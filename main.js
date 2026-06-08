import dotenv from "dotenv";
dotenv.config();

import express from "express";
import mongoose from "mongoose";
import cors from "cors";
import session from "express-session";
import FileStoreFactory from "session-file-store";

import product from "./routes/product.js";
import cart from "./routes/cart.js";
import checkout from "./routes/checkout.js";

const app = express();

app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// CORS
app.use(
  cors({
    origin: [
      "http://localhost:5173",
      "https://jaysheen-purse-store.vercel.app",
    ],
    credentials: true,
  })
);

// Session
const FileStore = FileStoreFactory(session);

app.use(
  session({
    store: new FileStore({
      path: "./sessions",
      retries: 0,
      ttl: 1800,
      reapInterval: 60,
    }),
    secret: "mySecretKey",
    resave: false,
    saveUninitialized: false,
    cookie: {
      maxAge: 1000 * 60 * 30,
      httpOnly: true,
      secure: false,
      sameSite: "lax",
    },
  })
);

// Routes
app.get("/", (req, res) => {
  res.send("hello");
});

app.use("/product", product);
app.use("/cart", cart);
app.use("/checkout", checkout);

app.use("/uploads", express.static("uploads"));
console.log(process.env.MONGO_URI);
// MongoDB Connection
const connectDB = async () => {
  try {
    await mongoose.connect(
      process.env.MONGO_URI
    );

    console.log("MongoDB connected successfully");
  } catch (error) {
    console.error("MongoDB connection failed:", error);
    process.exit(1);
  }
};

// Start Server
const startServer = async () => {
  await connectDB();

  app.listen(process.env.PORT || 5001, () => {
    console.log(`Server running on port ${process.env.PORT || 5001}`);
  });
};

startServer();