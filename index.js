const requireDir = require('require-dir');
const express = require('express'); //Express is a minimal and flexible Node.js web application framework that provides a robust set of features for web and mobile applications.
const { DateTime } = require("luxon"); //Luxon is a library for working with dates and times in JavaScript, and was written to supercede Moment.js.
const books = require("./config/booksdb.js");
const app = express();
const helmet = require('helmet'); //Helmet helps you secure your Express apps by setting various HTTP headers. https://www.npmjs.com/package/helmet
const os = require('os');
const httpStatus = require('http-status');
const config = require('./config/config.js');
const { errorConverter, errorHandler } = require('./middlewares/error');
const ApiError = require('./utils/ApiError');
const session = require('express-session')
const jwt = require('jsonwebtoken');


let publicRouter = require('./routes/public.route.js')
let customersRouter = require('./routes/customers.route.js')

app.use(helmet());
app.use(express.static('public'))
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

app.use(session({ secret: config.jwt.secret, resave: true, saveUninitialized: true }))

//app.use('/user', userRouter)

if (config.debug()) {
    console.log(config);
    console.log("Secret is " + config.jwt.secret);
}

app.use('/', publicRouter)
app.use('/customer', customersRouter)

/*app.get("/customer/test", (req, res) => {
    res.send("Authed");
});*/

app.use((req, res, next) => {
    next(new ApiError(httpStatus.NOT_FOUND, 'Not found'));
});

app.use(errorConverter);
app.use(errorHandler);

app.get("/", (req, res) => {
    res.send("Welcome to the express server | It is now " + DateTime.now().toLocaleString(DateTime.DATETIME_MED));
})

app.listen(config.port, async () => {
    console.log("Computer OS Platform Info : " + os.platform());
    console.log("Computer OS Architecture Info: " + os.arch());
    console.log(`Listening at http://localhost:${config.port}`)


    console.log("Attempting to connect to mongodb server");
    await config.mongoClient.connect();
    await books.updateBooks();
    console.log("Connected to MongoDB server");
});

module.exports = app;
