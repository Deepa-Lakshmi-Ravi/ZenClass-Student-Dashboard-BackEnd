const express = require("express");
const dotenv = require("dotenv");
const mongoose = require("mongoose");
const cors = require("cors");

//getting router
const AppRouter = require("./routers/router");

dotenv.config();
const app = express();

app.use(cors());
app.use(express.json());

//Connection DB

mongoose
  .connect(`${process.env.DB_URL}`)
  .then(() => {
    console.log("Connected to Database");
  })
  .catch((err) => {
    console.error("Error connecting to Database");
  });

app.use(AppRouter);

app.use("/", (req, res) => {
  res.send("Welcome to the Server");
});

//Start the Server

const PORT = process.env.PORT || 5000;

app.listen(PORT, () => {
  console.log("Server started at", +PORT);
});
