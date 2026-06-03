import express from 'express'

const cart = express.Router();





cart.post("/store", (req, res) => {
  try {
    const { name, image, price, description, quantity } = req.body;
console.log(req.body)
    // Create cart session if not exists
    if (!req.session.cart) {
      req.session.cart = [];
    }

    // Check if product already exists
    const existingProduct = req.session.cart.find(
      (item) => item.name === name
    );

    if (existingProduct) {
      existingProduct.quantity += Number(quantity);

      return res.status(200).json({
        success: true,
        message: "Quantity updated in cart",
        data: req.session.cart,
      });
    }

    // Add new product
    const cartItem = {
      name,
      image,
      price,
      description,
      quantity: Number(quantity),
    };

    req.session.cart.push(cartItem);

    res.status(201).json({
      success: true,
      message: "Product added to cart",
      data: req.session.cart,
    });

  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
});

// GET CART ITEMS
// GET route to fetch all items in the cart
// GET CART ITEMS
cart.get("/list", (req, res) => {
  try {

    // If cart does not exist, make it an empty array
    const cartList = req.session.cart || [];

    res.status(200).json({
      success: true,
      message: "Cart items retrieved successfully",
      count: cartList.length,
      data: cartList,
    });

  } catch (error) {
    res.status(500).json({
      success: false,
      message: "Failed to retrieve cart items",
      error: error.message,
    });
  }
});

cart.delete("/delete", (req, res) => {
  try {
    const { name } = req.body;

    // 1. Check if the cart session even exists or is empty
    if (!req.session.cart || req.session.cart.length === 0) {
      return res.status(400).json({
        success: false,
        message: "Cart is already empty",
      });
    }

    // 2. Check if the product actually exists in the cart
    const productExists = req.session.cart.some((item) => item.name === name);

    if (!productExists) {
      return res.status(404).json({
        success: false,
        message: "Product not found in cart",
      });
    }

    // 3. Filter out the product to delete it
    req.session.cart = req.session.cart.filter((item) => item.name !== name);

    // 4. Return the updated cart data back to React
    res.status(200).json({
      success: true,
      message: "Product removed from cart",
      data: req.session.cart,
    });

  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
});

export default cart;