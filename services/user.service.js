//const tokenModel = require('../models/token.model.js');
const config = require('../config/config.js');
const roles = require('../config/roles.js');
const { DateTime } = require("luxon");

const getUser = async (emailToLookup) => {
    var user = null;

    const collection = config.mongoClient.db(config.DB_NAME).collection(config.USERS_COLLECTION_NAME);
    //await collection.insertOne({ bookName: "test" });

    var query = { email: emailToLookup };

    var result = await collection.findOne(query);

    console.log(result);

    if (result != null && result != undefined) {
        user = result;
    }

    return user;
}

const insert = async (email, password) => {
    const collection = config.mongoClient.db(config.DB_NAME).collection(config.USERS_COLLECTION_NAME);
    var result = await collection.insertOne({ email: email, password: password, role: roles.user, createdDate: DateTime.now().toLocaleString(DateTime.DATETIME_MED) });

    return result;
}

module.exports = {
    getUser,
    insert
};