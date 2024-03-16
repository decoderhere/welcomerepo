const cloudinary= require('cloudinary')
const app= require('./app')


require('./config/database');

          
cloudinary.config({ 
  cloud_name: 'doz6wnpqr', 
  api_key: '972546547368998', 
  api_secret: 'DyftEMcDwyTM1fnlDbIq-LwZGn8' 
});

const server= app.listen(process.env.PORT,()=>{
    console.log(`server is running on ${process.env.PORT}`)
})

process.on("uncaughtException",(err)=>{
    console.log(`Error: ${err.message}`);
    // console.log("Sutting down the server due to uncaught exception");
   
        process.exit(1);
    
})

process.on('unhandledRejection',(err)=>{
    console.log('This cannot be handled',err)
    server.close(()=>{
        process.exit(1);
    });
})