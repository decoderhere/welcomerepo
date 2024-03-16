const nodeMailer = require("nodemailer");
const errorHandler = require("./errorHandler");

const sendMail= async(email,subject,text,next)=>{

const transport = nodeMailer.createTransport({
  host: "smtp.gmail.com",
  port: 465,
  service: 'gmail' ,
  auth: {
    user: "sanjeeviitd2016@gmail.com",
    pass: "San@1234",
  },
});

const mailOption = {
    to : email ,
    from : "sanjeeviitd2016@gmail.com" ,
    subject : subject,
    text
}


await transport.sendMail(mailOption,(err)=>{
    if(err){
        console.log(err)
    }
    else{
    console.log("Mail has been sent")
    }
})
}

module.exports= sendMail;