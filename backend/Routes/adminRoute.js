import express from 'express';
const adminroute = express.Router()
import  { adminlogin ,allProduct,alluser,blockUser,createproduct, deleteDish, singleProduct, unblockuser, updateDish, userById} from '../Controllers/adminController.js'
import  verifyToken  from '../Middlewares/adminAuthMiddleware.js';

import tryCatchMiddleware from '../middlewares/tryCatchMiddleware.js';
 import imageUpload from '../Middlewares/imageUpload/imageUpload.js';

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
.put('/users/block/:id',tryCatchMiddleware(blockUser))
.put('/users/unblock/:id',tryCatchMiddleware(unblockuser))

export default adminroute