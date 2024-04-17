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
    await adminModel.create({username:'admin25',password:'$2b$10$el9Lv0iLWvhSnnjMg6JQaOq8YKzvBYTaV4v8/l2Yf5KEdValXqx4q',root:true})
   }
}
adminRootUser()

module.exports=adminModel