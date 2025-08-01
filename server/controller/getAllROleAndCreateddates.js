// controllers/userRoleController.js
const User = require("../models/userModel");

const getAllRolesAndCreatedDates = async (req, res) => {
  try {
    const users = await User.find({}, "role createdAt"); // শুধু role আর createdAt পাঠাবো

    // UI-এর জন্য format ঠিক করা
    const data = users.map((user) => ({
      rolename: user.role,
      createdon: user.createdAt.toISOString().split("T")[0], // "YYYY-MM-DD" format
    }));

    return res.status(200).json({ data });
  } catch (error) {
    console.error("Error fetching roles:", error.message);
    return res
      .status(500)
      .json({ message: "Server Error", error: error.message });
  }
};

module.exports = {
  getAllRolesAndCreatedDates,
};
