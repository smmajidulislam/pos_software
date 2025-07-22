const jwt = require("jsonwebtoken");
const User = require("../models/userModel");
const bcrypt = require("bcryptjs");
require("dotenv").config();

const signUp = async (req, res) => {
  try {
    const { name, email, password } = req.body;
    console.log(name, email, password);

    const isExist = await User.findOne({ email });
    if (isExist) {
      return res.status(400).json({ message: "User already exists" });
    }

    const hashedPassword = await bcrypt.hash(password, 10);

    const newUser = new User({ email, password: hashedPassword, name });
    await newUser.save();
    const user = {
      _id: newUser._id,
      name: newUser.name,
      email: newUser.email,
      role: newUser.role,
    };

    return res.status(201).json({ message: "Signup successful", user });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Signup failed" });
  }
};
const login = async (req, res) => {
  try {
    const { email, password, remember } = req.body;

    const findUser = await User.findOne({ email });
    if (!findUser) {
      return res.status(400).json({ message: "User not found" });
    }

    const isMatch = await bcrypt.compare(password, findUser.password);
    if (!isMatch) {
      return res.status(400).json({ message: "Invalid credentials" });
    }

    // Cookie duration
    const expiresIn = remember ? "365d" : "1d";
    const maxAge = remember ? 365 * 24 * 60 * 60 * 1000 : 24 * 60 * 60 * 1000;

    const token = jwt.sign(
      { id: findUser._id, role: findUser.role },
      process.env.JWT_SECRET,
      { expiresIn }
    );

    res.cookie("token", token, {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      sameSite: process.env.NODE_ENV === "production" ? "None" : "Lax",
      maxAge,
    });

    const user = {
      _id: findUser._id,
      name: findUser.name,
      email: findUser.email,
      role: findUser.role,
    };

    res.status(200).json({ message: "Login successful", user, token });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Login failed" });
  }
};

const logout = async (req, res) => {
  res.clearCookie("token");
  res.status(200).json({ message: "Logout successful" });
};
module.exports = {
  signUp,
  login,
  logout,
};
