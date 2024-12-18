const UserModel = require("../models/UserModel")
const bcryptjs = require('bcryptjs')
const { sendEmail } = require("../utils/email");
const validator = require('validator');

async function registerUser(request,response){
    try {
        const { name, email , password, profile_pic, phone  } = request.body

        const checkEmail = await UserModel.findOne({ email }) 
        if(checkEmail){
            return response.status(400).json({
                message : "Already user exits",
                error : true,
            })
        }
        if(validator.isEmail(email)){
            // console.log('Valid email address.');
        }else{
            return response.status(500).json({
                message : "Invalid email address." || error,
                error : true
            })
        }

        const salt = await bcryptjs.genSalt(10)
        const hashpassword = await bcryptjs.hash(password,salt)

        const payload = {
            name,
            email,
            profile_pic,
            password : hashpassword
        }
        try{
            sendEmail(email, "Welcome to Talkify!", `Hi ${name},\n\nCongratulations on starting your journey with Talkify! I'm Gaurav, and I'm excited to have you on board.\n\nTalkify is designed to enhance communication through real-time messaging, file sharing, and video calls. With its user-friendly interface and robust security features, you can enjoy seamless interactions for both personal and professional use.\n\nWelcome aboard!`);

        }catch(error){
            return response.status(500).json({
                message : error.message || error,
                error : true
            })
        }
        const user = new UserModel(payload)
        const userSave = await user.save()

        return response.status(201).json({
            message : "User created successfully",
            data : userSave,
            success : true
        })

    } catch (error) {
        return response.status(500).json({
            message : error.message || error,
            error : true
        })
    }
}

module.exports = registerUser