let bookJsonObject = require("../data/books.json");
let bookService = require("../services/book.service.js");
let config = require("../config/config.js");

const getBooks = (async () => {
      return bookJsonObject;
});

/* Ensure initial sync of books in books.json to our mongoDB database */
const syncBooks = (async () => {
      bookJsonObject.books.map(async (book) => {
            if (book["isbn"] != null && book["isbn"] != undefined && book["isbn"] != "") {
                  if (!(await bookService.bookExists(book["isbn"]))) {
                        await bookService.insertBook(book["title"], book["author"], book["isbn"], book["price"] ? book["price"] : 0);
                  }
            }
      });
});

/* Update books.json with books from our mongoDB database */
const updateBooks = (async () => {
      await syncBooks();
      let books = await bookService.getBooks();

      console.log("Books: " + books.length);

      /*books.map((book) => {
            console.log(book);
      });*/

      console.log(books);

      bookJsonObject.books = books;
      return bookJsonObject;
});


module.exports =
{
      getBooks,
      updateBooks
}
