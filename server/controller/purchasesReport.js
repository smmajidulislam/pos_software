const Purchase = require("../models/purchaseModel");

const getPurchaseReport = async (req, res) => {
  try {
    // All purchases with populated product
    const purchases = await Purchase.find().populate("product");

    // Object to group data by product
    const report = {};

    purchases.forEach((purchase) => {
      const productId = purchase.product._id;
      const productName = purchase.product.name;

      if (!report[productId]) {
        report[productId] = {
          product: productName,
          purchasedAmount: 0,
          purchasedQty: 0,
          inStockQty: purchase.product.stock || 0,
        };
      }

      report[productId].purchasedAmount += purchase.grandTotal || 0;
      report[productId].purchasedQty += purchase.Qty || 0;
    });

    // Convert object to array
    const finalReport = Object.values(report);

    res.status(200).json(finalReport);
  } catch (error) {
    console.error("Error generating report:", error);
    res.status(500).json({ message: "Server Error" });
  }
};

module.exports = { getPurchaseReport };
