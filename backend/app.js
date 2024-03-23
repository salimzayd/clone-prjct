const express = require("express")
const app = express()
const port = 5000
require('dotenv').config();
const mongoose = require('mongoose');
const bodyParser = require('body-parser')

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



app.listen(port,() =>{
    console.log("server is listening in port ", port);
})