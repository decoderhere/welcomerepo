const ErrorHandler= require('../utils/errorHandler')

const errorMiddleware = (err,req,res,next)=> {
    console.log(err)
    const message= err.message || 'Internal Server Error'
    const code = err.statusCode || 500 ;

     
    
    if(err.code===11000){

        const message= `User Already exits because of Duplicate ${Object.values(err.keyValue)} ${ Object.keys(err.keyValue)} `
        err= new ErrorHandler(message,400)

    }

    if (err.name==='JsonWebTokenError'){
        const message= "Json web Toekn is invalid . try again"
        err= new ErrorHandler(message,400)
    }

    if(err.name ==='TokenExpiredError'){
        err= new ErrorHandler('Json web Token is expired,Plsease try again',400);
        
    }

    res.status(code).json({
        success: 'false',
        message: message 

}
    )
}
module.exports = errorMiddleware ;