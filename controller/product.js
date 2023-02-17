import express from "express";
import Product from "../models/product.js";
import { v2 as cloudinary } from 'cloudinary'
import dotenv from 'dotenv'

const productController = express.Router();

dotenv.config()
// cloud congig file
cloudinary.config({
  cloud_name:process.env.CLOUD_NAME,
  api_key:process.env.API_KEY,
  api_secret:process.env.API_SECRET
})

// post product
const postProduct = async (req, res, next) => {

  try {
    if (!req.file) {
      res.status(401).send({ message: "please select image" });

    } else {
      const { title, price, description } = req.body;
      
       let image = req.file.path;
   
      const result = await cloudinary.uploader.upload(image)
   
        if (!title || !price || !description || !image) {
          res.status(400).send({ error: "please fill the data" });
  
        } else if(price<1 || price>10){

          return res.status(400).send({error:"product price should be in between 1 to 10"})
        }
        
        else {
          (req.user.password = undefined), // password ko show nhi krwane ke ley
          (req.user.cPassword = undefined),
          (req.user.email = undefined),
          (req.user.token = undefined),
          (req.user.firstName = undefined);
          (req.user.isAdmin = undefined);

          
          
          const user = new Product({
            title,
            price,
            description,
            postedby: req.user, //req.user me user login ki details hai
            image:result.secure_url,
            cloudinary_id: result.public_id,
          });
          
          await user.save();
          res.status(200).json({
            status: "Success",
            message: "Create Post successfully.",
            post:user
          })
        }
        
    }  
  } catch (error) {
    res.status(400).send({ error: error });
  }

   
       
  }
  
// get the product
const getProducts = async (req,res,next) =>{

    try{

        const get= await  Product.find({postedby:req.user._id})
        .populate("postedby", "_id firstName")

            res.status(200).json({
              status: "Success",
              message: 'Fetched posts successfully.',
              post: get
            })
      }
        catch(error)
        {
        res.status(400).send({error: error})
        }
}


// get product by id
const getProduct = async (req,res,next) =>{

    try{
        const _id= req.params.id
    
        const getid= await Product.findById(_id)
    
        // res.status(200).send(getid)
        res.status(200).json({
          status: "Success",
          message: 'Post fetched.',
          post: getid
        })        
      }
        catch(error)
        {
            res.status(400).send(error)
        }
}

// delete product
const deleteProduct = async (req,res,next) =>{
    try{
        const _id= req.params.id

        const del= await Product.findByIdAndDelete(_id)

        res.status(200).json({ message: 'Deleted post.' });
    }
    catch(error)
    {
        res.status(500).send(error.message)
    }
}

// update product
const updateProduct = async (req,res,next) =>{

  try {

    const { title, price ,description } = req.body;
    if (!req.file) {
      res.status(401).send({ message: "please select image" });
    }
    else if(price<1 || price>10){

      return res.status(400).send({error:"product price should be in between 1 to 10"})
    }
    else {
    
      let image = req.file.path;
      const _id = req.params.id;
    
      let users = await Product.findById(req.params.id);
      const dis = await cloudinary.uploader.destroy(image);
    
      let result;
      if (dis) {
        result = await cloudinary.uploader.upload(image);
      }
    
      var user = await Product.findByIdAndUpdate(
        _id,
        {
          title,price,description,
          image: result?.secure_url,
        },
        { new: true }
      )
      user.save();
    
      res.status(200).json({
        status: "Success",
        message: "Product updated!",
        Product: user,
      });
    }
  } catch (error) {
  res.status(400).send({error:error.message})
    
  }
}


// deshboard products
const dashProduct = async (req,res,next) =>{

  try{

    const get= await  Product.find({})

        res.status(200).json({
          status: "Success",
          message: 'Fetched dashBoard product successfully.',
          products: get
        })
  }
    catch(error)
    {
    res.status(400).send({error: error.message})
    }
}

// pagination 
const pagination = async (req,res,next) =>{

  try {

    const { page = 1, limit = 150, sort,} = req.query;


    const data = await Product.find({ })

      .sort({ [sort]: 1 })        // sorting name, id ,etc

      .limit(limit * 1)       // apply limit to show data

      .skip((page - 1) * limit)     // pagination formula

    res.status(200).send({ page: page, limit: limit, data: data })


  } catch (error) {

   res.status(400).send(error.message)
  }
}

// search products
const search = async (req,res) =>{
  try {

    const { search = "" } = req.query;


    const data = await Product.find({ title: { $regex: search, $options: "i" } })


    res.status(200).send({ data: data })

    const total = await Product.countDocuments({

      title: { $regex: search, $options: "i" }   // search name according

    });
  } catch (error) {

    res.status(400).send(error.message)
  }
}


export default {
  productController,
  postProduct,
  getProducts,
  getProduct,
  deleteProduct,
  updateProduct,
  dashProduct,
  pagination,
  search
};
