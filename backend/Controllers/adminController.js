import mongoose from 'mongoose';
import jwt from 'jsonwebtoken'
import Schemas from '../modles/validationSchema.js';
import product from '../modles/productSchema.js';
import UserSchema from '../modles/UserSchema.js';


export const adminlogin = async (req,res) =>{
 const {email,password} = req.body;

 if(
    email == process.env.admin_email &&
    password == process.env.admin_password
 ){
    const token  = jwt.sign(
        {email:email},
        process.env.Admin_Access_Token_Secret
    );

    return res.status(200).send({
        status:"success",
        message:"admin registration successfull",
        data:token
    })
 }else{
    return res.status(404).json({
        status:"error",
        message:"admin credential is incorrect"
    })
 }
}

export const createproduct = async (req,res) =>{
    const {value,error} = Schemas.joiproductSchema.validate(req.body)
    console.log(req.body);

const {title,image,category,price} = value;
console.log(value);

if(error){
    return res.status(400).json({error:error.message});

}else{
    await product.create({
        title,
        image,
        category,
        price,
    })

    res.status(201).json({
        status:"success",
        message:"successfully created product",
        data:product
    })
}
}

export const alluser = async(req,res) =>{
const alluser = await UserSchema.find()


if(alluser.length === 0){
    return res.status(404).json({
        status:"error",
        message:"user not found"
    })
}

res.status(200).json({
    status:"successfully",
    message:"successfully fetched users data",
    data:alluser
})
}