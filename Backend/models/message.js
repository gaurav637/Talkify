import mongoose from "mongoose";

const messageSchema = new mongoose.Schema({
    text:{
        type: String,
        default: ""
    },
    imageUrl:{
        type: String,
        default: ""
    },
    videoUrl:{
        type: String,
        default: ""
    },
    seen:{
        type: Boolean,
        default: false
    }
},{
    timestamps: true
})

const messageModel = mongoose.model('Message',messageSchema);
module.exports = messageModel;