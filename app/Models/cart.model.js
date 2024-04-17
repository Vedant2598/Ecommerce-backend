const mongoose=require('mongoose')

const cartSchema=new mongoose.Schema({
    userId:{type:mongoose.Schema.Types.ObjectId,ref:"users"},
    productId:{type:mongoose.Schema.Types.ObjectId,ref:"products"},
    productName:{type:String,required:true},
    Quantity:Number,
    size:String
})

const cartModel=mongoose.model('carts',cartSchema)

module.exports=cartModel