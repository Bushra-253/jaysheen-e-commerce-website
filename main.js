import dotenv from "dotenv";
dotenv.config();
import express from 'express'
import product from './routes/product.js';
import mongoose from 'mongoose';
import multer from "multer";
import cors from 'cors';
import session from "express-session";
import FileStoreFactory from "session-file-store";
import cart from "./routes/cart.js";
import mailroutes from './routes/mailRoutes.js';


import path from "path";
import checkout from './routes/checkout.js';

const app = express();


app.use(express.json());
app.use(express.urlencoded({ extended: true }));
const FileStore = FileStoreFactory(session);

app.use(
  session({
    store: new FileStore({
      path: "./sessions",

      retries: 0,

      ttl: 1800, // 30 minutes in seconds

      reapInterval: 60 // check every 60 sec and delete expired files
    }),

    secret: "mySecretKey",

    resave: false,

    saveUninitialized: false,

    cookie: {
  maxAge: 1000 * 60 * 30,
  httpOnly: true,
  secure: false,
  sameSite: "lax"
}
  })
);
app.use(cors({
    origin: 'http://localhost:5173',
    credentials: true
}))



// Initialize session data



app.get('/',(req,res)=>{
 res.send('hello')
})




app.use('/Product',product)
app.use('/cart',cart)
app.use('/checkout',checkout)


app.use("/uploads", express.static("uploads"));

app.listen(5001, () => {
    console.log('Server is running on port 5001');
});

mongoose.connect('mongodb://localhost:27017/product').then(()=>{
    console.log('mongodb connect successfully')
})
