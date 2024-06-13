import express from 'express';
const adminroute = express.Router()
import  { adminlogin ,allProduct,alluser,blockUser,createproduct, deleteDish, singleProduct, updateDish, userById} from '../Controllers/adminController.js'
import  verifyToken  from '../Middlewares/adminAuthMiddleware.js';
import tryCatchMiddleware from '../middlewares/tryCatchMiddleware.js';
 import imageUpload from '../Middlewares/imageUpload/imageUpload.js';
import { allOrderDetails } from '../controllers/userController.js';
import { createCategory, deleteCategory, getCategories, updateCategory } from '../controllers/categoryController.js';

adminroute

.post("/login",tryCatchMiddleware(adminlogin))
.use(verifyToken)
.post('/product',imageUpload,createproduct)
.get('/Product',tryCatchMiddleware(allProduct))
.get('/users',tryCatchMiddleware(alluser))
.get('/users/:id',tryCatchMiddleware(userById))
.get('/dishes',tryCatchMiddleware(allProduct))
.get('/dishes/:id',tryCatchMiddleware(singleProduct))
.delete('/dishes/:id',tryCatchMiddleware(deleteDish))
.put('/dishes/:id',tryCatchMiddleware(updateDish))
.patch('/users/block/:id',tryCatchMiddleware(blockUser))
.get('/orders',tryCatchMiddleware(allOrderDetails))
.post('/category',tryCatchMiddleware(createCategory))
.get('/category',tryCatchMiddleware(getCategories))
.put('/category/:id',tryCatchMiddleware(updateCategory))
.delete('/category/:id',tryCatchMiddleware(deleteCategory))

export default adminroute