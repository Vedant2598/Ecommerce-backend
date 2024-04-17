const {Server}=require("socket.io")
const cookie=require("cookie")
const { socketAuth } = require("./SocketAuth")
const {TrackEmit, deleteUser} = require("./SocketController/Socket.admin.controller")
const { joinOwnChannel } = require("./SocketController/Socket.users.controller")

const InitializeSocket=(server)=>{
    const io =new Server(server,{cors:process.env.FRONTEND_URL})
    io
    // .use(socketAuth)
    .on("connection",(socket)=>{

        // socket.join("123")
        socket.on("AdminDeleteUserAccount",(payload)=>deleteUser(socket,payload))
        socket.on("JoinOwnChannel",(payload)=>joinOwnChannel(socket,payload))
        socket.on("TrackEmit",(payload)=>TrackEmit(socket,payload))
    })
}

module.exports=InitializeSocket