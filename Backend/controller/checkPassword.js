import {User} from "../models/user.js";
import bcrypt from "bcrypt"
import jwt from "jsonwebtoken"

export const checkPassword = async (req,res)=> {
    try{
        const {password,userId} = req.body;
        const user = await User.findById(userId);
        if(!user){
            console.log("Invlid user! ");
            res.status(400)
            .json({
                Message: "incorrect userId'"
            })
        }
        const matchPassword = await bcrypt.compare(password,user.password);
        if(!matchPassword){
            console.log("invalid password!");
            res.status(400)
            .json({
                Message: "Invalid password used!"
            });
        }
        const tokenData = {
            userId: user._id,
            email: user.email
        }
        const cookieOption = {
            http: true,
            secure: true
        }
        const token = jwt.sign(tokenData,process.env.SECRET_KEY,{expiresIn: '1d'});

        console.log("password is correct");
        res.status.cookie("token",token,cookieOption)(200)
        .json({
            Message: "Login Successfully", 
            Data: token,
            success: true
                              
        });
    }catch(error){
        console.log("Failed to check password");
        res.status(500)
        .json({
            Message: "Failed to check user password",
            Success: true
        })
    }
}