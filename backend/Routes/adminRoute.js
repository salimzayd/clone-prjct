import express from 'express';
const adminroute = express.Router()
import  { adminlogin ,allProduct,alluser,createproduct, userById} from '../Controllers/adminController.js'
import  verifyToken  from '../Middlewares/adminAuthMiddleware.js';

import tryCatchMiddleware from '../middlewares/tryCatchMiddleware.js';
 import imageUpload from '../Middlewares/imageUpload/imageUpload.js';

adminroute

.post("/login",tryCatchMiddleware(adminlogin))
.use(verifyToken)
.post('/product',imageUpload,createproduct)
.get('/Products',tryCatchMiddleware(allProduct))
.get('/alluser',tryCatchMiddleware(alluser))
.get('/users/:id',tryCatchMiddleware(userById))

export default adminroute