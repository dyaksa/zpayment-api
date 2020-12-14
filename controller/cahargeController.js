const services = require("../services/sevices");
const User = require("../models/userModel");

exports.charge = async (req,res) => {
    const id = req.userId;
    const { amount } = req.body;
    try {
        const user = await User.getById(id);
        const data = { 
            id: id,
            firstName: user[0][0].firstName, 
            lastName: user[0][0].lastName, 
            email: user[0][0].email, 
            phone: user[0][0].phone,
            name: `${user[0][0].firstName} ${user[0][0].lastName}`
        }
        const result = await services.postCharge(amount,data);
        if(result.token){
            return res.status(200).send({
                success: false,
                status: 200,
                message: "token found",
                token: result.token
            })
        }
        return res.status(403).send({
            success: false,
            status: 403,
            message: "token cannot found",
            token: null
        })
    }catch(err){
        return res.status(500).send({
            success: false,
            status: 500,
            message: `internal server error ${err.message}`
        })
    }
}
