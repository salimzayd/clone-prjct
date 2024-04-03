import tryCatchMiddleware from "../Middlewares/tryCatchMiddleware.js";
import users from "../Modles/UserSchema.js";
import joiUserSchema  from "../Modles/validationSchema.js";
import bcrypt from 'bcrypt'
// import jwt from 'jsonwebtoken' 
import { sendOTP } from "../OTP/Otp.js";


export const userRegister=  async (req,res,next) =>{

    try{
    const {value,error} = joiUserSchema.validate(req.body)
    if(error){
        return res.status(400).json({
            status:"error",
            message:error.details[0].message
        });
    }

    const {name,email,phonenumber,password} = value

    // checking existence 
    const existinguser = await users.findOne({name:name})
    if(existinguser){
        res.status(400).json({
            status:"error",
            message:"username already exist"
        })
    }

    // otp sending

    try{
    await sendOTP(req,res);

    await newUser.save();
    res.status(201).json("user created successfully")
    }catch(error){
        next(error)
    }
    // password hashing

    const hashedpassword = await 
    bcrypt.hash(password,10)

    // user creation 

    const userData = await users.create({
        name:name,
        email:email,
        phonenumber:phonenumber,
        password:hashedpassword
    });

    // success response 
    return res.status(200).json({
        status:"success",
        message:"user registered successfully",
        data:userData
    })
    }catch(error){
        console.error(error);
        return res.status(500).json({
            status:"error",
            message:"an unexpected error occured"
        })
    }
    };  
