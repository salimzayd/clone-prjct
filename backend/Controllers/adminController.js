import mongoose from 'mongoose';
import jwt from 'jsonwebtoken'
import Schemas from '../modles/validationSchema.js';
import product from '../modles/productSchema.js';
import UserSchema from '../modles/UserSchema.js';
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

const {title,image,category,price,description} = value;
console.log(value);

if(error){
    return res.status(400).json({error:error.message});

}else{
    await product.create({
        title,
        category,
        image,
        price,
        description
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

export const updateDish = async (req,res,next) =>{
    try{
        const {value,error} = Schemas.joiproductSchema.validate(req.body);
        if(error){
            return res.status(400).json({
                error:"error",
                message:"error in validation"
            })
        }
        const {_id} = req.params;

            const updatedDishes = await product.findOneAndUpdate(
                _id,
                {$set:{...value}},
                {new:true});

                if(updatedDishes){
                    return res.status(200).json({
                        status:"success",
                        message:"successfully updated data",
                        data:updatedDishes,
                    })
                }else{
                    return next(tryCatchMiddleware(404,"dish not found"))
                }
    }catch(error){
        return next(error)
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


if(alluser.length === 0){
    return res.status(404).json({
        status:"error",
        message:"user not found"
    })
}

res.status(200).json({
    status:"successfully",
    message:"successfully fetched users data",
    data:alluser
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
        const userId = req.params.id
        console.log('User ID:', userId);
        const user = await UserSchema.findById(userId);
        console.log(userId,"user");
        
        if (!user) {
            console.error('User not found');
            return res.status(404).json({ message: "User not found" });
        }

        if (user.isBlocked) {
            console.error('User is already blocked');
            return res.status(400).json({ message: "User is already blocked" });
        }

        user.isBlocked = true;
        await user.save();

        console.log('User blocked successfully');
        res.status(200).json({ message: "User blocked successfully", user });
    } catch (err) {
        console.error('Error blocking user:', err);
        return res.status(500).json({ message: "Internal server error" })
}
}


export const unblockuser = async (req,res,next) =>{
    try{
        const userId = req.params.id
        const user = await UserSchema.findById(userId)
        console.log(userId);
        console.log(user);

        if(!user){
            return res.status(404).json({
                status:"error",
                message:"user not found"
            })
        }

        if(!user.isBlocked){
            return res.status(400).json({
                status:"error",
                message:"user is not blocked"
            })
        }

        user.isBlocked = false

        await user.save()

        res.status(200).json({
            message:"user is successfully unblocked",
            status:"success"
        })
    }catch(err){
        next(err)
    }
}