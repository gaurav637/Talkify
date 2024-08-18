const UserModel = require("../models/UserModel")

async function checkEmail(request,response){  // check email
    try {
        const { email } = request.body // get data

        const checkEmail = await UserModel.findOne({email}).select("-password")

        if(!checkEmail){
            return response.status(400).json({
                message : "Invalid Email!",
                error : true
            })
        }

        return response.status(200).json({
            message : "email verify",
            success : true,
            data : checkEmail
        })

    } catch (error) {
        return response.status(500).json({
            message : error.message || error,
            error : true
        })
    }
}

module.exports = checkEmail