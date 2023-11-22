const books = require("../config/booksdb.js");
const userService = require("../services/user.service.js");
const jwt = require('jsonwebtoken');
const config = require('../config/config.js');
const express = require('express');
const customersRouter = express.Router();
const customersController = require("../controllers/customers.controller.js");
const validation = require("../middlewares/validation.middleware.js");
const { DateTime } = require("luxon");
const session = require('express-session')

customersRouter.use("/auth", function auth(req, res, next) {
    //Write the authenication mechanism here
    if (req.session.authorization) { //get the authorization object stored in the session
        token = req.session.authorization['accessToken']; //retrieve the token from authorization object
        jwt.verify(token, "access", (err, user) => { //Use JWT to verify token
            if (!err) {
                req.user = user;

                next();
            }
            else {
                return res.status(403).json({ message: "User not authenticated" })
            }
        });
    } else {
        return res.status(403).json({ message: "User not logged in" })
    }
});

// Login
customersRouter.post("/login", validation.login, customersController.login);

// Add a book review
customersRouter.put("/auth/review/:isbn", validation.hasValidSession, customersController.addReview);

// Remove a book review
customersRouter.delete("/auth/review/:isbn", validation.hasValidSession, customersController.removeReview);

// Get reviews for a book
customersRouter.get("/auth/review/:isbn", validation.hasValidSession, customersController.getReviewsByISBN);

// Add a book to the list
customersRouter.put("/auth/book/add", validation.hasValidSession, customersController.addBook);

// Update a book with given parameters
customersRouter.get("/auth/book/update/:isbn", validation.hasValidSession, customersController.updateBook);

module.exports = customersRouter;