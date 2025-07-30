const mongoose = require("mongoose");

const purchaseSchema = new mongoose.Schema(
  {
    supplier: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Supplier",
      required: true,
    },

    purchaseDate: {
      type: Date,
      default: Date.now,
    },
    quantity: {
      type: Number,
      required: true,
    },

    referenceNo: {
      type: String,
      unique: true,
    },

    products: [
      {
        product: {
          type: mongoose.Schema.Types.ObjectId,
          ref: "Product",
          required: true,
        },
        quantity: {
          type: Number,
          required: true,
        },
        purchasePrice: {
          type: Number,
          required: true,
        },
        discount: {
          type: Number,
          default: 0,
        },
        taxPercent: {
          type: Number,
          default: 0,
        },
        taxAmount: {
          type: Number,
          default: 0,
        },
        unitCost: {
          type: Number,
          default: 0,
        },
        totalCost: {
          type: Number,
          default: 0,
        },
      },
    ],

    orderTax: {
      type: Number,
      default: 0,
    },
    orderDiscount: {
      type: Number,
      default: 0,
    },
    shipping: {
      type: Number,
      default: 0,
    },

    status: {
      type: String,
      enum: ["pending", "received", "cancelled"],
      default: "pending",
    },

    notes: {
      type: String,
      maxlength: 300,
    },
  },
  { timestamps: true }
);

const Purchase =
  mongoose.models.Purchase || mongoose.model("Purchase", purchaseSchema);
module.exports = Purchase;
