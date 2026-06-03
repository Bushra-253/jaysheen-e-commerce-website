import express from 'express'
import nodemailer from 'nodemailer'
import Checkout from '../models/checkout.js'
import { transporter } from '../confiq/mail.js';
import { sendEmail } from '../utils/sendemail.js';
const checkout = express.Router();





// 1. Configure the Nodemailer transporter
// If using Gmail, make sure to generate an "App Password" in your Google Account security settings.
checkout.post("/store", async (req, res) => {

  try {

    const {
      name,
      email,
      phone,
      location,
      products
    } = req.body;

    // VALIDATION
    if (!name || !email || !phone || !location) {

      return res.status(400).json({
        success: false,
        message: "All fields are required",
      });

    }

    // PRODUCTS VALIDATION
    if (!products || products.length === 0) {

      return res.status(400).json({
        success: false,
        message: "Products are required",
      });

    }

    // FIX IMAGE ARRAY ISSUE
    const updatedProducts = products.map((item) => ({

      ...item,

      image: Array.isArray(item.image)
        ? item.image[0]
        : item.image,

      quantity: Number(item.quantity),
      price: Number(item.price),

    }));

    // CALCULATE TOTAL PRICE
    const totalPrice = updatedProducts.reduce(
      (total, item) => {

        return total + (
          item.price * item.quantity
        );

      },
      0
    );

    // 5% delieverycharges
    const delieverycharges = 300;

    // FINAL PRICE
    const finalPrice = totalPrice + delieverycharges;

    // SAVE ORDER
    const checkout = new Checkout({

      name,
      email,
      phone,
      location,
      products: updatedProducts,

      totalPrice,
      delieverycharges,
      finalPrice,

    });

    await checkout.save();

    // PRODUCT ROWS FOR EMAIL
    const productRows = updatedProducts
      .map((item) => `

        <tr>

          <td
            style="
              padding:8px;
              border-bottom:1px solid #ddd;
            "
          >
            ${item.name || "Product"}
          </td>

          <td
            style="
              padding:8px;
              border-bottom:1px solid #ddd;
              text-align:center;
            "
          >
            ${item.quantity}
          </td>

          <td
            style="
              padding:8px;
              border-bottom:1px solid #ddd;
              text-align:right;
            "
          >
            Rs.
            ${(item.price * item.quantity).toFixed(2)}
          </td>

        </tr>

      `)
      .join("");

    // EMAIL HTML
    const emailHtml = `

      <div
        style="
          font-family:Arial,sans-serif;
          max-width:600px;
          margin:auto;
          padding:20px;
          border:1px solid #eee;
        "
      >

        <h2
          style="
            text-align:center;
            color:#333;
          "
        >
          Thank You For Your Order,
          ${name}!
        </h2>

        <p>

          We are processing your order
          and will deliver it to

          <strong>
            ${location}
          </strong>

        </p>

        <h3>
          Order Details:
        </h3>

        <table
          style="
            width:100%;
            border-collapse:collapse;
          "
        >

          <thead>

            <tr
              style="
                background:#f8f9fa;
              "
            >

              <th
                style="
                  padding:8px;
                  text-align:left;
                  border-bottom:2px solid #ddd;
                "
              >
                Item
              </th>

              <th
                style="
                  padding:8px;
                  text-align:center;
                  border-bottom:2px solid #ddd;
                "
              >
                Qty
              </th>

              <th
                style="
                  padding:8px;
                  text-align:right;
                  border-bottom:2px solid #ddd;
                "
              >
                Total
              </th>

            </tr>

          </thead>

          <tbody>

            ${productRows}

          </tbody>

        </table>

        <!-- PRICE SECTION -->

        <div
          style="
            margin-top:20px;
          "
        >

          <div
            style="
              display:flex;
              justify-content:space-between;
              margin-bottom:10px;
              font-size:16px;
            "
          >

            <span>
              Total Price:
            </span>

            <strong>
              Rs.
              ${totalPrice.toFixed(2)}
            </strong>

          </div>

          <div
            style="
              display:flex;
              justify-content:space-between;
              margin-bottom:10px;
              font-size:16px;
              color:green;
            "
          >

            <span>
              Delievery Charges :
            </span>

            <strong>
              + Rs.
              ${delieverycharges.toFixed(2)}
            </strong>

          </div>

          <div
            style="
              display:flex;
              justify-content:space-between;
              font-size:20px;
              font-weight:bold;
              color:#0d6efd;
              border-top:2px solid #ddd;
              padding-top:10px;
            "
          >

            <span>
              Final Price:
            </span>

            <span>
              Rs.
              ${finalPrice.toFixed(2)}
            </span>

          </div>

        </div>

        <hr
          style="
            margin-top:30px;
          "
        />

        <p
          style="
            font-size:12px;
            color:#777;
            text-align:center;
          "
        >
          If you have any questions,
          reply to this email or contact us.
        </p>

      </div>

    `;

    // SEND EMAIL
    await sendEmail(

      email,
      "Order Confirmation - JAYSHEEN STORE",
      emailHtml

    );

    // CLEAR CART SESSION
    req.session.cart = [];

    // SAVE SESSION
    req.session.save((err) => {

      if (err) {

        console.log(
          "Session save error:",
          err
        );

        return res.status(500).json({

          success: false,
          message: "Session error",

        });

      }

      return res.status(201).json({

        success: true,
        message: "Order placed successfully",

        data: checkout,

      });

    });

  } catch (error) {

    console.log("CHECKOUT ERROR");

    console.log(error);

    return res.status(500).json({

      success: false,
      message: error.message,

    });

  }

});

// GET checkout ITEMS
// GET route to fetch all items in the checkout
checkout.get("/get", async (req, res) => {
  try {
    const orders = await Checkout.find().sort({
      createdAt: -1,
    });

    res.json({
      success: true,
      data: orders,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
});

checkout.put("/status/:id", async (req, res) => {
  try {
    const { status } = req.body;

    const order = await Checkout.findByIdAndUpdate(
      req.params.id,
      { status },
      { new: true }
    );

    res.json({
      success: true,
      order,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
});


export default checkout;