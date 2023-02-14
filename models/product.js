import mongoose from "mongoose";
var Schema= mongoose.Schema
const {ObjectId}= mongoose.Schema.Types


const productSchema=new mongoose.Schema({

    title: {
        type: String,
      },
    price:{
        type:Number
    },
    description:{
        type:String
    },
    comments:[{
        text:String,
        postedby:{type:ObjectId,ref:"user"}
    }],
    image:{
        type: String,
        },
    cloudinary_id: {
        type: String,
          },
        postedby:{
            type:ObjectId,
            ref:"user"
            },

},{versionKey: false})


const Product=mongoose.model('udproduct',productSchema)

export default Product