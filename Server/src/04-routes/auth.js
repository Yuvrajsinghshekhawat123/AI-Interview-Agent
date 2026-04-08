import  { Router } from 'express';
import { analysisResume, Login, logout, userDetails } from '../03-controllers/01-user.js';
import { jwtAuthMiddeware } from '../05-middlewares/jwtAuthMiddelware.js';
import { upload } from '../05-middlewares/multer.js';

export const authRouter=Router();

authRouter.post("/auth/login",Login);
authRouter.get("/userDetails",jwtAuthMiddeware,userDetails);
authRouter.post("/logout",jwtAuthMiddeware,logout);
authRouter.post("/analyze-resume",jwtAuthMiddeware,upload.single("resume"),analysisResume);





