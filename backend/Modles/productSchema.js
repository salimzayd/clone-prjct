import mongoose from "mongoose";


const productSchema = new mongoose.Schema({
    title:String,
    category:String,
    image:String,
    price:Number,
    description:String,
},{timestamps:true})

const product = mongoose.model('product',productSchema);

export default product;