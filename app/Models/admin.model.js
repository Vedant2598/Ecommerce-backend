const mongoose=require("mongoose")

let adminSchema=new mongoose.Schema({
    username:{
        type:String,
        unique:true
    },
    password:{
        type:String
    },
    root:Boolean
})

let adminModel=mongoose.model("admin",adminSchema)

adminModel.createIndexes()

//ADMIN PASSWORD : 12345

const adminRootUser=async()=>{
   let data= await adminModel.findOne({username:'admin123'})
   if(!data){
    await adminModel.create({username:'admin123',password:'$2b$10$3j3BC4j.38nHZSK9u2vd5.yPbPhUFV6uSi319JqGUtTWADQEdAbLe',root:true})
   }
}
adminRootUser()

module.exports=adminModel