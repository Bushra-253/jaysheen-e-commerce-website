import mongoose from "mongoose";

const checkoutSchema = new mongoose.Schema(  {
    name: {
      type: String,
      required: true
    },

    email: {
      type: String,
      required: true
    },

    phone: {
      type: String,
      required: true
    },

    location: {
      type: String,
      required: true
    },

    products: [
      {
        name: String,
        image: String,
        price: Number,
        quantity: Number
      }
    ],

    totalPrice: {
      type: Number,
      default: 0
    },
    
    delieverycharges: {
      type: Number,
      default: 0
    },
    
    finalPrice: {
      type: Number,
      default: 0
    }
     ,status: {
      type: String,
      enum: ["Pending", "Completed", "Cancelled"],
      default: "Pending",
    },
  },
  {
    timestamps: true
  });

const Checkout = mongoose.model("Checkout", checkoutSchema);
export default Checkout;