const Brand = require("../models/brandModel");

// Create Brand
exports.createBrand = async (req, res) => {
  try {
    const { status, posId, logo, name } = req.body;
    let preParedData = {};
    if (status) preParedData.status = status;
    if (posId) preParedData.posId = posId;
    if (logo) preParedData.logo = logo;
    if (name) preParedData.name = name;
    const brand = new Brand(preParedData);
    await brand.save();
    res.status(201).json({ success: true, data: brand });
  } catch (error) {
    res.status(400).json({ success: false, message: error.message });
  }
};

// Get All Brands
// controllers/brandController.js
exports.getAllBrands = async (req, res) => {
  try {
    const { posId, brand, status, time, search, sort } = req.query;
    let query = {};

    if (posId) query.posId = posId;
    if (brand && brand !== "choose")
      query.name = { $regex: brand, $options: "i" };
    if (status && status !== "choose Status") query.status = status;
    if (search) query.name = { $regex: search, $options: "i" };
    if (time) {
      const [day, month, year] = time.split("-");
      const dateStr = `${year}-${month}-${day}`;
      const date = new Date(dateStr);
      const nextDate = new Date(date);
      nextDate.setDate(date.getDate() + 1);

      if (!isNaN(date.getTime())) {
        query.createdAt = { $gte: date, $lt: nextDate };
      }
    }

    let brandsQuery = Brand.find(query).populate("posId");

    if (sort === "asc") {
      brandsQuery = brandsQuery.sort({ createdAt: 1 });
    } else if (sort === "desc") {
      brandsQuery = brandsQuery.sort({ createdAt: -1 });
    }

    const brands = await brandsQuery;

    res.status(200).json({ success: true, data: brands });
  } catch (error) {
    console.log(error);
    res.status(500).json({ success: false, message: error.message });
  }
};

// Get Single Brand by ID
exports.getBrandById = async (req, res) => {
  try {
    const brand = await Brand.findById(req.params.id).populate("posId");
    if (!brand) {
      return res
        .status(404)
        .json({ success: false, message: "Brand not found" });
    }
    res.status(200).json({ success: true, data: brand });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// Update Brand
exports.updateBrand = async (req, res) => {
  try {
    const brand = await Brand.findByIdAndUpdate(req.params.id, req.body, {
      new: true,
      runValidators: true,
    });
    if (!brand) {
      return res
        .status(404)
        .json({ success: false, message: "Brand not found" });
    }
    res.status(200).json({ success: true, data: brand });
  } catch (error) {
    res.status(400).json({ success: false, message: error.message });
  }
};

// Delete Brand
exports.deleteBrand = async (req, res) => {
  try {
    const brand = await Brand.findByIdAndDelete(req.params.id);
    if (!brand) {
      return res
        .status(404)
        .json({ success: false, message: "Brand not found" });
    }
    res
      .status(200)
      .json({ success: true, message: "Brand deleted successfully" });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};
