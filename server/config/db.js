const mongoose = require('mongoose')

const connectDB = async ()=>{
    const conn = await mongoose.connect(process.env.MONGO_URL)
    console.log(`MONGODB CONNECTED : ${conn.connection.host}`)
}

module.exports = connectDB

