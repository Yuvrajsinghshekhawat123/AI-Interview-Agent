// controllers/paymentController.js
import { razorpay } from "../06-utils/Razorpay_Instance.js";
import crypto from "crypto";
import { Payment } from "../02-models/04-payment.js";
import { CreditPackage } from "../02-models/04-payment.js";
import { User } from "../02-models/01-userModel.js";

// Get all available credit packages
export const getCreditPackages = async (req, res) => {
  try {
    const packages = await CreditPackage.find({ isActive: true }).sort({
      displayOrder: 1,
      price: 1,
    });

    res.status(200).json({ success: true, packages });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// Create Razorpay Order
export const createOrder = async (req, res) => {
  try {
    const { packageId } = req.body;
    console.log("ddddddddddddddddd", packageId);
    const userId = req.userId;

    const creditPackage = await CreditPackage.findById(packageId);
    if (!creditPackage) {
      return res
        .status(404)
        .json({ success: false, message: "Package not found" });
    }

    // Handle free package - no payment required
    if (creditPackage.isFree || creditPackage.price === 0) {
      const user = await User.findById(userId);
      user.credits += creditPackage.credits;
      user.totalCreditsPurchased += creditPackage.credits;

      const payment = new Payment({
        userId,
        packageId: creditPackage._id,
        packageName: creditPackage.name,
        credits: creditPackage.credits,
        amount: 0,
        status: "completed",
        paidAt: new Date(),
      });
      await payment.save();

      user.paymentHistory.push(payment._id);
      await user.save();

      return res.status(200).json({
        success: true,
        message: "Free package activated",
        credits: creditPackage.credits,
        totalCredits: user.credits,
        isFree: true,
      });
    }

    // Create Razorpay Order
    const options = {
      amount: Math.round(creditPackage.price * 100), // Convert to paise
      currency: "INR",
      receipt: `receipt_${Date.now()}`,
      notes: {
        userId: userId.toString(),
        packageId: packageId,
        packageName: creditPackage.name,
        credits: creditPackage.credits.toString(),
      },
    };

    const order = await razorpay.orders.create(options);

    // Save payment record
    const payment = new Payment({
      userId,
      packageId,
      packageName: creditPackage.name,
      credits: creditPackage.credits,
      amount: creditPackage.price,
      razorpayOrderId: order.id,
      status: "pending",
    });
    await payment.save();

    res.status(200).json({
      success: true,
      orderId: order.id,
      amount: order.amount,
      currency: order.currency,
      keyId: process.env.RAZORPAY_KEY_ID,
      paymentId: payment._id,
    });
  } catch (error) {
    console.error("Create order error:", error);
    res.status(500).json({ success: false, message: error.message });
  }
};

// Verify Payment after checkout
export const verifyPayment = async (req, res) => {
  try {
    const { orderId, paymentId, signature, paymentRecordId } = req.body;

    const userId = req.userId;

    // Find payment record
    const payment = await Payment.findById(paymentRecordId);
    if (!payment) {
      return res
        .status(404)
        .json({ success: false, message: "Payment record not found" });
    }

    if (payment.status === "completed") {
      return res
        .status(200)
        .json({ success: true, message: "Already verified" });
    }

    // Verify signature
    const body = orderId + "|" + paymentId;
    const expectedSignature = crypto
      .createHmac("sha256", process.env.RAZORPAY_KEY_SECRET)
      .update(body.toString())
      .digest("hex");

    if (expectedSignature !== signature) {
      payment.status = "failed";
      payment.failedReason = "Signature verification failed";
      await payment.save();
      return res
        .status(400)
        .json({ success: false, message: "Invalid payment signature" });
    }

    // Update payment record
    payment.razorpayPaymentId = paymentId;
    payment.razorpaySignature = signature;
    payment.status = "completed";
    payment.paidAt = new Date();
    await payment.save();

    // Add credits to user
    const user = await User.findById(userId);
    user.credits += payment.credits;
    user.totalCreditsPurchased += payment.credits;
    user.paymentHistory.push(payment._id);
    await user.save();

    res.status(200).json({
      success: true,
      message: "Payment verified successfully",
      credits: payment.credits,
      totalCredits: user.credits,
      totalPurchased: user.totalCreditsPurchased,
    });
  } catch (error) {
    console.error("Payment verification error:", error);
    res.status(500).json({ success: false, message: error.message });
  }
};

// Get user's credit balance
export const getCreditBalance = async (req, res) => {
  try {
    const user = await User.findById(req.userId).select(
      "credits totalCreditsPurchased",
    );
    res.status(200).json({
      success: true,
      credits: user?.credits || 0,
      totalPurchased: user?.totalCreditsPurchased || 0,
    });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// Get payment history
export const getPaymentHistory = async (req, res) => {
  try {
    const payments = await Payment.find({
      userId: req.userId,
      status: "completed",
    })
      .populate("packageId")
      .sort({ createdAt: -1 });
    res.status(200).json({ success: true, payments });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};



export const getPurchasedPackages = async (req, res) => {
  try {
    const userId = req.userId;
    const user = await User.findById(userId).populate({
      path: "paymentHistory",
      select: "amount credits packageId packageName status paidAt",
    });


    res.status(200).json({
      success: true,
      purchasedPackages: user.paymentHistory || [],
    });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};




// Deduct credit for interview
// export const deductCredits = async (req, res) => {
//   try {
//     const user = await User.findById(req.userId);
//     if (!user || user.credits <= 0) {
//       return res.status(403).json({
//         success: false, message: "Insufficient credits", credits: 0
//       });
//     }
//     user.credits -= 1;
//     await user.save();
//     res.status(200).json({ success: true, creditsRemaining: user.credits });
//   } catch (error) {
//     res.status(500).json({ success: false, message: error.message });
//   }
// };

// // Webhook Handler for automatic payment updates
// export const handleWebhook = async (req, res) => {
//   const secret = process.env.RAZORPAY_WEBHOOK_SECRET;
//   const signature = req.headers['x-razorpay-signature'];

//   // Verify webhook signature [citation:6]
//   const body = JSON.stringify(req.body);
//   const expectedSignature = crypto
//     .createHmac('sha256', secret)
//     .update(body)
//     .digest('hex');

//   if (expectedSignature !== signature) {
//     return res.status(400).json({ status: 'verification_failed' });
//   }

//   const event = req.body.event;

//   if (event === 'payment.captured') {
//     const paymentEntity = req.body.payload.payment.entity;
//     const orderId = paymentEntity.order_id;
//     const paymentId = paymentEntity.id;

//     const payment = await Payment.findOneAndUpdate(
//       { razorpayOrderId: orderId },
//       { razorpayPaymentId: paymentId, status: 'completed', paidAt: new Date() },
//       { new: true }
//     );

//     if (payment && payment.status !== 'completed') {
//       const user = await User.findById(payment.userId);
//       user.credits += payment.credits;
//       user.totalCreditsPurchased += payment.credits;
//       user.paymentHistory.push(payment._id);
//       await user.save();
//     }
//   }

//   res.status(200).json({ status: 'success' });
// };
