import express from "express";
import User from "../models/user.js";
import Product from "../models/product.js";
import secure from "../bcrypt/authbcr.js";
import createtoken from "../token/authtoken.js";
import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";

const authController = express.Router();

// register api.....
const authRegister = async (req, res, next) => {
  const { firstName, email, password, cPassword } = req.body;

  if (!firstName || !email || !password || !cPassword) {
    return res.status(422).send({ error: "please fill the field properly" });
  } else {
    const spassword = await secure(req.body.password);

    const user = new User({
      firstName,
      email,
      password: spassword,
      cPassword: spassword,
    });

    const userdata = await User.findOne({ email: req.body.email });

    if (userdata) {
      res.status(400).send({ error: "user already exist" });
    } else if (password != cPassword) {
      return res.status(422).send({ error: "password are not match" });
    } else {
      const userdatas = await user.save();

      res.status(200).send({ message: "User Register Successfully" });
    }
  }
};

// login api....
const authLogin = async (req, res, next) => {
  const { email, password } = req.body;

  if (!email || !password) {
    res.status(400).send({ error: "please fill the proper field " });
    
  } else {
    let user = await User.findOne({ email: req.body.email });

    if (!user) {
      return res.status(404).send({ error: "invalid email" });
    
    } else if (user.isVarified === 0) {

      res.status(400).send({ error: "not allow by admin" })
    }
    else {
      const checkpassword = await bcrypt.compare(
        req.body.password,
        user.password
      );

      if (!checkpassword) {
        return res.status(404).send({ error: "invalid password" });
      }
      const token = await createtoken(user._id);

      // console.log(token);

      let Id = user._id;

      res.status(200).send({ success: "😉welcome..!!", token, Id });
    }
  }
};

// change password...
const changePassword = async (req, res) => {
  try {
    const email = req.body.email;
    const password = req.body.password;

    const data = await User.findOne({ email: email });

    if (data) {
      const newpswd = await secure(password);

      const userdata = await User.findOneAndUpdate(
        { email: email },
        {
          $set: {
            password: newpswd,
          },
        }
      );
      res.status(200).send({ success: "successfully change your password" });
    } else {
      res.status(400).send({ error: "user not found please try again" });
    }
  } catch (error) {
    res.status(400).send(error);
  }
};

// get user profile
const getUser = async (req, res) => {
  try {
    const details = await User.find({ _id: req.user._id }).select('-password -cPassword -isAdmin')

    if (!details) {
      res.status(400).send({ error: "not found user detail" });
    } else {
      res.status(200).send({user:details});
    }
  } catch (error) {
    res.status(400).send(error);
  }
};

// get user by id
const getUserById = async (req,res) =>{

  try {

    const id= req.params.id

    const detail = await User.find({ _id: req.user._id})

    if(detail) {
      const user= await User.findById(id).select('-password -cPassword -isAdmin')

      res.status(200).send(user)
    }else{
      res.status(400).send({message:"user not found"})
    }
    
  } catch (error) {
    res.status(400).send(error);

  }
}

// update user profile
const updateUser = async (req,res) =>{

  try {
    const id= req.params.id
    const detail = await User.find({ _id: req.user._id})

    if(detail){

      const updateuser = await User.findByIdAndUpdate(id,req.body,{
        new:true
      }).select("-password -isAdmin -cPassword")

      res.status(200).send({updatedUser:updateuser})
    }else{
      res.status(400).send({message:"user not found"})

    }

  }
  catch(error) {

    res.status(400).send(error);

  }

}

// delete user profile
const deleteUser = async (req,res) =>{

  try {
    
    const id = req.params.id

    const details = await User.find({ _id: req.user._id });

    if(details) {

      const user = await User.findByIdAndDelete(id)

      res.status(200).send({message:"user deleted"})
    }
    else {
      res.status(200).send({message:"no user found"});
    }


  } catch (error) {
    
    res.status(400).send(error)
  }
}

// post the comment on product
const commentProduct = async (req,res) =>{
  const comment = {
    text:req.body.text,
    postedby:req.user._id
}
Product.findByIdAndUpdate(req.body.productId,{
    $push:{comments:comment}
},{
    new:true
})
.populate("comments.postedby","_id firstName")
.populate("postedby","_id firstName")

.exec((err,result)=>{
    if(err){
        return res.status(422).send({error:err})
    }else{
        res.status(200).send(result)
    }
})
  
}

export default {
  authController,
  authRegister,
  authLogin,
  changePassword,
  getUser,
  updateUser,
  deleteUser,
  getUserById,
  commentProduct
};
