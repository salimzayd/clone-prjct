import jwt from 'jsonwebtoken'

export const verifyToken = (req,res,next) =>{
    const token = req.headers["authorization"]
    console.log("dxgfh",token);


    if(!token){
        return res.status(403).json({
            error:"no token provided"
        })
    }

    jwt.verify(token,process.env.Admin_Access_Token_Secret,(err,decoded) =>{
        if(err){
            return res.status(403).json({error:"unauthorized"})
        }

        req.email = decoded.email
        next()
    })
} 