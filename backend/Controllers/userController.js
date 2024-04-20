import tryCatchMiddleware from "../middlewares/tryCatchMiddleware.js";
import users from "../modles/UserSchema.js"
import Schemas from "../modles/validationSchema.js";
import bcrypt from 'bcrypt'
// import eventemitter from 'events'
// eventemitter.defaultMaxListeners = 15;
import jwt from 'jsonwebtoken' 
import { sendOTP } from "../OTP/Otp.js";
import product from "../modles/productSchema.js"


export const userRegister=  async (req,res,next) =>{

    try{
    const {value,error} = Schemas.joiUserSchema.validate(req.body)
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

    await users.save();
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
export const Login = async (req, res,next) => {
  const {value,error} = Schemas.joiUserSchema.validate(req.body);

  if(error){
    res.json(error.message)
  }
  const {email,password} = value;

  try{
    // finding user by email
    const validuser = await users.findOne({email})

    if(!validuser){
      return res.status(404).json({
        status:"error",
        message:"user not found"

      })}
      // checking password
      const validpassword = await bcrypt.compare(password,validuser.password);
      if(!validpassword){
        return res.status(404).json({
          status:"error",
          message:"incorrect pasword"
        })
      }
      // creating token
      const token = jwt.sign({
        id:validuser._id},
      process.env.User_ACCESS_TOKEN_SECRET);
      res.status(200).json({
        token,user:validuser
      })
    }catch(error){
      next(error)
    }
};

export const viewDishes = async (req,res) =>{
  const dishes = await product.find();

  if(!dishes){
    res.status(404).send({status:"error",message:"dishes not found"})
  }

  res.status(200).send({
    status:"success",
    message:"successfully fetched data",
    data:dishes
  })
}
