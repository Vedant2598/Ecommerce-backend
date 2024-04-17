const {validationResult,matchedData}=require("express-validator")
let jwt=require('jsonwebtoken')

const dataValidator=(req,res,next)=>{
    try{
        let result=validationResult(req)
        // console.log(result)
        if(result.isEmpty()){

            next()
        }
        else{
            
            res.json({status:"failed",message:"Invalid Inputs"})
        }
    }catch(e){res.json({status:"failed",message:"Invalid Inputs"})}
}


const jwtTokenValidator=(req,res,next)=>{
    let data=matchedData(req)
    try{

        if(data){
            let token=jwt.verify(data.token,process.env.JWT_SECRET)
           
            req.token=token
            next()
        }else{
       
            res.json({status:"failed",message:"Invalid Token"})
        }

    }
    catch(e){
        console.log(e)
        // console.log("failed")
        res.json({status:"failed",message:"Invalid Token"})
    }
}



module.exports={dataValidator,jwtTokenValidator}

