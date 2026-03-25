import  { Router } from 'express';
import { Login, logout, userDetails } from '../03-controllers/01-user.js';
import { jwtAuthMiddeware } from '../05-middlewares/jwtAuthMiddelware.js';

export const authRouter=Router();

authRouter.post("/auth/login",Login);
authRouter.get("/userDetails",jwtAuthMiddeware,userDetails);
authRouter.post("/logout",jwtAuthMiddeware,logout);