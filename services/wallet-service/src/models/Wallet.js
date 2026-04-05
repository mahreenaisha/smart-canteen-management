import mongoose from "mongoose";

const walletSchema = new mongoose.Schema(
  {
    studentId: {
      type: String,
      required: true,
      unique: true
    },
    balance: {
      type: Number,
      required: true,
      default: 0
    }
  },
  { timestamps: true }
);

const Wallet = mongoose.model("Wallet", walletSchema);

export default Wallet;