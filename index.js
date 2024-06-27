import {app} from './app.js'
import dotenv from 'dotenv'
import connectDB from './src/db/index.js'

;dotenv.config({
    path: './.env'
})


connectDB()
.then( () => {
    app.listen(5000, () => {
        console.log("server is also running at port :",5000)
    })
})
.catch( (error) => {
    console.log("unable to connect to server :",error)
})

