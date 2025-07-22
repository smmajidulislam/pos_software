const mongoose = require("mongoose");

const wareHouseSchema = new mongoose.Schema(
  {
    value: {
      type: String,
    },
    label: {
      type: String,
    },
    pos: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Pos",
      required: true,
    },
  },
  {
    timestamps: true,
  }
);

const WareHouse =
  mongoose.models.WareHouse || mongoose.model("WareHouse", wareHouseSchema);
module.exports = WareHouse;
