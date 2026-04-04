require("dotenv").config();
const express = require("express");
const mongoose = require("mongoose");
const cors = require("cors");

const app = express();

app.use(cors());
app.use(express.json());

const authRoutes = require("./routes/authRoutes");

app.use("/api/auth", authRoutes);

const userRoutes = require("./routes/userRoutes");

app.use("/api/users", userRoutes);

// DB Connection
mongoose.connect(process.env.MONGO_URI)
  .then(() => console.log("User DB Connected"))
  .catch(err => console.log(err));

app.get("/", (req, res) => {
  res.send("User Service Running");
});

app.listen(process.env.PORT, () => {
  console.log("Server running on port " + process.env.PORT);
});