import express from 'express'

import authController from '../controller/auth.js'
import checkauth from '../middleware/auth.js'

import {adduservali} from '../validation/authValidation.js'

const authRouter = express.Router()


authRouter.post("/register",adduservali,authController.authRegister)

authRouter.post("/login",authController.authLogin)

authRouter.post("/changePassword",checkauth,authController.changePassword)

authRouter.get("/getUserProfile",checkauth,authController.getUser)

authRouter.get("/getUserById/:id",checkauth,authController.getUserById)

authRouter.put("/updateUserProfile/:id",checkauth,authController.updateUser)

authRouter.delete("/deleteUserProfile/:id",checkauth,authController.deleteUser)

authRouter.post("/productComment",checkauth,authController.commentProduct)








export default authRouter