import jwt from 'jsonwebtoken'

const VerifyToken  = (req,res,next) =>{
        const token  = req.headers["authorization"]
        console.log("token" ,token);

        if(!token){
            return res.status(403).send({error:"no token provided"})

        }

        jwt.verify(token,process.env.User_ACCESS_TOKEN_SECRET,(err,decoded) =>{
            if(err){
                return res.status(401).json({error:"unauthorisation"})
            }
            req.email = decoded.email
            next()
        })

}

export default VerifyToken