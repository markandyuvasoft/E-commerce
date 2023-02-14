import mongoose from "mongoose";
var Schema= mongoose.Schema
const {ObjectId}= mongoose.Schema.Types


const cartSchema =new mongoose.Schema({

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
  
},{versionKey: false})


const Cart=mongoose.model('cart',cartSchema )

export default Cart




