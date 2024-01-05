// show inbox page
const showInboxPage = (req, res) => {
    res.locals.baseUrl = req.baseUrl;
    res.render('inbox');
}

module.exports = {
    showInboxPage
}