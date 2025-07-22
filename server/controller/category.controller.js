const Category = require("../models/categoryModel");

exports.getCategories = async (req, res) => {
  try {
    const { type, pos, category, status, date, search, sort, parent } =
      req.query;
    let filter = {};

    if (type === "main") {
      filter.type = "main";
    } else if (type === "sub") {
      filter.type = "sub";
    } else if (type === "sub-sub") {
      filter.type = "sub-sub";
    }

    if (pos) filter.posid = pos;
    if (category) filter._id = category;
    if (status) filter.status = status;
    if (parent) filter.parent = parent;
    // date filter
    if (date) {
      const selectedDate = new Date(date);
      const startOfDay = new Date(selectedDate.setHours(0, 0, 0, 0));
      const endOfDay = new Date(selectedDate.setHours(23, 59, 59, 999));
      filter.createdAt = { $gte: startOfDay, $lte: endOfDay };
    }

    // search by name
    if (search) {
      filter.name = { $regex: search, $options: "i" };
    }

    // sort logic
    let sortOption = { createdAt: -1 }; // default: newest
    if (sort === "asc") {
      sortOption = { createdAt: 1 }; // oldest
    } else if (sort === "desc") {
      sortOption = { createdAt: -1 }; // newest
    }
    let query = Category.find(filter).sort(sortOption);
    if (type === "sub" || type === "sub-sub") {
      query = query.populate("parent");
    }

    const categories = await query;

    res.status(200).json({ success: true, data: categories });
  } catch (error) {
    console.log(error);
    res.status(500).json({ error: "Failed to fetch categories" });
  }
};

exports.createCategory = async (req, res) => {
  try {
    const { name, slug, status, type, parent, code, description, posid } =
      req.body;

    // fallback default values
    const safeStatus = status || "active";
    const safeType = type || "main";
    const safeParent = safeType === "main" ? null : parent;
    const safeCode = safeType === "main" ? "" : code || "";
    const safeDescription = safeType === "main" ? "" : description || "";

    // validate required fields
    if (!name || !posid) {
      return res
        .status(400)
        .json({ error: "name or wareHouse or posid are required" });
    }
    const newCategory = new Category({
      name,
      slug,
      status: safeStatus,
      type: safeType,
      parent: safeParent,
      code: safeCode,
      description: safeDescription,
      posid,
    });

    const savedCategory = await newCategory.save();

    res.status(201).json({ success: true, data: savedCategory });
  } catch (error) {
    res.status(500).json({ error: "Failed to create category" });
  }
};

exports.updateCategory = async (req, res) => {
  try {
    const category = await Category.findByIdAndUpdate(req.params.id, req.body, {
      new: true,
    });
    res.status(200).json(category);
  } catch (error) {
    res.status(500).json({ error: "Failed to update category" });
  }
};

exports.deleteCategory = async (req, res) => {
  try {
    await Category.findByIdAndDelete(req.params.id);
    res.status(200).json({ message: "Category deleted successfully" });
  } catch (error) {
    res.status(500).json({ error: "Failed to delete category" });
  }
};

exports.getCategory = async (req, res) => {
  try {
    const category = await Category.findById(req.params.id);
    res.status(200).json(category);
  } catch (error) {
    res.status(500).json({ error: "Failed to fetch category" });
  }
};
