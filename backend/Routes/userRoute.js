import express from "express";
const userrouter = express.Router();
// import userController from "../Controllers/userController"
import tryCatchMiddleware from "../middlewares/tryCatchMiddleware.js";
import {  userRegister,Login, viewDishes, singleDish, searchDishes, Payment, createOrder, OrderDetails, allOrderDetails, updateUser, deleteAccount, singleUser} from "../Controllers/userController.js";
import { sendOTP, verifyOtp } from "../otp/Otp.js";
import VerifyToken from "../middlewares/UserAuth.js";
import imageupload from "../middlewares/imageUpload/imageUpload.js"
import { addReview, deleteReview, getProductReview, updateReview } from "../controllers/reviewController.js";



userrouter


.post ("/register",tryCatchMiddleware(userRegister))
.post("/sendotp",tryCatchMiddleware(sendOTP))
.post("/verifyotp",tryCatchMiddleware(verifyOtp))
.post("/login",tryCatchMiddleware(Login))
.get("/dishes",tryCatchMiddleware(viewDishes))
.use(VerifyToken)
.get('/dishes/:id',tryCatchMiddleware(singleDish))
.get('/search',tryCatchMiddleware(searchDishes))
.post('/payment',tryCatchMiddleware(Payment))
.post('/order',tryCatchMiddleware(createOrder))
.get('/order/:id',tryCatchMiddleware(OrderDetails))
.get('/order',tryCatchMiddleware(allOrderDetails))
.get('/user/:id',tryCatchMiddleware(singleUser))
// .post('/profile/:id',tryCatchMiddleware,imageupload,(createProfile))
.put('/profile/:id',imageupload,tryCatchMiddleware(updateUser))
.delete('/profile/:id',tryCatchMiddleware(deleteAccount))
.post('/review',tryCatchMiddleware(addReview))
.get('/review/:id',tryCatchMiddleware(getProductReview))
.put('/review/:id',tryCatchMiddleware(updateReview))
.delete('/review/:id',tryCatchMiddleware(deleteReview))







export default userrouter