const createHttpError = require("http-errors")

// 404 not found error handler
const notFoundHandler = (req, res, next) => {
    next(createHttpError(404, 'Your request content was not found.'))
}

// default error handler
const defaultErrorHandler = (err, req, res, next) => {
    res.locals.error = process.env.NODE_ENV === 'development' ? err : {message: err.message};
    res.status(err.status || 500);

    if (res.locals.html) {
        res.render('error', {
            title: "Error Page"
        });
    } else {
        return res.send(res.locals.error);
    }
}

module.exports = {
    notFoundHandler,
    defaultErrorHandler
}