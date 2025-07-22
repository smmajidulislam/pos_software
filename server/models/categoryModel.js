const mongoose = require("mongoose");

const categorySchema = new mongoose.Schema(
  {
    name: { type: String, required: true, trim: true },
    slug: { type: String },
    code: { type: String, trim: true },
    description: { type: String, trim: true },
    posid: { type: mongoose.Schema.Types.ObjectId, ref: "Pos", required: true },
    parent: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Category",
      default: null,
    },

    type: {
      type: String,
      enum: ["main", "sub", "sub-sub"],
      required: true,
    },

    status: {
      type: String,
      enum: ["active", "inactive"],
      default: "active",
    },
  },
  { timestamps: true }
);

const Category =
  mongoose.models.Category || mongoose.model("Category", categorySchema);

module.exports = Category;
