const mongoose=require('mongoose')

let productSchema=new mongoose.Schema({
    name:{
        type:String,
        required:true
    },
    description:{
        type:String,
    },
    imgExtension:{
        type:String,
    },
    price:{
        type:Number,
        required:true
    },
    discount:{
        type:Number
    },
    category:{
        type:String,
        required:true
    },
    size_options:{
        type:Array,
        default:{}    
    },
    foodType:{
        type:String,
        default:null
    }
    ,
    rating:{
        type:mongoose.Schema.Types.Decimal128,
        default:0
    }

})

let productModel= mongoose.model("products",productSchema)
productModel.createIndexes({name:1})

module.exports=productModel