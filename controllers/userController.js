const _ = require("lodash");
const {
    User
} = require("../models/people");
const {
    unlinkFile
} = require("../helper/unlinkFile");
const path = require('path');
const bcrypt = require('bcrypt');
const createHttpError = require("http-errors");
const { default: mongoose } = require("mongoose");

// show users page

const showUserPage = async (req, res, next) => {
    try {
        const limit = req.query.limit ? parseInt(req.query.limit) : 0;
        const page = req.query.page ? parseInt(req.query.page) : 1;
        const search = req.query.search ? req.query.search : "";
        const totalUser = await User.countDocuments();
        const totalPages = Math.ceil(totalUser / limit);
        const skipData = (page - 1) * limit;
        if (page <= totalPages && totalUser > 0) {
            const users = await User.find({
                name: {
                    $regex: search,
                    $options: "i"
                }
            })
                .limit(limit)
                .skip(skipData)
                .select('-__v -password')
                .sort({
                    createdAt: -1
                });

                res.render('users', {
                    baseUrl: req.baseUrl,
                    users,
                    totalUsers: users.length
                });
                // return res.status(200).send(users); 
        } else {
            res.render('users', {
                baseUrl: req.baseUrl,
                totalUsers: 0,
                noUsers: "No data available" 
            });
            // return res.status(200).send({message: "No data available."});
        }

        
    } catch (error) {
        next(createHttpError(400, "Failed to fetch users data."));
    }

}

// user registration
const addUser = async (req, res) => {
    const data = _.pick(req.body, ["name", "email", "mobile", "dob", "password", "gender", "agreed"]);
    const filename = req.files[0].filename;
    const filepath = path.join(global.upload, "avatar", req.files[0].filename);

    try {

        const hashedPass = await bcrypt.hash(data.password, 10);

        let uniqueErrors = {};
        let findUserByEmail = await User.findOne({
            email: data.email
        });
        let findUserByMobile = await User.findOne({
            mobile: data.mobile
        });

        if (findUserByEmail) {
            uniqueErrors = {
                ...uniqueErrors,
                email: {
                    msg: "This email has already been exist."
                }
            }
        }

        if (findUserByMobile) {
            uniqueErrors = {
                ...uniqueErrors,
                mobile: {
                    msg: "This mobile number has already been exist."
                }
            }
        }

        if (Object.keys(uniqueErrors).length > 0) {
            unlinkFile(filepath);
            return res.status(400).send(uniqueErrors);
        }

        const user = new User({
            ...data,
            avatar: filename,
            password: hashedPass
        });

        await user.save();
        return res.status(201).send({
            message: "User registration has been successfully."
        });

    } catch (error) {
        unlinkFile(filepath);
        return res.status(400).send({
            message: "User registration has been failed."
        });
    }
}

// show user details by id

const userDetails = async (req, res) => {
    try {
        const id = req.params.id;
        const user = await User.findById(id)
            .select({
                __v: 0,
                password: 0
            });
        if (!user) {
            return res.status(404).send({
                message: "User not found."
            });
        }
        return res.status(200).send(user);
    } catch (error) {
        if (error instanceof mongoose.Error.CastError) {
            return res.status(404).send({
                message: "User not found."
            });
        }
        return res.status(400).send({
            message: "Failed to fetch user details."
        });
    }
}

const editUser = async (req, res) => {
    try {
        const id = req.params.id;
        const user = await User.findById(id);
        if (!user) {
            return res.status(404).send({
                message: "User not found."
            });
        } 
        const userdata = (req.files && req.files.length > 0) ? {...req.body, avatar: req.files[0].filename} : {...req.body};
        const result = await User.findByIdAndUpdate(id, userdata);
        if (req.files && req.files.length > 0) {
            unlinkFile(path.join(global.upload, "avatar", user.avatar));
        }

        return res.status(200).send({message: "User information was updated."});
        
    } catch (error) {
        if (req.files && req.files.length > 0) {
            unlinkFile(path.join(global.upload, "avatar", req.files[0].filename));
        }
        if (error instanceof mongoose.Error.CastError) {
            return res.status(404).send({
                message: "User not found."
            });
        }
        return res.status(400).send({
            message: "Failed to update user details."
        });
    }
}

const deleteUser = async (req, res) => {
    try {
        const id = req.params.id;
        const user = await User.findByIdAndDelete(id);
        if (!user) {
            return res.status(404).send({
                message: "User not found."
            });
        } 
        unlinkFile(path.join(global.upload, "avatar", user.avatar));
        return res.status(200).send({message: "User was deleted."});
    } catch (error) {
        if (error instanceof mongoose.Error.CastError) {
            return res.status(404).send({
                message: "User not found."
            });
        }
        return res.status(400).send({
            message: "Failed to delete user details."
        });
    }
} 

module.exports = {
    showUserPage,
    addUser,
    userDetails,
    editUser,
    deleteUser
}