import Joi from "joi"


const joiUserSchema= Joi.object({
    name:Joi.string(),
    email:Joi.string(),
    phonenumber:Joi.number().min(10),
    password:Joi.string().required()

})




export default  joiUserSchema