import dotenv from "dotenv";
dotenv.config();

import { transporter } from "../confiq/mail.js";

export const sendEmail = async (to, subject, html) => {

  try {

    console.log("SENDING EMAIL TO:", to);

    const info = await transporter.sendMail({

      from: `"JAYSHEEN STORE" <${process.env.SMTP_USER}>`,

      to,

      subject,

      html,

    });

    console.log("EMAIL SENT SUCCESSFULLY");
    console.log(info.response);

    return true;

  } catch (error) {

    console.log("EMAIL ERROR");
    console.log(error);

    return false;
  }

};