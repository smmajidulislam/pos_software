const Order = require("../models/orderModel");
const Purchase = require("../models/PurchaseModel");
// যদি Purchase Return বা Sales Return আলাদা মডেল থাকে, তাহলে সেটিও import করবে

const getProfitlossReport = async (req, res) => {
  try {
    const startOfYear = new Date("2023-01-01");
    const endOfYear = new Date("2023-12-31");

    const orders = await Order.aggregate([
      {
        $match: {
          createdAt: { $gte: startOfYear, $lte: endOfYear },
          status: { $in: ["Completed"] },
        },
      },
      {
        $group: {
          _id: { $month: "$createdAt" },
          totalSales: { $sum: "$grandTotal" },
          totalService: { $sum: "$totalTax" }, // যদি সার্ভিস ইনকাম এইভাবে গণনা হয়
        },
      },
    ]);

    const purchases = await Purchase.aggregate([
      {
        $match: {
          createdAt: { $gte: startOfYear, $lte: endOfYear },
          status: { $in: ["received"] },
        },
      },
      {
        $group: {
          _id: { $month: "$createdAt" },
          totalPurchase: { $sum: "$grandTotal" },
        },
      },
    ]);

    const monthlyData = [];

    for (let i = 1; i <= 6; i++) {
      const monthName = new Date(2023, i - 1).toLocaleString("default", {
        month: "short",
      });
      const orderData = orders.find((o) => o._id === i);
      const purchaseData = purchases.find((p) => p._id === i);

      const sales = orderData?.totalSales || 0;
      const service = orderData?.totalService || 0;
      const purchase = purchaseData?.totalPurchase || 0;

      const grossProfit = sales + service - purchase;
      const totalExpense = purchase * 0.8; // ডেমো হিসেবে ৮০% এক্সপেন্স ধরছি
      const netProfit = grossProfit - totalExpense;

      monthlyData.push({
        month: monthName + " 2023",
        sales: sales.toFixed(2),
        service: service.toFixed(2),
        purchase,
        grossProfit: grossProfit.toFixed(2),
        totalExpense: totalExpense.toFixed(2),
        netProfit: netProfit.toFixed(2),
      });
    }

    return res.status(200).json({ success: true, data: monthlyData });
  } catch (error) {
    console.error("Error generating report:", error);
    return res.status(500).json({ success: false, message: "Server error" });
  }
};
module.exports = { getProfitlossReport };
