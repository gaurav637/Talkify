import {User} from "../models/user.js";
import bcrypt from 'bcrypt';
import jwt from 'jsonwebtoken';

export const registerUser =  async (req,res) => {
    try{
        const {email,password,name,profilePic} = req.body;
        const checkEmail = await User.findOne({ email });
        if(checkEmail){
            console.log("email already Used!");
            res.status(404).json({Error: "Email is Already Used! please try new email address"});
        }
        const salt = await bcrypt.genSalt(10);
        const hashPassword = await bcrypt.hash(password,salt);
        const payload = {
            email,
            password: hashPassword,
            name,
            profilePic
        }
        const user = new User(payload);
        const savedUser = await user.save();
        res.status(201).json({
            Message: "User created Successfully",
            Data: savedUser,
            Success: true
        });

    }catch(error){
        console.log("failed to create new User");
        res.status(500).json({Error: "Failed to Create new User"});
    }
}

export const loginUser = async (req,res) => {
   try{
        const {email , password} = req.body;
        const user = User.findOne({email});
        if(!user){
            console.log("user not found invalid email!");
            res.status(404).json({Error: "User Not Found!"});
        }
        const passwordMatch = bcrypt.compare(password,user.password);
        console.log("password matcher -> ",passwordMatch);
        if(!passwordMatch){
            console.log("user not found invalid password!");
            res.status(404).json({Error: "User Not Found!"});
        }
        
        const key = password.env.SECRET_KEY;
        const token = jwt.sign({userId : user._id}, key,{
            expiresIn: '1h'
        });
        res.status(200).json(token);
   }catch(error){
        console.log("Failed to Authentication!",error);
        res.status(500).json({Message: "Failed Authentication"});
    }
}


