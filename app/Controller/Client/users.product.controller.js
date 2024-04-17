const { matchedData } = require("express-validator")
const productModel=require("../../Models/product.model")
const userModel = require("../../Models/user.model")
const cartModel=require("../../Models/cart.model")
const favouritesModel=require("../../Models/favourites.models")
const orderModel = require("../../Models/orders.model")
const ratingModel=require("../../Models/ratings.model")
const { default: mongoose } = require("mongoose")

const SearchProduct=async(req,res)=>{
    try{
        const {search}=matchedData(req)
        let data=await productModel.find({name:{$regex:new RegExp(search,'i')}},{_id:0,imgExtension:0})
        if(data.length>0){
            res.json({status:"success",data:data})
        }else{
            res.json({status:"success",data:[],message:'No Data Found'})
        }
    }catch(e){
        console.log(e)
        res.status(500).json({status:"failed",message:'Internal Server Error'})
    }
    

}

const getCategoryProduct=async(req,res)=>{
    try{
        let {category}=matchedData(req)
        // console.log(category)
        let data=await productModel.find({category:category}) 
        if(data.length>0){
            res.json({status:"success",data:data})
        }else{
            res.json({status:"success",data:[],message:'No Data Found'})
        }
        
    }catch(e){
        res.status(500).json({status:"failed",message:'Internal Server Error'})
    }
}

const getSingleProductData=async(req,res)=>{
    const {name}=matchedData(req)
    // console.log(name)
    try{
        let data=await productModel.findOne({name:name},{_id:0,imgExtension:0})
        // console.log(data,name)
        if(data){
            res.json({status:"success",data:data})
        }else{
            res.json({status:"failed",message:'Product Not Found'})
        }
    }catch(e){
        console.log(e)
        res.json({status:"failed",message:'Internal Server Error'})
    }
    

}

/* PRODUCT CART SECTION */
const addToCart=async(req,res)=>{
    try{
        let data=matchedData(req)
        let auth=await userModel.findOne({_id:req.token._id})
        let product=await productModel.findOne({name:data.ProductName})
        // console.log(product.name)
        if(auth){
            if(product){
                await cartModel.create({
                    userId:auth._id,
                    productId:product._id,
                    Quantity:data.ProductQuantity,
                    productName:product.name,
                    size:data.size
                })
                res.json({status:"success",message:'Item Added'})
            }else{
                res.json({status:"failed",message:'Product Not Found'})
            }
        }else{
            res.json({status:"failed",message:'User Not Found'})
        }
    }catch(e){
        console.log(e)
        res.json({status:"failed",message:'Internal Server Error'})
    }
}

const getCartItems=async(req,res)=>{
    try{
        let token=req.token._id
        let id=new mongoose.Types.ObjectId(token)
        // let result=await cartModel.find({userId:token},{Quantity:1,productName:1,_id:0})
        const result = await cartModel.aggregate([
            {
                $match:{
                    userId:id
                }
            },
            {
              $lookup: {
                from: "products",
                localField: "productId",
                foreignField: "_id",
                as: "details"
              }
            },
            {
              $project: {
                _id:1,
                productName:1,
                Quantity:1,
                size:1,
                'details.price': 1,
                'details.discount':1,
                'details.size_options':1
              }
            }
          ]);

        //   console.log(result)
        if(result){
            res.json({status:"success",data:result})
        }else{
            res.json({status:"failed",message:'No Items in Cart'})
        } 
 
    }catch(e){
        console.log(e)
        res.json({status:"failed",message:'Internal Server Error'})
    }
}

const removeFromCart=async(req,res)=>{
    try{
        let data=matchedData(req)
        let token=new mongoose.Types.ObjectId(req.token._id)
        let cartId=new mongoose.Types.ObjectId(data.id)
 
        if(cartId && token){
            await cartModel.deleteOne({_id:cartId,userId:token})
            res.json({status:"success"})
        }else{
            res.json({status:"failed",message:'No Items in Cart'})
        } 
 
    }catch(e){
        console.log(e)
        res.json({status:"failed",message:'Internal Server Error'})
    }
}

const cartUpdate=async(req,res)=>{
    try{
        let {data}=matchedData(req)
        let token=new mongoose.Types.ObjectId(req.token._id)

        // console.time("1")
        // console.log(data)
        if(data && token){
            if(data.length>0){  
                data.map(async(item)=>{
                    if(item.Quantity){
                        if(item.Quantity>0 && item.Quantity<=10){
                            await cartModel.updateOne({_id:new mongoose.Types.ObjectId(item._id),userId:token},{$set:{Quantity:item.Quantity}})
                        }
                    }
                })
                res.json({status:"success",message:'Cart Updated'})
            
            }else{
                res.json({status:"failed",message:'No Items in Cart'})
            }
        }else{
            res.json({status:"failed",message:'Internal Server Error'})
        } 
        // console.timeEnd("1")
    }catch(e){
        console.log(e)
        res.json({status:"failed",message:'Internal Server Error'})
    }

}


/* FAVOURITES SECTION */

const getFavourites=async(req,res)=>{
    let token=req.token._id
    let id=new mongoose.Types.ObjectId(token)
 
    try{
  
        let data=await favouritesModel.aggregate([
            {
                $match:{
                    userId:id
                }
            },
            {
                $lookup:{
                    from:"products",
                    localField:"productName",
                    foreignField:"name",
                    as:"details"
                }
            },
            {
                $project:{
                    _id:0,
                    userId:0,
                    'details._id':0,
                    'details.description':0,
                    'details.imgExtension':0,
                    'details.name':0,
                    'details.size_options':0

                }
            }
        ])

        if(data.length>0){
            res.json({status:"success",data:data})
        }else{
            res.json({status:"failed",message:"No Favourites Found"})
        }
    }catch(e){
        res.json({status:"failed",message:'Internal Server Error'})
    }

}

//THIS TO CHECK WHETHER ITEM IS FAVOURITE OR NOT
const getSingleFavourites=async(req,res)=>{
    let data=matchedData(req)
    let token=new mongoose.Types.ObjectId(req.token._id)

    try{
        let result=await favouritesModel.findOne({userId:token,productName:data.ProductName})

        if(result){
            res.json({status:"success",data:true})
        }else{
            res.json({status:"failed",message:"No Favourites Found"})
        }
    }catch(e){
        res.json({status:"failed",message:'Internal Server Error'})
    }
}


const addFavourites=async(req,res)=>{
    let data=matchedData(req)
    let token=new mongoose.Types.ObjectId(req.token._id)

    try{
        if(data.ProductName){
            let isAlreadyFavourite=await favouritesModel.findOne({userId:token,productName:data.ProductName})
            if(isAlreadyFavourite==null){
                await favouritesModel.create({userId:token,productName:data.ProductName})
                res.json({status:"success",data:data})
            }else{
                res.json({status:"failed",message:"Already Favourite"})
            }
        }else{
            res.json({status:"failed",message:"No Product Name"})
        }
    }catch(e){
        res.json({status:"failed",message:'Internal Server Error'})
    }
}

const removeFavourites=async(req,res)=>{
    let data=matchedData(req)
    let token=new mongoose.Types.ObjectId(req.token._id)

    try{
        await favouritesModel.deleteOne({userId:token,productName:data.ProductName})
        res.json({status:"success",data:data})

    }catch(e){
        res.json({status:"failed",message:'Internal Server Error'})
    }
}


/* ORDER PRODCTS SECTION */

const getOrders=async(req,res)=>{
    try{

        let token=new mongoose.Types.ObjectId(req.token._id)
        let data=await orderModel.find({userId:token},{userId:0})
        // console.log(data)
        if(data.length>0){
            res.json({status:"success",data:data})
        }else{
            res.json({status:"success",data:[],message:"No Orders Found"})
        }
        
    }catch(e){
        res.json({status:"failed",message:'Internal Server Error'})
    }

}

const placeOrder=async(req,res)=>{
    try{
        // console.time("2")
        let {products,address,totalPrice}=matchedData(req)
        let token=new mongoose.Types.ObjectId(req.token._id)
        let sizeIndexes={Small:0,Medium:1,Large:2}
        
        
        if(token && products && address && totalPrice){
            // let data = products.map((item)=>{
            //     delete item['details']
            //     return item
            // })
            let userDetails=await userModel.findOne({_id:token})
            let totalPrice_=0
            
            for(let i=0;i<products.length;i++){

                let item=products[i]
                let data2= await productModel.findOne({name:item.productName},{_id:0,price:1,discount:1,size_options:1})
                let price = data2.price
                let discount=data2.discount
                let sizePrice=parseInt(Object.values(data2.size_options[sizeIndexes[item.size]]))

                if(item.Quantity>0 && item.Quantity<=10){
                    
                   totalPrice_+=((price+sizePrice)-(parseInt((price+sizePrice)*(discount/100))))*item.Quantity

                }else{
                    res.json({status:"failed",message:"Place Order Failed"})
                    break
                }
          
            }
            // console.log(totalPrice_,totalPrice)
            if(totalPrice===totalPrice_){
                await orderModel.create({userId:token,userEmail:userDetails.email,address:address,cost:totalPrice_,products:products,orderDate:new Date().toLocaleDateString(),orderTime:new Date().toLocaleTimeString()})

                if(products.length>1){
                    await cartModel.deleteMany({userId:token})
                }
            }
            else{
                res.json({status:"failed",message:"Place Order Failed"})
            }
          
            res.json({status:"success"})
            // console.timeEnd("2")
        }else{
            res.json({status:"failed",message:"Place Order Failed"})
        }
    }
    catch(e){
        res.json({status:"failed",message:'Internal Server Error'})
        console.log(e)
    }
}

const cancelProductOrder=async(req,res)=>{

     let data = await orderModel.findOne({
        products: {
            $elemMatch: {
                'productName': 'Pizza'
            }
        }
    })

    // console.log("Cancel Order ",data)

}


/* RATINGS SECTION  */

// const calculateRating=async(productId)=>{
//     await ratingModel.find({productId:productId})
// }

const addRating=async(req,res)=>{
    try{
        let {productName,rating}=matchedData(req)
        let token=new mongoose.Types.ObjectId(req.token._id)
        let productId=await productModel.findOne({name:productName},{_id:1})
        await ratingModel.create({userId:token,productId:productId,rating:rating})

        res.json({status:"success"})
        // calculateRating(productId)
         
    }catch(e){
        res.json({status:"failed",message:'Internal Server Error'})
    }
}

const deleteRating=async(req,res)=>{
    try{
        let {productName}=matchedData(req)
        let token=new mongoose.Types.ObjectId(req.token._id)
        let productId=await productModel.findOne({name:productName},{_id:1})
        await ratingModel.deleteOne({userId:token,productId:productId})

        res.json({status:"success"})
         
    }catch(e){
        res.json({status:"failed",message:'Internal Server Error'})
    }
}

const getUserRating=async(req,res)=>{
    try{
        let {productName}=matchedData(req)
        let token=new mongoose.Types.ObjectId(req.token._id)
        let productId=await productModel.findOne({name:productName})

        let data=await ratingModel.findOne({userId:token,productId:productId},{_id:0,rating:1})
        let ordersCheck = await orderModel.findOne({
            products: {
                $elemMatch: {
                    'productName': productName
                }
            }
        })
   
        if(data){
            res.json({status:"success",data:data})
        }
        else if(ordersCheck){
            res.json({status:"success",data:{rating:0}})
        }
        else{
            res.json({status:"success",data:null,message:"No Ratings Found"})
        }
        
    }catch(e){
        res.json({status:"failed",message:'Internal Server Error'})
    }
}

// const getProductRating=async(req,res)=>{
//       try{
//         let{productName}=matchedData(req)

//         let data=await productModel.findOne({name:productName},{_id:0,rating:1})
//         console.log(Number(data.rating))
//         if(data){
//             res.json({status:"success",data:data})
//         }else{
//             res.json({status:"failed",message:"No Ratings Found"})
//         }
//       }catch(e){
//         res.json({status:"failed",message:'Internal Server Error'})
//       }
// }

module.exports={SearchProduct,getSingleProductData,getCategoryProduct,
                addToCart,removeFromCart,getCartItems,cartUpdate,
                getFavourites,getSingleFavourites,addFavourites,removeFavourites,
                placeOrder,cancelProductOrder,getOrders,
                addRating,deleteRating,getUserRating
            }