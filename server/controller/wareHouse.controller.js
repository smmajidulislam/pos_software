const WareHouse = require("../models/warehouseModel");

// 🔹 Create Warehouse
exports.createWareHouse = async (req, res) => {
  try {
    const { value, label, pos } = req.body;

    const newWarehouse = new WareHouse({
      value,
      label,
      pos,
    });

    await newWarehouse.save();

    res.status(201).json({
      success: true,
      message: "Warehouse created",
      data: newWarehouse,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: "Failed to create",
      error: error.message,
    });
  }
};

// 🔹 Get All Warehouses (Optional: Filter by POS or Admin)
exports.getAllWareHouses = async (req, res) => {
  try {
    const { pos } = req.query;
    const query = {};
    if (pos) query.pos = pos;

    const warehouses = await WareHouse.find(query).populate("pos", "name");

    res.status(200).json({ success: true, data: warehouses });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: "Failed to fetch",
      error: error.message,
    });
  }
};

// 🔹 Get Single Warehouse by ID
exports.getWareHouseById = async (req, res) => {
  try {
    const { id } = req.params;
    const warehouse = await WareHouse.findById(id);

    if (!warehouse) {
      return res
        .status(404)
        .json({ success: false, message: "Warehouse not found" });
    }

    res.status(200).json({ success: true, data: warehouse });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: "Failed to fetch",
      error: error.message,
    });
  }
};

// 🔹 Update Warehouse
exports.updateWareHouse = async (req, res) => {
  try {
    const { id } = req.params;
    const updated = await WareHouse.findByIdAndUpdate(id, req.body, {
      new: true,
      runValidators: true,
    });

    if (!updated) {
      return res
        .status(404)
        .json({ success: false, message: "Warehouse not found" });
    }

    res
      .status(200)
      .json({ success: true, message: "Warehouse updated", data: updated });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: "Failed to update",
      error: error.message,
    });
  }
};

// 🔹 Delete Warehouse
exports.deleteWareHouse = async (req, res) => {
  try {
    const { id } = req.params;
    const deleted = await WareHouse.findByIdAndDelete(id);

    if (!deleted) {
      return res
        .status(404)
        .json({ success: false, message: "Warehouse not found" });
    }

    res.status(200).json({ success: true, message: "Warehouse deleted" });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: "Failed to delete",
      error: error.message,
    });
  }
};
