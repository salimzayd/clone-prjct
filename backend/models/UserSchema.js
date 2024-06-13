import mongoose from "mongoose"


const userSchema = new mongoose.Schema({
    name:String,
    email:String,
    phonenumber:Number,
    password:String,
    image:String,
    isActive:{
        type:Boolean,
        default:true
    },
    isBlocked:{
        type:Boolean,
        default:false
    },

    cart:[{type:mongoose.Schema.ObjectId,ref:'product'}],
    orders:[{type:mongoose.Schema.ObjectId,ref:'orders'}],
    review:[{type:mongoose.Schema.ObjectId,ref:'review'}]

},{timestamps:true})

const usermodel =  mongoose.model("users", userSchema)

export default usermodel