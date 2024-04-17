const mongoose=require("mongoose")

const favouritesSchema=new mongoose.Schema({
    productName:String,
    userId:{
        type:mongoose.Schema.Types.ObjectId,
    },
})

const favouritesModel= mongoose.model("favourites",favouritesSchema)

module.exports=favouritesModel