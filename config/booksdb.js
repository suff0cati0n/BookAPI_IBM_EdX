const JsonRecords = require('json-records');
let bookJsonRecords = new JsonRecords("./data/books.json");
let bookService = require("../services/book.service.js");
let config = require("../config/config.js");
const fs = require('fs');

const getBooks = (() => {
      return bookJsonRecords.get();
});

const checkRecord = ((record, isbn) => {
      //console.log(record);
      //console.log(isbn);
      return record["isbn"] == isbn;
});

const bookRecordExists = ((isbn) => {
      return bookJsonRecords.get(record => checkRecord(record, isbn)).length > 0;
});

//Ensure that we can work with the JSON records in our books.json file
const hasValidBookFields = ((book) => {
      return (book["title"] != null && book["title"] != undefined && book["title"] != "") &&
            (book["author"] != null && book["author"] != undefined && book["author"] != "") &&
            (book["isbn"] != null && book["isbn"] != undefined && book["isbn"] != "");
});

/* Ensure initial sync of books in books.json to our mongoDB database */
const syncBooks = (async () => {
      await new Promise(async (resolve, reject) => {

            //Let's grab all the books from our books.json file and insert them into our mongoDB database
            getBooks().map(async (book) => {
                  if (hasValidBookFields(book)) {
                        if (!(await bookService.bookExists(book["isbn"]))) {
                              bookService.insertBook(book["title"], book["author"], book["isbn"], book["price"] ? book["price"] : 0);
                        }
                  }
            });

            //Now we ensure that our books.json file is in sync with our mongoDB database
            var booksFromDB = await bookService.getBooks();

            //Let's grab all the books from our mongoDB database and add/override them in our books.json file
            booksFromDB.map((book) => {
                  if (hasValidBookFields(book)) {
                        if (!bookRecordExists(book["isbn"]))
                              bookJsonRecords.add(book);
                        else
                              bookJsonRecords.update(record => record.isbn === book.isbn, book);
                  }
            });

            resolve();
      });
});

/* Update books.json with books from our mongoDB database */
const updateBooks = (async () => {
      await syncBooks();
      let books = await bookService.getBooks();

      if (config.debug()) {
            console.log("Books In DB: " + books.length);
            console.log("Books in JSON: " + bookJsonRecords.fileRecords.length)
      }

      books.map((book) => {
            if (!bookRecordExists(book.isbn)) {
                  console.log("adding " + book.isbn + " to bookJsonRecords");
                  bookJsonRecords.add(book);
            }
      });

      //console.log(bookJsonRecords);

      //console.log(books);

      //booksData = books;
      return books;
});


module.exports =
{
      getBooks,
      updateBooks
}
