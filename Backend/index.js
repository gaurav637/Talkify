import 'dotenv/config';
import express from 'express';
import cors from 'cors';
import {connectDatabase} from './config/connectDB.js';
const app = express();

app.use(cors({
    origin: process.env.FRONTEND_URL,
    credentials : true
}));

const PORT = process.env.PORT||8080;

app.get('/' , (req,res) => {
    res.send({
        Message: "hello world iam Gaurav Negi"
    })
})

app.listen(PORT ,()=> {
    console.log(`server is running at port ${PORT}`);
})