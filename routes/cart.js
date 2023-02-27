import express from 'express'
import cartController from '../controller/cart.js'
import checkauth from '../middleware/auth.js'
import {addcartvali} from '../validation/authValidation.js'


const cartRouter = express.Router()

cartRouter.post('/cart',addcartvali,checkauth,cartController.postCart)

cartRouter.post('/cart/increment',checkauth,cartController.incrementCart)


cartRouter.get('/cart/get',checkauth,cartController.getCart)

cartRouter.delete('/cart/delete/',checkauth,cartController.deleteCart)




export default cartRouter