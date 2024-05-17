import tryCatchMiddleware from "../middlewares/tryCatchMiddleware.js";
import users from "../modles/UserSchema.js"
import Schemas from "../modles/validationSchema.js";
import bcrypt from 'bcrypt'
// import eventemitter from 'events'
// eventemitter.defaultMaxListeners = 15;
import jwt from 'jsonwebtoken' 
import { sendOTP } from "../OTP/Otp.js";
import product from "../modles/productSchema.js"


export const userRegister=  async (req,res,next) =>{

    try{
    const {value,error} = Schemas.joiUserSchema.validate(req.body)
    if(error){
        return res.status(400).json({
            status:"error",
            message:error.details[0].message
        });
    }

    const {name,email,phonenumber,password} = value

    // checking existence 
    const existinguser = await users.findOne({name:name})
    if(existinguser){
        res.status(400).json({
            status:"error",
            message:"username already exist"
        })
    }

    // otp sending

    try{
    await sendOTP(req,res);

    await users.save();
    res.status(201).json("user created successfully")
    }catch(error){
        next(error)
    }
    // password hashing

    const hashedpassword = await 
    bcrypt.hash(password,10)

    // user creation 

    const userData = await users.create({
        name:name,
        email:email,
        phonenumber:phonenumber,
        password:hashedpassword
    });

    // success response 
    return res.status(200).json({
        status:"success",
        message:"user registered successfully",
        data:userData
    })
    }catch(error){
        console.error(error);
        return res.status(500).json({
            status:"error",
            message:"an unexpected error occured"
        })
    }
    
    };
    
    //User login
export const Login = async (req, res,next) => {
  const {value,error} = Schemas.joiUserSchema.validate(req.body);

  if(error){
    res.json(error.message)
  }
  const {email,password} = value;

  try{
    // finding user by email
    const validuser = await users.findOne({email})

    if(!validuser){
      return res.status(404).json({
        status:"error",
        message:"user not found"

      })}

      if (validuser.isBlocked) {
        return res.status(403).json({ status: "error", message: "User is blocked" });
    }
      // checking password
      const validpassword = await bcrypt.compare(password,validuser.password);
      if(!validpassword){
        return res.status(404).json({
          status:"error",
          message:"incorrect pasword"
        })
      }
      // creating token
      const token = jwt.sign({
        id:validuser._id},
      process.env.User_ACCESS_TOKEN_SECRET);
      res.status(200).json({
        token,user:validuser
      })
    }catch(error){
      next(error)
    }
};

export const viewDishes = async (req,res) =>{
  const dishes = await product.find();

  if(!dishes){
    res.status(404).send({status:"error",message:"dishes not found"})
  }

  res.status(200).send({
    status:"success",
    message:"successfully fetched data",
    data:dishes
  })
}

export const singleDish = async (req,res) =>{
  const dishId = req.params.id
  const sdish = await product.findById(dishId)

  if(!sdish){
    return res.status(404).json({
      status:"error",
      message:"dish not found"
    })
  }

  return res.status(200).json({
    status:"success",
    message:"successfully fetched dish data",
    data:sdish
  })
}

export const addToCart = async  (req,res) =>{
  const userId = req.params.id
  const user = await users.findById(userId);
  console.log(user);

  if(!user){
    return res.status(404).json0({
      status:"error",
      message:"user not found"
    })
  }

  const {dishId} = req.body

  if(!dishId){
    return res.status(404).json({
      status:"error",
      message:"dish not found"
    })
  }

  const newdish = await users.updateOne({_id:userId},{$addToSet:{cart:dishId}});
  return res.status(200).json({
    status:"success",
    message:"dish successfully added to cart",
    data:newdish
  })
}

export const viewCart = async (req,res) =>{
  const userId = req.params.id;
  const user = awaitusers.findById(userId);

  if(!user){
    return res.status(404).json({
      status:"error",
      message:"user is not found"
    })
  }

  const cartDishId = user.cart;
  console.log("usrcart", user.cart);

  if(cartDishId.length === 0){
    return res.status(200).json({
    status:"success",
    message:"cart is empty",
    data:[]
})  
}
const cartDish = await product.find({_id:{$in:cartDishId}})

res.status(200).json({
  status:"success",
  message:"cart product fetched successfully",
  data:cartDish
})
}



// export const searchDish = async (req, res) => {
//   try {
//     const { title, category, _id } = req.query;
//     let query = {};

//     if (title) {
//       query.title = { $regex: new RegExp(title, "i") };
//     }

//     if (category) {
//       query.category = { $regex: new RegExp(category, "i") };
//     }

//     // Validate and handle `_id` if it's part of the query
//     if (_id) {
//       if (mongoose.Types.ObjectId.isValid(_id)) {
//         query._id = mongoose.Types.ObjectId(_id);
//       } else {
//         return res.status(400).json({
//           status: "error",
//           message: "Invalid ID format",
//         });
//       }
//     }

//     const dishes = await product.find(query);

//     if (dishes.length === 0) {
//       return res.status(404).json({
//         status: "error",
//         message: "No dishes found with this criteria",
//       });
//     }

//     return res.status(200).json({
//       status: "success",
//       message: "Dishes found",
//       data: dishes,
//     });
//   } catch (error) {
//     console.error(error);
//     return res.status(500).json({
//       status: "error",
//       message: "An error occurred while searching for dishes",
//       error_message: error.message,
//     });
//   }
// };
