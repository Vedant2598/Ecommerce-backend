const mongoose=require("mongoose")

const ratings=new mongoose.Schema({
    userId:{type:mongoose.Schema.Types.ObjectId,ref:"users"},
    productId:{type:mongoose.Schema.Types.ObjectId,ref:"users"},
    productName:{type:String},
    rating:{type:Number}
})

const ratingModel=mongoose.model('ratings',ratings)

module.exports=ratingModel