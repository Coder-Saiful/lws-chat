const {check, validationResult} = require('express-validator');
const {User} = require('../models/people');
const path = require('path');
const fs = require('fs');
const { unlinkFile } = require('../helper/unlinkFile');

const addUserValidator = [
    check('name')
        .isLength({min: 1}).withMessage("Name is required.")
        .isLength({min: 5}).withMessage("Name must be at least 5 characters long.")
        .isLength({max: 50}).withMessage("Name must be less than or equal 50 characters.")
        .isAlpha("en-US", {ignore: ". "}).withMessage("Name must not contain anything other than alphabet.")
        .trim(),
    check("email")
        .isLength({min: 1}).withMessage("Email is required.")
        .isEmail().withMessage("Invalid email address.")
        .trim(),
    check("mobile")
        .isLength({min: 1}).withMessage("Mobile number is required.")
        .isNumeric().withMessage("Invalid number.")
        .isMobilePhone("bn-BD", {strictMode: true}).withMessage("Mobile number must be a valid bangladeshi mobile number."),
    check("dob")
        .isLength({min: 1}).withMessage("Date of birth is required.")
        .custom((value) => {
            const pattern1 = /^\d{4}-\d{1,2}-\d{1,2}$/;
            const pattern2 = /^\d{1,2}-\d{1,2}-\d{4}$/;
            const pattern3 = /^\d{4}\/\d{1,2}\/\d{1,2}$/;
            const pattern4 = /^\d{1,2}\/\d{1,2}\/\d{4}$/;

            if (pattern1.test(value) || pattern2.test(value) || pattern3.test(value) || pattern4.test(value)) {
                return true;
            } else {
                return false;
            }
        }).withMessage("Invalid date of birth"),
    check("password")
        .isLength({min: 1}).withMessage("Password is required.")
        .isStrongPassword().withMessage("Password must be at least 8 characters long and should contain at least 1 uppercase letter, 1 lowercase letter, 1 number & 1 symbol"),
    check("cpassword")
        .isLength({min: 1}).withMessage("Confirm password is required.")
        .custom((value, req) => {
            return req.req.body.password === req.req.body.cpassword;
        }).withMessage("The password and confirm password match didn't match."),
    check("gender")
        .isLength({min: 1}).withMessage("Gender is required.")
        .custom((value) => {
            return value === "male" || value === "Male" || value === "Female" || value === "female" || value === "other" || value === "Other";
        }).withMessage("Gender must contain Male, Female or Other"),
    check("agreed")
        .custom(value => {
           if (!value || value == "" || value == "false" || value == false) {
            throw new Error("Accept our terms and conditions.")
           }
           return true;
        })
        .isBoolean().withMessage("This field accept boolean data like true or false.")
];

const addUserValidatorHandler = (req, res, next) => {
    const result = validationResult(req);
    const mappedError = result.mapped();
    for (let err in mappedError) {
        delete mappedError[err]["type"];
        delete mappedError[err]["value"];
        delete mappedError[err]["path"];
        delete mappedError[err]["location"];
    }

    let imageError = (req.imageError && Object.keys(req.imageError).length > 0) ? req.imageError : {};
    let inputError = (Object.keys(mappedError).length > 0) ? mappedError : {};
    let errors = {...imageError, ...inputError};

    if (Object.keys(errors).length > 0) {
        // unlink previous image if the previous image exists
        if (req.files && req.files.length > 0) {
           const filepath = path.join(global.upload, "avatar", req.files[0].filename);
           unlinkFile(filepath);
        }
        return res.status(400).send(errors);
    }
    next();
}

module.exports = {
    addUserValidator,
    addUserValidatorHandler
}