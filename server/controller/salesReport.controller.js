const Order = require("../models/orderModel");

const getProductSalesReport = async (req, res) => {
  try {
    const result = await Order.aggregate([
      { $unwind: "$products" },

      {
        $group: {
          _id: "$products.productId",
          soldQty: { $sum: "$products.quantity" },
          soldAmount: { $sum: "$products.totalPrice" },
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
        $lookup: {
          from: "categories", // assuming Category model name is 'Category'
          localField: "productDetails.category",
          foreignField: "_id",
          as: "categoryDetails",
        },
      },
      {
        $lookup: {
          from: "brands",
          localField: "productDetails.brand",
          foreignField: "_id",
          as: "brandDetails",
        },
      },

      {
        $project: {
          productName: "$productDetails.productName",
          sku: "$productDetails.sku",
          category: { $arrayElemAt: ["$categoryDetails.name", 0] },
          brand: { $arrayElemAt: ["$brandDetails.name", 0] },
          soldQty: 1,
          soldAmount: 1,
          inStockQty: "$productDetails.stock",
          productImage: {
            $cond: [
              {
                $gt: [{ $size: "$productDetails.images" }, 0],
              },
              { $arrayElemAt: ["$productDetails.images.url", 0] },
              null,
            ],
          },
        },
      },
    ]);

    res.status(200).json(result);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

module.exports = { getProductSalesReport };
