const express = require('express');
let books = require("../config/booksdb.js");
const publicRouter = express.Router();
const validation = require("../middlewares/validation.middleware.js");
const publicController = require("../controllers/public.controller.js");
const { DateTime } = require("luxon");

publicRouter.get("/time", async (req, res) => {
    res.send("Welcome to the express server | It is now " + DateTime.now().toLocaleString(DateTime.DATETIME_MED));
})

publicRouter.post("/register", validation.register, publicController.register);

// Get the book list available in the shop
publicRouter.get('/', async function (req, res) {
    //Write your code here
    await books.updateBooks();
    console.log(books.getBooks());
    return res.status(300).json({ message: "Yet to be implemented - public route" });
});

// Get book details based on ISBN
publicRouter.get('/isbn/:isbn', async function (req, res) {
    //Write your code here
    return res.status(300).json({ message: "Yet to be implemented" });
});

// Get book details based on author
publicRouter.get('/author/:author', async function (req, res) {
    //Write your code here
    return res.status(300).json({ message: "Yet to be implemented" });
});

// Get all books based on title
publicRouter.get('/title/:title', async function (req, res) {
    //Write your code here
    return res.status(300).json({ message: "Yet to be implemented" });
});

//  Get book review
publicRouter.get('/review/:isbn', async function (req, res) {
    //Write your code here
    return res.status(300).json({ message: "Yet to be implemented" });
});


module.exports = publicRouter;