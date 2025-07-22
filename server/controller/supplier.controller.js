const User = require("../models/userModel");

// ✅ Create Supplier
exports.createSupplier = async (req, res) => {
  try {
    const {
      name,
      email,
      phone,
      address,
      city,
      country,
      description,
      image,
      posId,
    } = req.body;

    const supplier = new User({
      role: "supplier",
      name,
      email,
      phone,
      address: `${address}, ${city}, ${country}`,
      image,
      description,
      posId,
    });

    await supplier.save();

    res
      .status(201)
      .json({ message: "Supplier created successfully", supplier });
  } catch (error) {
    console.error("Error creating supplier:", error);
    res.status(500).json({ message: "Internal server error" });
  }
};

// ✅ Get All Suppliers
// GET: /api/getSuppliers?posId=xyz&search=&filter=newest
exports.getSuppliers = async (req, res) => {
  try {
    const { posId, search = "", filter = "" } = req.query;

    const sortOrder = filter === "oldest" ? 1 : -1; // newest => -1, oldest => 1

    const query = {
      role: "supplier",
    };

    if (posId) query.posId = posId;
    if (search) query.name = { $regex: search, $options: "i" };

    const suppliers = await User.find(query).sort({
      createdAt: sortOrder || -1,
    });

    res.status(200).json({ message: "success", suppliers });
  } catch (error) {
    res.status(500).json({ message: error.message || "Internal server error" });
  }
};

// ✅ Get Single Supplier
exports.getSupplierById = async (req, res) => {
  try {
    const supplier = await User.findOne({
      _id: req.params.id,
      role: "supplier",
    });

    if (!supplier) {
      return res.status(404).json({ message: "Supplier not found" });
    }

    res.status(200).json(supplier);
  } catch (error) {
    console.error("Error getting supplier:", error);
    res.status(500).json({ message: "Internal server error" });
  }
};

// ✅ Update Supplier
exports.updateSupplier = async (req, res) => {
  try {
    const { name, email, phone, address, description, image } = req.body;

    const updated = await User.findOneAndUpdate(
      { _id: req.params.id, role: "supplier" },
      {
        name,
        email,
        phone,
        address,
        description,
        image,
      },
      { new: true }
    );

    if (!updated) {
      return res.status(404).json({ message: "Supplier not found" });
    }

    res.status(200).json({ message: "Supplier updated", supplier: updated });
  } catch (error) {
    console.error("Error updating supplier:", error);
    res.status(500).json({ message: "Internal server error" });
  }
};

// ✅ Delete Supplier
exports.deleteSupplier = async (req, res) => {
  try {
    const deleted = await User.findOneAndDelete({
      _id: req.params.id,
      role: "supplier",
    });

    if (!deleted) {
      return res.status(404).json({ message: "Supplier not found" });
    }

    res.status(200).json({ message: "Supplier deleted successfully" });
  } catch (error) {
    console.error("Error deleting supplier:", error);
    res.status(500).json({ message: "Internal server error" });
  }
};
