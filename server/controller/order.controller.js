const Order = require("../models/orderModel");
const mongoose = require("mongoose");

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
      posId,
    } = req.body;

    let reference;
    let isExists = true;

    // Generate unique reference
    while (isExists) {
      const refereNo = Math.floor(Math.random() * 1000000)
        .toString()
        .padStart(6, "0");
      reference = `REF-${refereNo}`;
      isExists = await Order.findOne({ reference });
    }
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
      posId,
      grandTotal,
      products,
      reference,
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
const getAllOrders = async (req, res) => {
  try {
    const { customer, status, reference, paymentStatus, search, sort, posId } =
      req.query;

    const filter = {
      posId: posId,
    };

    if (customer) {
      filter.customerId = new mongoose.Types.ObjectId(customer);
    }

    if (status) {
      filter.status = status;
    }

    if (paymentStatus) {
      filter.paymentStatus = paymentStatus;
    }

    if (reference) {
      filter._id = { $regex: reference, $options: "i" };
    }

    // যদি search ফিল্ড future এ যুক্ত করো
    if (search) {
      filter.$or = [
        { "products.productName": { $regex: search, $options: "i" } },
        { "products.itemCode": { $regex: search, $options: "i" } },
        { status: { $regex: search, $options: "i" } },
      ];
    }

    // sort: latest => createdAt descending, oldest => ascending
    const sortOption = sort === "oldest" ? 1 : -1;

    const orders = await Order.find(filter)
      .populate("customerId", "name")
      .populate("supplierId", "name")
      .sort({ createdAt: sortOption });

    res.status(200).json({
      success: true,
      count: orders.length,
      data: orders,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: "Something went wrong while fetching orders",
      error: error.message,
    });
  }
};

module.exports = { createOrder, getAllOrders };
