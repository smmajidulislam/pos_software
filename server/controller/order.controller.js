const Order = require("../models/orderModel"); // আপনার অর্ডার মডেল এখানে import করুন

// CREATE ORDER
const createOrder = async (req, res) => {
  try {
    const {
      customerId,
      supplierId,
      status,
      shipping,
      discount,
      totalDiscount,
      orderTax,
      totalTax,
      payment,
      due,
      grandTotal,
      products,
    } = req.body;

    const newOrder = new Order({
      customerId,
      supplierId,
      status,
      shipping,
      discount,
      totalDiscount,
      orderTax,
      totalTax,
      payment,
      due,
      grandTotal,
      products,
    });

    const savedOrder = await newOrder.save();

    res.status(201).json({
      message: "Order created successfully",
      data: savedOrder,
    });
  } catch (error) {
    res.status(500).json({
      message: "Failed to create order",
      error: error.message,
    });
  }
};

module.exports = { createOrder };
