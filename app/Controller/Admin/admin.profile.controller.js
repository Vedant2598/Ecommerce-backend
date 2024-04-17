const { matchedData } = require("express-validator")
const userModel=require("../../Models/user.model")
const adminsModel=require("../../Models/admin.model")
const cartModel=require("../../Models/cart.model")
const orderModel=require("../../Models/orders.model")
const favouriteModel=require("../../Models/favourites.models")
const ratingModel=require("../../Models/ratings.model")
const bcrypt=require("bcrypt")

/* ADMINS DATA MANIPULATION :- STARTS */

const DeleteAdminAccount=async(req,res)=>{
    try{
        let data=matchedData(req)

        let rootCheck=await adminsModel.findOne({_id:data.id})
        if(rootCheck.root!=true){

            await adminsModel.deleteOne({_id:data.id})
            if(data.id==req.token._id){
                res.send({status:"success",message:"Logout ASAP"})
            }else{
                res.send({status:"success"})
            }
        }
        else{
            res.json({status:"failed",message:"Root Account Can't be deleted"})
        }
        
    }catch(e){
        res.json({status:"failed",message:"End Point error"})
    }
}

const getAdminsData=async(req,res)=>{
    try{
        let data=matchedData(req)
        let result=await adminsModel.find({username:{$regex:new RegExp(data.search,"i")}})
        // console.log(result)
        res.send({status:"success",result:result})
    }
    catch(e){
        res.send({status:"success",result:null})
    }
}
/* ADMINS DATA MANIPULATION :- ENDS */



/* USERS DATA MANIPULATION :- STARTS */
const getUsersData=async(req,res)=>{
    try{

        let data=matchedData(req)
        let result=await userModel.find({email:{$regex:new RegExp(data.search,"i")}})
        // console.log(result)
        res.send({status:"success",data:result})
    }
    catch(e){
        res.send({status:"success",data:null})
    }
}

const AdminCreateUserData=async(req,res)=>{
    let data=matchedData(req)
    try{
        let password=bcrypt.hashSync(data.password,10)
       
        let payload={name:data.name,email:data.email,password:password,phone:data.phone}
        await userModel.create(payload)
        // console.log(data)
        res.json({status:"success",message:"Account Created"})
    }
    catch(e){
        console.log(e)
        res.json({status:"failed",message:"Account Already Exist"})
    }
}


const AdminUpdateUsersData=async(req,res)=>{
    try{
        let data=matchedData(req)

        await userModel.updateOne({_id:data.id},{$set:{name:data.name,email:data.email,phone:data.phone}})
        res.json({status:"success"})
    }catch(e){
        res.json({status:"failed",message:"End Point error"})
    }
}

const AdminDeleteUserAccount=async(req,res)=>{
    try{
        let data=matchedData(req)

    
            await userModel.deleteOne({_id:data.id})
            await orderModel.deleteMany({userId:data.id})
            await cartModel.deleteMany({userId:data.id})
            await ratingModel.deleteMany({userId:data.id})
            await favouriteModel.deleteMany({userId:data.id})
            res.json({status:"success"})
        
    }catch(e){
        res.json({status:"failed",message:"End Point error"})
    }
}
/* USERS DATA MANIPULATION :- ENDS */

module.exports={getUsersData,getAdminsData,AdminUpdateUsersData,AdminDeleteUserAccount,DeleteAdminAccount,AdminCreateUserData}