import express from 'express'
import checkauth from '../middleware/auth.js'
import orderController from '../controller/order.js'

const orderRouter = express.Router()

orderRouter.post('/create-checkout-session',checkauth, orderController.postOrder)

orderRouter.get('/create-checkout-session',checkauth, orderController.pay)

orderRouter.get('/success', orderController.successOrder)

orderRouter.get('/cancel', orderController.cancleOrder)







export default orderRouter