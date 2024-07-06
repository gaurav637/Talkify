import { Schema } from "mongoose";
import { model } from "mongoose";

const userSchema = new Schema({
    name:{
        type: String,
        required: [true , "Provide Name"]
    },
    email:{
        type: String,
        require: [true , "Provide Email"],
        unique: true
    },
    password:{
        type: String,
        required: [true , "provide Password"],
        unique: true
    },
    profilePic:{
        type: String,
        default: ""
    }
},{
    timestamps: true
});

export const User = model('User',userSchema);
// module.exports =   UserModel;
