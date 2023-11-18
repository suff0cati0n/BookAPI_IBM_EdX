const dotenv = require('dotenv');
const path = require('path');
const { env } = require('process');
const envVars = {};
const { MongoClient } = require('mongodb');

dotenv.config({ path: path.join(__dirname, '../.env'), processEnv: envVars });

/*
    Checks whether or not the environment variables are set
    Only for variables that can be made public
*/
function validate(env) {
    return env != null && env !== undefined && env !== '';
}

console.log(envVars);

module.exports = {
    env: validate(envVars.NODE_ENV) ? envVars.NODE_ENV : 'development',
    port: validate(envVars.PORT) ? envVars.PORT : 8080,
    jwt: {
        secret: envVars.JWT_SECRET, /*DO NOT MAKE PUBLIC*/
        accessExpirationInMinutes: validate(envVars.JWT_ACCESS_EXPIRATION_MINUTES) ? envVars.JWT_ACCESS_EXPIRATION_MINUTES : 30
    },
    mongoClient: new MongoClient(validate(envVars.MONGO_URL) ? envVars.MONGO_URL : 'mongodb://localhost:27017'),
    DB_NAME: validate(envVars.DB_NAME) ? envVars.DB_NAME : 'bookstore',
    USERS_COLLECTION_NAME: validate(envVars.USERS_COLLECTION_NAME) ? envVars.USERS_COLLECTION_NAME : 'users',
    BOOKS_COLLECTION_NAME: validate(envVars.BOOKS_COLLECTION_NAME) ? envVars.BOOKS_COLLECTION_NAME : 'books',
}