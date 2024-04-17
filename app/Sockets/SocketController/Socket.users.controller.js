const jwt=require("jsonwebtoken")


const joinOwnChannel=(socket,payload)=>{
    try{
        let id=jwt.verify(payload.token,process.env.JWT_SECRET)
        if(id){
            // console.log("Channel Joined",id._id)
            socket.join(String(id._id))
        }
    }catch(e){
        console.log("Join Channel error")
    }
}

module.exports={joinOwnChannel}