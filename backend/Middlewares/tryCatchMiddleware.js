const tryCatchMiddleware = (tryCatchHandler) =>{
    return async (req,res,next) =>{
        try{
            await tryCatchHandler(req,res,next)
        
    }catch(error){
        console.log(error);
        res.status(500).json({status:"failure",message:"error",error_message:error.message})
    }
}

}

export default tryCatchMiddleware