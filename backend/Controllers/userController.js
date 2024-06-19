import tryCatchMiddleware from "../middlewares/tryCatchMiddleware.js";
import users from "../models/UserSchema.js";
import Schemas from "../models/validationSchema.js";
import Order from "../models/orderSchema.js";
import bcrypt from 'bcrypt';
import jwt from 'jsonwebtoken';
import { sendOTP } from "../otp/Otp.js";
import product from "../models/productSchema.js";
import Razorpay from 'razorpay';




export const userRegister=  async (req,res) =>{

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

    const hashedpassword = await 
    bcrypt.hash(password,10)
    
    const newUser = new users({
      name,
      email,
      phonenumber,
      password:hashedpassword
    })
    await newUser.save();

    newUser.otpStatus = 'sent';
    await newUser.save()

    return res.status(201).json({
      status:"success",
      message:"user registered successfully",
      userId:newUser._id
    })

    }catch(error){
        console.error(error);
        return res.status(500).json({
            status:"error",
            message:"an unexpected error occured"
        })
    } 
    }

    export const completeRegister = async (req,res) =>{
      try{

        const {userId,otp} = req.body;
        const user = await users.findById(userId);
        if(!user){
          return res.status(404).json({
            status:"error",
            message:"user not found"
          })
        }

        user.otpStatus = "verified";
        await user.save()

        return res.status(200).json({
          status:"success",
          message:"registration completed successfully"
        })
      }catch(error){
        console.error(error)
        return res.status(500).json({
          status:"error",
          message:"internal server error"
        });
      }
    }
    
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

// export const addToCart = async  (req,res) =>{
//   const userId = req.params.id
//   const user = await users.findById(userId);
//   console.log(user);

//   if(!user){
//     return res.status(404).json0({
//       status:"error",
//       message:"user not found"
//     })
//   }

//   const {dishId} = req.body

//   if(!dishId){
//     return res.status(404).json({
//       status:"error",
//       message:"dish not found"
//     })
//   }

//   const newdish = await users.updateOne({_id:userId},{$addToSet:{cart:dishId}});
//   return res.status(200).json({
//     status:"success",
//     message:"dish successfully added to cart",
//     data:newdish
//   })
// }

// export const viewCart = async (req,res) =>{
//   const userId = req.params.id;
//   const user = awaitusers.findById(userId);

//   if(!user){
//     return res.status(404).json({
//       status:"error",
//       message:"user is not found"
//     })
//   }

//   const cartDishId = user.cart;
//   console.log("usrcart", user.cart);

//   if(cartDishId.length === 0){
//     return res.status(200).json({
//     status:"success",
//     message:"cart is empty",
//     data:[]
// })  
// }
// const cartDish = await product.find({_id:{$in:cartDishId}})

// res.status(200).json({
//   status:"success",
//   message:"cart product fetched successfully",
//   data:cartDish
// })
// }

export const searchDishes = async (req,res)=>{
  try{
    const {title} = req.query;

    let query = {}
    console.log(query);

    // if(category){
    //   query.category = {$regex:new RegExp(category,'i')};
    // }
    // console.log(category);

    if(title){
      query.title = {$regex :new RegExp(title,'i')}
    }
    console.log(title);

    const dishes = await product.find(query);
    console.log(dishes,"dishessss");

    if (dishes.length === 0){
      return res.status(404).json({
        status:"error",
        message:"no dishes found in this specified criteria"
      })
    }
    return res.status(200).json({
      status:"success",
      message:"dish found successfully",
      data:dishes
    }
    )
  }catch(error){
    console.error(error);
  }
}

// export const createProfile = async (req,res) =>{
//   const {userId} = req.params;
//   const{value,error} = Schemas.joiUserSchema.validate(req.body);

//   try{
//     if(error){
//       return res.status(400).json({
//         status:"error",
//         message:"validation error"
//       })
//     }

//     const user = await users.findById(userId);

//     if(!user){
//       return res.status(404).json({
//         status:"error",
//         message:"user not found"
//       })
//     }
//     user.profile = value;
//     await user.save();

//     res.status(200).json({
//       status:"success",
//       message:"profile updated successfully",user
//     })
//   }catch(err){
//     console.error(err);
//   }
// }

export const singleUser = async (req,res) =>{
  const {id} = req.params;

  try{
    const user = await users.findById(id);
    if(user){
      res.status(200).json({
        status:"success",
        message:"user fetched by id",
        data:user
      })
    }
  }catch(err){
    console.error(err);
  }
}


export const updateUser = async (req,res) =>{

  try{
    const {name,email,phonenumber,image} = req.body;

    const {id} = req.params;

    const updateDish = await users.findByIdAndUpdate(
      id,
      {$set:{name,email,phonenumber,image}},
      {new:true}
    );

    if(updateDish){
      return res.status(200).json({
        status:"success",
        message:"successfully updated data",
        data:updateDish
      })
    }else{
      return res.status(404)
    }
  }catch(error){
    console.error(error);
  }
}

export const deleteAccount = async(req,res) => {
  const {id} = req.params
  try{
    const user = await users.findById(id);

    if(!user){
      return res.status(404).json({
        status:"error",
        message:"user not found"
      })
    }

    await users.deleteOne({_id:id});
    return res.status(200).json({
      status:"success",
      message:"successfully deleted user"
    })
  }catch(err){
    console.error(err);
  }
}

export const Payment = async (req,res) =>{
  const razorpay = new Razorpay({
    key_id:process.env.Razor_id,
    key_secret:process.env.Razor_secret
  });

  const {amount,currency,receipt} = req.body;

  try{
    const payment = await razorpay.orders.create({amount,currency,receipt});
    res.json({
      status:"success",
      message:"payment initiated",
      data:payment,
    })
  }catch(error){
    res.status(500).json({error:message});
  }
}
const razorpay = new Razorpay({
  key_id:process.env.Razor_id,
  key_secret:process.env.Razor_secret
});


export const createOrder = async (req, res) => {
  const { userId, productIds, amount, currency } = req.body;
  console.log(req.body);

  try {
    const payment = await razorpay.orders.create({
      amount: amount * 100,
      currency,
      receipt: `receipt_${Date.now()}`
    });

    const order = new Order({
      usermodel: userId, // Ensure this matches the schema definition
      products: productIds,
      payment_id: payment.id,
      total_amount: amount
    });

    await order.save();

    res.status(201).json({
      status: "success",
      message: "Order created successfully",
      data: order,
      payment_id: payment.id
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({
      status: "error",
      message: "An error occurred while creating the order",
      error: error.message
    });
  }
};

export const OrderDetails = async (req,res) =>{
  const {id} = req.params

  try{
    const order = await Order.findById(id)
    .populate('usermodel')
    .populate('products');

    if(!order){
      return res.status(404).json({
        status:"error",
        message:"order not found"
      })
    }

    res.status(200).json({
      status:"success",
      message:"order details fetched successfully",
      data:order
    })
  }catch(error){
    console.error(error);
  }
}

export const allOrderDetails = async (req,res) =>{
  try{
    const order = await Order.find().populate('usermodel');
    if(order.length === 0){
      return res.status(404).json({
        status:"error",
        message:"order not found"
      })
    } res.status(200).json({
      status:"success",
      message:"All order fetched successfully",
      data:order
    })
  }catch(error){
    console.error(error);
  }
}