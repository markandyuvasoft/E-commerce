import express from "express";
import User from "../models/user.js";
import secure from "../bcrypt/authbcr.js";
import createtoken from "../token/authtoken.js";
import bcrypt from "bcrypt";


const adminController = express.Router();

// get admin profile
const adminProfile = async (req,res) =>{
    try {
        const details = await User.find({ _id: req.user._id }).select('-password -cPassword')
    
        if (!details) {
          res.status(400).send({ error: "not found admin detail" });
        } else {
          res.status(200).send({Admin:details});
        }
      } catch (error) {
        res.status(400).send(error.message);
      }

}

// delete admin profile
const deleteAdminProfile = async (req,res) =>{

    try {
    
        const id = req.params.id
    
        const details = await User.find({ _id: req.user._id });
    
        if(details) {
    
          const user = await User.findByIdAndDelete(id)
    
          res.status(200).send({message:"admin deleted"})
        }
        else {
          res.status(200).send({message:"no admin found"});
        }
      } catch (error) {
        
        res.status(400).send(error.message)
      }

}

// update admin profile
const updateAdminProfile = async (req,res) =>{

    try {
        const id= req.params.id
        const detail = await (await User.find({ _id: req.user._id}))
    
        if(detail){
    
          const updateuser = await User.findByIdAndUpdate(id,req.body,{
            new:true
          }).select("-password -isAdmin -cPassword")
    
          res.status(200).send({updatedAdmin:updateuser})
        }else{
          res.status(400).send({message:"admin not found"})
    
        }
    
      }
      catch(error) {
    
        res.status(400).send(error.message);
    
      }
}

// block the user
const blockAuth = async (req,res) =>{
  
  try {
    const email = req.body

  if(!email) {
    res.status(200).send({error: "please fill the email field"})
  } 
  else{
    let user = await User.findOne({ email: req.body.email})

    if(!user) {
      res.status(200).send({error: "invalid email"})
    
    } else{
      const _id = req.params.id
      const isVarified = req.body.isVarified

      const getid = await User.findByIdAndUpdate(_id, req.body.isVarified, {
        new: true
      })
      const data = {
        isVarified: 1
      }
      if (getid.isVarified == 1) {

        const data = {
          isVarified: 0
        }
        const get = await User.findByIdAndUpdate(getid._id, data)
        res.status(200).send({ success: "block the user" })
     
      } else {
        res.status(400).send({ message: "user already blocked" })
      }
    } 
  }
  
  } catch (error) {
    res.status(400).send(error.message)
    
  }
  
}

// unBlock the user
const unBlockAuth = async (req,res) =>{

  try {
    const _id = req.params.id
    const isVarified = req.body.isVarified
  
    const getid = await User.findByIdAndUpdate(_id, req.body.isVarified, {
      new: true
    })
    const data = {
      isVarified: 0
    }
    if (getid.isVarified == 0) {
  
      const details = {
        isVarified: 1
      }
      const getUserId = await User.findByIdAndUpdate(getid._id, details)
  
      res.status(200).send({ success: "unblock the user" })
    }
    else {
      res.status(400).send({ message: "user already unblock" })
    }
    
  } catch (error) {
    res.status(400).send(error.message)  
  }
}

// made a admin
const madeAdmin = async (req,res) =>{

  try {
    const _id = req.params.id

    const isAdmin = req.body.isAdmin
  
    const getid = await User.findByIdAndUpdate(_id, req.body.isAdmin, {
      new: true
    })
    const data = {
      isAdmin: false
    }
  
    if (getid.isAdmin == false) {
  
      const da1ta = {
        isAdmin: true
      }
      const getid1 = await User.findByIdAndUpdate(getid._id, da1ta)
  
      res.status(200).send({ success: "you have made this user an Admin" })
    }
    else {
  
      res.status(400).send({ message: "you have already made this user an Admin" })
  
    }
    
  } catch (error) {
    res.status(400).send(error.message)  
    
  }
}

// made a user
const madeUser = async (req,res) =>{
  try {
    const _id= req.params.id

    const isAdmin= req.body.isAdmin
  
    const getid= await User.findByIdAndUpdate(_id,req.body.isAdmin,{
      new:true
    })
    const data= {
      isAdmin:true
    }
  
  if(getid.isAdmin==true){
  
      const da1ta= {
        isAdmin:false
      }
      const getid1= await User.findByIdAndUpdate(getid._id,da1ta)
  
      res.status(200).send({success:"you have successfully made this admin a user"})
    }
    else{
  
  res.status(400).send({message:"you have already made this admin a user"})
  
  }
    
  } catch (error) {
    res.status(400).send(error.message)  
    
  }
}


// get all register user
const allAuthUser = async (req,res) =>{

  try {  
    // const user = await User.find({ $or: [{ isAdmin: false }, { isAdmin: false }] })

  const user = await User.find({isAdmin: false}).select('-password -cPassword')

  if(user){
    res.status(200).send({userList:user})
  }
  else{
    res.status(400).send({userList:"No user found"})
  
}
  } catch (error) {

    res.status(400).send(error.message)   
  }
}


export default {adminController,

    adminProfile,
    deleteAdminProfile,
    updateAdminProfile,
    blockAuth,
    unBlockAuth,
    madeAdmin,
    madeUser,
    allAuthUser

}