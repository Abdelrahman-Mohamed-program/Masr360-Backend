const nodemailer = require("nodemailer");

let transporter = nodemailer.createTransport({
    service:"gmail",
      auth: {
    user: process.env.AUTH_EMAIL,
    pass: process.env.AUTH_PASS, // app password (NO spaces)
  },
})

module.exports = transporter;