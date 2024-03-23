const Joi = require('joi')


const joiUserSchema= Joi.object({
    name:Joi.string(),
    email:Joi.string(),
    password:Joi.string().required()
})




module.exports = {joiUserSchema}