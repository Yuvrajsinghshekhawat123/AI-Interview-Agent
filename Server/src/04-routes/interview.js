import { Router } from "express";
import { jwtAuthMiddeware } from '../05-middlewares/jwtAuthMiddelware.js';
import { finishInterview, generateQuestions, submitAnswer } from "../03-controllers/01-user.js";


export const interviewRouter=Router();   
interviewRouter.post("/generate-questions", jwtAuthMiddeware, generateQuestions);
interviewRouter.post("/submit-answers", jwtAuthMiddeware, submitAnswer);
interviewRouter.post("/finish-interview", jwtAuthMiddeware, finishInterview);

