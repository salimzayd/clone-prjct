import jwt from 'jsonwebtoken'
import dotenv from 'dotenv'
dotenv.config()

const verifyToken = (req,res,next) =>{
    const authHeader = req.headers["authorization"]
    console.log("token",authHeader);


    if(!authHeader || !authHeader.startsWith('Bearer')){
        return res.status(403).json({
            error:"no token provided"
        })
    }

    const token = authHeader.split(' ')[1];

    jwt.verify(token,process.env.Admin_Access_Token_Secret,(err,decoded) =>{
        
        if(err){
            return res.status(403).json({error:"token verification failed.invalid or expired token"})
        }

        req.email = decoded.email
        next()
    })
} 
export default verifyToken