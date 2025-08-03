const express = require("express");
const router = express.Router();
const { signUp, login, logout } = require("../controller/auth.controller");
const {
  createPos,
  deletePos,
  updatePos,
  getPos,
  getAllPos,
} = require("../controller/pos.controller");
const {
  createCategory,
  getCategories,
  updateCategory,
  deleteCategory,
  getCategory,
} = require("../controller/category.controller");
const {
  createBrand,
  getAllBrands,
  updateBrand,
  deleteBrand,
} = require("../controller/brand.controller");
const {
  createUnit,
  getAllUnits,
  getUnitById,
  updateUnit,
  deleteUnit,
} = require("../controller/Unit.controller");
const {
  deleteWareHouse,
  updateWareHouse,
  getWareHouseById,
  getAllWareHouses,
  createWareHouse,
} = require("../controller/wareHouse.controller");
const {
  createVariant,
  getVariants,
  getVariantById,
  updateVariant,
  deleteVariant,
} = require("../controller/Variant.controller");
const {
  createProduct,
  getProducts,
  getProductById,
} = require("../controller/product.controller");
const {
  createSupplier,
  getSupplierById,
  updateSupplier,
  deleteSupplier,
  getSuppliers,
} = require("../controller/supplier.controller");
const {
  createUser,
  getUserById,
  getUsers,
  updateUser,
  deleteUser,
} = require("../controller/user.controller");
const {
  createOrder,
  getAllOrders,
  deleteOrder,
} = require("../controller/order.controller");
const {
  createPurchase,
  getAllPurchases,
} = require("../controller/Purchase.controller");
const {
  createPayment,
  getAllPayments,
  getPaymentById,
  deletePayment,
} = require("../controller/payment.controller");
const { getSellInvoice } = require("../controller/paymentInvoice.controller");
const { getHomePageData } = require("../controller/homepageData.comtroller");
const {
  getProductSalesReport,
} = require("../controller/salesReport.controller");
const {
  getPurchaseReport,
} = require("../controller/purchaceReport.controller");
const {
  getCustomerPaymentReport,
} = require("../controller/customer.controller");
const { getProfitlossReport } = require("../controller/Profit&loss.controller");
const {
  getAllRolesAndCreatedDates,
} = require("../controller/getAllROleAndCreateddates");

// auth routes
router.post("/signup", signUp);
router.post("/login", login);
router.post("/logout", logout);
// pos routes
router.post("/pos", createPos);
router.delete("/pos/:id", deletePos);
router.put("/pos/:id", updatePos);
router.get("/pos/:id", getPos);
router.get("/pos", getAllPos);
// warehouse routes
router.post("/warehouse", createWareHouse);
router.get("/warehouse", getAllWareHouses);
router.get("/warehouse/:id", getWareHouseById);
router.put("/warehouse/:id", updateWareHouse);
router.delete("/warehouse/:id", deleteWareHouse);

// category routes
router.post("/category", createCategory);
router.get("/categories", getCategories);
router.get("/category/:id", getCategory);
router.put("/categorie/:id", updateCategory);
router.delete("/categorie/:id", deleteCategory);
// brand routes
router.post("/brand", createBrand);
router.get("/brands", getAllBrands);
router.put("/brand/:id", updateBrand);
router.delete("/brand/:id", deleteBrand);
// Unit routes
router.post("/unit", createUnit);
router.get("/units", getAllUnits);
router.get("/unit/:id", getUnitById);
router.put("/unit/:id", updateUnit);
router.delete("/unit/:id", deleteUnit);
// /api/variants
router.post("/variants", createVariant);
router.get("/variants", getVariants);
router.get("/variants/:id", getVariantById);
router.put("/variants/:id", updateVariant);
router.delete("/variants/:id", deleteVariant);
// product routes
router.post("/product/purchace", createPurchase);
router.get("/product/purchace", getAllPurchases);
// get purchase report for purchase section
router.get("/purchase-report", getPurchaseReport);
// create product
router.post("/product", createProduct);
router.get("/product", getProducts);
router.get("/product/:id", getProductById);
// supplier routea
router.post("/supllier", createSupplier);
router.get("/supllier", getSuppliers);
router.get("/supllier/:id", getSupplierById);
router.put("/supllier/:id", updateSupplier);
router.delete("/supllier/:id", deleteSupplier);
// users route
router.post("/user", createUser);
router.get("/user", getUsers);
router.get("/user/:id", getUserById);
router.put("/user/:id", updateUser);
router.delete("/user/:id", deleteUser);
// order routes
router.post("/order", createOrder);
router.get("/order", getAllOrders);
router.delete("/order/:id", deleteOrder);
// payment api
router.post("/payments", createPayment);
router.get("/payments", getAllPayments);
router.get("/payments/:id", getPaymentById);
router.delete("/payments/:id", deletePayment);

// invoice api
router.get("/or-sell-invoices", getSellInvoice);
// DashBord Data
router.get("/dashbord-data", getHomePageData);
// report data
router.get("/sales-report-data", getProductSalesReport);
router.get("/purchase-report-data", getPurchaseReport);
router.get("/customer-report-data", getCustomerPaymentReport);
router.get("/profit&loss-report-data", getProfitlossReport);
router.get("/role-and-permission", getAllRolesAndCreatedDates);

module.exports = router;
