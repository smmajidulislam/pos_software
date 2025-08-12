const Purchase = require("../models/purchaseModel");
const Product = require("../models/productModel");

const getAllPurchases = async (req, res) => {
  try {
    const { pos } = req.query;
    let baseQuery = {
      pos: pos,
    };
    const purchases = await Purchase.find(baseQuery)
      .populate("product", "productName")
      .populate("supplier", "name")
      .sort({ createdAt: -1 });

    const formatted = purchases.map((item) => ({
      productName: item.product?.productName || "N/A",
      reference: item.reference,
      date: new Date(item.date).toLocaleDateString("en-GB", {
        day: "2-digit",
        month: "short",
        year: "numeric",
      }), // e.g. 01 Jul 2025
      status: item.status,
      grandTotal: item.grandTotal,
      payment: item.payment,
      due: item.due,
      _id: item._id,
    }));

    res.status(200).json(formatted);
  } catch (error) {
    console.log(error);
    res.status(500).json({ message: "Something went wrong", error });
  }
};
const createPurchase = async (req, res) => {
  try {
    const {
      supplier,
      product,
      payment,
      due,
      grandTotal,
      pos,
      status,
      date,
      quantity,
    } = req.body;
    const purchase = await Purchase.create({
      supplier: supplier?.value || supplier,
      product: product?._id || product,
      payment,
      due,
      grandTotal,
      pos,
      Qty: Number(quantity),
      status: status?.value || status,
      date,
    });
    const productToUpdate = await Product.findById(product?._id);
    if (productToUpdate) {
      const validQuantity = Number(quantity);
      productToUpdate.stock = Number(productToUpdate.stock) + validQuantity;
      await productToUpdate.save();
    }

    res.status(201).json({
      success: true,
      message: "Purchase created successfully",
      data: purchase,
    });
  } catch (error) {
    console.error("Create Purchase Error:", error);
    res.status(500).json({
      success: false,
      message: "Failed to create purchase",
      error: error.message,
    });
  }
};
module.exports = { getAllPurchases, createPurchase };
