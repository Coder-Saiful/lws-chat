const fs = require('fs');
const path = require('path');
const { User } = require('../models/people');
const { unlinkFile } = require('../helper/unlinkFile');

const showTrashFilePage = (req, res, next) => {
    const folders = fs.readdirSync(global.upload);
    let error = false;
    const folderWithData = [];

    folders.forEach(async (folder) => {

        const localFiles = fs.readdirSync(path.join(global.upload, folder));

        if (folder === "avatar") {
            try {
                const users = await User.find().select('avatar -_id');
                const userFiles = [];
                users.forEach(user => userFiles.push(user.avatar));

                const trashFiles = localFiles.filter((file) => !userFiles.includes(file));

                if (trashFiles.length > 0) {
                    folderWithData.push({folder, quantity: trashFiles.length, files: trashFiles})
                }

                res.render('trash',{
                    baseUrl: req.baseUrl,
                    title: "Delete all unused files.",
                    trashData: folderWithData
                });
            } catch (error) {
                next(400, "Failed to load trash files.");
            }
        }
    });

    
}

const deleteTrash = (req, res) => {
    let folder = req.body.folder;
    let trashFiles = req.body.trashFiles.split(",");
    let error = false;
    
    trashFiles.forEach(file => {
        const filepath = path.join(global.upload, folder, file);
        const result = unlinkFile(filepath);
        if (result) {
            error = false;
        } else {
            error = true;;
        }

    });
    if (error) {
        return res.status(400).send({message: "There was an error when deleting trash files."});
    }
    return res.status(200).send({message: "Trash file deleted successfully."});
}

module.exports = {
    showTrashFilePage,
    deleteTrash
}