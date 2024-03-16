const cloudinary = require("cloudinary");
const student = require("../models/student");
const errorMiddleware = require("../utils/error");
const errorHandler = require("../utils/errorHandler");
const asyncawaiterror = require("../utils/asyncawaiterror");
const sendtoken = require("../utils/sendtoken");
const sendMail = require("../utils/sendmail");
const crypto= require('crypto')
const { text } = require("body-parser");

const register = asyncawaiterror(async (req, res, next) => {
    
    // const cloud = await cloudinary.v2.uploader.upload(req.files.name
    //     , {
    //   folder: "avatars",
    //   width: 150,
    //   crop: "scale",
    // });
  const { name, email, password } = req.body;

  if (!name || !email || !password) {
    return next(new errorHandler("All fields required", 400));
  }
  const user = await student.create({
    name,
    email,
    password,
    // avatar: {
    //   public_id: cloud.public_id,
    //   secure_url: cloud.secure_url,
    // },
  });

  await user.save();

  if (user) {
    sendtoken(res, user, 201);
  } else {
    return next(new errorHandler("User cannot be created", 400));
  }
});

const login = asyncawaiterror(async (req, res, next) => {
  const { email, password } = req.body;

  const user = await student.findOne({ email }).select("+password");

  if (!user) {
    return next(new errorHandler("User does not find", 404));
  }
  const isMatch = await user.verifyPassword(password);

  if (!isMatch) {
    return next(new errorHandler("Password does not match", 403));
  }
  
  sendtoken(res, user, 200);
});




const getAllStudents = async (req, res, next) => {
  const users = await student.find();
  res.status(200).json({success: true, users: users});
};

const logout = (req, res, next) => {
  res
    .status(300)
    .cookie("token", null, { expire: Date.now(), httpOnly: true })
    .json({ message: "User has been logout successfullt" });
}

const forgotPassword =asyncawaiterror(async (req,res,next)=>{

    const {email}= req.body
    const user= await student.findOne({email})
    if (!user){
        return next(new errorHandler('User doesnt found',404))
    }
   
    const resetToken= await user.getResetPasswordToken() ;
    console.log("resetToken",resetToken)
    await user.save({ validateBeforeSave: false });

    // const HostUrl= process.env.FRONTEND_URL;
  const resetPasswordUrl = `${req.protocol}://${req.get(
    "host"
  )}/password/reset/${resetToken}`;
    const subject= "Reset Password Key"
    const text= `Here is your password key ${resetPasswordUrl} `
    
    try {
        // sendMail(email,subject,text,next);
        res.status(200).json({
            sucess: true,
            user,
            message: `email sent to ${email} successfully!`,
            
          });

    } catch (error) {
        user.resetPasswordToken= null 
        user.resetPasswordexpire =null 
        user.save( {validateBeforeSave: false})

        return next (new errorHandler( `There is ${error.message}  in sending mail`,400))
    }
})

const resetPassword = asyncawaiterror( async (req,res,next)=>{
    const resetToken1= req.params.resetToken ;
    const resettok= await crypto
    .createHash("sha256")
    .update(resetToken1)
    .digest("hex");
     console.log(resettok)
    const user= await student.findOne({
        resetPasswordToken: resettok
        }).select("+password");

    if (!user){
        return next(new errorHandler('token has been expired',404))
    }
    
    const {newPassword, repeatPass}= req.body

    if (newPassword != repeatPass){
        return next(new errorHandler('Password doesnot match'))
    }
    user.password= newPassword;
    user.resetPasswordToken=null,
    user.resetPasswordexpire= null;
    await user.save({validateBeforeSave:false})
    
    sendtoken(res,user,200);

})


const deleteUser= asyncawaiterror( async (req,res,next)=>{
    Email= req.params.email
    const user = student.findOne({email:Email})
    if(!user){
        return next(new errorHandler('User does not exist',400))
    }
    const rest= await student.deleteOne({email:Email})
    if (!rest.deletedCount){
        return next(new errorHandler('Could not delete the user'))
    }
    res.status(200).json({sucess:true, message:"User has been deleted Successfully"})

})

const updateUser= asyncawaiterror(async (req,res,next)=>{
 const email= req.query.email
const user= await student.findOne({email})
const {name}= req.body
if(!user){
  return next(new errorHandler('User does not exist',400))
}
 const decoded= await student.updateOne({email},{$set : {name}})
 if (!decoded.modifiedCount){
    return next(new errorHandler('Could not update the user'))
}
res.status(200).json({sucess:true, message:"User has been updated Successfully"})
})

module.exports = { register, login, logout, getAllStudents,forgotPassword,resetPassword,deleteUser,updateUser};
