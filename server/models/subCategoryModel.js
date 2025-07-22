const mongoose = require("mongoose");

const subCategorySchema = new mongoose.Schema(
  {
    parentCategory: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Category", // Reference to Category model
      required: true,
    },
    name: {
      type: String,
      required: true,
      trim: true,
    },

    code: {
      type: String,
      unique: true,
      required: true,
    },
    posId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Pos",
      required: true,
    },
    description: {
      type: String,
      trim: true,
    },
    status: {
      type: String,
      enum: ["active", "inactive"],
      default: "active",
    },
  },
  {
    timestamps: true,
  }
);

const SubCategory = mongoose.model("SubCategory", subCategorySchema);
module.exports = SubCategory;
