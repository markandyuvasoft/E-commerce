import Jwt from 'jsonwebtoken'
import mongoose from 'mongoose'
import User from '../models/user.js'


const checkauth=(req,res,next)=>{
    
    const {authorization} = req.headers

    if(!authorization){

       return res.status(401).json({error:"only auth"})
    }

    const token = authorization.replace("Bearer ","")

    Jwt.verify(token,process.env.JWT_SECRET,(err,payload)=>{

        if(err){

         return  res.status(401).json({error:"only auth user"})

        }else{

            const {_id} = payload

            User.findById(_id).then(userdata=>{

                req.user = userdata
                
                next()
            })
        }

    })
} 

export default checkauth