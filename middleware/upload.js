const multer = require("multer");
const helper = require("../helper/imageFilter");
const path = require("path");
const storage = multer.diskStorage({
    destination: function(req,file,cb){
        cb(null,"public/");
    },
        filename: (req, file, cb) => {
        cb(null, file.fieldname + '-' + Date.now() + path.extname(file.originalname));
    }
});

const uploadImage = (req,res,next) => {
    const upload = multer({storage: storage, fileFilter: helper.imageFilter}).single("photo");
    upload(req,res,(err) => {
        if(req.fileValidationError){
            return res.status(500).send({
              success: false,
              message: err.message
            })
        }
        if(!req.file){
            return res.status(500).send({
                success: false,
                message: "Please select an image to upload"
            })
        }
        if(err instanceof multer.MulterError){
            return res.status(500).send({
                success: false,
                message: err
            })
        }
        if(err){
            return res.status(500).send({
                success: false,
                message: err
            });
        }
        next();
        return;
    });
}

exports.uploadImage = uploadImage;