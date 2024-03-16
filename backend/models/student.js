const mongoose= require('mongoose');
const validator= require('validator')
const bcryptjs= require('bcryptjs')
const jwt= require('jsonwebtoken')
const crypto= require('crypto')
const myschema= mongoose.Schema({

    name :{
        type: String,
        required: [true ,'Please Enter Name'],
        maxLength :[ 15,'name cannot be bigger than 15'],
        minLength :[ 3,'name cannot be less than 3 characters'],
    },
    email :{
        type : String ,
        required: [true ,'Please Enter Name'],
        unique :[ true, 'This Email is already exits'],
        validate :[validator.isEmail ,'Please Enter valid Email']
    },
    password:{
        type : String ,
        required: [true ,'Please Enter Password'],
        minLength :[ 5,'password cannot be less than 5 characters'],
        select: false
    },
    avatar :{
        public_id : {type : String , required: false},
        secret_url: {type: String , required: false}
    },
    createdAt :{
        type: Date,
        default: Date.now
    }
,
resetPasswordToken : {type: String} ,
resetPasswordexpire :{ type: String}

})

myschema.pre('save',async function (next){
    if (!this.isModified('password')){
        next()
    }
    this.password= await bcryptjs.hash(this.password,10)
})

myschema.methods.getToken= async function() {
    const payload= {id: this._id, email: this.email}
    const token= jwt.sign(payload, process.env.SECRET_KEY, {expiresIn : Date.now()+ 2*24*60*60*1000})
    return  token
}

myschema.methods.verifyPassword= async function (password){
    const match= await bcryptjs.compare(password,this.password)
    return match
} ,

myschema.methods.getResetPasswordToken = async function (){
    const resetToken= crypto.randomBytes(20).toString("hex");
    this. resetPasswordToken= crypto
    .createHash("sha256")
    .update(resetToken)
    .digest("hex");

  this.resetPasswordexpire= Date.now() + 15*60*60*1000;
 return resetToken
}

module.exports= mongoose.model('students',myschema);