require('dotenv/config');
const express = require('express');
const { baseMiddleware } = require('./middlewares');
const mongoose = require('mongoose');
const { routeList } = require('./middlewares/routes');
const { notFoundHandler, defaultErrorHandler } = require('./middlewares/errorHandler');
const app = express();

// all middlewares
baseMiddleware(app);

// route list
routeList(app);

// 404 not found handler
app.use(notFoundHandler);

// default error handler
app.use(defaultErrorHandler);

// database connection
mongoose.connect(process.env.CONN_STRING)
    .then(() => console.log("MongoDB database connection successfully."))
    .catch(err => {
        console.log(err);
        console.log('Mongodb database connection failed.');
    });

// start server
const port = process.env.PORT;
app.listen(port, () =>  {
    console.log('Server running on port ' + port + "...");
});