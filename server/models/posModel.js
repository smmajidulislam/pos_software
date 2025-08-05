const mongoose = require("mongoose");

const PosSchema = new mongoose.Schema(
  {
    value: {
      type: String,
    },
    label: {
      type: String,
    },

    admin: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
    salesmans: [
      {
        type: mongoose.Schema.Types.ObjectId,
        ref: "User", // Salesman reference
      },
    ],
  },
  {
    timestamps: true,
  }
);

const Pos = mongoose.models.Pos || mongoose.model("Pos", PosSchema);
module.exports = Pos;
