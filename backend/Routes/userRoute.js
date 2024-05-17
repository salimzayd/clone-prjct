import express from "express";
const userrouter = express.Router();
// import userController from "../Controllers/userController"
import tryCatchMiddleware from "../middlewares/tryCatchMiddleware.js";
import {  userRegister,Login, viewDishes, singleDish, addToCart, viewCart } from "../Controllers/userController.js";
import { sendOTP, verifyOtp } from "../OTP/Otp.js";
import VerifyToken from "../middlewares/UserAuth.js";



userrouter


.post ("/register",tryCatchMiddleware(userRegister))
.post("/sendotp",tryCatchMiddleware(sendOTP))
.post("/verifyotp",tryCatchMiddleware(verifyOtp))
.post("/login",tryCatchMiddleware(Login))
.use(VerifyToken)
.get("/dishes",tryCatchMiddleware(viewDishes))
.get('/dishes/:id',tryCatchMiddleware(singleDish))
// .get('/dishes/search',tryCatchMiddleware(searchDish))





export default userrouter