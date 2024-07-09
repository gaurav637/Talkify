import 'dotenv/config';
import express from 'express';
import cors from 'cors';
import {connectDatabase} from './config/connectDB.js';
import chatRoutes from "./routes/chatRouters.js"; 
const app = express();

connectDatabase();
app.use(express.json());
app.use(cors({
    origin: process.env.FRONTEND_URL,
    credentials : true
}));
app.use('/user',chatRoutes);
app.get('/' , (req,res) => {
    res.send({
        Message: "hello world iam Gaurav Negi"
    })
})


const PORT = process.env.PORT||8080;
app.listen(PORT ,()=> {
    console.log(`server is running at port ${PORT}`);
})