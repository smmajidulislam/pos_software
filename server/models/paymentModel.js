const mongoose = require("mongoose");

const paymentSchema = new mongoose.Schema(
  {
    orderId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Order",
      required: true,
    },
    paymentAmount: {
      type: Number,
      required: true,
    },
    pos: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Pos",
    },
    paymentDate: {
      type: Date,
      default: Date.now,
    },
    method: {
      type: String,
      enum: ["Cash", "Card", "Bkash", "Nagad", "Others"],
      default: "Cash",
    },
    note: String,
  },
  { timestamps: true }
);

module.exports = mongoose.model("Payment", paymentSchema);

const Payment =
  mongoose.models.Payment || mongoose.model("Payment", paymentSchema);
module.exports = Payment;
