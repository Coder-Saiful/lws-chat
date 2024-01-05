module.exports.decorateHtmlResponse = (page_title) => (req, res, next) => {
    res.locals.html = true;
    res.locals.title = page_title + " - " + process.env.APP_NAME;
    next();
}