const { showLoginPage } = require('../controllers/loginController');
const { decorateHtmlResponse } = require('../middlewares/decorateHtmlResponse');

const router = require('express').Router();

router.get('/', decorateHtmlResponse("Login"),showLoginPage);

module.exports.loginRouter = router;