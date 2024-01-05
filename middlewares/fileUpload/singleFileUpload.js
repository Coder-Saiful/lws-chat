const multer = require('multer');
const path = require('path');

module.exports.singleFileUpload = (folderName, fieldName, maxSize = 5, fileTypes = ["image/jpg", "image/png", "image/jpeg"]) => (req, res, next) => {
    const UPLOAD_FOLDER = path.join(__dirname, `../../public/uploads/${folderName}`);

    const storage = multer.diskStorage({
        destination: (req, file, cb) => {
            cb(null, UPLOAD_FOLDER);
        },
        filename: (req, file, cb) =>  {
            const fileExt = path.extname(file.originalname);
            const fileName = file.originalname.replace(fileExt, "").toLocaleLowerCase().split(/[\s,_]+/).join("-").concat("-").concat(Date.now());
            const fileName2 = "image_".concat(Date.now());
            cb(null, fileName + fileExt);
        }
    }); 
    
    const upload = multer({
        storage: storage,
        fileFilter: (req, file, cb) => {
            if (fileTypes.includes(file.mimetype)) {
                cb(null, true);
            } else {
                req.imageError = {
                    [fieldName]: "Only jpg, jpeg or png format are allowed."
                }
                next();
            }
        },
        limits: {
            fileSize: 1024 * 1024 * maxSize
        }
    });

    upload.any()(req, res, (err) => {
        if (err) {
            if (err.code && err.code === "LIMIT_FILE_SIZE") {
                req.imageError = {
                    [fieldName]: `Your file must be less than or equal ${maxSize}mb.`
                }
                next();
            } else {
                req.imageError = {
                    [fieldName]: `Your image was not upload.`
                }
            }
        } else {
            if (req.method == "POST" && req.files.length == 0) {
                req.imageError = {
                    [fieldName]: `Image field is required.`
                }
            }
            next();
        }
    });
}  
