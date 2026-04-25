import express from "express";
import cors from "cors";
import cookieParser from "cookie-parser";
import { connectDB } from "./01-config/connectDB.js";
 import requestIp from "request-ip";
import { authRouter } from "./04-routes/auth.js";
import { interviewRouter } from "./04-routes/interview.js";


const app=express();
app.use(cors({
    origin:"http://localhost:5173",
    methods:["GET", "POST", "PUT", "DELETE"],
    credentials:true,
}));
 

// middlewares
app.use(cookieParser());

app.use(requestIp.mw());

app.use(express.json());


app.use("/api/user",authRouter);
app.use("/api/user/interview", interviewRouter);
let port=process.env.PORT;




/* -------------------- Start Server -------------------- */
/* -------------------- Start Server -------------------- */
async function startServer() {
    try {
        await connectDB();
        // Add "0.0.0.0" to listen on all IPv4 interfaces
        app.listen(port, "0.0.0.0", () => {
            console.log(`Server running on Port ${port}`);
        });
    } catch (error) {
        console.error("Failed to connect to DB", error);
    }
}

startServer();

