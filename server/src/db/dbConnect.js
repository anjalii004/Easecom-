const mongoose = require("mongoose");
const connectDB = async() => {
    try {
        const connectionInstance = await mongoose.connect(process.env.MONGODB_URL);
        // console.log(connectionInstance);
        console.log("MongoDB Connected !! DB HOST - ", connectionInstance.connection.host);
    } catch (err) {
        console.log("MongoDB connection failed !!", err);
        process.exit(1);
    }
}
module.exports = connectDB;
