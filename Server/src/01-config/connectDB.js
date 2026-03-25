import mongoose from "mongoose";


export const connectDB=async ()=>{
    try{
        await mongoose.connect(process.env.MONGODB_URL);
        console.log("MongoDb connected successfully");
    }catch(err){
        console.error("❌ MongoDB connection error:", err.message);
        process.exit(1);
    }
};

