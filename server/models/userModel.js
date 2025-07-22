const mongoose = require("mongoose");

const UserSchema = new mongoose.Schema(
  {
    role: {
      type: String,
      enum: ["customer", "salesman", "admin", "manager", "supplier"],
      required: true,
      default: "customer",
    },
    name: {
      type: String,
      required: true,
    },
    email: {
      type: String,
      required: function () {
        return this.role !== "customer";
      },
    },
    posId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Pos",
    },
    phone: {
      type: String,
    },
    address: {
      type: String,
    },
    password: {
      type: String,
      required: function () {
        return this.role !== "customer" && this.role !== "supplier";
      },
    },
    balance: {
      type: Number,
      default: 0,
    },
    salary: {
      type: Number,
    },
    status: {
      type: String,
      enum: ["active", "inactive"],
      default: "active",
    },
    dob: {
      type: Date,
    },
    shift: {
      type: String,
      enum: ["day", "night"],
      default: "day",
    },
    image: {
      type: String,
    },
    description: {
      type: String,
    },
    createdAt: {
      type: Date,
      default: Date.now,
    },
  },
  {
    timestamps: true,
  }
);

const User = mongoose.models.User || mongoose.model("User", UserSchema);
module.exports = User;
