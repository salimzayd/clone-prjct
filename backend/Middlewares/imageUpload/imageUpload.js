import fs from 'fs'
import path from 'path'
import multer from 'multer'
import env from 'dotenv'
env.config()
import cloudinary from "cloudinary"
import { fileURLToPath } from 'url'

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename)

const storage = multer.diskStorage({
    destination:path.join(__dirname,'uploads'),
    filename:(req,file,cb) =>{
        cb(null,Date.now + file.originalname)
    }
})

const upload = multer({storage})
cloudinary.v2
cloudinary.config({
    cloud_name:process.env.cloud_name,
    api_key:process.env.API_key,
    api_secret:process.env.api_secret
})

// const cloudinary = require("cloudinary").v2
// cloudinary.config({
//     cloud_name:process.env.cloud_name,
//     api_key:process.env.API_key,
//     api_secret:process.env.api_secret
// })


const imageUpload = (req,res,next) =>{
    upload.single("image")(req,res, async (err) =>{
        if(err){
            return res.status(400).json({
                error:err.message
            })
        }

        try{
            const result = await cloudinary.uploader.upload(req.file.path,{
                folder:"FoodFleet-imgs"
            })

            req.body.image = result.secure_url

            fs.unlink(req.file.path,(unlinker) =>{
                if(unlinker){
                    console.log("error deleting localfiles",unlinker);
                }
            })
            next()
        }
        catch(error){
            return res.status(500).json({
                message:"error uploading file to cloudinary"
            })
    }
    })
}

export default imageUpload;