const mongoose=require("mongoose")

const connectDB=async()=>{
    await mongoose.connect(process.env.DATABASE_URL)
    .then(()=>{
        console.log("Database Connected Successfully")
    })
    .catch((err)=>{
        console.log("Database connection failed")
        console.log(err)
    })
}

module.exports=connectDB