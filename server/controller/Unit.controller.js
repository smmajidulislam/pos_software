const Unit = require("../models/unitModel");
const Product = require("../models/productModel");

// ✅ Create Unit
exports.createUnit = async (req, res) => {
  try {
    const { name, shortName, pos, status } = req.body;
    if (!shortName && !status) {
      const newUnit = new Unit({ name, pos });
      await newUnit.save();
      res.status(201).json({
        message: "Unit created successfully.",
        data: newUnit,
      });
    } else {
      const newUnit = new Unit({ name, shortName, pos, status });
      await newUnit.save();
      res.status(201).json({
        message: "Unit created successfully.",
        data: newUnit,
      });
    }
  } catch (error) {
    res
      .status(500)
      .json({ message: "Failed to create unit.", error: error.message });
  }
};

// ✅ Get All Units (optional filter by pos)
exports.getAllUnits = async (req, res) => {
  try {
    const { posId, unitName, status, time, search, newest, oldest } = req.query;

    // Filter অবজেক্ট বানানো
    const filter = {};

    if (posId) filter.pos = posId;
    if (unitName) filter._id = unitName; // case-insensitive match
    if (status) filter.status = status;
    if (search) {
      // Search যেকোন field এ লাগাতে পারো, যেমন name বা shortName
      filter.$or = [
        { name: { $regex: search, $options: "i" } },
        { shortName: { $regex: search, $options: "i" } },
      ];
    }

    if (time) {
      // time যদি date string হয়, সেটাকে filter করা যাবে createdAt এর জন্য
      // ধরে নিচ্ছি time একটা date string, filter হবে ঐ তারিখের জন্য
      const date = new Date(time);
      const nextDate = new Date(date);
      nextDate.setDate(nextDate.getDate() + 1);

      filter.createdAt = { $gte: date, $lt: nextDate };
    }

    // Sort অবজেক্ট বানানো
    let sortOption = { createdAt: -1 }; // default newest first

    if (newest === "newest") sortOption = { createdAt: -1 };
    else if (oldest === "oldest") sortOption = { createdAt: 1 };

    const units = await Unit.find(filter).sort(sortOption);

    // Count products for each unit
    const unitsWithProductCount = await Promise.all(
      units.map(async (unit) => {
        const productCount = await Product.countDocuments({ unit: unit._id });
        return {
          ...unit.toObject(),
          noOfProducts: productCount,
        };
      })
    );

    res.status(200).json({
      message: "Units fetched successfully.",
      data: unitsWithProductCount,
    });
  } catch (error) {
    res
      .status(500)
      .json({ message: "Failed to fetch units.", error: error.message });
  }
};

// ✅ Get Single Unit by ID
exports.getUnitById = async (req, res) => {
  try {
    const unit = await Unit.findById(req.params.id);

    if (!unit) {
      return res.status(404).json({ message: "Unit not found." });
    }

    res.status(200).json({
      message: "Unit fetched successfully.",
      data: unit,
    });
  } catch (error) {
    res
      .status(500)
      .json({ message: "Failed to fetch unit.", error: error.message });
  }
};

// ✅ Update Unit
exports.updateUnit = async (req, res) => {
  try {
    const updatedUnit = await Unit.findByIdAndUpdate(req.params.id, req.body, {
      new: true,
      runValidators: true,
    });

    if (!updatedUnit) {
      return res.status(404).json({ message: "Unit not found." });
    }

    res.status(200).json({
      message: "Unit updated successfully.",
      data: updatedUnit,
    });
  } catch (error) {
    res
      .status(500)
      .json({ message: "Failed to update unit.", error: error.message });
  }
};

// ✅ Delete Unit
exports.deleteUnit = async (req, res) => {
  try {
    const deletedUnit = await Unit.findByIdAndDelete(req.params.id);

    if (!deletedUnit) {
      return res.status(404).json({ message: "Unit not found." });
    }

    res.status(200).json({ message: "Unit deleted successfully." });
  } catch (error) {
    res
      .status(500)
      .json({ message: "Failed to delete unit.", error: error.message });
  }
};
