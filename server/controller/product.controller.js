const Product = require("../models/productModel");

// Helper: Strict required fields check
function validateStrictRequiredFields(body) {
  const requiredFields = [
    "store",
    "warehouse",
    "brand",
    "category",
    "unit",
    "parchacePrice",
    "price",
  ];
  const missing = requiredFields.filter(
    (field) => body[field] === undefined || body[field] === null
  );
  return missing;
}

exports.createProduct = async (req, res) => {
  try {
    // Validate required fields
    const missingFields = validateStrictRequiredFields(req.body);
    if (missingFields.length > 0) {
      return res.status(400).json({
        success: false,
        message: `Missing required fields: ${missingFields.join(", ")}`,
      });
    }

    if (!req.body.productName || typeof req.body.productName !== "string") {
      return res
        .status(400)
        .json({ success: false, message: "productName must be a string" });
    }

    // Filter only allowed fields
    const allowedFields = [
      "productName",
      "slug",
      "isVariantProduct",
      "variants",
      "sku",
      "itemCode",
      "quantity",
      "parchacePrice",
      "price",
      "description",
      "category",
      "subCategory",
      "subSubCategory",
      "brand",
      "unit",
      "discountType",
      "discountValue",
      "taxType",
      "taxValue",
      "images",
      "expiry",
      "expiryDate",
      "manufactureDate",
      "manufacturer",
      "sellingType",
      "quantityAlert",
      "store",
      "variantAttribute",
      "variantValues",
      "warranties",
      "warehouse",
    ];

    const productData = {};

    allowedFields.forEach((field) => {
      const value = req.body[field];

      // Skip empty string values (especially for ObjectId fields)
      if (value === "" || value === undefined || value === null) return;

      // Convert number fields safely
      if (
        [
          "parchacePrice",
          "price",
          "quantity",
          "discountValue",
          "taxValue",
          "quantityAlert",
        ].includes(field)
      ) {
        productData[field] = Number(value) || 0;
      } else {
        productData[field] = value;
      }
    });

    // Optional: validate enum values manually (prevent Mongoose enum error)
    const validDiscountTypes = ["percentage", "flat", "none", "cash"]; // তোমার স্কিমা অনুযায়ী
    if (
      productData.discountType &&
      !validDiscountTypes.includes(productData.discountType)
    ) {
      return res.status(400).json({
        success: false,
        message: `Invalid discountType. Must be one of: ${validDiscountTypes.join(
          ", "
        )}`,
      });
    }

    const newProduct = new Product(productData);
    const savedProduct = await newProduct.save();

    res.status(201).json({ success: true, product: savedProduct });
  } catch (error) {
    console.error("Create product error:", error);
    res.status(500).json({
      success: false,
      message: "Server error",
      error: error.message,
    });
  }
};
exports.getProducts = async (req, res) => {
  try {
    const { categoryId, pos, search } = req.query;
    const baseQuery = {
      store: pos,
    };
    if (categoryId !== "allCategory") {
      baseQuery.$or = [
        { category: categoryId },
        { subCategory: categoryId },
        { subSubCategory: categoryId },
      ];
    }
    if (search) {
      baseQuery.productName = { $regex: search, $options: "i" };
    }

    const data = await Product.find(baseQuery);

    return res.status(200).json({ message: "success", data });
  } catch (error) {
    console.log(error);
    return res.status(500).json({ message: error.message || "Server error" });
  }
};
