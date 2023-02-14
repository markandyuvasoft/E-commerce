import express from 'express'
import adminAuth from '../middleware/admin.js'
import adminController from '../controller/admin.js'
import checkauth from '../middleware/auth.js'



const adminRouter = express.Router()

adminRouter.get("/getAdminProfile",[checkauth,adminAuth],adminController.adminProfile)

adminRouter.delete("/deleteAdminProfile/:id",[checkauth,adminAuth],adminController.deleteAdminProfile)

adminRouter.put("/updateAdminProfile/:id",[checkauth,adminAuth],adminController.updateAdminProfile)

adminRouter.put("/blockAuth/:id",[checkauth,adminAuth],adminController.blockAuth)

adminRouter.put("/unBlockAuth/:id",[checkauth,adminAuth],adminController.unBlockAuth)

adminRouter.put("/madeAdmin/:id",[checkauth,adminAuth],adminController.madeAdmin)

adminRouter.put("/madeUser/:id",[checkauth,adminAuth],adminController.madeUser)

adminRouter.get("/getALLAuth",[checkauth,adminAuth],adminController.allAuthUser)




export default adminRouter