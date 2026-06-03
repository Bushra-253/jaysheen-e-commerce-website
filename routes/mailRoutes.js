import express from "express";
import { sendEmail } from "../utils/sendemail.js";
const mailroutes = express.Router();

mailroutes.post("/send-mail", async (req, res) => {
  try {
    const { email, name } = req.body;

    await sendEmail(
      email,
      "Welcome!",
      `<h2>Hello ${name}</h2>
       <p>Welcome to our MERN app.</p>`
    );

    res.status(200).json({
      success: true,
      message: "Email sent successfully",
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
});
export default mailroutes;