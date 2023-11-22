const config = require('../config/config.js');
const roles = require('../config/roles.js');
const { DateTime } = require("luxon");
const hash = require('../utils/hash.js');


/* 
    getUser returns the user object if the user is valid
    getUser returns null if the user is invalid
*/
const getUser = async (emailToLookup) => {
    var user = null;

    const collection = config.mongoClient.db(config.DB_NAME).collection(config.USERS_COLLECTION_NAME);

    var query = { email: emailToLookup };

    var result = await collection.findOne(query);

    if (result != null && result != undefined) {
        user = result;
    }

    return user;
}

const verifyUser = async (emailToLookup, passwordToLookup) => {
    var match = false;
    const collection = config.mongoClient.db(config.DB_NAME).collection(config.USERS_COLLECTION_NAME);
    var result = await collection.findOne({ email: emailToLookup });

    if (result == null || result == undefined) return false;

    var hashedPassword = result.password;

    await hash.compare(passwordToLookup, hashedPassword).then(function (result) {
        match = result;
    });

    return match;
}

/*
    insert inserts a new user into the database and returns the result of the insert operation
*/
const insert = async (email, password) => {
    var result = await new Promise(async (resolve, reject) => {
        const hashedPassword = await hash.getHash(password);
        const collection = config.mongoClient.db(config.DB_NAME).collection(config.USERS_COLLECTION_NAME);
        var result = await collection.insertOne({ email: email, password: hashedPassword, role: roles.user, createdDate: DateTime.now().toLocaleString(DateTime.DATETIME_MED) });
        resolve(result);
    });

    return result;
}

module.exports = {
    getUser,
    verifyUser,
    insert
};