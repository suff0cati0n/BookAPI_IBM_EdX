const express = require('express');
const users = require("../services/user.service.js");
let books = require("../config/booksdb.js");
const { DateTime } = require("luxon");

const register = (async (req, res) => {
    const { email, password } = req.query;

    console.log("Register controller");
    console.log(email);
    console.log(password);

    await users.insert(email, password);
    return res.status(300).json({ email: email, password: password });
});

module.exports = {
    register
};