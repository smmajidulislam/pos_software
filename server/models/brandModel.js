const mongoose = require("mongoose");

const brandSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: true,
    },
    logo: {
      type: String,
    },

    posId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Pos",
      required: true,
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

const Brand = mongoose.models.Brand || mongoose.model("Brand", brandSchema);
module.exports = Brand;
