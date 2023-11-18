let books = require("../config/booksdb.js");
let users = require("../services/user.service.js");

const register = (async (req, res, next) => {
    const { email, password } = req.query;

    var user = await users.getUser(email);

    if (user != null && user != undefined) {
        return res.status(300).json({ message: "User exists" });
    }

    next();
});

module.exports = {
    register
};