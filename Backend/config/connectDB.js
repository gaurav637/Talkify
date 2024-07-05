import mongoose from 'mongoose';
import 'dotenv/config'
export const connectDatabase = async ()=> {
    try{
        const url = process.env.MONGO_URI;
        await mongoose.connect(url);
        const connection = mongoose.connection;
        connection.on('connected' , ()=> {
            console.log("MongoDB Connected ");
        })
        connection.on('error' , ()=> {
            console.log('MongoDB Not Connected ');
        })
        connection.on('disconnected', ()=> {
            console.log('Disconnect MongoDB');
        })
    }catch(error){
        console.log("Failed to connect mongodb !");
    }
}
