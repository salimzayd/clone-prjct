import mongoose from 'mongoose';
import jwt from 'jsonwebtoken'
import Schemas from '../models/validationSchema.js';
import product from '../models/productSchema.js';
import UserSchema from '../models/UserSchema.js';
import Order from '../models/orderSchema.js'
import tryCatchMiddleware from '../middlewares/tryCatchMiddleware.js';


export const adminlogin = async (req,res) =>{
 const {email,password} = req.body;

 if(
    email == process.env.admin_email &&
    password == process.env.admin_password
 ){
    const token  = jwt.sign(
        {email:email},
        process.env.Admin_Access_Token_Secret
    );

    return res.status(200).send({
        status:"success",
        message:"admin registration successfull",
        data:token
    })
 }else{
    return res.status(404).json({
        status:"error",
        message:"admin credential is incorrect"
    })
 }
}

export const createproduct = async (req,res) =>{
    const {value,error} = Schemas.joiproductSchema.validate(req.body)
    console.log(req.body);
    
console.log(value);

if(error){
    return res.status(400).json({error:error.message});

}else{
    await product.create({
        ...value
    })

    res.status(201).json({
        status:"success",
        message:"successfully created product",
        data:product
    })
}
}

export const allProduct = async(req,res) => {
    const dishes = await product.find()
    // console.log(dishes,"gfh");

    if(!dishes){
        return(
            res.status(404).json({
                status:"error",
                message:"dishes is not found"
            })
        )
    }

    res.status(200).json({
        status:"success",
        message:"successfully fetched dishes",
        data:dishes
    })
}

export const singleProduct = async (req,res,next) =>{
    const dishId = req.params.id

    try{
        const dish = await product.findById(dishId)
        console.log(dish);

        if(dish){
            return res.status(200).json({
                status:"success",
                message:"successfully fetched single dish",
                data:dish
            })
        }
        return next(tryCatchMiddleware(404,"package not found"))
    }catch(err){
        next(err)
    }
}

export const updateDish = async (req,res) =>{
    try{
         const {value,error} = Schemas.joiproductSchema.validate(req.body);
        console.log(req.body,"gdhgjk")

        if(error){
            return res.status(400).json({
                status:"error",
                message:"validation error"
            })
        }

        const { id } = req.params;
        console.log(id,"tddfghjk");

        const updatedPackage = await product.findByIdAndUpdate(
            id,
            {$set:{...value}},
            {new:true}
        );

        if(updatedPackage){
            return res.status(200).json({
                status:"success",
                message:"successfully updated data",
                data:updatedPackage
                
            });
        
        }
        else{
            return res.status(404).json({
                status:"error",
                message:"product not found"
            })
        }  
    }catch(error){
        res.status(500).json({
            status:"error",
            message:"internal server error"
        })
    }
}

export const deleteDish = async (req,res,next) =>{
    try{
        const {id} = req.params;

        const deletedDish = await product.findByIdAndDelete(id);

        if(!deletedDish){
            return res.status(404).json({
                message:"dish not found"
            })
        }

        res.status(200).json({
            message:"dish deleted successfully",deletedDish
        })
    }catch(err){
        next(err)
    }
}


export const alluser = async(req,res) =>{
const alluser = await UserSchema.find()
const allcount = await UserSchema.countDocuments()


if(alluser.length === 0){
    return res.status(404).json({
        status:"error",
        message:"user not found"
    })
}

res.status(200).json({
    status:"successfully",
    message:"successfully fetched users data",
    data:alluser,
    datacount:allcount
})
}


// specific user

export const userById = async(req,res) =>{
    const userId= req.params.id
    const user = await UserSchema.findById(userId)
    

    if(!user){
        return res.status(404).json({
            status:"error",
            message:"user not found"
        });
    }

    res.status(200).json({
        status:"success",
        message:"successfully fetched user data",
        data:user
    })
}

export const blockUser = async (req, res) => {
    try {
        const userid = req.params.id;
        const action = req.query.action

        const user = await UserSchema.findById(userid);

        if(!user){
            return res.status(404).json({
                status:"error",
                message:"user not found"
            });
        }

        if(action === "block" && user.isBlocked){
            return res.status(400).json({
                message:"user is already blocked"
            })
        }else if (action === "unblock" && !user.isBlocked){
            return res.status(400).json({
                message:"user is blocked"
            })
        }

        user.isBlocked = action === 'block';
        await user.save();

        const actionMessage = action === "block"? "blocked" : "unblocked"
        res.status(200).json({
            message:`user ${actionMessage} successfully`,user
        })
    }catch(error){
        console.error(error);
        }
    }

    export const getAllOrder = async (req, res) => {
        try {
            const orders = await Order.find().populate("usermodel products");
            const allcount = orders.length;
            console.log(allcount)
    
            if (orders.length === 0) {
                return res.status(404).json({
                    status: "error",
                    message: "No orders found"
                });
            }
            return res.status(200).json({
                status: "success",
                message: "All orders fetched successfully",
                data: orders,
                datacount: allcount,
            });
        } catch (error) {
            console.error(error);
            return res.status(500).json({
                status: "error",
                message: "An error occurred while fetching orders",
            });
        }
    };
    