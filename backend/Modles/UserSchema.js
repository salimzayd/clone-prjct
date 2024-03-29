import mongoose from "mongoose"


const userSchema = new mongoose.Schema({
    name:String,
    email:String,
    phonenumber:Number,
    password:String,

})

const usermodel =  mongoose.model("user", userSchema)

export default usermodel