const express = require("express");
const mongoose = require("mongoose");
const cors = require("cors");

const menuRoutes = require("./routes/menuRoutes");

const app = express();

app.use(cors());
app.use(express.json());

console.log("Loaded MONGO_URI:", process.env.MONGO_URI);
mongoose.connect(process.env.MONGO_URI,{family: 4})
  .then(() => console.log("MongoDB connected"))
  .catch(err => console.log(err));

app.use("/api/menu", menuRoutes);

module.exports = app;