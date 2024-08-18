const UserModel = require("../models/UserModel");
require('dotenv').config();
const jwt = require('jsonwebtoken');

async function checkEmail(request,response){
    try {
        const { userId } = request.body
       // const checkEmail = await UserModel.findOne({_id}).select("-password")

       const checkEmail = await UserModel.findOne({ _id: userId}).select("-password");

        if(!checkEmail){
            return response.status(400).json({
                message : "user not exit",
                error : true
            })
        }
        const key = process.env.JWT_SECREAT_KEY;
        const token = jwt.sign({userId:checkEmail._id},key,{ expiresIn: '7d' });
        response.cookie("token",token);

        return response.status(200).json({
            message : "email verify",
            success : true,
            token: token,
            data : checkEmail
        })

    } catch (error) {
        console.log("failed to authenticated password 30 line");
        return response.status(500).json({
            message : error.message || error,
            error : true
        })
    }
}

module.exports = checkEmail