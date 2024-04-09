import mongoose from 'mongoose';
import jwt from 'jsonwebtoken'
import users from '../Modles/UserSchema'
import joiproductSchema from "../Modles/validationSchema"
import product from '../Modles/productSchema';


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
    const {value,error} = joiproductSchema.validate(req.body)
}
const {title,image,category,price,reviews} = value;
console.log(value);

if(error){
    return res.status(400).json({error:error.message});

}else{
    await product.create({
        title,
        image,
        category,
        price,
        reviews
    })

    res.status(201).json({
        status:"success",
        message:"successfully created product",
        data:product
    })
}