const User = require("../models/userModel");
const Order = require("../models/orderModel");
const Purchase = require("../models/purchaseModel");
const Product = require("../models/productModel");
const getHomePageData = async (req, res) => {
  try {
    const customer = await User.countDocuments({ role: "customer" });
    const supplier = await User.countDocuments({ role: "supplier" });
    const salesInvoice = await Order.countDocuments();
    const purchaseInvoice = await Purchase.countDocuments();

    const monthLabels = [
      "Jan",
      "Feb",
      "Mar",
      "Apr",
      "May",
      "Jun",
      "Jul",
      "Aug",
      "Sep",
      "Oct",
      "Nov",
      "Dec",
    ];
    const currentYear = new Date().getFullYear();

    // Aggregate Sales
    const sales = await Order.aggregate([
      {
        $match: {
          createdAt: {
            $gte: new Date(`${currentYear}-01-01`),
            $lte: new Date(`${currentYear}-12-31`),
          },
        },
      },
      {
        $group: {
          _id: { $month: "$createdAt" },
          total: { $sum: "$grandTotal" },
        },
      },
    ]);

    // Aggregate Purchases
    const purchases = await Purchase.aggregate([
      {
        $match: {
          createdAt: {
            $gte: new Date(`${currentYear}-01-01`),
            $lte: new Date(`${currentYear}-12-31`),
          },
        },
      },
      {
        $group: {
          _id: { $month: "$createdAt" },
          total: { $sum: "$grandTotal" },
        },
      },
    ]);

    // Initialize 12 months data with 0
    const salesData = Array(12).fill(0);
    const purchaseData = Array(12).fill(0);

    // Fill sales
    sales.forEach((item) => {
      salesData[item._id - 1] = item.total;
    });

    // Fill purchases
    purchases.forEach((item) => {
      purchaseData[item._id - 1] = item.total;
    });
    const chartData = {
      labels: monthLabels,
      sales: salesData,
      purchases: purchaseData,
    };
    const recenctProduct = await Product.find()
      .sort({ createdAt: -1 })
      .limit(5);
    const expiredProduct = await Product.find({
      expiryDate: { $lt: new Date() },
    })
      .sort({ createdAt: -1 })
      .limit(10);
    const totalSalesDue = await Order.aggregate([
      {
        $group: {
          _id: null,
          total: { $sum: "$due" },
        },
      },
    ]);
    const totalSales = await Order.aggregate([
      {
        $group: {
          _id: null,
          total: { $sum: "$grandTotal" },
        },
      },
    ]);
    const totalPurchasesAndDue = await Purchase.aggregate([
      {
        $group: {
          _id: null,
          totalPurchase: { $sum: "$grandTotal" },
          totalDue: { $sum: "$due" },
        },
      },
    ]);

    const totals = totalPurchasesAndDue[0] || { totalPurchase: 0, totalDue: 0 };
    const data = [
      { customer: customer },
      { supplier: supplier },
      { salesInvoice: salesInvoice },
      { purchaseInvoice: purchaseInvoice },
      {
        totalSalesDue: totalSalesDue[0]?.total || 0,
        totalsales: totalSales[0]?.total || 0,
      },
      { totalsPurchaceAndDue: totals },
      { totalsexpense: "Dummy Data 0 " },

      chartData,
      { recenctProduct },
      { expiredProduct },
    ];
    res.status(200).json({ message: "success", data });
  } catch (error) {
    console.log(error);
    res.status(500).json({ message: "internal server error" || error.message });
  }
};

module.exports = { getHomePageData };
