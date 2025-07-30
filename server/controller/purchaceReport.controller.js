const Purchase = require("../models/purchaseModel");

const getPurchaseReport = async (req, res) => {
  try {
    const result = await Purchase.aggregate([
      {
        $group: {
          _id: "$product",
          totalPurchaseQty: { $sum: "$products.quantity" || 0 },
          totalPurchaseAmount: { $sum: "$grandTotal" },
        },
      },
      {
        $lookup: {
          from: "products",
          localField: "_id",
          foreignField: "_id",
          as: "productDetails",
        },
      },
      { $unwind: "$productDetails" },
      {
        $project: {
          productName: "$productDetails.productName",
          purchaseAmount: "$totalPurchaseAmount",
          purchaseQty: "$totalPurchaseQty",
          inStockQty: {
            $ifNull: ["$productDetails.stock", 0],
          },
        },
      },
    ]);

    res.status(200).json(result);
  } catch (error) {
    console.error("Error in purchase report:", error);
    res.status(500).json({ error: error.message });
  }
};

module.exports = { getPurchaseReport };
