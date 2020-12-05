const Transfers = require("../models/transferModel");
const User = require("../models/userModel");
const _ = require("underscore");
const entries = require("../helper/entries");
const OneSignal = require("onesignal-node");
const client = new OneSignal.Client(process.env.ONESIGNAL_APP_ID,process.env.ONESIGNAL_API_KEY);

exports.addTransfers = async (req, res) => {
  try {
    let { userId } = req.params;
    let { amount } = req.body;
    const sender = await User.getById(req.userId);
    const receive = await User.getById(userId);
    if(_.isEmpty(receive[0])){
      return res.status(404).send({
        success: false,
        message: "user cannot found",
        data: []
      })
    }
    const currentSenderBalance = sender[0][0].balance;
    const currentReceiveBalance = receive[0][0].balance;
    const data = {...req.body, sender_id: req.userId, receive_id: userId, category: 1};
    
    if(parseInt(amount) > parseInt(currentSenderBalance)){
      return res.status(401).send({
        success: false,
        message: "amount greater than balance"
      })
    }
    const senderBalance = (parseInt(currentSenderBalance) - parseInt(amount));
    const receiveBalance = (parseInt(currentReceiveBalance) + parseInt(amount));
    const updatedSender = await User.updateById(req.userId, entries({balance: senderBalance}));
    const updatedReceive = await User.updateById(userId, entries({balance: receiveBalance}));

    if(!updatedSender[0].affectedRows){
      return res.status(500).send({
        success: false,
        message: "Internal server error",
        data: updatedSender[0]
      })
    }

    if(!updatedReceive[0].affectedRows){
      return res.status(500).send({
        success: false,
        message: "Internal server error",
        data: updatedReceive[0]
      })
    }
    const transfered = await Transfers.save(data);
    if(!transfered[0].affectedRows){
      return res.status(500).send({
        success: false,
        message: "internal server error",
        data: transfered[0]
      })
    }

    const notification = {
      headings: {
        "en": `Congratulations your funds have been entered 🔔`
      },
      contents: {
        "en": `Transfer from ${sender[0][0].firstName} ${sender[0][0].lastName} of ${amount} has entered your wallet 🎁`
      },
      include_segments: ["Subscribed Users"],
      filters: [
        { "field": "email", "value": `${receive[0][0].email}` }
      ]
    }
    const response = await client.createNotification(notification)
    return res.status(201).send({
      success: true,
      message: `success transfer to ${receive[0][0].firstName} amount ${amount}`,
      data: transfered[0],
      notification_id: response.body.id
    })
  }catch(err){
    return res.status(500).send({
      success: false,
      message: err.message,
      data:[]
    })
  }
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

exports.getIncome = async (req,res) => {
  try{
    let total = 0;
    const id  = req.userId;
    const income = await Transfers.findIncome(id);
    if(_.isEmpty(income)){
      return res.status(200).send({
        success: true,
        message: `success fetch income ${id}`,
        data: [
          { average: 0 }
        ]
      })
    }
    income.map((item) => {
      total += parseInt(item.amount);
    });
    return res.status(200).send({
      success: true,
      message: `sucess fetch income ${id}`,
      data: [
        { average : total }
      ]
    })
  }catch(err){
    return res.status(500).send({
      success: false,
      message: err.message,
      data: []
    })
  }
};

exports.getExpense = async (req,res) => {
  try {
    let total = 0;
    const id = req.userId;
    const expense = await Transfers.findExpense(id);
    if(_.isEmpty(expense)){
      return res.status(200).send({
        success: true,
        message: `success fetch expense ${id}`,
        data: [
          { average : 0}
        ]
      })
    }
    expense.map((item) => {
      total += parseInt(item.amount);
    })
    return res.status(200).send({
      success: true,
      message: `success fetch expense ${id}`,
      data: [
        { average : total }
      ]
    })
  }catch(err){
    return res.status(500).send({
      success: false,
      message: err.message,
      data: []
    })
  }
};

exports.getTransactionsToday = async (req,res) => {
  try {
    const id = req.userId;
    const transactions = await Transfers.findTransactionToday(id);
    return res.status(200).send({
      success: true,
      status: 200,
      message: "successfully",
      data: transactions[0]
    })
  }catch(err){
    return res.status(500).send({
      success: false,
      status: 500,
      message: `internal server error ${err.message}`
    })
  }
}

exports.getTransactionsByWeek = async (req,res) => {
  try {
    const id = req.userId;
    const transactions = await Transfers.findDataByWeekAndLogin(id);
    if(!_.isEmpty(transactions[0])){
      return res.status(200).send({
        success: true,
        status: 200,
        message: "data last week founded",
        data: transactions[0]
      })
    }
    return res.status(200).send({
      success: true,
      status: 200,
      message: "data last week not found",
      data: []
    })
  }catch(err){
    return res.status(500).send({
      success: false,
      status: 500,
      message: `internal server error : ${err.message}`,
    })
  }
};

exports.getTransfersByUserLogin = async (req,res) => {
  try {
    const id = req.userId;
    let { page, limit } = req.query;
    if (!limit) limit = 5;
    else limit = parseInt(limit);
    if (!page) page = 1;
    else page = parseInt(page);
    const transfers = await Transfers.fetchByUserLogin(id,page,limit);
    return res.status(200).send({
      success: true,
      message: "success",
      data: transfers[0]
    })
  }catch(err){
    return res.status(500).send({
      success: false,
      message: err.message,
      data: []
    })
  }
}
