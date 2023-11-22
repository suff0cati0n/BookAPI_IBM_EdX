const express = require('express');
const users = require("../services/user.service.js");
let books = require("../config/booksdb.js");
const { DateTime } = require("luxon");

const register = (async (req, res) => {
    const { email, password } = req.query;

    var user = await users.insert(email, password);
    if (user == null || user == undefined) {
        return res.status(200).json({ message: "User not registered - database error" });
    }

    return res.status(200).json({ message: "Successfully registered!", email: email, password: password });
});

const getBooks = (async (req, res) => {
    //Write your code here
    await books.updateBooks();
    var bookList = books.getBooks();
    return res.status(300).json(bookList);
});

const getBookByISBN = (async (req, res) => {
    //Write your code here
    var booksByISBN = await books.getBooks({ identifierName: "isbn", identifierValue: req.params.isbn });

    if (booksByISBN.length == 0) {
        return res.status(300).json({ message: "No books found with ISBN" });
    }

    return res.status(200).json(booksByISBN);
});

const getBookByAuthor = (async (req, res) => {
    //Write your code here
    var booksByAuthor = await books.getBooks({ identifierName: "author", identifierValue: req.params.author });

    if (booksByAuthor.length == 0) {
        return res.status(300).json({ message: "No books found by Author" });
    }

    return res.status(200).json(booksByAuthor);
});

const getBookByTitle = (async (req, res) => {
    //Write your code here
    var booksByTitle = await books.getBooks({ identifierName: "title", identifierValue: req.params.title });

    if (booksByTitle.length == 0) {
        return res.status(300).json({ message: "No books found by Title" });
    }

    return res.status(200).json(booksByTitle);
});

const getBookReviewByISBN = (async (req, res) => {
    //Write your code here
    var booksByISBN = await books.getBooks({ identifierName: "isbn", identifierValue: req.params.isbn });

    if (booksByISBN.length == 0) {
        return res.status(300).json({ message: "No books found with ISBN" });
    }

    var reviewList = { isbn: req.params.isbn, reviews: booksByISBN[0].reviews };
    return res.status(200).json(reviewList);
});

module.exports = {
    register,
    getBooks,
    getBookByISBN,
    getBookByAuthor,
    getBookByTitle,
    getBookReviewByISBN
};