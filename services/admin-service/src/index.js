require("dotenv").config();
const mongoose = require("mongoose");

const app = require("./app");

mongoose.connect(process.env.MONGO_URI)
  .then(() => console.log("Admin DB connected"));

app.listen(process.env.PORT, () => {
  console.log(`Admin Service running on ${process.env.PORT}`);
});