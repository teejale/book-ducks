import { setLoggedInState, getUserId } from "../general/general.js";
import { changeTheme } from "../general/general.js";
import { BASE_URL, mediaUrl } from "../general/api.js";
setLoggedInState();
const userId = await getUserId();
changeTheme();

//get logged in users info and displays it
const getUser = async () => {
  try {
    let res = await axios.get(`${BASE_URL}/api/users/me`, {
      headers: { Authorization: "bearer " + sessionStorage.getItem("token") },
    });
    console.log(res);
    if (res.status === 200) {
      const welcomeUser = document.createElement("h2");
      welcomeUser.innerHTML = `${res.data.username}'s Reading Nook`;
      document.querySelector("#profile").append(welcomeUser);
    }
  } catch (error) {
    console.log(error.response);
  }
};

getUser();
const uploadBtn = document.querySelector("#upload-btn");
const inputTitle = document.querySelector("#input-title");
const inputAuthor = document.querySelector("#input-author");
const inputGenre = document.querySelector("#input-genre");
const inputYear = document.querySelector("#input-year");
const inputPages = document.querySelector("#input-pages");
const imgUpload = document.querySelector("#img-upload");

const getCategory = async () => {
  inputGenre.innerHTML = "";
  try {
    let res = await axios.get(`${BASE_URL}/api/categories`);
    let categories = res.data.data;
    console.log(categories);

    categories.forEach((category) => {
      const categoryOpt = document.createElement("option");
      categoryOpt.value = category.id;
      categoryOpt.innerText = `${category.Genre}`;
      inputGenre.append(categoryOpt);
    });
  } catch (error) {
    console.log("Failed to get categories:: " + error.message);
  }
};
getCategory();

const uploadBooks = async (e) => {
  e.preventDefault();
  const image = imgUpload.files[0];
  if (!image) {
    console.error("No image selected");
    return;
  }
  try {
    const imgData = new FormData();
    imgData.append("files", image);
    const uploadRes = await axios.post(`${BASE_URL}/api/upload`, imgData, {
      headers: {
        Authorization: `Bearer ${sessionStorage.getItem("token")}`,
      },
    });
    const imageId = uploadRes.data[0].id;
    const bookRes = await axios.post(
      `${BASE_URL}/api/books`,
      {
        data: {
          Title: inputTitle.value,
          Author: inputAuthor.value,
          categories: {
            connect: [Number(inputGenre.value)],
          },
          Release_Year: Number(inputYear.value),
          Pages: Number(inputPages.value),
          Cover: imageId,
        },
      },
      {
        headers: {
          Authorization: `Bearer ${sessionStorage.getItem("token")}`,
        },
      },
    );
    console.log("Book created:", bookRes.data);
  } catch (error) {
    console.error("Upload failed:", error.response?.data || error.message);
  }
};

uploadBtn.addEventListener("click", uploadBooks);

const usersSavedBooks = document.querySelector("#usersSavedBooks");
//creates html for users saved books and displays it

const renderBooks = (books) => {
  usersSavedBooks.innerHTML = "";

  if (books.length === 0) {
    const noSavedBook = document.createElement("p");
    noSavedBook.innerText = "You have not saved any book yet.";
    usersSavedBooks.append(noSavedBook);
  }

  books.forEach((book) => {
    const bookArticle = document.createElement("article");
    usersSavedBooks.append(bookArticle);

    const bookCover = document.createElement("img");
    bookCover.setAttribute("src", mediaUrl(book.Cover?.url));
    bookArticle.append(bookCover);

    const bookHeader = document.createElement("h2");
    bookHeader.innerText = book.Title;
    bookArticle.append(bookHeader);

    const bookPara = document.createElement("p");
    bookPara.textContent = book.Author;
    bookArticle.append(bookPara);

    //fix this button, set data attr
    const removeBtn = document.createElement("button");
    removeBtn.dataset.bookId = book.documentId;
    removeBtn.innerText = "Remove";
    bookArticle.append(removeBtn);

    removeBtn.addEventListener("click", () => {
      removeSavedBook(removeBtn.dataset.bookId);
    });
  });
};

//users saved books
const getSavedBooks = async () => {
  try {
    let res = await axios.get(
      `${BASE_URL}/api/books?filters[SavedByUsers][id][$eq]=${userId}&populate=*`,
      {
        headers: {
          Authorization: `Bearer ${sessionStorage.getItem("token")}`,
        },
      },
    );
    const savedBooks = res.data.data;
    renderBooks(savedBooks);
    console.log(savedBooks);
  } catch (error) {
    console.log("Could not get users saved books " + error.message);
  }
};

getSavedBooks();

const sortAuthor = async () => {
  try {
    const res = await axios.get(
      `${BASE_URL}/api/books?filters[SavedByUsers][id][$eq]=${userId}&sort[0]=Author:asc&populate=*`,
      {
        headers: {
          Authorization: `Bearer ${sessionStorage.getItem("token")}`,
        },
      },
    );
    const sortedBooks = res.data.data;
    renderBooks(sortedBooks);
  } catch (error) {
    console.log("Failed to sort author: " + error.message);
  }
};

const sortAuthorBtn = document.querySelector("#sortAuthorBtn");
sortAuthorBtn.addEventListener("click", sortAuthor);

const sortTitle = async () => {
  try {
    const res = await axios.get(
      `${BASE_URL}/api/books?filters[SavedByUsers][id][$eq]=${userId}&sort[0]=Title:asc&populate=*`,
      {
        headers: {
          Authorization: `Bearer ${sessionStorage.getItem("token")}`,
        },
      },
    );
    const sortedBooks = res.data.data;
    renderBooks(sortedBooks);
  } catch (error) {
    console.log("Failed to sort author: " + error.message);
  }
};

//maybe add sort for latest saved books?
const sortTitleBtn = document.querySelector("#sortTitleBtn");
sortTitleBtn.addEventListener("click", sortTitle);

const removeSavedBook = async (bookId) => {
  try {
    const res = await axios.put(
      `${BASE_URL}/api/books/${bookId}`,
      {
        data: {
          SavedByUsers: {
            disconnect: [userId],
          },
        },
      },
      {
        headers: {
          Authorization: `Bearer ${sessionStorage.getItem("token")}`,
        },
      },
    );
    getSavedBooks();
  } catch (error) {
    console.log("Could not remove saved book: " + error.message);
  }
};

//create tabs
function openTabs(tabId) {
  const tabs = document.querySelectorAll(".usersTab");
  tabs.forEach((tab) => {
    tab.classList.add("hidden");
  });

  const selected = document.getElementById(tabId);
  selected.classList.remove("hidden");
}

const tabButtons = document.querySelectorAll(".tabBtn");
tabButtons.forEach((button) => {
  button.addEventListener("click", () => {
    openTabs(button.dataset.tab);
  });
});

// //display users ratings
// const usersRatings = document.querySelector("#usersRatings");
// function renderRatings(ratings) {
//   usersRatings.innerHTML = "";
//   ratings.forEach(rating => {
//     const ratedBook = document.createElement("article");
//     const bookTitle = document.createElement("h2");
//     bookTitle.innerText = rating.book.Title;
//     const ratingText = document.createElement("p");
//     ratingText.innerText = `Rating: ${rating.Rating}/5`;
//     ratedBook.append(bookTitle);
//     ratedBook.append(ratingText);
//     usersRatings.append(ratedBook);
//   });
// }

// //get ratings
// const getRatings = async () => {
//   try {
//     const res = await axios.get(`${BASE_URL}/api/ratings?filters[users_permissions_user][id][$eq]=${userId}&populate=*`,
//       {
//         headers: {
//           Authorization: `Bearer ${sessionStorage.getItem("token")}`
//         }
//       }
//     );
//     const ratings = res.data.data;
//     renderRatings(ratings);
//   } catch (error) {
//     console.log("Could not get users ratings " + error.message);
//   }
// };

// getRatings();
