import mongoose, { connect } from "mongoose";

const connectDB = async (mongoUri) => {
    try{
        await mongoose.connnect(mongoUri);
        console.log("Database connectd 🚀")
    }
    catch(err){
        console.error("❌ There was en error connecting to the database error:", err);
        process.exit(1);
    }
}

export default connectDB;