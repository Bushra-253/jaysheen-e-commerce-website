import dotenv from "dotenv";
dotenv.config();

import nodemailer from "nodemailer";

console.log("HOST:", process.env.SMTP_HOST);
console.log("PORT:", process.env.SMTP_PORT);
console.log("USER:", process.env.SMTP_USER);

export const transporter = nodemailer.createTransport({
  host: process.env.SMTP_HOST,

  port: Number(process.env.SMTP_PORT),

  secure: false,

  auth: {
    user: process.env.SMTP_USER,
    pass: process.env.SMTP_PASS,
  },
});

// VERIFY CONNECTION
transporter.verify((error, success) => {

  if (error) {
    console.log("MAIL ERROR");
    console.log(error);
  } 
  
  else {
    console.log("MAIL SERVER IS READY");
  }

});