const express = require('express');
const jwt = require('jsonwebtoken');
const users = require("../services/user.service.js");
const config = require('../config/config.js');
let books = require("../config/booksdb.js");
const { DateTime } = require("luxon");

const login = (async (req, res) => {
    const user = req.query.username;
    const pass = req.query.password;

    let accessToken = jwt.sign({
        data: user
    }, 'access', { expiresIn: config.jwt.accessExpirationInMinutes * 60 });
    req.session.authorization = {
        accessToken, user
    }
    return res.status(200).json({ message: "User successfully logged in" });
});

const validRating = (rating) => {
    if (typeof rating == "string")
        rating = parseInt(rating);

    if (isNaN(rating)) return false;

    return rating >= 1 && rating <= 5;
};


const addReview = (async (req, res) => {
    const { isbn } = req.params;
    const { review, rating } = req.query;

    if (!isbn || !review || !rating) {
        return res.status(404).json({ message: "Body Empty" });
    }

    if (!validRating(rating)) {
        return res.status(404).json({ message: "Invalid rating - must be 1 through 5" });
    }

    let bookObj = await books.addReview(req, isbn, review, rating);

    if (bookObj.response) {
        return res.status(200).json({ message: "Review not added", response: bookObj.response });
    }

    return res.status(200).json({ message: "Review successfully added", book: bookObj });
});

const removeReview = (async (req, res) => {
    const { isbn } = req.params;
    const { user } = req.query;

    if (!isbn || !user) {
        return res.status(404).json({ message: "Body Empty" });
    }

    let bookObj = await books.removeReview(req, isbn, user);

    if (bookObj.response) {
        return res.status(200).json({ message: "Review not removed", response: bookObj.response });
    }

    return res.status(200).json({ message: "Review successfully removed", book: bookObj });
});

const addBook = (async (req, res) => {
    const { isbn, title, author, price = 0, reviews = [] } = req.query;

    if (!isbn || !title || !author) {
        return res.status(404).json({ message: "Body Empty" });
    }

    let bookObj = await books.addBook(req, isbn, title, author, price);

    if (bookObj.response) {
        return res.status(200).json({ message: "Book not added", response: bookObj.response });
    }

    await books.updateBooks();

    return res.status(200).json({ message: "Book successfully added", book: bookObj });
});

const updateBook = (async (req, res) => {
    const { isbn } = req.params;
    const { title, author, price } = req.query;

    if (!isbn || !title || !author || !price) {
        return res.status(404).json({ message: "Body Empty" });
    }

    let bookObj = await books.updateBook(req, isbn, title, author, price);

    if (bookObj.response) {
        return res.status(200).json({ message: "Book not updated", response: bookObj.response });
    }

    await books.updateBooks();

    return res.status(200).json({ message: "Book successfully updated", book: bookObj });
});

const getReviewsByISBN = (async (req, res) => {
    const { isbn } = req.params;

    if (!isbn) {
        return res.status(404).json({ message: "Body Empty" });
    }

    let bookObj = await books.getReviewsByISBN(req, isbn);

    if (bookObj.response) {
        return res.status(200).json({ message: "Unable to retrieve reviews", response: bookObj.response });
    }

    return res.status(200).json({ message: "Reviews successfully found", reviews: bookObj });
});

module.exports = {
    login,
    addReview,
    removeReview,
    getReviewsByISBN,
    addBook,
    updateBook
};
