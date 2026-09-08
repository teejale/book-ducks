import { setLoggedInState } from "../general/general.js";
import { changeTheme } from "../general/general.js";
import { BASE_URL, mediaUrl } from "../general/api.js";
setLoggedInState();
changeTheme();

let rowBooks = document.querySelector("#row-books");
rowBooks.classList.add("row-books");
//get all books 
const renderPage = async () => {
  try {
    let res = await axios.get(`${BASE_URL}/api/books?populate=Cover`);
    let books = res.data.data;
    //displays every book and creates buttons
    books.forEach(book => {
      let bookArticle = document.createElement("article");
      rowBooks.append(bookArticle);

      let bookCover = document.createElement("img");
      console.log(book);
      bookCover.setAttribute("src", mediaUrl(book.Cover?.url));

      bookArticle.append(bookCover);
      console.log(bookCover)

      let bookHeader = document.createElement("h2");

      bookHeader.innerText = `${book.Title}`;
      bookArticle.append(bookHeader);

      let bookPara = document.createElement("p");
      bookPara.innerText = `${book.Author}`;
      bookHeader.append(bookPara);

      let bookFooter = document.createElement("footer");
      bookFooter.classList = "card-footer";
      bookArticle.append(bookFooter);
      let readMoreBtn = document.createElement("button");
      let buyBtn = document.createElement("button");
      readMoreBtn.innerText = "Read More";
      buyBtn.innerText = "Buy";
      bookFooter.append(readMoreBtn);
      bookFooter.append(buyBtn);

      readMoreBtn.addEventListener("click", () => {
        window.location.href = `../books/bookInfo.html?id=${encodeURIComponent(book.documentId)}`;
      });
      buyBtn.addEventListener("click", () => {
        alert(`You bought ${book.Title}`);
      })
    })
  } catch (error) {
    rowBooks.textContent = 'The book collection is unavailable right now. Please try again later.';
    console.log(" Error: could not retrieve books :" + error.message );
  }
};

renderPage();
