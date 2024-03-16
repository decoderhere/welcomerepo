const express= require('express');
const bodyParser= require('body-parser')
const cookieParser= require('cookie-parser');
const router = require('./routes/student');
const fileupload= require('express-fileupload')
const errorMiddleware= require ('./utils/error')
const cors= require('cors')
require('dotenv').config();

const app= express();

// app.get("/sanjeev",(req,res)=>{
//     res.sendFile(__dirname+ '/' + 'public'+'/'+'hello.html')
// })

app.use(express.static('public'))
app.use(bodyParser.urlencoded({extended:true}))
app.use(bodyParser.json());
app.use(cookieParser())
app.use(cors())
app.use(fileupload())
app.use('/sanjeev',router);
app.use(errorMiddleware)


module.exports= app;