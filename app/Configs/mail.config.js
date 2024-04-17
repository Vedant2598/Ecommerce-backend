const nodemailer=require("nodemailer")
const otp=require("otp-generator")
require("dotenv").config()

const transport=nodemailer.createTransport(
    {
        host:"smtp.gmail.com",
        port:587,
        secure:false,
        auth:{
            user:"testers.2598@gmail.com",
            pass:process.env.MAIL_PASSWORD
        }
    }
)

// const mailOption={
//     from:"testers.2598@gmail.com",
//     to:"vedant.vartak250@gmail.com",
//     subject:"This is a test mail",
//     text:`Your OTP is ${otp.generate(6,{digits:true,lowerCaseAlphabets:false,specialChars:false,upperCaseAlphabets:false})}`
// }

// transport.sendMail(mailOption,(e,info)=>{
//     if(e){
//         console.log(e)
//     }
//     console.log(info.messageId,info.response)
// })

module.exports=transport