const Transfers = require("../models/transferModel");
const User = require("../models/userModel");
const _ = require("underscore");

exports.addTransfers = (req, res) => {
  let { userId } = req.params;
  User.getById(userId)
    .then((userData) => {
      if (!_.isEmpty(userData[0])) {
        const data = {...req.body, sender_id: req.userId, receive_id: userId};
        Transfers.save(data)
          .then((results) => {
            res.status(201).send({
              success: true,
              message: "success add transfers data",
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
          message: `user id ${userId} not found`,
        });
      }
    })
    .catch((err) => {
      res.status(500).send({
        success: false,
        message: err.message,
        data: [],
      });
    });
};

exports.deleteTransfers = (req, res) => {
  let { id } = req.params;
  Transfers.getById(id)
    .then((results) => {
      if (!_.isEmpty(results[0])) {
        Transfers.deleteById(id)
          .then((results) => {
            res.status(200).send({
              success: true,
              message: `delete transfer ${id} success`,
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
          message: `transfer ${id} not found`,
        });
      }
    })
    .catch((err) => {
      res.status(500).send({
        success: false,
        message: err.message,
      });
    });
};

exports.getById = (req, res) => {
  let { id } = req.params;
  Transfers.getById(id)
    .then((results) => {
      if (!_.isEmpty(results[0])) {
        res.status(200).send({
          success: true,
          message: `success fetch transfer ${id}`,
          data: results[0],
        });
      } else {
        res.status(404).send({
          success: false,
          message: `transfer id ${id} cannot found`,
          data: [],
        });
      }
    })
    .catch((err) => {
      res.status(500).send({
        success: false,
        message: err.message,
      });
    });
};

exports.updateTransfer = (req, res) => {
  let { id } = req.params;
  let { amount = "", note = "" } = req.body;
  if (amount.trim() || note.trim()) {
    Transfers.getById(id)
      .then((results) => {
        if (!_.isEmpty(results[0])) {
          const data = Object.entries(req.body).map((item) => {
            return parseInt(item[1]) > 0
              ? `${item[0]} = ${item[1]}`
              : `${item[0]} = '${item[1]}'`;
          });
          Transfers.updateById(id, data)
            .then((results) => {
              res.status(200).send({
                success: true,
                message: `success update transfer ${id}`,
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
            message: `transfer ${id} not found`,
          });
        }
      })
      .catch((err) => {
        res.status(500).send({
          success: false,
          message: err.message,
        });
      });
  } else {
    res.status(500).send({
      success: false,
      message: `Internal server error`,
    });
  }
};

exports.getTransfers = (req, res) => {
  let { page, limit, name } = req.query;
  if (!limit) limit = 5;
  else limit = parseInt(limit);
  if (!page) page = 1;
  else page = parseInt(page);
  if (name) {
    Transfers.getTransferName(req.userId,name)
      .then((results) => {
        if (!_.isEmpty(results[0])) {
          res.status(200).send({
            success: true,
            message: `success fetch user name ${name}`,
            data: results[0],
          });
        } else {
          res.status(404).send({
            success: false,
            message: `transaction ${name} cannot found`,
            data: [],
          });
        }
      })
      .catch((err) => {
        res.status(500).send({
          success: false,
          message: err.message,
          data: [],
        });
      });
  } else {
    Transfers.fetch(req.userId, page,limit).then(results => {
      if(!_.isEmpty(results[0])){
        res.status(200).send({
          success: true,
          message: "success fetch data user",
          data: results[0]
        })
      }else{
        res.status(404).send({
          success: false,
          message: "transaction not found",
          data: []
        })
      }
    }).catch(err => {
      res.status(500).send({
        success: false,
        message: "Internal server error",
        data:[]
      })
    })
  }
};
