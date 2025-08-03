const Purchase = require("../models/purchaseModel");
const getPurchaseReturns = async (req, res) => {
  const { reference } = req.query;
  console.log("i am in");
  try {
    console.log("i am in");
    const purchaseReturns = await Purchase.find({ reference: reference })
      .populate("product", "productName")
      .populate("supplier", "name")
      .sort({ createdAt: -1 });
    res.status(200).json(purchaseReturns);
  } catch (error) {
    console.log(error);
    res.status(500).json({ message: "Something went wrong", error });
  }
};

module.exports = { getPurchaseReturns };
