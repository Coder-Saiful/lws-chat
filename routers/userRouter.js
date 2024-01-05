const { showUserPage, addUser, userDetails, editUser, deleteUser } = require('../controllers/userController');
const { decorateHtmlResponse } = require('../middlewares/decorateHtmlResponse');
const { singleFileUpload } = require('../middlewares/fileUpload/singleFileUpload');
const { addUserValidator, addUserValidatorHandler } = require('../validators/addUserValidator');

const router = require('express').Router();

router.route('/')
    .get(decorateHtmlResponse("Users"),showUserPage)
    .post(singleFileUpload("avatar", "avatar", 5), addUserValidator, addUserValidatorHandler, addUser);

router.route('/:id')
    .get(userDetails)
    .put(singleFileUpload("avatar", "avatar", 5), addUserValidator, addUserValidatorHandler, editUser)
    .delete(deleteUser);

module.exports.userRouter = router;