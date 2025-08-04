const Purchase = require("../models/purchaseModel");
const PurchaseReturn = require("../models/purchaseReturnModel");
const Product = require("../models/productModel");
const getPurchaseReturns = async (req, res) => {
  const { reference } = req.query;
  try {
    const purchaseReturns = await Purchase.find({ reference: reference })
      .populate("product", "productName price discountType discountValue")
      .populate("supplier", "name")
      .sort({ createdAt: -1 });
    res.status(200).json(purchaseReturns);
  } catch (error) {
    console.log(error);
    res.status(500).json({ message: "Something went wrong", error });
  }
};
const createPurchaseReturn = async (req, res) => {
  try {
    const {
      reference,
      product,
      quantity,
      unitPrice,
      discountPerUnit,
      totalDiscount,
      totalAmount,
      payment,
      due,
      status,
      pos,
      date,
    } = req.body;

    const returnData = await PurchaseReturn.create({
      reference,
      product,
      quantity,
      unitPrice,
      discountPerUnit,
      totalDiscount,
      totalAmount,
      payment,
      due,
      status: status?.value || status,
      pos,
      date,
    });

    // Optional: update product stock
    const prod = await Product.findById(product);
    if (prod) {
      prod.stock = prod.stock - Number(quantity); // reduce stock on return
      await prod.save();
    }

    res.status(201).json({
      success: true,
      message: "Purchase return created successfully",
      data: returnData,
    });
  } catch (error) {
    console.error("Create Purchase Return Error:", error);
    res.status(500).json({
      success: false,
      message: "Failed to create purchase return",
      error: error.message,
    });
  }
};
const getAllPurchaseReturns = async (req, res) => {
  try {
    const findData = await PurchaseReturn.find().populate(
      "product",
      "productName"
    );
    res.status(200).json({ success: true, data: findData });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

module.exports = {
  getPurchaseReturns,
  createPurchaseReturn,
  getAllPurchaseReturns,
};
