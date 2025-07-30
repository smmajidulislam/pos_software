const Order = require("../models/orderModel");

const getSellInvoice = async (req, res) => {
  console.log("hello i am in,", req.query.pos);
  const { pos } = req.query;
  try {
    const orders = await Order.find({ posId: pos })
      .populate("customerId", "name")
      .sort({ createdAt: -1 });

    const invoiceData = orders.map((order, index) => {
      return {
        invoiceNo: `INV${String(index + 1).padStart(3, "0")}`, // যেমন: INV001
        customer: order.customerId?.name || "N/A",
        dueDate: order.createdAt.toLocaleDateString("en-GB", {
          day: "2-digit",
          month: "short",
          year: "numeric",
        }), // 19 Jan 2023 ফরম্যাটে
        amount: order.grandTotal || 0,
        paid: order.payment || 0,
        due: order.due || 0,
        status: order.status,
      };
    });

    res.status(200).json(invoiceData);
  } catch (error) {
    console.error("Error fetching invoices:", error);
    res.status(500).json({ message: "Failed to fetch invoices" });
  }
};

module.exports = { getSellInvoice };
