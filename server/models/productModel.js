const mongoose = require("mongoose");
const productSchema = new mongoose.Schema(
  {
    productName: { type: String, required: true },
    slug: { type: String },
    isVariantProduct: { type: Boolean, default: false },

    // Variants support
    variants: [
      {
        attributes: mongoose.Schema.Types.Mixed,
        sku: String,
        itemCode: String,
        quantity: Number,
        buyPrice: Number,
        salesPrice: Number,
        barcodeSymbology: String,
        images: [String],
      },
    ],

    sku: { type: String },
    itemCode: { type: String },
    quantity: { type: Number },
    parchacePrice: { type: Number },
    price: { type: Number },

    description: { type: String, maxlength: 60 },
    category: { type: mongoose.Schema.Types.ObjectId, ref: "Category" },
    subCategory: { type: mongoose.Schema.Types.ObjectId, ref: "Category" },
    subSubCategory: { type: mongoose.Schema.Types.ObjectId, ref: "Category" },
    brand: { type: mongoose.Schema.Types.ObjectId, ref: "Brand" },
    unit: { type: mongoose.Schema.Types.ObjectId, ref: "Unit" },

    discountType: {
      type: String,
      enum: ["percentage", "flat", "none", "cash"],
      default: "none",
    },
    stock: { type: Number, default: 0 },
    discountValue: { type: Number, default: 0 },
    reference: { type: String, required: true },
    taxType: {
      type: String,
      enum: ["salesTax", "exclusive"],
    },
    taxValue: { type: Number, default: 0 },

    images: [
      {
        url: { type: String, required: true },
      },
    ],

    // Additional fields you have in data
    expiry: { type: Boolean, default: false },
    expiryDate: { type: Date },
    manufactureDate: { type: Date },
    manufacturer: { type: Boolean, default: false },
    parchacePrice: { type: Number },
    sellingType: { type: String }, // optional enum if fixed values
    quantityAlert: { type: Number },
    store: { type: mongoose.Schema.Types.ObjectId, ref: "pos" },
    variantAttribute: { type: String },
    variantValues: { type: String },
    warranties: { type: Boolean, default: false },
    warehouse: { type: mongoose.Schema.Types.ObjectId, ref: "Warehouse" },
  },
  { timestamps: true }
);

const Product =
  mongoose.models.Product || mongoose.model("Product", productSchema);
module.exports = Product;
