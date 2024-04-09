import express from 'express';
import router from express.Router()
import admin, { adminlogin } from '../Controllers/adminController'
import  verifyToken  from '../Middlewares/adminAuthMiddleware';

import tryCatchMiddleware from '../Middlewares/tryCatchMiddleware';
import imageUpload from '../Middlewares/imageUpload/imageUpload';
import adminController from '../Controllers/adminController'

router

.post("/login",tryCatchMiddleware(adminlogin))
.use(verifyToken)