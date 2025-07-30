const Payment = require("../models/paymentModel");
const Order = require("../models/orderModel");

// ✅ Create a new payment
const createPayment = async (req, res) => {
  try {
    const { orderId, paymentAmount, pos, paymentDate, method, note } = req.body;

    if (!orderId || !paymentAmount) {
      return res
        .status(400)
        .json({ message: "orderId and paymentAmount are required." });
    }

    const newPayment = new Payment({
      orderId,
      paymentAmount,
      pos,
      paymentDate,
      method,
      note,
    });
    const order = await Order.findById(orderId);
    order.payment += Number(paymentAmount);
    order.due -= Number(paymentAmount);
    await order.save();

    const savedPayment = await newPayment.save();
    res.status(201).json({ ok: true, savedPayment });
  } catch (error) {
    console.log(error);
    res
      .status(500)
      .json({ message: "Failed to create payment", error: error.message });
  }
};

// ✅ Get all payments
const getAllPayments = async (req, res) => {
  const { orderId } = req.query;
  try {
    const payments = await Payment.find({ orderId })
      .populate("orderId")
      .populate("pos")
      .sort({ createdAt: -1 });

    res.status(200).json(payments);
  } catch (error) {
    console.log(error);
    res
      .status(500)
      .json({ message: "Failed to get payments", error: error.message });
  }
};

// ✅ Get a single payment by ID
const getPaymentById = async (req, res) => {
  try {
    const { id } = req.params;
    const payment = await Payment.findById(id)
      .populate("orderId")
      .populate("pos");

    if (!payment) {
      return res.status(404).json({ message: "Payment not found" });
    }

    res.status(200).json(payment);
  } catch (error) {
    res
      .status(500)
      .json({ message: "Failed to get payment", error: error.message });
  }
};

// ✅ Update payment by ID
const updatePayment = async (req, res) => {
  try {
    const { id } = req.params;
    const updated = await Payment.findByIdAndUpdate(id, req.body, {
      new: true,
      runValidators: true,
    });

    if (!updated) {
      return res.status(404).json({ message: "Payment not found" });
    }

    res.status(200).json(updated);
  } catch (error) {
    res
      .status(500)
      .json({ message: "Failed to update payment", error: error.message });
  }
};

// ✅ Delete payment by ID
const deletePayment = async (req, res) => {
  try {
    const { id } = req.params;
    const deleted = await Payment.findByIdAndDelete(id);

    if (!deleted) {
      return res.status(404).json({ message: "Payment not found" });
    }

    res.status(200).json({ message: "Payment deleted successfully" });
  } catch (error) {
    res
      .status(500)
      .json({ message: "Failed to delete payment", error: error.message });
  }
};

module.exports = {
  createPayment,
  getAllPayments,
  getPaymentById,
  updatePayment,
  deletePayment,
};
