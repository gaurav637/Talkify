import {User} from "../models/user.js";

export const verifyEmail = async (req,res)=> {
    try{
        const {email} = req.body;
        const checkEmail = await User.findOne({email}).select("-password");//not send password frontend side
        if(!checkEmail){
            console.log("Not Found Email");
            res.send(404).json({
                Message: "user Not Exist",
                Error: true
            })
        }
        res.status(200).json({
            Message: "user is valid",
            Data: checkEmail
        });

    }catch(error){
        console.log("Invlid Email Address!");
        res.status(500).json({Message: "Invalid Email!"});
    }
}