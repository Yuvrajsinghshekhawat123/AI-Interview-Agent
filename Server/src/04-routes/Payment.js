// routes/paymentRoutes.js

import { createOrder, getCreditBalance, getCreditPackages, getPaymentHistory, getPurchasedPackages, verifyPayment } from "../03-controllers/02-payment.js";
import { jwtAuthMiddeware } from "../05-middlewares/jwtAuthMiddelware.js";
import { Router } from "express";

const paymentRouter = Router(); 

// Webhook (must be raw body, before express.json())
// paymentRouter.post("/webhook", express.raw({ type: "application/json" }), handleWebhook);

// Protected routes
paymentRouter.get("/packages", jwtAuthMiddeware, getCreditPackages);
paymentRouter.post("/create-order", jwtAuthMiddeware, createOrder);
paymentRouter.post("/verify-payment", jwtAuthMiddeware, verifyPayment);
paymentRouter.get("/balance", jwtAuthMiddeware, getCreditBalance);
paymentRouter.get("/history", jwtAuthMiddeware, getPaymentHistory);
// paymentRouter.post("/deduct", jwtAuthMiddeware, deductCredits);
paymentRouter.get("/getPurchasedPackages", jwtAuthMiddeware, getPurchasedPackages);

export default paymentRouter;