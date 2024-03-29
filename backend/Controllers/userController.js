import user from "../Modles/UserSchema.js";
import joiUserSchema  from "../Modles/validationSchema.js";
import bcrypt from 'bcrypt'
// import { Jwt } from "jsonwebtoken";


export const userRegister=  async (req,res) =>{
    const {value,error} = joiUserSchema.validate(req.body)
    const {name,email,phonenumber,password} = value;
    const hashpassword = await bcrypt.hash(password,10)

    if (error){
        res.status(400).json({
            status:"error",
            message:"invalid user"
        })
    }

    const existinguser = await user.findOne({name:name})

    if (existinguser){
        res.status(400).json({
            status:"error",
            message:"username already taken"
        })
    }else{
        const userdata = await user.create({
            name:name,
            email:email,
            phonenumber:phonenumber,
            password:hashpassword
        }) 
        return res.status(201).json({
            status:"success",
            message:"user registered successfully",
            data:userdata
        })
    }
    }
