import Joi from "joi"


const joiUserSchema= Joi.object({
    name:Joi.string(),
    email:Joi.string(),
    phonenumber:Joi.number().min(10),
    password:Joi.string().required()

})
 
const joiproductSchema = Joi.object({
    id:Joi.string(),
    image:Joi.string(),
    title:Joi.string(),
    category:Joi.string(),
    price:Joi.number().positive()
})




const Schemas = { joiUserSchema,joiproductSchema} 

export default Schemas