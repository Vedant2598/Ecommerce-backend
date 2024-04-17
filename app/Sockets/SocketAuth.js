const jwt=require("jsonwebtoken")

const socketAuth=(socket,next)=>{
    try {

        const token = socket.handshake.query.token;
        // console.log(token)
        // next()
        console.log(token)
        if(token){
            let isValid=jwt.verify(String(token),process.env.JWT_SECRET)
            if(isValid){
                socket.token=isValid
                next();
            }
        }
}catch(e){
    console.log(e)
}
}

module.exports={socketAuth}