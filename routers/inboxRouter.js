const { showInboxPage } = require('../controllers/inboxController');
const { decorateHtmlResponse } = require('../middlewares/decorateHtmlResponse');

const router = require('express').Router();

router.route('/')
    .get(decorateHtmlResponse("Inbox"),showInboxPage);

module.exports.inboxRouter = router;