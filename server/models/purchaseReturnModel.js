const mongoose = require("mongoose");

const purchaseReturnSchema = new mongoose.Schema(
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
      enum: ["pending", "received"],
      default: "pending",
    },
    pos: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Pos",
      required: true,
    },
    date: {
      type: Date,
      default: Date.now,
    },
  },
  { timestamps: true }
);

module.exports =
  mongoose.models.PurchaseReturn ||
  mongoose.model("PurchaseReturn", purchaseReturnSchema);
