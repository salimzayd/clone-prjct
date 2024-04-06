import express from "express";
const userrouter = express.Router();
// import userController from "../Controllers/userController"
import tryCatchMiddleware from "../Middlewares/tryCatchMiddleware.js";
import {  userRegister,Login } from "../Controllers/userController.js";
import { sendOTP, verifyOtp } from "../OTP/Otp.js";



userrouter


.post ("/register",tryCatchMiddleware(userRegister))
.post("/sendotp",tryCatchMiddleware(sendOTP))
.post("/verifyotp",tryCatchMiddleware(verifyOtp))
.post("/login",tryCatchMiddleware(Login))



export default userrouter