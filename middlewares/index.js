const cookieParser = require('cookie-parser');
const express = require('express');
const morgan = require('morgan');
const path = require('path');


module.exports.baseMiddleware = (app) => {
    // request parser
    app.use(express.json());
    app.use(express.urlencoded({extended: true}));

    // cookie parser
    app.use(cookieParser(process.env.SECRET_KEY));

    // set view engine
    app.set('view engine', 'ejs');

    // set static folder
    app.use(express.static(path.join(__dirname, '../public')));

    // check request details
    if (process.env.NODE_ENV == 'development') {
        app.use(morgan('tiny'));
    }

    // set global variable
    global.upload = path.join(__dirname, "../public/uploads");
}