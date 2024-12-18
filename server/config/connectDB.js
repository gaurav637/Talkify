const mongoose = require('mongoose')

async function connectDB(){
    try {
        await mongoose.connect(process.env.MONGODB_URI)

        const connection = mongoose.connection

        connection.on('connected',()=>{
            console.log("Connect to DB")
        })

        connection.on('error',(error)=>{
            console.log("MongoDB Failed ",error)
        })
    } catch (error) {
        console.log("Failed to connect DataBase",error)
    }
}

module.exports = connectDB