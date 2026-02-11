 const transporter = require("../config/nodemailer");
const sendEmail = async (email,template)=>{

    
try {
    const mailOptions = {
        from:process.env.AUTH_EMAIL,
        to:email,
        subject:"Verfiy your email",
        html:template
    } 

     await  transporter.sendMail(mailOptions);

} 
catch (error) {
    throw error
}
}

module.exports = sendEmail;