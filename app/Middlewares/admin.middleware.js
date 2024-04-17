const {matchedData}=require("express-validator")
const jwt=require("jsonwebtoken")


const AdminTokenValidator=(req,res,next)=>{
    let data=matchedData(req)
 
    try{
            let token=jwt.verify(data.tokenadmin421,process.env.ADMIN_JWT_SECRET)
            req.token=token
            next()
    }
    catch(e){
        res.json({Status:"failed",Message:"Invalid Token"})
    }
}

module.exports={AdminTokenValidator}