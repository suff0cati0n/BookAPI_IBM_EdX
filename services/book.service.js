const config = require('../config/config.js');
const roles = require('../config/roles.js');
const { DateTime } = require("luxon");

const getBooks = async () => {
    const collection = config.mongoClient.db(config.DB_NAME).collection(config.BOOKS_COLLECTION_NAME);
    var result = await collection.find({}).toArray();
    return result;
}

const bookExists = async (isbn, returnResult = false) => {
    const collection = config.mongoClient.db(config.DB_NAME).collection(config.BOOKS_COLLECTION_NAME);
    var query = { isbn: isbn };
    var result = await collection.findOne(query);

    if (returnResult)
        return result;

    return (result != null && result != undefined);
}

const insertBook = async (title, author, isbn, price) => {

    var insertedObj = await new Promise((resolve, reject) => {
        const collection = config.mongoClient.db(config.DB_NAME).collection(config.BOOKS_COLLECTION_NAME);
        var insertID = collection.insertOne({ title: title, author: author, isbn: isbn, reviews: [], price: price });
        resolve(insertID);
    });

    if (insertedObj == null || insertedObj == undefined)
        return null;

    var query = { _id: insertedObj.insertedId }
    const collection = config.mongoClient.db(config.DB_NAME).collection(config.BOOKS_COLLECTION_NAME);
    var result = await collection.findOne(query);

    if (result == null || result == undefined)
        return null;

    return result;
}

const updateBook = async (isbn, title, author, reviews, price) => {
    var resultObj = await new Promise((resolve, reject) => {
        const collection = config.mongoClient.db(config.DB_NAME).collection(config.BOOKS_COLLECTION_NAME);
        var objectFromDB = collection.updateOne({ isbn: isbn }, { $set: { title: title, author: author, reviews: reviews, price: price } });
        resolve(objectFromDB);
    });

    if (resultObj == null || resultObj == undefined)
        return null;

    var query = { isbn: isbn };
    const collection = config.mongoClient.db(config.DB_NAME).collection(config.BOOKS_COLLECTION_NAME);
    var result = await collection.findOne(query);

    if (result == null || result == undefined)
        return null;

    return result;
}

module.exports = {
    getBooks,
    bookExists,
    insertBook,
    updateBook
};