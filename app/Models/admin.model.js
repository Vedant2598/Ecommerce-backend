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

//ADMIN PASSWORD : admin@2598

const adminRootUser=async()=>{
   let data= await adminModel.findOne({username:'admin123'})
   if(!data){
    await adminModel.create({username:'admin25',password:'$2b$10$0EDcxg.KPdj9g4290Z6SCeUSAn7MJOzIBJc9sUSGocRJJXxgkuxKi',root:true})
   }
}
adminRootUser()

module.exports=adminModel