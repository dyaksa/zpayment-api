const db = require("../helper/DB");
const User = require("../models/userModel");
const _ = require("underscore");

module.exports = class Upload {
    static addPhoto(userId,image) {
        return new Promise((resolve,reject) => {
            User.getById(userId).then(results => {
                if(_.isEmpty(results[0])){
                    reject(new Error("user not found"));
                }else{
                    db.query(`UPDATE users SET photo = ? WHERE id = ?`,[image, userId])
                    .then(results => {
                        resolve(results);
                    }).catch(err => {
                        reject(err);
                    });
                }
            }).catch(err => {
                reject(err);
            })
        });
    }
}