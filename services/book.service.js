const config = require('../config/config.js');
const roles = require('../config/roles.js');
const { DateTime } = require("luxon");

const getBooks = async () => {
    const collection = config.mongoClient.db(config.DB_NAME).collection(config.BOOKS_COLLECTION_NAME);
    var result = await collection.find({}).toArray();
    return result;
}

const bookExists = async (isbn, returnResult) => {
    const collection = config.mongoClient.db(config.DB_NAME).collection(config.BOOKS_COLLECTION_NAME);
    var query = { isbn: isbn };
    var result = await collection.findOne(query);

    if (returnResult)
        return result;

    return (result != null && result != undefined);
}

const insertBook = async (title, author, isbn, price) => {
    const collection = config.mongoClient.db(config.DB_NAME).collection(config.BOOKS_COLLECTION_NAME);
    var result = await collection.insertOne({ title: title, author: author, isbn: isbn, reviews: [], price: price });
    return result;
}

module.exports = {
    getBooks,
    bookExists,
    insertBook
};