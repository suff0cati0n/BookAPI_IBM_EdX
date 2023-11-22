const express = require('express');
let books = require("../config/booksdb.js");
const config = require('../config/config.js');
const publicRouter = express.Router();
const validation = require("../middlewares/validation.middleware.js");
const publicController = require("../controllers/public.controller.js");
const { DateTime } = require("luxon");

publicRouter.get("/time", async (req, res) => {
    res.send("Welcome to the express server | It is now " + DateTime.now().toLocaleString(DateTime.DATETIME_MED));
})

publicRouter.post("/register", validation.register, publicController.register);

// Get the book list available in the shop
publicRouter.get('/', validation.nothing, publicController.getBooks);

// Get book details based on ISBN
publicRouter.get('/isbn/:isbn', validation.hasValidISBN, publicController.getBookByISBN);

// Get book details based on author
publicRouter.get('/author/:author', validation.hasValidAuthor, publicController.getBookByAuthor);

// Get all books based on title
publicRouter.get('/title/:title', validation.hasValidTitle, publicController.getBookByTitle);

//  Get book review
publicRouter.get('/review/:isbn', validation.hasValidISBN, publicController.getBookReviewByISBN);


module.exports = publicRouter;