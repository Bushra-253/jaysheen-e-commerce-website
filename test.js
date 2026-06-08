import mongoose from "mongoose";

mongoose
  .connect(
    "mongodb+srv://nbushranoor520_db_user:amqBlzX6XlkON1a5@cluster0.vc6roq0.mongodb.net/product?retryWrites=true&w=majority&appName=Cluster0"
  )
  .then(() => {
    console.log("MongoDB Connected");
    process.exit(0);
  })
  .catch((err) => {
    console.error(err);
    process.exit(1);
  });