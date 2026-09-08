import { setLoggedInState, getUserId } from "../general/general.js";
import { changeTheme } from "../general/general.js";
const userId = await getUserId();
const BASE_URL = "https://book-ducks-api.vercel.app";
setLoggedInState();
changeTheme();

//reads the url from the query parameter
const params = new URLSearchParams(window.location.search);
const bookId = params.get("id");
console.log(bookId);

const bookCoverBox = document.querySelector("#book");
const bookInfoBox = document.querySelector("#book-info");
//get the books info and displays it
const bookInfo = async () => {
  try {
    const res = await axios.get(`${BASE_URL}/api/books/${bookId}?populate=*`);
    const book = res.data.data;
    console.log(res);

    const img = document.createElement("img");
    img.src = `${BASE_URL}${book.Cover.url}`;
    bookCoverBox.append(img);

    const bookHeader = document.createElement("h2");
    bookHeader.innerText = `${book.Title}`;
    bookInfoBox.append(bookHeader);
    console.log(bookHeader);

    const bookAuthor = document.createElement("p");
    bookAuthor.innerText = `${book.Author}`;
    bookHeader.append(bookAuthor);

    const bookPages = document.createElement("p");
    bookPages.innerText = `Pages: ${book.Pages}`;
    bookHeader.append(bookPages);

    const bookYear = document.createElement("p");
    bookYear.innerText = `Release year: ${book.Release_Year}`;
    bookHeader.append(bookYear);

    const buyBtn = document.querySelector("#buyBtn");
    buyBtn.addEventListener("click", () => {
      alert(`You bought ${book.Title}`);
    });
  } catch (error) {
    console.log("Could not get book " + error.message);
  }
};

bookInfo();

if (userId !== null) {
  const isBookUserSaved = async (bookId) => {
    try {
      const res = await axios.get(
        `${BASE_URL}/api/books?filters[documentId][$eq]=${bookId}&filters[SavedByUsers][id][$eq]=${userId}`,
        {
          headers: {
            Authorization: `Bearer ${sessionStorage.getItem("token")}`,
          },
        },
      );
      return await res.data;
    } catch (error) {
      console.log("Failed to get user's book: " + error.message);
    }
  };

  const saveBookBtn = document.querySelector("#saveBookBtn");

  const saveBook = async () => {
    try {
      const res = await axios.put(
        `${BASE_URL}/api/books/${bookId}`,
        {
          data: {
            SavedByUsers: {
              connect: [userId],
            },
          },
        },
        {
          headers: {
            Authorization: `Bearer ${sessionStorage.getItem("token")}`,
          },
        },
      );
      saveBookBtn.innerHTML = `<i class="fa-solid fa-bookmark"></i>Book is saved`;
    } catch (error) {
      console.log("Failed to update usersBook: " + error.message);
    }
  };

  //wait for async for the data from the function
  const bookIsSaved = (await isBookUserSaved(bookId)).data.length > 0;
  saveBookBtn.classList.remove("hidden");
  //styling for button if book is saved
  if (!bookIsSaved) {
    saveBookBtn.innerHTML = `<i class="fa-regular fa-bookmark"></i>Save book`;
    saveBookBtn.addEventListener("click", saveBook);
  } else {
    console.log("ALready saved");
    saveBookBtn.innerHTML = `<i class="fa-solid fa-bookmark"></i>Book is saved`;
  }
  console.log(bookIsSaved);
}

// rating
const usersRatings = async (bookId, stars) => {
  try {
    const res = await axios.post(
      `${BASE_URL}/api/ratings`,
      {
        data: {
          Rating: stars,
          book: {
            connect: [bookId],
          },
          users_permissions_user: {
            connect: [userId],
          },
        },
      },
      {
        headers: {
          Authorization: `Bearer ${sessionStorage.getItem("token")}`,
        },
      },
    );
    console.log("You rated " + res.data);
  } catch (error) {
    console.log("Could not rate: " + error.message);
  }
};
