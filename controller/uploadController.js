const Upload = require("../models/uploadModel");

exports.uploadPhoto = (req,res) => {
    const path = `${process.env.BASE_URI}/${req.file.filename}`;
    Upload.addPhoto(req.userId, path).then(results => {
        res.status(201).send({
            success: true,
            message: "success update image",
            data: results[0]
        })
    }).catch(err => {
        res.status(500).send({
            success: false,
            message: err.message,
            data:[]
        })
    });
}