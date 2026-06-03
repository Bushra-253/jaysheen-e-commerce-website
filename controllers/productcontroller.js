import Product from '../models/product.js'
import path from "path";
import fs from "fs";

import { fileURLToPath } from "url";

export const store = async (req, res) => {

  try {
console.log(req.files)
    // Get all uploaded image names
    const images =  req.files.map(file => file.filename)
      ;
      console.log(images)

    const product = new Product({

      category: req.body.category,
      name: req.body.name,
      price: req.body.price,
      description: req.body.description,

      // Save images array
      images: images
    });

    await product.save();

    res.status(200).json({
      message: "Product saved successfully",
      data: product
    });

  } catch (error) {

    res.status(500).json({
      message: "Error storing product",
      error: error.message
    });

  }

};



export const list = async (req, res) => {

        const data = await Product.find();

        res.status(201).json({
            message: "Data fetch successfully",
            data: data
        });
    
};



const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

export const deletedata = async (req, res) => {

  try {

    const { id } = req.params;

    const data = await Product.findById(id);

    if (!data) {
      return res.status(404).json({
        message: "Product not found"
      });
    }

  if (data.images?.length > 0) {

  const images = data.images.flat();

  images.forEach((img) => {

    const imgfile = path.join(
      __dirname,
      "../uploads",
      img
    );

    if (fs.existsSync(imgfile)) {
      fs.unlinkSync(imgfile);
    }

  });

}

    await Product.findByIdAndDelete(id);

    res.status(200).json({
      message: "Data deleted successfully"
    });

  } catch (error) {

    res.status(500).json({
      message: "Error deleting data",
      error: error.message
    });

  }

};

export const edit = async (req, res) => {
  try {
    const { id } = req.params;

    const data = await Product.findById(id);

    if (!data) {
      return res.status(404).json({
        message: "Product not found"
      });
    }

    res.status(200).json({
      message: "Product fetched successfully",
      data: data
    });

  } catch (error) {
    res.status(500).json({
      message: "Error fetching product",
      error: error.message
    });
    console.log(error)
  }
};


export const update = async (req, res) => {
  try {
    const { id } = req.params;

    const product = await Product.findById(id);

    if (!product) {
      return res.status(404).json({
        message: "Product not found",
      });
    }

    // New images uploaded
    if (req.files && req.files.length > 0) {

      // Flatten all nested arrays
      const oldImages = product.images?.flat(Infinity) || [];

      // Delete old images
      oldImages.forEach((img) => {

        const oldImagePath = path.join(
          __dirname,
          "../uploads",
          img
        );

        try {
          if (fs.existsSync(oldImagePath)) {
            fs.unlinkSync(oldImagePath);
          }
        } catch (err) {
          console.log("Image delete error:", err.message);
        }

      });

      // Save new images
      const newImages = req.files.map(
        (file) => file.filename
      );

      // Match your current database structure
      product.images = [[newImages]];
    }

    product.category =
      req.body.category ?? product.category;

    product.name =
      req.body.name ?? product.name;

    product.price =
      req.body.price ?? product.price;

    product.description =
      req.body.description ?? product.description;

    await product.save();

    res.status(200).json({
      message: "Product updated successfully",
      data: product,
    });

  } catch (error) {

    res.status(500).json({
      message: "Error updating product",
      error: error.message,
    });

  }
};