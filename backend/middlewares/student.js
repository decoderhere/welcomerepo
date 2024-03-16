const jwt= require('jsonwebtoken');
const errorHandler = require('../utils/errorHandler');
const student = require('../models/student');
const auth = async (req,res,next)=>{

    const {token}= req.cookies ;
    if(!token) {
        return next(new errorHandler('Please login to excess',404))
    }
    const decodedData= await jwt.verify(token, process.env.SECRET_KEY)
    if (!decodedData){
        return next(new errorHandler('Please login to excess',404))
    }
    const user= await student.findOne({_id:decodedData.id})
    req.user= user ;
    next()
}
module.exports= auth