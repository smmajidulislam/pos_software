const Order = require("../models/orderModel");

const getCustomerPaymentReport = async (req, res) => {
  try {
    const report = await Order.aggregate([
      // Step 1: User collection থেকে customer এর ডিটেইল লোড করব
      {
        $lookup: {
          from: "users",
          localField: "customerId",
          foreignField: "_id",
          as: "customerDetails",
        },
      },
      { $unwind: "$customerDetails" },

      // Step 2: গ্রুপ করে মোট amount, payment, due হিসাব করব
      {
        $group: {
          _id: "$customerDetails._id",
          customerName: { $first: "$customerDetails.name" },
          totalAmount: { $sum: "$grandTotal" },
          totalPaid: { $sum: "$payment" },
          totalDue: { $sum: "$due" },
          status: { $first: "$status" }, // প্রথম অর্ডারের status নিলাম
        },
      },

      // Step 3: paymentStatus এবং custom Customer ID ফরম্যাট যোগ করব
      {
        $addFields: {
          paymentStatus: {
            $cond: [{ $eq: ["$totalDue", 0] }, "Paid", "Unpaid"],
          },
          customerId: {
            $concat: [
              "CT_",
              {
                $toUpper: {
                  $substrBytes: [{ $toString: "$_id" }, 0, 6],
                },
              },
            ],
          },
        },
      },

      // Step 4: প্রয়োজনীয় ফিল্ড প্রজেক্ট করব
      {
        $project: {
          _id: 0,
          customerId: 1,
          customerName: 1,
          amount: "$totalAmount",
          paid: "$totalPaid",
          dueAmount: "$totalDue",
          status: 1,
          paymentStatus: 1,
        },
      },
    ]);

    res.status(200).json(report);
  } catch (error) {
    console.error("Error in customer payment report:", error);
    res.status(500).json({ error: error.message });
  }
};

module.exports = { getCustomerPaymentReport };
