const Upload = require("../models/uploadModel");
const cloudinary = require("../helper/cloudinary");

exports.uploadPhoto = async (req,res) => {
    try {
        const image = await cloudinary.uploader.upload(req.file.path);
        const updated = await Upload.addPhoto(req.userId, image.secure_url);
        res.status(200).send({
            success: true,
            message: "success update image avatar",
            data: updated[0]
        });
    }catch(err){
        return res.status(500).send({
            success: false,
            message: err.message,
            data: []
        })
    }
    // Upload.addPhoto(req.userId, path).then(results => {
    //     res.status(201).send({
    //         success: true,
    //         message: "success update image",
    //         data: results[0]
    //     })
    // }).catch(err => {
    //     res.status(500).send({
    //         success: false,
    //         message: err.message,
    //         data:[]
    //     })
    // });
}