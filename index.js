import  express  from "express";
import mongoose from "mongoose";
import dotenv from 'dotenv'
import cors from "cors";
// import router from "./routes/employ.js"
// import userrouter from "./routes/user.js"
import authrouter from "./routes/auth.js"
// import adminrouter from "./routes/admin.js"
import productRouter from "./routes/product.js";
import cartRouter from "./routes/cart.js";
import orderRouter from "./routes/order.js";
import adminRouter from "./routes/admin.js";
import *as path from 'path'
// import fileUpload from 'express-fileupload'
dotenv.config()
const index=express();


// midleware
index.use(express.json());
index.use(express.urlencoded({extended:true}));

index.use(cors())
mongoose.set('strictQuery',true);

// routes
index.use("/",orderRouter)
index.use("/",cartRouter)
index.use("/",authrouter)
index.use("/",productRouter)
index.use("/",adminRouter)



// welcome side
index.get('/',(req,res)=>{
    res.status(200).send("welcome to E-commerce Api")
})


// index.use(fileUpload({
//     useTempFiles:true
// }))

index.use('/image', express.static('images'));


index.set('views', path.join('views'))
index.set('view engine', 'ejs')

const PORT=process.env.PORT||8000
// connect mongo db atlas
mongoose.connect(process.env.MONGO_URL,{usenewurlparser:true,}).then(()=>{
    console.log("connected to mongodb atlas")
}).catch(error=>{
console.log("something wrong")
})



// server port
app.listen(PORT,()=>{
    console.log("server started at port http://localhost:8000");
})