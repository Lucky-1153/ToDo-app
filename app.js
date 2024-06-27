import express from "express";
import cors from 'cors'
import cookieParser from "cookie-parser";


let app = express()

app.get(cors({
    origin:"*",
    
    method:"GET POST Delete"
}))

// ---------------express configuration-------------------
app.use(express.json({limit:"20kb"}))
// app.use(express.urlencoded())
app.use(express.static("public"))
app.use(cookieParser())




import userRoute from './src/routes/user.routes.js'
import todoRoute from "./src/routes/todo.routes.js"


app.use('/users', userRoute)
app.use('/todo', todoRoute)



export {app}      