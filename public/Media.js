const path=require("path")
const { matchedData } = require("express-validator")
let productModel=require("../app/Models/product.model")
const fs=require("fs")

const sendProductImage=async(req,res)=>{
    let {name}=matchedData(req)
    // console.log("product Image ",name)
    if(name){
        try{

            let data=await productModel.findOne({name:name}) 
         
            if(data){
                res.sendFile(__dirname+`/Media/ProductsPictures/${data._id}/${data._id}.${data.imgExtension}`)
            }

        }catch(e){
            res.json({Status:"failed",Message:"End Point Error"})
        }
    }
}




module.exports={sendProductImage}