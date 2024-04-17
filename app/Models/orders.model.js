const mongoose=require('mongoose')

const orderSchema=new mongoose.Schema({
    userId:{type:mongoose.Schema.Types.ObjectId,ref:"users"},
    userEmail:{
        type:String
    },
    products:{
        type:Array,
        required:true
    },
    address:{
        type:Object,
        required:true
    },
    status:{
        type:String,
        default:'Ordered'
    },
    cost:{
        type:Number,
        required:true
    },
    orderDate:{
        type:String,
    },
    orderTime:{
        type:String,
    }
})

const orderModel=mongoose.model('orders',orderSchema)

module.exports=orderModel