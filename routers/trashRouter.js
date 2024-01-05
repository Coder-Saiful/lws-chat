const { showTrashFilePage, deleteTrash } = require('../controllers/trashController');
const { decorateHtmlResponse } = require('../middlewares/decorateHtmlResponse');

const router = require('express').Router();

router.get('/', decorateHtmlResponse(""),showTrashFilePage);
router.post('/delete', deleteTrash);

module.exports.trashRouter = router;