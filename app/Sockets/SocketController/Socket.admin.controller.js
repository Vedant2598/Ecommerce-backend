const TrackEmit=(socket,payload)=>{
    // console.log(payload.message,payload.userId)
    socket.join(String(payload.userId))
    socket.to(String(payload.userId)).emit("TrackEmitClient",{message:payload.message,orderId:payload.orderId})
}

const deleteUser=(socket,payload)=>{
    // console.log("delete emitted")
    socket.to(String(payload.id)).emit("DeleteUserReceiver")
}

module.exports={TrackEmit,deleteUser}