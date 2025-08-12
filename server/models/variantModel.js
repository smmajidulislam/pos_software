const mongoose = require("mongoose");
const variantSchema = new mongoose.Schema(
  {
    variant: {
      type: String,
      required: true,
    },
    pos: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Pos",
      required: true,
    },
    values: {
      type: [String],
      required: true,
    },
    status: {
      type: String,
      enum: ["active", "inActive"],
    },
  },
  {
    timestamps: true,
  }
);

const Variant =
  mongoose.models.Variant || mongoose.model("Variant", variantSchema);
module.exports = Variant;
