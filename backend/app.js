
import express from "express";
const app = express()
const port = 5000
import dotenv from "dotenv"
dotenv.config()
import bodyParser from "body-parser";
import cors from "cors"
import userrouter from "./Routes/userRoute.js";
import mongoose from "mongoose";

const mongodb = "mongodb://127.0.0.1:27017/clone";

main().catch((err) =>{
    console.log(err);
})

async function main(){
    await mongoose.connect(mongodb)
    console.log("db connected");
}

app.use(bodyParser.urlencoded({extended:true}))
app.use(bodyParser.json())
app.use(express.json())
app.use(cors())

app.use('/api/users' , userrouter)



app.listen(port,() =>{
    console.log("server is listening in port ", port);
})