const books = require("../config/booksdb.js");
const userService = require("../services/user.service.js");
const jwt = require('jsonwebtoken');
const config = require('../config/config.js');
const express = require('express');
const customersRouter = express.Router();
const { DateTime } = require("luxon");
const session = require('express-session')

//let users = [];

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
                console.log("User");
                console.log(user);
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

customersRouter.use("/auth", function auth(req, res, next) {
    //Write the authenication mechanism here
    console.log(req.session);
    if (req.session.authorization) { //get the authorization object stored in the session
        token = req.session.authorization['accessToken']; //retrieve the token from authorization object
        jwt.verify(token, "access", (err, user) => { //Use JWT to verify token
            if (!err) {
                req.user = user;
                console.log("User customer/auth/*");
                console.log(user);
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

customersRouter.post("/login", async (req, res) => {
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
    console.log("Setting a new token")

    if (!req.session) {
        return res.status(404).json({ message: "Session not found" });
    }

    let accessToken = jwt.sign({
        data: pass
    }, 'access', { expiresIn: config.jwt.accessExpirationInMinutes * 60 });
    req.session.authorization = {
        accessToken, user
    }
    return res.status(200).json({ message: "User successfully logged in" });
});

// Add a book review
customersRouter.put("/auth/review/:isbn", (req, res) => {
    //Write your code here
    if (!req.session) {
        return res.status(404).json({ message: "Session not found" });
    }

    /*if (!loggedIn(req)) {
        return res.status(404).json({ message: "Auth Check - User not logged in" });
    }*/

    return res.status(300).json({ message: "Yet to be implemented" });
});

customersRouter.get("/auth/test", (req, res) => {
    console.log(req.session);
    return res.status(300).json({ message: "Authed - Yet to be implemented" });
});

module.exports = customersRouter;