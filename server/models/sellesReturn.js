const mongoose = require("mongoose");

const selesReturnSchema = new mongoose.Schema(
  {
    reference: {
      type: String,
      required: true,
    },
    product: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Product",
      required: true,
    },
    customer: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
    },
    pos: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Order",
      required: true,
    },
    quantity: {
      type: Number,
      required: true,
    },
    unitPrice: {
      type: Number,
      required: true,
    },
    discountPerUnit: {
      type: Number,
      default: 0,
    },
    totalDiscount: {
      type: Number,
      default: 0,
    },
    totalAmount: {
      type: Number,
      required: true,
    },
    payment: {
      type: Number,
      default: 0,
    },
    due: {
      type: Number,
      default: 0,
    },
    status: {
      type: String,
      enum: ["received", "pending"],
      required: true,
    },
  },
  {
    timestamps: true,
  }
);

const selesReturn = mongoose.model("selesReturn", selesReturnSchema);
module.exports = selesReturn;
