import mongoose from "mongoose";


const productSchema = new mongoose.Schema({
    title:String,
    category:String,
    image:String,
    price:Number
})