import Joi from "joi"


const joiUserSchema= Joi.object({
    name:Joi.string(),
    email:Joi.string(),
    phonenumber:Joi.number().min(10),
    password:Joi.string().required()

})
 
const joiproductSchema = Joi.object({
    title:Joi.string(),
    category:Joi.string(),
    image:Joi.string(),
    price:Joi.number().positive(),
    description:Joi.string(),
})

const joiReviewSchema = Joi.object({
    user:Joi.string().required(),
    products:Joi.string().required(),
    rating:Joi.number().min(1).max(5).required(),
    reviewText:Joi.string().min(10).required(),
})




const Schemas = { joiUserSchema,joiproductSchema,joiReviewSchema} 

export default Schemas