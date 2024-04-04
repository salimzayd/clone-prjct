import express from "express";
const userrouter = express.Router();
// import userController from "../Controllers/userController"
import tryCatchMiddleware from "../Middlewares/tryCatchMiddleware.js";
import {  userRegister,Login } from "../Controllers/userController.js";
import { sendOTP } from "../OTP/Otp.js";



userrouter


.post ("/register",tryCatchMiddleware(userRegister))
.post("/verifyotp",tryCatchMiddleware(sendOTP))
.post("/login",tryCatchMiddleware(Login))



export default userrouter