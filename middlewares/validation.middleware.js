let books = require("../config/booksdb.js");
let users = require("../services/user.service.js");
const userService = require("../services/user.service.js");
const jwt = require('jsonwebtoken');
const { DateTime } = require("luxon");
const config = require('../config/config.js');

const isValid = (username, password) => { //returns boolean
    //write code to check is the username is valid
    return (username !== null && username !== undefined && username !== "") && (password !== null && password !== undefined && password !== "");
}

const authenticatedUser = async (username, password) => { //returns boolean
    //write code to check if username and password match the one we have in records
    let userMatch = await userService.verifyUser(username, password);

    return userMatch;
}

function loggedIn(req) {
    if (req.session.authorization) { //get the authorization object stored in the session
        token = req.session.authorization['accessToken']; //retrieve the token from authorization object
        jwt.verify(token, "access", (err, user) => { //Use JWT to verify token
            if (!err) {
                req.user = user;

                return true;
            }
            else {
                return false;
            }
        });
    } else {
        return false;
    }
}


const register = (async (req, res, next) => {
    const { email, password } = req.query;

    var user = await users.getUser(email);

    if (user != null && user != undefined) {
        return res.status(300).json({ message: "User exists" });
    }

    next();
});

const login = (async (req, res, next) => {
    const userObj = req.user;
    const user = req.query.username;
    const pass = req.query.password;
    //console.log(req.session);
    if (!isValid(user, pass)) {
        return res.status(404).json({ message: "Body Empty" });
    }
    if (!await authenticatedUser(user, pass)) {
        return res.status(404).json({ message: "Invalid credentials" });
    }

    if (!req.session) {
        return res.status(404).json({ message: "Session not found" });
    }

    next();
});

const hasValidSession = (async (req, res, next) => {

    if (!req.session) {
        return res.status(404).json({ message: "Session not found" });
    }

    next();
});

const nothing = (async (req, res, next) => {
    next();
});

const hasValidISBN = (async (req, res, next) => {
    const { isbn } = req.params;

    if (isbn == null || isbn == undefined || isbn == "") {
        return res.status(300).json({ message: "Invalid ISBN" });
    }

    if (isbn.length <= 4) {
        return res.status(300).json({ message: "Invalid ISBN" });
    }

    next();
});

const hasValidAuthor = (async (req, res, next) => {
    const { author } = req.params;

    if (author == null || author == undefined || author == "") {
        return res.status(300).json({ message: "Invalid Author" });
    }

    next();
});

const hasValidTitle = (async (req, res, next) => {
    const { title } = req.params;

    if (title == null || title == undefined || title == "") {
        return res.status(300).json({ message: "Invalid Title" });
    }

    next();
});

module.exports = {
    register,
    login,
    nothing,
    hasValidSession,
    hasValidISBN,
    hasValidAuthor,
    hasValidTitle
};