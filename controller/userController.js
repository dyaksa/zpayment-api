const User = require("../models/userModel");
const Topup = require("../models/topupModel");
const _ = require("underscore");
const bcrypt = require("bcrypt");

exports.postUser = (req, res) => {
  User.save(req.body)
    .then((results) => {
      res.status(201).send({
        success: true,
        message: "success created user",
        data: results[0],
      });
    })
    .catch((err) => {
      res.status(500).send({
        success: false,
        message: "Internal server error",
        data: [],
      });
    });
};

exports.userUpdate = (req, res) => {
  let id = req.userId;
  let {
    firstName = "",
    lastName = "",
    email = "",
    password = "",
    pin = "",
    phone = "",
    photo = "",
    balance = "",
    userInformation = "",
    verified = "",
  } = req.body;

  if (
    firstName.trim() ||
    lastName.trim() ||
    email.trim() ||
    password.trim() ||
    pin.trim() ||
    phone.trim() ||
    photo.trim() ||
    balance.trim() ||
    userInformation.trim() ||
    verified.trim()
  ) {
    User.getById(id)
      .then((results) => {
        if (!_.isEmpty(results[0])) {
          let body = {};
          if (req.body.password) {
            const { password } = req.body;
            body = {
              ...req.body,
              password: bcrypt.hashSync(password, 10),
            };
          }else if(req.file) {
            body = { ...req.body, photo: `${process.env.BASE_URI}/${req.file.filename}`};
          }else{
            body = {...req.body};
          }
          const data = Object.entries(body).map((item) => {
            return parseInt(item[1]) > 0
              ? `${item[0]} = ${item[1]}`
              : `${item[0]} = '${item[1]}'`;
          });
          User.updateById(id, data)
            .then((results) => {
              res.status(200).send({
                success: true,
                message: `User ${id} success update`,
                data: results[0],
              });
            })
            .catch((err) => {
              res.status(400).send({
                success: false,
                message: "failed update user",
              });
            });
        } else {
          res.status(404).send({
            success: false,
            message: "users not found",
          });
        }
      })
      .catch((err) => {
        res.status(500).send({
          success: false,
          message: "Internal server error",
          data: [],
        });
      });
  } else {
    res.status(500).send({
      success: false,
      message: "internal server error",
    });
  }
};

exports.getUser = (req, res) => {
  const id = req.userId;
  let { page, limit, name } = req.query;
  if (!page) page = 1;
  else page = parseInt(page);
  if (!limit) limit = 5;
  else limit = parseInt(limit);

  if(name){
    User.getUserByName(id,name,limit,page)
    .then(results => {
      if(!_.isEmpty(results[0])){
        res.status(200).send({
          success: true,
          message: `user ${name} founded`,
          data: results[0] 
        })
      }else{
        res.status(200).send({
          success: false,
          message: `user  ${name} not founded`,
          data: []
        })
      }
    }).catch(err => {
        res.status(500).send({
          success: false,
          message: "Internal server error",
          data: []
      })
    })
  }else{
    //when name is empty
    User.fetch(id, page, limit)
    .then((results) => {
      res.status(200).send({
        success: true,
        message: "success fetch user data",
        data: results[0],
      });
    })
    .catch((err) => {
      res.status(500).send({
        success: false,
        message: "failed fecth user data",
        data: err.message,
      });
    });
  }
};

exports.getUserLogin = (req, res) => {
  const id  = req.userId;
  User.getById(id)
    .then((results) => {
      if (!_.isEmpty(results[0])) {
        res.status(200).send({
          success: true,
          message: `success get user by id ${id}`,
          data: results[0],
        });
      } else {
        res.status(404).send({
          success: false,
          message: `user ${id} not found`,
          data: [],
        });
      }
    })
    .catch((err) => {
      res.status(500).send({
        success: false,
        message: `internal server error`,
        data: err.message,
      });
    });
};

exports.getByEmail = async (req,res) => {
  try {
    const { email } = req.params;
    const user = await User.findByEmail(email);
    if(!_.isEmpty(user[0])){
      return res.status(200).send({
        success: true,
        status: 200,
        message: "email found",
        data: user[0]
      })
    }
    return res.status(200).send({
      success: true,
      status: 200,
      message: "email not found",
      data: []
    })
  }catch(err){
    return res.status(500).send({
      success: false,
      status: 500,
      message: `internal server error: ${err.message}`
    })
  }
}

exports.getUserById =  async (req,res) => {
    try {
      let { id } = req.params;
      const user = await User.getById(id);
      if(_.isEmpty(user[0])){
        return res.status(404).send({
          success: false,
          message: "user cannot found",
          data: []
        })
      }
      return res.status(200).send({
        success: true,
        message: `user ${id} founded`,
        data: user[0]
      })
    }catch(err){
      return res.status(500).send({
        success: false,
        message: "internal server error",
        data: []
      })
    }
}

exports.deleteUser = (req, res) => {
  let { id } = req.params;
  User.getById(id)
    .then((results) => {
      if (!_.isEmpty(results[0])) {
        User.deleteById(id)
          .then((results) => {
            res.status(200).send({
              success: true,
              message: `success delete user ${id}`,
              data: results[0],
            });
          })
          .catch((err) => {
            res.status(500).send({
              success: false,
              message: err.message,
              data: [],
            });
          });
      } else {
        res.status(404).send({
          success: false,
          message: `user id ${id} not found`,
          data: [],
        });
      }
    })
    .catch((err) => {
      res.status(500).send({
        success: false,
        message: "Internal server Error",
        data: [],
      });
    });
};
