const JsonRecords = require('json-records');
let bookJsonRecords = new JsonRecords("./data/books.json");
let bookService = require("../services/book.service.js");
let userService = require("../services/user.service.js");
let config = require("../config/config.js");
let roles = require("../config/roles.js");
const fs = require('fs');
const { user } = require('./roles.js');

const getBooks = ((query = null) => {
      if (query != null) {
            return bookJsonRecords.get(record => query.identifierValue == record[query.identifierName]);
      };

      return bookJsonRecords.get();
});

const checkRecord = ((record, isbn) => {
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

const isPrivelegedUser = (async (email) => {
      var user = await userService.getUser(email);

      if (user == null || user == undefined) {
            return false;
      }

      return user.role.roleName == roles.admin.roleName || user.role.roleName == roles.manager.roleName || user.role.roleName == roles.sudoUser.roleName;
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

      return books;
});

const alreadyReviewed = ((reviews, username) => {
      if (reviews == null || reviews == undefined || reviews.length == 0) {
            return false;
      }

      if (username == null || username == undefined || username == "") {
            return false;
      }

      return reviews.filter(review => review.username === username).length > 0;
});

const addReview = (async (req, isbn, review, rating) => {
      let booksByISBN = await getBooks({ identifierName: "isbn", identifierValue: isbn });

      if (booksByISBN.length > 0) {
            let book = booksByISBN[0];
            let reviews = book.reviews;

            if (alreadyReviewed(reviews, req.user.data)) {
                  console.log("User already reviewed this book");
                  return { response: "Review already added" };
            }
            else {
                  var newReview = {
                        username: req.user.data,
                        review: review,
                        rating: rating
                  };
                  reviews.push(newReview);
            }

            bookJsonRecords.update(record => record.isbn === book.isbn, book);
            bookService.updateBook(book.isbn, book.title, book.author, book.reviews, book.price);

            return book;
      }

      return { response: "Book not found" };
});

const removeReview = (async (req, isbn, username) => {
      if (!await isPrivelegedUser(req.user.data)) {
            return { response: "User not authorized to remove reviews" };
      }

      let booksByISBN = await getBooks({ identifierName: "isbn", identifierValue: isbn });

      if (booksByISBN.length > 0) {
            let book = booksByISBN[0];

            if (!alreadyReviewed(book.reviews, username))
                  return { response: "Review not found" };
            else {
                  var newReviews = book.reviews.filter(review => review.username !== username);
                  book.reviews = newReviews;
            }

            bookJsonRecords.update(record => record.isbn === book.isbn, book);
            bookService.updateBook(book.isbn, book.title, book.author, book.reviews, book.price);

            return book;
      }

      return { response: "Book not found" };
});

const addBook = (async (req, isbn, title, author, price) => {

      if (!await isPrivelegedUser(req.user.data)) {
            return { response: "User not authorized to add books" };
      }

      if (bookRecordExists(isbn)) {
            return { response: "Book already exists" };
      }

      var book = await bookService.insertBook(title, author, isbn, price);

      if (book == null || book == undefined) {
            return { response: "Database returned null or undefined" };
      }

      return book;
});

const updateBook = (async (req, isbn, title, author, price) => {

      if (!await isPrivelegedUser(req.user.data)) {
            return { response: "User not authorized to update books" };
      }

      if (!bookRecordExists(isbn)) {
            return { response: "Book needs to be added" };
      }

      var reviews = await getBooks({ identifierName: "isbn", identifierValue: isbn })[0].reviews;

      var book = await bookService.updateBook(isbn, title, author, reviews, price);

      if (book == null || book == undefined) {
            return { response: "Database returned null or undefined" };
      }

      bookJsonRecords.update(record => record.isbn === book.isbn, book);

      return book;
});

const getReviewsByISBN = (async (req, isbn) => {
      let booksByISBN = await getBooks({ identifierName: "isbn", identifierValue: isbn });

      if (booksByISBN.length > 0) {
            let book = booksByISBN[0];
            let reviews = book.reviews;

            if (reviews.length == 0)
                  return { response: "No reviews found" };

            return reviews;
      }

      return { response: "No books found with given ISBN" };
});


module.exports =
{
      getBooks,
      getReviewsByISBN,
      updateBooks,
      addReview,
      removeReview,
      addBook,
      updateBook
}
