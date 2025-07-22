const mongoose = require("mongoose");

const unitSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: true,
      trim: true,
    },
    shortName: {
      type: String,
    },

    pos: {
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

const Unit = mongoose.models.Unit || mongoose.model("Unit", unitSchema);
module.exports = Unit;
