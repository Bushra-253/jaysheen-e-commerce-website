import express from "express";

const cart = express.Router();

cart.post("/store", (req, res) => {
  try {
    console.log("SESSION ID:", req.sessionID);
    console.log("BODY:", req.body);

    const { name, image, price, description, quantity } = req.body;

    if (!req.session.cart) {
      req.session.cart = [];
    }

    const existingProduct = req.session.cart.find(
      (item) => item.name === name
    );

    if (existingProduct) {
      existingProduct.quantity += Number(quantity);

      req.session.save((err) => {
        if (err) {
          return res.status(500).json({
            success: false,
            message: err.message,
          });
        }

        return res.status(200).json({
          success: true,
          message: "Quantity updated",
          data: req.session.cart,
        });
      });

      return;
    }

    req.session.cart.push({
      name,
      image,
      price,
      description,
      quantity: Number(quantity),
    });

    req.session.save((err) => {
      if (err) {
        return res.status(500).json({
          success: false,
          message: err.message,
        });
      }

      res.status(201).json({
        success: true,
        message: "Product added",
        data: req.session.cart,
      });
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
});

cart.get("/list", (req, res) => {
  console.log("SESSION ID:", req.sessionID);
  console.log("CART:", req.session.cart);

  res.status(200).json({
    success: true,
    data: req.session.cart || [],
  });
});

cart.delete("/delete", (req, res) => {
  try {
    const { name } = req.body;

    if (!req.session.cart) {
      return res.status(400).json({
        success: false,
        message: "Cart empty",
      });
    }

    req.session.cart = req.session.cart.filter(
      (item) => item.name !== name
    );

    req.session.save((err) => {
      if (err) {
        return res.status(500).json({
          success: false,
          message: err.message,
        });
      }

      res.status(200).json({
        success: true,
        data: req.session.cart,
      });
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
});

export default cart;
