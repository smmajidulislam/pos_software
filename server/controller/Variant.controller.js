const Variant = require("../models/variantModel");

// 📥 Create Variant
const createVariant = async (req, res) => {
  try {
    const { variant, values, pos } = req.body;

    if (!variant || !values || !pos) {
      return res.status(400).json({ message: "All fields are required" });
    }

    const newVariant = new Variant({ variant, values, pos });
    await newVariant.save();
    res
      .status(201)
      .json({ message: "Variant created successfully", newVariant });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// 📃 Get All Variants (optional pos filter)
const getVariants = async (req, res) => {
  try {
    const { pos, search, status, date, sort } = req.query;
    let filter = {};

    // Filter by POS ID
    if (pos) {
      filter.pos = pos;
    }

    // Filter by status
    if (status) {
      filter.status = status;
    }

    // Search by name or any field (you can change this to another field like 'title')
    if (search) {
      filter.name = { $regex: search, $options: "i" };
    }

    // Filter by date (assuming it's a single day string like '2025-07-18')
    if (date) {
      const start = new Date(date);
      const end = new Date(date);
      end.setDate(end.getDate() + 1); // end of day
      filter.createdAt = { $gte: start, $lt: end };
    }

    // Sort logic
    let sortOption = { createdAt: -1 }; // default Newest

    if (sort === "oldest") {
      sortOption = { createdAt: 1 };
    } else if (sort === "name-asc") {
      sortOption = { name: 1 };
    } else if (sort === "name-desc") {
      sortOption = { name: -1 };
    }

    const variants = await Variant.find(filter).sort(sortOption);

    res.status(200).json({
      message: "Variants fetched successfully",
      variants,
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// 🔍 Get Single Variant by ID
const getVariantById = async (req, res) => {
  try {
    const variant = await Variant.findById(req.params.id);

    if (!variant) {
      return res.status(404).json({ message: "Variant not found" });
    }

    res.status(200).json({ message: "Variant fetched successfully", variant });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// ✏️ Update Variant
const updateVariant = async (req, res) => {
  try {
    const { variant, values, status } = req.body;
    const updatedVariant = await Variant.findByIdAndUpdate(
      req.params.id,
      { variant, values, status },
      { new: true }
    );

    if (!updatedVariant) {
      return res.status(404).json({ message: "Variant not found" });
    }

    res.status(200).json({
      message: "Variant updated successfully",
      updatedVariant,
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// ❌ Delete Variant
const deleteVariant = async (req, res) => {
  console.log(req.params.id);
  try {
    const deleted = await Variant.findByIdAndDelete(req.params.id);

    if (!deleted) {
      return res.status(404).json({ message: "Variant not found" });
    }

    res.status(200).json({ message: "Variant deleted successfully" });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

module.exports = {
  createVariant,
  getVariants,
  getVariantById,
  updateVariant,
  deleteVariant,
};
