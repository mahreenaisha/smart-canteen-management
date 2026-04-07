import express from "express";
import mongoose from "mongoose";
import dotenv from "dotenv";
import cors from "cors";

import walletRoutes from "./routes/walletRoutes.js";

dotenv.config();

const app = express();

app.use(cors());
app.use(express.json());

// DB connection
mongoose.connect(process.env.MONGO_URI)
  .then(() => console.log("Wallet DB connected"))
  .catch(err => console.log(err));

// Routes
app.use("/api/wallet", walletRoutes);

// Health check (optional but useful)
app.get("/", (req, res) => {
  res.send("Wallet Service Running");
});

// Start server
const PORT = process.env.PORT || 5005;

app.listen(PORT, () => {
  console.log(`Wallet Service running on port ${PORT}`);
});
