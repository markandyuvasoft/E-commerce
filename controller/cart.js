import express from 'express'
import Cart from '../models/cart.js';
import Product from '../models/product.js';

const cartController = express.Router()

// post cart api
const postCart = async (req,res)=>{

    const postedby = req.user._id

    var { itemId, quantity } = req.body

    try {

        const cart = await Cart.findOne({ postedby })

        const item = await Product.findOne({ _id: itemId })

        if(!item) {
            res.status(401).send({message: "item not found"})
            
            return
        } 
        const price = item.price
        const title = item.title

        // if cart already exist for user

        if(cart) {
            const itemIndex= cart.items.findIndex((item) => item.itemId == itemId)   // findindex= items ko findout kr rha hai id ki help se..
            
        //check if product exist or not
            
        if(itemIndex > -1) {

            let product = cart.items[itemIndex]

            product.quantity++

            // ++quantity

            cart.bill = cart.items.reduce((acc, curr) => {   // reduct=> price ko add kr rha hai 100+100=200
                 return acc + curr.quantity * curr.price     // curr= current price
            },0)
        
            cart.items[itemIndex] = product

            await cart.save()

            res.status(200).send(cart)

        } else {
        cart.items.push({ itemId, title, quantity, price})
        cart.bill = cart.items.reduce((acc, curr) => {   // reduct=> price ko add kr rha hai 100+100=200
            return acc + curr.quantity * curr.price     // curr= current price
       },0)

       await cart.save()
       res.status(200).send(cart)
    }
} else {
    //  no cart exist create one 

    const newCart = await Cart.create({

        postedby,
        items: [{ itemId, title, quantity, price}],
        bill: quantity * price
    })
    return res.status(200).send(newCart)
}

    } catch (error) {
// console.log(error);  
res.status(400).send(error.message)      
    }

}


// get cart api
const  getCart = async (req,res) => {

    const postedby = req.user._id

    try {
        
        const cart = await Cart.findOne({ postedby })

        if( cart && cart.items.length > 0) {

            res.status(200).send(cart)
        }
        else{
            res.send(null)
        }

    } catch (error) {
        res.status(400).send("something wrong")
    }

}


// delete cart api

const deleteCart = async (req,res) => {

    const postedby = req.user._id

    const itemId = req.query.itemId

    // console.log(itemId);

    // try {
        let cart = await Cart.findOne({ postedby });
    
        const itemIndex = cart.items.findIndex((item) => item.itemId == itemId);
        
        if (itemIndex > -1) {

          let item = cart.items[itemIndex];
          cart.bill -= item.quantity * item.price;

          if(cart.bill < 0) {
              cart.bill = 0
          } 

          cart.items.splice(itemIndex, 1);
          cart.bill = cart.items.reduce((acc, curr) => {
            return acc + curr.quantity * curr.price;
        },0)

          cart = await cart.save();
    
          res.status(200).send(cart);

        } else {
        res.status(404).send("item not found");
        }

    //   } catch (error) {
    //     // console.log(error);
    //     res.status(400).send("something wrong");
    //   }


}


export default {cartController, postCart, getCart, deleteCart}