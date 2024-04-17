const express=require("express")
const app=express()
const server=require("http").createServer(app)
const cors=require("cors")
const helmet=require("helmet")
const bodyparser=require("body-parser")
const cookieParser=require('cookie-parser')


require("dotenv").config()

const PORT=process.env.PORT || 5000

//CUSTOM IMPORTS 
const connectDB=require("./app/Configs/db.config")
const InitializeSocket=require("./app/Sockets/sockets.config")

//MIDDLEWARES USED
app.use(cors({origin:process.env.FRONTEND_URL,credentials:true}))
app.use(express.static("public"))
app.use(express.json())
app.use(express.urlencoded({extended:true}))
app.use(cookieParser())
app.use(helmet())

// app.use(bodyparser.urlencoded({extended:true}))
// app.use(bodyparser.json())


//ROUTES
const usersRoutes=require("./app/Routes/users.routes")
const adminRoutes=require("./app/Routes/admin.routes")
const adminLoginRoutes=require("./app/Routes/admin.auth.routes")

app.use("/users",usersRoutes)
app.use("/admin",adminRoutes)
app.use("/adminAuth",adminLoginRoutes)

connectDB()
.then(()=>{
    InitializeSocket(server)
    server.listen(3002,()=>{
        console.log(`server running on http://localhost:${PORT}`)
    })
})
.catch((e)=>{
    console.log(e)
})