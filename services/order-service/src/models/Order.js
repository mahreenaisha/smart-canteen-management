const mongoose = require("mongoose");

const orderSchema = new mongoose.Schema(
  {
    orderId: {
      type: String,
      required: true,
      unique: true
    },

    studentId: {
      type: String,
      required: true
    },

    email: {
      type: String,
      required: true
    },

    items: [
      {
        name: {
          type: String,
          required: true
        },
        price: {
          type: Number,
          required: true
        },
        qty: {
          type: Number,
          required: true
        }
      }
    ],

    total: {
      type: Number,
      required: true
    },

    status: {
      type: String,
      enum: ["PLACED", "READY", "CANCELLED"],
      default: "PLACED"
    }
  },
  {
    timestamps: true
  }
);

module.exports = mongoose.model("Order", orderSchema);