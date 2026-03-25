import express from "express";
import cors from "cors";
import cookieParser from "cookie-parser";
import { connectDB } from "./01-config/connectDB.js";
 import requestIp from "request-ip";
import { authRouter } from "./04-routes/auth.js";


const app=express();
 

// middlewares
app.use(cookieParser());

app.use(requestIp.mw());
app.use(cors({
    origin:"http://localhost:5173",
    methods:["GET", "POST", "PUT", "DELETE"],
    credentials:true,
}));

app.use(express.json());


app.use("/api/user",authRouter);
let port=process.env.PORT;




/* -------------------- Start Server -------------------- */
async function startServer() {
    await connectDB();
    app.listen(port,()=>{
        console.log(`Server running on Port ${port}`);
    });
}

startServer();

