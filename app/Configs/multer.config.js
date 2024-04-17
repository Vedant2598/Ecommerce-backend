const multer=require("multer")
const fs=require("fs")
const productModel=require("../Models/product.model")

//FILES VALIDATIONS 
const validateFileExtension=(fileExtension)=>{
    if(fileExtension){

        let result=false
        let extension=String(fileExtension).toLowerCase()
        let ValidExtensions=["jpg","png","jpeg"]
        
        ValidExtensions.forEach(x=>{
            if(x===extension){
                result=true
            }
        })
       
        return result
    }
}

const fileFilter=(req,file,cb)=>{
    try{
        let fileExtension=file.originalname.split(".")[1]
        let isExtensionValid=validateFileExtension(fileExtension)
        if(isExtensionValid){
            cb(null,true)
        }else{
            cb(new Error("Invalid File Extension"),false)
        }
    }catch(e){

    }
}

// FILES STORES CONFIGURATIONS
const storeProductImages=multer.diskStorage({
    destination:async(req,file,cb)=>{
        let name=String(req.body.productName)
        let data =await productModel.findOne({name:name})
        
        if(data){
            try{
                fs.mkdirSync(`./public/Media/ProductsPictures/${data._id}`)
                cb(null,`./public/Media/ProductsPictures/${data._id}`)
                req.fileStatus=true
            }catch(e){
                req.fileStatus=true
                cb(null,`./public/Media/ProductsPictures/${data._id}`)
            }
        }
        else{
            req.fileStatus=false
        }
    },
    filename:async(req,file,cb)=>{
        try{

            let name=String(req.body.productName)
            let data =await productModel.findOne({name:name})
           
            if(data){

                if(data.imgExtension!=''){
                    fs.rmSync(`./public/Media/ProductsPictures/${data._id}/${data._id}.${data.imgExtension}`)
                }
                req.fileStatus=true
                let extension=file.originalname.split(".")[1]
                await productModel.updateOne({name:name},{$set:{imgExtension:extension}})
                cb(null,`${data._id}.${extension}`)
                
            }else{
                req.fileStatus=false
            }
            }catch(e){
                console.log(e)
                req.fileStatus=false
            }
    },
})

const productImage=multer({storage:storeProductImages,fileFilter:fileFilter})

module.exports={productImage}