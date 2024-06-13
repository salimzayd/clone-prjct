import usermodel from "../models/UserSchema.js";
import Schemas from "../models/validationSchema.js"
import product from "../models/productSchema.js";
import Review from "../models/reviewSchema.js"

export const addReview = async (req,res) =>{
    const {value,error} = Schemas.joiReviewSchema.validate(req.body);

    if(error){
        return res.status(400).json({
            status:"error",
            message:error.message
        })
    }

    const {user,products:productId,rating,reviewText} = value;

    try{

        const existinguser = await usermodel.findById(user)
        const existingproduct = await product.findById(productId)

        if(!existinguser){
            return res.status(404).json({
                status:"error",
                message:"user is not found"
            })
        }

        if(!existingproduct){
            return res.status(404).json({
                status:"error",
                message:"product is not found"
            })
        }

        const newReview = new Review({
            user,
            products:productId,
            rating,
            reviewText
        })

        await newReview.save();

        if(!existinguser.review){
            existinguser.review = []
        }

        existinguser.review.push(newReview._id)
        await existinguser.save();

        return res.status(201).json({
            status:"success",
            message:"review added successfully",
            data:newReview
        })
    }catch(error){
        console.error(error);
    }
}

export const getProductReview = async (req,res) =>{
    const{productId} = req.params

    try{
        const reviews= await Review.find({product:productId}).populate(
            "user",
            "name email "
        );

        if(!reviews || reviews.length === 0){
            return res.status(404).json({
                status:"error",
                message:"No Reviews found"
            })
        }

        return res.status(200).json({
            status:"success",
            message:"review fetched successfully",
            data:reviews
        })
    }catch(error){
        console.error(error);
    }
}


export const updateReview = async(req,res) =>{
    const{value,error} = Schemas.joiReviewSchema.validate(req.body);

    if(error){
        return res.status(400).json({
            status:"error",
            message:error.message
        })
    }

    const { id } = req.params;
    const {user,products:productId,rating,reviewText} = value;

    try{
        const review = await Review.findById(id);
        

        if(!review){
            return res.status(404).json({
                status:"error",
                message:"review not found"
            })
        }

        if(review.user.toString() !== user){
            return res.status(403).json({
                status:"error",
                message:"user is not authorized to update review"
            })
        }

        review.products = productId;
        review.rating = rating;
        review.reviewText = reviewText

        await review.save();

        return res.status(200).json({
            status:"success",
            message:"review updated successfully",
            data:review
        })
    }catch(error){
        console.error(error);
    }
}

export const deleteReview = async(req,res) =>{
    const {id} = req.params
    try{

        const review = await Review.findById(id)

        if(!review){
            return res.status(404).json({
                status:"error",
                message:"review not found"
            })
        }

        await Review.deleteOne({_id:id})

        return res.status(200).json({
            status:"success",
            message:"review deleted successfully"
        })
    }catch(error){
        console.error(error);
    }
}