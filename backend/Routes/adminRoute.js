import express from 'express';
const adminroute = express.Router()
import  { adminlogin ,createproduct} from '../Controllers/adminController.js'
import  verifyToken  from '../Middlewares/adminAuthMiddleware.js';

import tryCatchMiddleware from '../middlewares/tryCatchMiddleware.js';
// import imageUpload from '../Middlewares/imageUpload/imageUpload.js';

adminroute

.post("/login",tryCatchMiddleware(adminlogin))
.use(verifyToken)
.post('/product',createproduct)

export default adminroute