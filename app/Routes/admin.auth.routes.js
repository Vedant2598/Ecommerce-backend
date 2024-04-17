const {validationResult,matchedData, body}=require("express-validator")
const express=require("express")
const router=express.Router()
const {AdminloginData}=require("../Controller/Admin/admin.auth.controller")

const rateLimit=require("express-rate-limit")

const loginLimit=rateLimit.rateLimit({windowMs:60*10,max:3,message:{status:"failed",message:"Too many request"}})

router.route("/").post(loginLimit,
[body("username").isString().notEmpty(),body("password").isString().notEmpty()],
AdminloginData)

adminLoginRoutes=router

module.exports=adminLoginRoutes