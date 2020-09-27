const Topup = require("../models/topupModel");

exports.getTopup = (req, res) => {
  let { page, limit } = req.query;
  if (!limit) limit = 5;
  else limit = parseInt(limit);
  if (!page) page = 1;
  else page = parseInt(page);
  Topup.fetchAll(page, limit)
    .then((results) => {
      res.status(200).send({
        success: true,
        message: "success fetch topup data",
        data: results[0],
      });
    })
    .catch((err) => {
      res.status(500).send({
        success: false,
        message: "failed fetch topup data",
        data: [],
      });
    });
};

exports.postTopup = (req, res) => {
  const { title } = req.body;
  if (title) {
    Topup.save(title)
      .then((results) => {
        res.status(201).send({
          success: true,
          message: "success created topup data",
          data: results[0],
        });
      })
      .catch((err) => {
        res.status(500).send({
          success: false,
          message: "Internal server error",
          data: new Error(err),
        });
      });
  } else {
    res.status(400).send({
      success: false,
      message: "all fields must be filled",
      data: [],
    });
  }
};

exports.deleteTopup = (req, res) => {
  const { id } = req.params;
  Topup.deleteById(id)
    .then((results) => {
      res.status(200).send({
        success: true,
        message: "success delete topup",
        data: results,
      });
    })
    .catch((err) => {
      res.status(500).send({
        success: false,
        message: "Internal server error",
        data: err,
      });
    });
};
