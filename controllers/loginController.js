// show login page
const showLoginPage = (req, res) => {
    console.log({current: req.baseUrl})
    res.render('login', {
        baseUrl: req.baseUrl
    });
}

module.exports = {
    showLoginPage
}