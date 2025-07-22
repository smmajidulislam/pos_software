const Pos = require("../models/posModel");

const createPos = async (req, res) => {
  try {
    const { value, label, admin } = req.body;
    const pos = await Pos.create({ value, label, admin });
    return res.status(201).json(pos);
  } catch (error) {
    return res.status(500).json({ message: error.message });
  }
};
const getPos = async (req, res) => {
  try {
    const { id } = req.params;
    const pos = await Pos.findById(id);
    return res.status(200).json(pos);
  } catch (error) {
    return res.status(500).json({ message: error.message });
  }
};
const getAllPos = async (req, res) => {
  try {
    const pos = await Pos.find();
    return res.status(200).json(pos);
  } catch (error) {
    return res.status(500).json({ message: error.message });
  }
};
const updatePos = async (req, res) => {
  try {
    const { id } = req.params;
    const { value, label } = req.body;
    const pos = await Pos.findByIdAndUpdate(
      id,
      { value, label },
      { new: true }
    );
    return res.status(200).json(pos);
  } catch (error) {
    return res.status(500).json({ message: error.message });
  }
};
const deletePos = async (req, res) => {
  try {
    const { id } = req.params;
    const pos = await Pos.findByIdAndDelete(id);
    return res.status(200).json(pos);
  } catch (error) {
    return res.status(500).json({ message: error.message });
  }
};

module.exports = { createPos, deletePos, updatePos, getPos, getAllPos };
