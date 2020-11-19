const authModel = require("../models/authModel");
const userModel = require("../models/userModel");
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
const _ = require("underscore");
const faker = require("faker");

exports.register = (req, res) => {
  const data = {...req.body, uuid: faker.random.uuid()}
  authModel
    .register(data)
    .then((results) => {
      res.status(201).send({
        success: true,
        message: "success add users data",
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

exports.findEmail = async (req,res) => {
  const { email } = req.body;
  try {
    const result = await userModel.findByEmail(email);
    if(!_.isEmpty(result[0])){
      let token = jwt.sign(
        {
          id: result[0][0].id
        },
        process.env.SECRET_KEY,
        {
          expiresIn: Math.floor(Date.now() / 1000) + (60 * 60)
        }
      )
      return res.status(200).send({
        success: true,
        accessToken: token,
        message: "email founded"
      })
    }
    return res.status(404).send({
      success: false,
      message: "email is not exists"
    })
  }catch(err){
    return res.statu(500).send({
      success: false,
      message: "Internal server error"
    })
  }
} 

exports.updatedPassword = async (req,res) => {
  const { password } = req.body;
  try {
      const passwordCrypt = bcrypt.hashSync(password,10);
      const body = {
        password: passwordCrypt
      }
      const data = Object.entries(body).map((item) => {
        return parseInt(item[1]) > 0
          ? `${item[0]} = ${item[1]}`
          : `${item[0]} = '${item[1]}'`;
      });
      const updated = await userModel.updateById(req.userId, data);
      if(updated[0].affectedRows){
        return res.status(201).send({
          success: true,
          message: "success change password"
        })
      }
      return res.status(401).send({
        success: false,
        message: "change password is failed"
      })
  }catch(err){
    return res.status(500).send({
      success: false,
      message: err.message
    })
  }
}

exports.login = (req, res) => {
  const { email, password } = req.body;
  authModel
    .login(email)
    .then((user) => {
      if (!_.isEmpty(user)) {
        let passwordIsValid = bcrypt.compareSync(password, user[0].password);
        if (!passwordIsValid) {
          return res.status(401).send({
            success: false,
            email: email,
            auth: false,
            accessToken: null,
            data: {},
            message: "password is not match",
          });
        }
        let token = jwt.sign(
          {
            id: user[0].id,
            email: user[0].email,
          },
          process.env.SECRET_KEY
        );
        return res.status(201).send({
          success: true,
          email: email,
          auth: true,
          accessToken: token,
          user: {
            id: user[0].id,
            firstName: user[0].firstName,
            lastName: user[0].lastName,
          },
          message: "user is loged in",
        });
      } else {
        return res.status(404).send({
          success: false,
          message: "email is not exists",
          data: results[0],
        });
      }
    })
    .catch((err) => {
      return res.status(404).send({
        success: false,
        email: email,
        auth: false,
        accessToken: null,
        message: "email is not exists",
      });
    });
};
