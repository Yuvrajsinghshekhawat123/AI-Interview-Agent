
import { User } from "../02-models/01-userModel.js";
import { Session } from "../02-models/02-session.js";
import argon2 from "argon2";
import admin from "../06-utils/firebaseAdmin.js";
import { setAccessTokenCookies, setRefreshTokenCookie } from "../06-utils/token.js";

export async function Login(req, res) {
  try {
    const token = req.headers.authorization?.split(" ")[1];

    if (!token) {
      return res.status(401).json({ message: "No token provided" });
    }

    // ✅ Verify Firebase token
    const decoded = await admin.auth().verifyIdToken(token);
 

    // ✅ Create or find user
    let user = await User.findOne({ email: decoded.email });

    if (!user) {
      user = await User.create({
        name: decoded.name,
        email: decoded.email,
        firebaseUid: decoded.uid,
      });
    }

    // ✅ Create tokens
    const access_Token = setAccessTokenCookies(res, { userId: decoded.uid });
    const refresh_Token = setRefreshTokenCookie(res, { userId: decoded.uid });

    // ✅ Hash refresh token
    const hashedRefreshToken = await argon2.hash(refresh_Token);

    const userAgent = req.headers["user-agent"] || null;

    // ✅ Store session
    await Session.create({
      userId: decoded.uid, // FIXED
      refreshTokenHash: hashedRefreshToken, // FIXED
      userAgent,
      clientIp: req.clientIp,
    });

    // ✅ Send response
    return res.status(200).json({
      success: true,
      message: "Login successful",
      user,
    });

  } catch (err) {
    console.error(err);

    return res.status(401).json({
      success: false,
      message: "Invalid Firebase token",
    });
  }
}





// userDeatils
export async function userDetails(req, res) {
  try {
    const user = await User.findOne({ firebaseUid: req.userId });

    if (!user) {
      return res.status(404).json({
        success: false,
        message: "User not found",
      });
    }

    return res.status(200).json({
      success: true,
      message: "User details",
      user,
    });

  } catch (err) {
    console.log(err.message);
    return res.status(500).json({
      success: false,
      message: err.message,
    });
  }
}




// loggout
export async function logout(req, res) {
  try {
    const userAgent = req.headers["user-agent"] || null;
    await Session.deleteMany({userId:req.userId, userAgent,  clientIp:req.clientIp});

    res.clearCookie("access_Token");
    res.clearCookie("refresh_Token");
    res.status(201).json({ success: true, message: "User logut successfully" });
  } catch (err) {
    return res.status(500).json({ success: false, message: err.message });
  }
}