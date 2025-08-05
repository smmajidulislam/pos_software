const Order = require("../models/orderModel");

const SalesReturn = require("../models/sellesReturn");

const createSalesReturn = async (req, res) => {
  try {
    const {
      reference,
      product,
      pos,
      quantity,
      unitPrice,
      discountPerUnit,
      totalDiscount,
      totalAmount,
      payment,
      due,
      status,
    } = req.body;

    if (
      !reference ||
      !product ||
      !pos ||
      quantity <= 0 ||
      !unitPrice ||
      !totalAmount ||
      !status
    ) {
      return res.status(400).json({ success: false, message: "Invalid input" });
    }
    const findCustomer = await Order.findOne({ reference });

    const newSalesReturn = await SalesReturn.create({
      reference,
      product,
      pos,
      quantity,
      unitPrice,
      discountPerUnit,
      totalDiscount,
      totalAmount,
      payment,
      due,
      status,
      customer: findCustomer?.customerId,
    });

    return res.status(201).json({
      success: true,
      message: "Sales return created successfully",
      data: newSalesReturn,
    });
  } catch (error) {
    return res.status(500).json({ success: false, message: "Server error" });
  }
};

const getSalesReturnByReference = async (req, res) => {
  try {
    const { reference } = req.params;

    if (!reference) {
      return res
        .status(400)
        .json({ success: false, message: "Reference is required" });
    }

    const order = await Order.findOne({ reference }).populate(
      "products.productId"
    );

    if (!order) {
      return res
        .status(404)
        .json({ success: false, message: "Reference not found" });
    }

    // Assuming we return the first product info only for return
    const product = order.products[0];

    if (!product) {
      return res
        .status(404)
        .json({ success: false, message: "No product found in order" });
    }

    return res.status(200).json([
      {
        _id: order._id,
        reference: order.reference,
        Qty: product.quantity,
        payment: order.payment || 0,
        product: {
          _id: product.productId?._id || null,
          productName: product.productId?.productName || product.productName,
          price: product.rate || 0,
          discountValue: product.discountAmount || 0,
        },
      },
    ]);
  } catch (err) {
    console.error("Error fetching order by reference:", err);
    return res.status(500).json({ success: false, message: "Server error" });
  }
};
const getAllSalesReturns = async (req, res) => {
  try {
    const salesReturns = await SalesReturn.find()
      .populate("product")
      .populate("customer");
    return res.status(200).json({ success: true, data: salesReturns });
  } catch (error) {
    return res.status(500).json({ success: false, message: "Server error" });
  }
};

module.exports = {
  getSalesReturnByReference,
  createSalesReturn,
  getAllSalesReturns,
};
