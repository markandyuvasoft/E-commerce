import mongoose from "mongoose";
var Schema= mongoose.Schema
const {ObjectId}= mongoose.Schema.Types


const orderSchema = new mongoose.Schema({

    postedby : {
        type: ObjectId,
        ref: 'user'
    },
    items: [{
        itemId: {
            type:ObjectId,
            ref: 'udproduct'
        },
        title: String,

        quantity: {
            type: Number
        },
        price: Number
    }],

    bill: {
        type: Number
    }
    
  

})



const Order= new mongoose.model('order',orderSchema)

export default Order