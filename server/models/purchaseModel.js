const mongoose = require("mongoose");

const purchaseSchema = new mongoose.Schema(
  {
    supplier: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
    product: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Product",
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
    grandTotal: {
      type: Number,
      default: 0,
    },
    pos: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Pos",
      required: true,
    },
    status: {
      type: String,
      enum: ["pending", "received", "cancelled"],
      default: "pending",
    },
    reference: {
      type: String,
      unique: true,
    },
    date: {
      type: Date,
      default: Date.now,
    },
  },
  { timestamps: true }
);

purchaseSchema.pre("save", async function (next) {
  if (!this.reference) {
    const random = Math.floor(100000 + Math.random() * 900000);
    this.reference = `REF-${random}`;
  }
  next();
});

module.exports =
  mongoose.models.Purchase || mongoose.model("Purchase", purchaseSchema);
