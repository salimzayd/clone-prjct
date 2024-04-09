import tryCatchMiddleware from "../Middlewares/tryCatchMiddleware.js";
import users from "../Modles/UserSchema.js";
import joiUserSchema  from "../Modles/validationSchema.js";
import bcrypt from 'bcrypt'
import eventemitter from 'events'
eventemitter.defaultMaxListeners = 15;
import jwt from 'jsonwebtoken' 
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
    
    //User login
export const Login = async (req, res) => {
    try {
      const { email, password } = req.body;
  
      // Check user
      const user = await users.findOne({ email });
  
      if (!user) {
        return res.status(404).json({
          status: "error",
          message: "Invalid email or password",
        });
      }
  
      // Check password
      const passwordMatch = await bcrypt.compare(password, user.password);
  
      if (!passwordMatch) {
        return res.status(401).json({
          status: "error", 
          message: "Invalid email or password",
        });
      }
  
      // Generate and send token
      const token = jwt.sign({ id: user._id }, process.env.User_ACCESS_TOKEN_SECRET, {
        expiresIn: "1h"
      });
  
      return res.status(200).json({
        status: "success",
        message: "User login successful",
        token: token
      });
    } catch (error) {
      console.error(error);
      return res.status(500).json({
        status: "error",
        message: "An unexpected error occurred",
        error: error.message
    });
    }
  };
