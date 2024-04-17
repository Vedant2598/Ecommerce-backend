const path=require("path")
const { matchedData } = require("express-validator")
let productModel=require("../app/Models/product.model")
const fs=require("fs")

/* ADMIN IMAGES */
const sendProductImageAdmin=async(req,res)=>{
    let {id}=matchedData(req)

    if(id){
        try{

            let data=await productModel.findOne({_id:id}) 
           
            if(data){
                res.sendFile(__dirname+`/Media/ProductsPictures/${data._id}/${data._id}.${data.imgExtension}`)
            }
            else{
                res.json({Status:"failed",Message:"End Point Error"})
            }

        }catch(e){
            res.json({Status:"failed",Message:"Internal Server Error"})
        }
    }
    else{
        res.json({Status:"failed",Message:"Bad Request"})
    }
}


//MIDDLEWARE
const deleteProductImage=async(req,res,next)=>{
    let {id}=matchedData(req)

    if(id){
        try{

            let data=await productModel.findOne({_id:id}) 
           
            if(data){
                fs.rmSync(__dirname+`/Media/ProductsPictures/${data._id}/${data._id}.${data.imgExtension}`)
                fs.rmdirSync(__dirname+`/Media/ProductsPictures/${data._id}`)
                next()
            }
            else{
                res.json({Status:"failed",Message:"Image or dir not found"})
            }

        }catch(e){
            res.json({Status:"failed",Message:"Internal Server Error"})
        }
    }
    else{
        res.json({Status:"failed",Message:"Bad Request"})
    }
}

//THIS API DON'T SAVE THE PRODUCT IT JUST REMOVE THE PREVIOUS PRODUCT
// const saveProductImage=async(req,res,next)=>{
//     let {id}=matchedData(req)

//     if(id){
//         try{

//             let data=await productModel.findOne({_id:id}) 
           
//             if(data){
//                 fs.rmSync(__dirname+`/Media/ProductsPictures/${data._id}/${data._id}.${data.imgExtension}`)
//                 next()
//             }
//             else{
//                 res.json({Status:"failed",Message:"Image or dir not found"})
//             }

//         }catch(e){
//             res.json({Status:"failed",Message:"Internal Server Error"})
//         }
//     }
//     else{
//         res.json({Status:"failed",Message:"Bad Request"})
//     }
// }
 
module.exports={sendProductImageAdmin,deleteProductImage}