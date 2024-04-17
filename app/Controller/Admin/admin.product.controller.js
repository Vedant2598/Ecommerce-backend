const {matchedData}=require("express-validator")
const productModel=require("../../Models/product.model")
const categoryModel=require("../../Models/category.model")

const searchProductDataAdmin=async(req,res)=>{
    try{
        let {search}=matchedData(req)
        let result=await productModel.find({name:{$regex:new RegExp(search,'i')}})

        if(result.length>0){
            res.send({status:"success",data:result})
        }else{
            res.json({status:"success",data:[]})
        }

    }catch(e){
        res.status(500).json({status:"failed",message:"Internal Server Error"})
    }
}

const addProduct=async(req,res)=>{
    let data=matchedData(req)
    // console.log(data)
    try{
        if(data.productDiscount>=0 && data.productDiscount<=100){

            await productModel.create({name:data.productName,description:data.productDescription,imgExtension:'',price:data.productPrice,discount:data.productDiscount,category:data.Category,size_options:data.sizeOption,rating:data.rating,foodType:data.foodType})
            res.json({status:"success",message:'Product Created Successful'})
            
        }else{
            res.json({status:"failed",message:"Wrong Discount"})
        }
    }catch(e){
        console.log(e)
        res.json({status:"failed",message:'End Point Error'})
    }
}

const saveProduct=async(req,res)=>{
    try{
        let data=matchedData(req)

        if(data){
            if(data.productDiscount>=0 && data.productDiscount<=100){
                await productModel.updateOne({_id:data.id},{$set:{name:data.productName,description:data.productDescription,price:data.productPrice,discount:data.productDiscount,category:data.Category,size_options:data.sizeOption,rating:data.rating,foodType:data.foodType}})
                res.json({status:"success",message:"Updated Successful"})
            }else{
                res.json({status:"failed",message:"Wrong Discount"})
            }
        }else{
            res.json({status:"failed",message:"No data Found"})
        }
    }catch(e){
        console.log(e)
        res.status(500).json({status:"failed",message:"Internal Server Error"})
    }
}

const deleteProduct=async(req,res)=>{
    try{
        let {id}=matchedData(req)
        
        if(id){
            await productModel.deleteOne({_id:id})
            res.json({status:"success",message:'Product Deleted Successful'})
        }else{
            res.json({status:"failed",message:'Invalid Inputs'})
        }
    }catch(e){
        console.log(e)
        res.json({status:"failed",message:'Internal Server Error'})
    }
}

// CATEGORY ADD | DELETE
const addCategory=async(req,res)=>{
    try{
        const {name}=matchedData(req)
        let duplicateCheck=await categoryModel.find({name:name})
        console.log(duplicateCheck)
        if(duplicateCheck){
            await categoryModel.create({name:name})
            res.json({status:"success"})
        }else{
            res.json({status:"failed",message:"Already exist"})
        }
    }catch(e){
        res.json({status:"failed",message:'End Point Error'})
    }
}

const deleteCategory=async(req,res)=>{
    try{
        const {name}=matchedData(req)
      
        await categoryModel.deleteOne({name:name})
        res.json({status:"success"})
  
    }catch(e){
        res.json({status:"failed",message:'End Point Error'})
    }
}

const getCategory=async(req,res)=>{
    try{
      
        let data=await categoryModel.find()
        res.json({status:"success",data:data})
  
    }catch(e){
        res.json({status:"failed",message:'End Point Error'})
    }
}

//MIDDLEWARE
const productDuplicateCheck=async(req,res,next)=>{
    try{

        let data=matchedData(req)
        let result=await productModel.findOne({name:data.productName})
        if(result){
            res.json({status:"failed",message:'Name Already exists'})
        }
        else{
            next()
        }
    }catch(e){
        console.log("duplicate")
        res.json({status:"failed",message:'End Point Error'})
    }
}

const fileUploadStatus=(req,res)=>{
    let status=req.fileStatus
    console.log("file Status : ",status)
    if(status){
        res.json({status:"success"})
    }
    else{
        res.json({status:"failed",message:"Invalid File"})
    }
}



module.exports={searchProductDataAdmin,addProduct,saveProduct,deleteProduct,productDuplicateCheck,fileUploadStatus,
    addCategory,deleteCategory,getCategory}