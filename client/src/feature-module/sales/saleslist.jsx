import React, { useEffect, useRef, useState } from "react";
import { Link } from "react-router-dom";
import ImageWithBasePath from "../../core/img/imagewithbasebath";
import {
  FileText,
  PlusCircle,
  Sliders,
  StopCircle,
  User,
} from "feather-icons-react/build/IconComponents";
import { Filter } from "react-feather";
import Select from "react-select";
import { DatePicker } from "antd";
import dayjs from "dayjs";
import "bootstrap/dist/js/bootstrap.bundle.min.js";
import { useGetSuppliersQuery } from "../../core/redux/api/supplierApi/supplierApi";
import { usePos } from "../../hooks/PosProvider";
import { useGetUsersQuery } from "../../core/redux/api/userApi/userApi";
import { useGetProductsQuery } from "../../core/redux/api/productapi/productApi";
import {
  useCreateOrderMutation,
  useDeleteOrderMutation,
  useGetOrdersQuery,
} from "../../core/redux/api/orderApi/orderApi";
import {
  useCreatePaymentMutation,
  useDeletePaymentMutation,
  useGetAllPaymentsQuery,
} from "../../core/redux/api/paymentApi/paymentApi";
import Swal from "sweetalert2";
import {
  handlePrint,
  handleDownloadPDF,
  handleDownloadExcel,
} from "../../utils/Print";

const SalesList = () => {
  const [isFilterVisible, setIsFilterVisible] = useState(false);
  const [selectedProduct, setSelectedProduct] = useState([]);
  const [selectedOrder, setSelectedOrder] = useState(null);
  const [payingAmount, setPayingAmount] = useState(0);
  const [remaingDueAmount, setRemainingDueAmount] = useState(0);
  const [createPayment] = useCreatePaymentMutation();

  const [method, setMethod] = useState(null);
  const grandTotal = selectedProduct.reduce(
    (acc, curr) => acc + Number(curr.price),
    0
  );
  const totalDiscount = selectedProduct.reduce(
    (acc, curr) => acc + Number(curr.discountAmount),
    0
  );
  const totalOrderTax = selectedProduct.reduce(
    (acc, curr) => acc + Number(curr.taxAmount),
    0
  );

  const { pos } = usePos();
  const { data: supplierList, isLoading: supplierLoading } =
    useGetSuppliersQuery(
      {
        posId: pos?._id,
      },
      {
        skip: !pos?._id,
      }
    );
  const [suppliername, setSupplierName] = useState([]);
  const [selectedSupplier, setSelectedSupplier] = useState(null);

  const [customer, setCustomer] = useState([]);
  const [selectedCustomer, setSelectedCustomer] = useState(null);
  const [selectedStatus, setSelectedStatus] = useState(null);
  const [search, setSearch] = useState("");
  const [selectedDateForPayment, setSelectedDateForPayment] = useState(dayjs());
  const [duePayment, setDuePayment] = useState(0);
  const [createOrder] = useCreateOrderMutation();

  const [pay, setPay] = useState(0);
  const { data: productsList, refetch } = useGetProductsQuery(
    {
      pos: pos?._id,
      search: search,
    },
    {
      skip: !pos?._id,
    }
  );
  const salesDetailsRef = useRef(null);

  // ====================================================
  const [searchDataForFIlter, setSearchDataForFIlter] = useState({
    customer: null,
    status: null,
    reference: "",
    paymentStatus: null,
    search: "",
    sort: null,
  });

  const handleSearchDataForFIlter = (field, value) => {
    setSearchDataForFIlter((prev) => ({
      ...prev,
      [field]: value,
    }));
  };
  // ====================================================
  const handleCreatePayment = async (e) => {
    e.preventDefault();
    const fromData = new FormData(e.target);
    const data = Object.fromEntries(fromData.entries());
    const payload = {
      orderId: selectedOrder?._id,
      paymentAmount: data?.payingamount,
      paymentDate: selectedDateForPayment,
      method: method?.value,
      note: data?.description,
    };
    if (
      !payload.orderId ||
      !payload.paymentAmount ||
      !payload.paymentDate ||
      !payload.method
    ) {
      Swal.fire({
        icon: "warning",
        title: "Missing required fields",
        text: "Please fill all required fields before submitting payment.",
        confirmButtonText: "OK",
      });
      return;
    }
    const res = await createPayment(payload).unwrap();
    if (res?.ok) {
      Swal.fire({
        icon: "success",
        title: res.message,
        showConfirmButton: false,
        timer: 1500,
      });
      refetch();
    } else {
      Swal.fire({
        icon: "error",
        title: "Something went wrong",
        showConfirmButton: false,
        timer: 1500,
      });
    }
  };

  const { data: usersList, isLoading: usersLoading } = useGetUsersQuery({
    role: "customer",
  });
  const { data: singelPaymentHistory } = useGetAllPaymentsQuery(
    {
      orderId: selectedOrder?._id,
    },
    {
      skip: !selectedOrder?._id,
    }
  );
  const [deletePayment] = useDeletePaymentMutation();
  const [deleteOrder] = useDeleteOrderMutation();

  const { data: orderList } = useGetOrdersQuery(
    {
      customer: searchDataForFIlter?.customer?.value,
      status: searchDataForFIlter?.status?.value,
      reference: searchDataForFIlter?.reference,
      paymentStatus: searchDataForFIlter?.paymentStatus?.value,
      search: searchDataForFIlter?.search,
      sort: searchDataForFIlter?.sort?.value,
      posId: pos?._id,
    },
    {
      skip: !pos?._id,
    }
  );

  const handleQuantityChange = (productId, newQty) => {
    const originalProduct = productsList?.data.find(
      (item) => item._id === productId
    );

    if (!originalProduct) return;

    if (newQty < 1) {
      Swal.fire({
        icon: "error",
        title: "Invalid Quantity",
        text: "Quantity must be at least 1.",
        confirmButtonText: "OK",
        confirmButtonColor: "#00ff00",
        timer: 1000,
      });
      return;
    }

    if (newQty > originalProduct.stock) {
      Swal.fire({
        icon: "error",
        title: "Invalid Quantity",
        text: "Quantity exceeds stock.",
        confirmButtonText: "OK",
        confirmButtonColor: "#00ff00",
        timer: 1000,
      });
      return;
    }

    const updatedProducts = selectedProduct.map((product) => {
      if (product._id === productId) {
        const unitPrice = Number(originalProduct?.price) || 0;
        const discountValue = Number(originalProduct.discountValue) || 0;
        const taxPercent = Number(originalProduct.taxValue) || 0;
        const variantQty =
          originalProduct.variantValues.find(
            (value) => value.variantAttribute === product.selectedVariant
          )?.qty || 1;

        // Calculate unit price based on selected variant and quantity
        const adjustedPrice = unitPrice * (newQty / variantQty);
        const discountAmount = adjustedPrice * (discountValue / 100);
        const taxableAmount = adjustedPrice - discountAmount;
        const taxAmount = taxableAmount * (taxPercent / 100);
        const totalPrice = taxableAmount + taxAmount;

        return {
          ...product,
          quantity: newQty,
          price: totalPrice.toFixed(2),
          discountAmount: discountAmount.toFixed(2),
          taxAmount: taxAmount.toFixed(2),
        };
      }
      return product;
    });

    setSelectedProduct(updatedProducts);
  };

  const handlePaymentChange = (e) => {
    const payment = e.target.value;
    setPay(payment);
    setDuePayment(grandTotal - payment);
  };
  const handleSelectedProduct = (product) => {
    const alreadySelected = selectedProduct.find((p) => p._id === product._id);
    if (alreadySelected) {
      Swal.fire({
        icon: "error",
        title: "Product already selected",
        text: "You have already selected this product.",
        confirmButtonText: "OK",
        confirmButtonColor: "#00ff00",
        timer: 700,
      });
      return;
    }

    const qty = 1;
    const unitPrice = Number(product.price) || 0;
    const discountValue = Number(product.discountValue) || 0;
    const taxPercent = Number(product.taxValue) || 0;

    const subtotal = qty * unitPrice;
    const discountAmount = qty * discountValue;
    const taxableAmount = subtotal;
    const taxAmount = taxPercent * qty;
    const totalPrice = taxableAmount + taxAmount;

    const newProduct = {
      ...product,
      quantity: qty,
      discountAmount: discountAmount.toFixed(2),
      taxAmount: taxAmount.toFixed(2),
      price: Number(totalPrice.toFixed(2)),
    };

    setSelectedProduct([...selectedProduct, newProduct]);
  };

  const handleDeleteProduct = (p) => {
    const filteredData = selectedProduct.filter((item) => item._id !== p._id);
    setSelectedProduct(filteredData);
  };
  const handleCreateOrderSubmit = async (e) => {
    e.preventDefault();
    const formData = new FormData(e.target);
    const fromData = Object.fromEntries(formData.entries());

    // Form থেকে shipping cost নিন (যদি থাকে)
    const shippingCost = Number(fromData.shipping) || 0;
    const payment = Number(fromData.payment) || 0;
    const due = Number(fromData.due) || 0;

    const orderDiscount = totalDiscount || 0;
    const orderTax = totalOrderTax || 0;

    const payload = {
      customerId: selectedCustomer?.value,
      supplierId: selectedSupplier?.value,
      status: selectedStatus?.value,
      shipping: shippingCost,
      discount: orderDiscount,
      orderTax: orderTax,
      totalDiscount: totalDiscount.toFixed(2),
      totalTax: totalOrderTax.toFixed(2),
      grandTotal: grandTotal.toFixed(2),
      payment: payment.toFixed(2),
      due: due.toFixed(2),
      posId: pos?._id,
      products: selectedProduct.map((product) => ({
        productId: product._id,
        productName: product.productName,
        itemCode: product.itemCode,
        rate: product.parchacePrice,
        quantity: product.quantity,
        discountAmount: product.discountAmount,
        taxAmount: product.taxAmount,
        totalPrice: product.price,
      })),
    };

    try {
      const res = await createOrder(payload).unwrap();
      if (res) {
        Swal.fire({
          title: "Success!",
          text: "Order created successfully!",
          icon: "success",
          confirmButtonText: "OK",
          timer: 1000,
        });
        setSelectedProduct([]);
        setSelectedSupplier(null);
        setSelectedCustomer(null);
        setSelectedStatus(null);
        setSearch("");
        setPay(0);
        setDuePayment(0);
      }
    } catch (error) {
      Swal.fire({
        title: "Error!",
        text: " Customer suppier product blance fill up care fully !",
        icon: "error",
        confirmButtonText: "OK",
        timer: 1200,
      });
    }
  };
  const handlenextDue = (num, isEqual) => {
    if (Number(isEqual) === Number(0)) {
      Swal.fire({
        icon: "error",
        title: "Payment amount must be less than due amount",
        confirmButtonText: "OK",
        confirmButtonColor: "#00ff00",
        timer: 1000,
      });
      return;
    }
    setPayingAmount(num);
    setRemainingDueAmount(Number(selectedOrder?.due - num));
  };
  const handleDeletePayment = async (id) => {
    await deletePayment(id);
  };
  const handleVariantChange = (productId, selectedVariant) => {
    const updatedProducts = selectedProduct.map((product) => {
      if (product._id === productId) {
        return {
          ...product,
          selectedVariant,
          selectedVariantValue: "",
        };
      }
      return product;
    });
    setSelectedProduct(updatedProducts); // Update the state
  };

  const handleVariantValueChange = (productId, selectedVariantValue) => {
    const updatedProducts = selectedProduct.map((product) => {
      if (product._id === productId) {
        return {
          ...product,
          selectedVariantValue,
        };
      }
      return product;
    });
    setSelectedProduct(updatedProducts);
  };

  useEffect(() => {
    if (supplierList) {
      const supplierOptions = supplierList?.suppliers.map((supplier) => ({
        value: supplier._id,
        label: supplier.name,
      }));
      setSupplierName(supplierOptions);
    }
    if (usersList) {
      const customerOptions = usersList?.map((customer) => ({
        value: customer._id,
        label: customer.name,
      }));
      setCustomer(customerOptions);
    }
  }, [supplierList, supplierLoading, usersLoading, usersList]);

  const toggleFilterVisibility = () => {
    setIsFilterVisible((prevVisibility) => !prevVisibility);
  };
  const oldandlatestvalue = [
    { value: "latest", label: "Latest" },
    { value: "oldest", label: "oldest" },
  ];

  const status = [
    { value: "Pending", label: "Pending" },
    { value: "Completed", label: "Completed" },
    { value: "Cancelled", label: "Cancelled" },
  ];
  const paymentstatus = [
    { value: "Choose Payment Status", label: "Choose Payment Status" },
    { value: "Computers", label: "Computers" },
    { value: "Fruits", label: "Fruits" },
  ];

  const paymenttype = [
    { value: "Choose", label: "Choose" },
    { value: "Cash", label: "Cash" },
    { value: "Online", label: "Online" },
  ];
  console.log(selectedProduct);
  const handleDateChangeForCreatePayment = (date) => {
    setSelectedDateForPayment(date);
  };
  const handleDeleteOrder = async (id) => {
    await deleteOrder(id);
  };

  return (
    <div>
      <div className="page-wrapper">
        <div className="content">
          <div className="page-header">
            <div className="add-item d-flex">
              <div className="page-title">
                <h4>Sales List</h4>
                <h6>Manage Your Sales</h6>
              </div>
            </div>

            <div className="page-btn">
              <Link
                to="#"
                className="btn btn-added"
                data-bs-toggle="modal"
                data-bs-target="#add-sales-new"
              >
                <PlusCircle className="me-2" />
                Add New Sales
              </Link>
            </div>
          </div>
          {/* /product list */}
          <div className="card table-list-card">
            <div className="card-body">
              <div className="table-top">
                <div className="search-set">
                  <div className="search-input">
                    <input
                      type="text"
                      placeholder="Search"
                      value={searchDataForFIlter?.search}
                      onChange={(e) =>
                        setSearchDataForFIlter((prev) => ({
                          ...prev,
                          search: e.target.value,
                        }))
                      }
                      className="form-control form-control-sm formsearch"
                    />
                    <Link to className="btn btn-searchset">
                      <i data-feather="search" className="feather-search" />
                    </Link>
                  </div>
                </div>
                <div className="search-path">
                  <div className="d-flex align-items-center">
                    <div className="search-path">
                      <Link
                        className={`btn btn-filter ${
                          isFilterVisible ? "setclose" : ""
                        }`}
                        id="filter_search"
                      >
                        <Filter
                          className="filter-icon"
                          onClick={toggleFilterVisibility}
                        />
                        <span onClick={toggleFilterVisibility}>
                          <ImageWithBasePath
                            src="assets/img/icons/closes.svg"
                            alt="img"
                          />
                        </span>
                      </Link>
                    </div>
                  </div>
                </div>
                <div className="form-sort">
                  <Sliders className="info-img" />
                  <Select
                    className="select"
                    options={oldandlatestvalue}
                    value={searchDataForFIlter?.sort}
                    onChange={(selectedOption) =>
                      handleSearchDataForFIlter("sort", selectedOption)
                    }
                  />
                </div>
              </div>
              {/* /Filter========================= */}

              <div
                className={`card${isFilterVisible ? " visible" : ""}`}
                id="filter_inputs"
                style={{ display: isFilterVisible ? "block" : "none" }}
              >
                <div className="card-body pb-0">
                  <div className="row">
                    <div className="col-lg-3 col-sm-6 col-12">
                      <div className="input-blocks">
                        <User className="info-img" />
                        <Select
                          className="select"
                          options={customer}
                          value={searchDataForFIlter.customer}
                          onChange={(selectedOption) =>
                            handleSearchDataForFIlter(
                              "customer",
                              selectedOption
                            )
                          }
                        />
                      </div>
                    </div>

                    <div className="col-lg-2 col-sm-6 col-12">
                      <div className="input-blocks">
                        <StopCircle className="info-img" />
                        <Select
                          className="select"
                          options={status}
                          placeholder="Select Status"
                          value={searchDataForFIlter.status}
                          onChange={(selectedOption) =>
                            handleSearchDataForFIlter("status", selectedOption)
                          }
                        />
                      </div>
                    </div>

                    <div className="col-lg-2 col-sm-6 col-12">
                      <div className="input-blocks">
                        <FileText className="info-img" />
                        <input
                          type="text"
                          placeholder="Enter Reference"
                          className="form-control"
                          value={searchDataForFIlter.reference}
                          onChange={(e) =>
                            handleSearchDataForFIlter(
                              "reference",
                              e.target.value
                            )
                          }
                        />
                      </div>
                    </div>

                    <div className="col-lg-3 col-sm-6 col-12">
                      <div className="input-blocks">
                        <StopCircle className="info-img" />
                        <Select
                          className="select"
                          options={paymentstatus}
                          placeholder="Choose Payment Status"
                          value={searchDataForFIlter.paymentStatus}
                          onChange={(selectedOption) =>
                            handleSearchDataForFIlter(
                              "paymentStatus",
                              selectedOption
                            )
                          }
                        />
                      </div>
                    </div>

                    <div className="col-lg-2 col-sm-6 col-12">
                      <div className="input-blocks">
                        <Link className="btn btn-filters ms-auto">
                          <i data-feather="search" className="feather-search" />
                          Search
                        </Link>
                      </div>
                    </div>
                  </div>
                </div>
              </div>

              {/* /Filter ========================= */}
              {/* =============================== table deta */}
              <div className="table-responsive">
                <table className="table  datanew">
                  <thead>
                    <tr className="text-center">
                      <th>Customer Name</th>
                      <th>Reference</th>
                      <th>Date</th>
                      <th>Status</th>
                      <th>Grand Total</th>
                      <th>Paid</th>
                      <th>Due</th>
                      <th>Payment Status</th>
                      <th>Biller</th>
                      <th className="text-center">Action</th>
                    </tr>
                  </thead>
                  <tbody className="sales-list">
                    {orderList?.data.map((item, index) => (
                      <tr key={index} className="text-center">
                        <td>{item?.customerId?.name}</td>
                        <td>{item.reference}</td>
                        <td>
                          {new Date(item.createdAt).toLocaleDateString(
                            "en-GB",
                            {
                              day: "2-digit",
                              month: "short",
                              year: "numeric",
                            }
                          )}
                        </td>

                        <td>
                          <span className="badge badge-bgsuccess">
                            {item.status}
                          </span>
                        </td>
                        <td>{item.grandTotal}</td>
                        <td>{item.payment}</td>
                        <td>{item.due}</td>
                        <td>
                          <span className="badge badge-linesuccess">
                            {item.status}
                          </span>
                        </td>
                        <td>Admin</td>
                        <td className="text-center">
                          <div className="dropdown">
                            <button
                              className="btn action-set"
                              type="button"
                              data-bs-toggle="dropdown"
                              aria-expanded="false"
                            >
                              <i
                                className="fa fa-ellipsis-v"
                                aria-hidden="true"
                              ></i>
                            </button>
                            <ul className="dropdown-menu">
                              <li>
                                <button
                                  className="dropdown-item"
                                  data-bs-toggle="modal"
                                  data-bs-target="#sales-details-new"
                                  onClick={() => setSelectedOrder(item)}
                                  type="button"
                                >
                                  <i
                                    data-feather="eye"
                                    className="info-img"
                                  ></i>{" "}
                                  Sale Detail
                                </button>
                              </li>
                              <li>
                                <button
                                  className="dropdown-item"
                                  data-bs-toggle="modal"
                                  data-bs-target="#showpayment"
                                  onClick={() => setSelectedOrder(item)}
                                  type="button"
                                >
                                  <i
                                    data-feather="dollar-sign"
                                    className="info-img"
                                  ></i>{" "}
                                  Show Payments
                                </button>
                              </li>
                              <li>
                                <button
                                  className="dropdown-item"
                                  data-bs-toggle="modal"
                                  data-bs-target="#createpayment"
                                  onClick={() => setSelectedOrder(item)}
                                  type="button"
                                >
                                  <i
                                    data-feather="plus-circle"
                                    className="info-img"
                                  ></i>{" "}
                                  Create Payment
                                </button>
                              </li>
                              <li>
                                <button
                                  className="dropdown-item confirm-text mb-0"
                                  onClick={() => handleDeleteOrder(item?._id)}
                                  type="button"
                                >
                                  <i
                                    data-feather="trash-2"
                                    className="info-img"
                                  ></i>{" "}
                                  Delete Sale
                                </button>
                              </li>
                            </ul>
                          </div>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
              {/* ================================ */}
            </div>
          </div>
          {/* /product list */}
        </div>
      </div>
      <>
        {/*add popup */}
        <div className="modal fade" id="add-sales-new">
          <div className="modal-dialog add-centered">
            <div className="modal-content">
              <div className="page-wrapper p-0 m-0">
                <div className="content p-0">
                  <div className="modal-header border-0 custom-modal-header">
                    <div className="page-title">
                      <h4> Add Sales</h4>
                    </div>
                    <button
                      type="button"
                      className="close"
                      data-bs-dismiss="modal"
                      aria-label="Close"
                    >
                      <span aria-hidden="true">×</span>
                    </button>
                  </div>
                  <div className="card">
                    <div className="card-body">
                      <form onSubmit={handleCreateOrderSubmit}>
                        <div className="row">
                          <div className="col-lg-4 col-sm-6 col-12">
                            <div className="input-blocks">
                              <label>Customer Name</label>
                              <div className="row">
                                <div className="col-lg-10 col-sm-10 col-10">
                                  <Select
                                    className="select"
                                    options={customer}
                                    value={selectedCustomer}
                                    onChange={(option) =>
                                      setSelectedCustomer(option)
                                    }
                                  />
                                </div>
                                <div className="col-lg-2 col-sm-2 col-2 ps-0">
                                  <div className="add-icon">
                                    <Link to="#" className="choose-add">
                                      <PlusCircle className="plus" />
                                    </Link>
                                  </div>
                                </div>
                              </div>
                            </div>
                          </div>

                          <div className="col-lg-4 col-sm-6 col-12">
                            <div className="input-blocks">
                              <label>Supplier</label>

                              <Select
                                className="select"
                                options={suppliername}
                                placeholder="Newest"
                                value={selectedSupplier}
                                onChange={(option) =>
                                  setSelectedSupplier(option)
                                }
                              />
                            </div>
                          </div>
                          <div className="col-lg-12 col-sm-6 col-12">
                            <div className="input-blocks">
                              <label>Product Name</label>
                              <div className="input-groupicon select-code">
                                <input
                                  type="text"
                                  placeholder="Please type product code and select"
                                  className="form-control"
                                  name="productName"
                                  value={search}
                                  onChange={(e) => setSearch(e.target.value)}
                                />
                                <div className="addonset">
                                  <ImageWithBasePath
                                    src="assets/img/icons/qrcode-scan.svg"
                                    alt="img"
                                  />
                                </div>
                              </div>
                            </div>
                          </div>
                        </div>
                        {/* table for selecte product */}
                        <div className="table-responsive no-pagination">
                          <table className="table  datanew">
                            <thead>
                              <tr>
                                <th>Product</th>
                                <th className="text-center">Stock</th>
                                <th className="text-center"> Price</th>
                                <th className="text-center">Discount</th>
                                <th className="text-center">Tax</th>
                                <th className="text-center">Tax Amount</th>
                                <th className="text-center">Item Code</th>
                                <th className="text-center">Total Price</th>
                              </tr>
                            </thead>
                            <tbody style={{ cursor: "pointer" }}>
                              {productsList?.data.map((product, index) => (
                                <tr
                                  key={index}
                                  onClick={() => handleSelectedProduct(product)}
                                >
                                  <td>{product.productName}</td>
                                  <td className="text-center">
                                    {product.stock}
                                  </td>
                                  <td className="text-center">
                                    {product.price}
                                  </td>
                                  <td className="text-center">
                                    {product.discountValue}
                                  </td>
                                  <td className="text-center">
                                    {product.taxType}
                                  </td>
                                  <td className="text-center">
                                    {product.taxValue}
                                  </td>
                                  <td className="text-center">
                                    {product.itemCode}
                                  </td>
                                  <td className="text-center">
                                    {product.price}
                                  </td>
                                </tr>
                              ))}
                            </tbody>
                          </table>
                        </div>
                        {/* table for selecte product */}
                        {selectedProduct?.length > 0 && (
                          <div className="text-center my-4">
                            <h2 className="fw-bold text-primary">
                              Selected Product
                            </h2>
                          </div>
                        )}
                        {/* table for selected product */}
                        {selectedProduct?.length > 0 && (
                          <div className="table-responsive no-pagination">
                            <table className="table datanew">
                              <thead>
                                <tr>
                                  <th>Product</th>
                                  <th className="text-center">Qty</th>
                                  <th className="text-center">Variant</th>
                                  <th className="text-center">Variant Value</th>
                                  <th className="text-center">Price</th>
                                  <th className="text-center">Discount</th>
                                  <th className="text-center">Item Code</th>
                                  <th className="text-center">Total Price</th>

                                  <th className="text-center">Action</th>
                                </tr>
                              </thead>
                              <tbody>
                                {selectedProduct?.map((product, index) => (
                                  <tr key={index}>
                                    <td>{product.productName}</td>
                                    <td className="text-center">
                                      <input
                                        type="number"
                                        min="1"
                                        value={product.quantity}
                                        onChange={(e) =>
                                          handleQuantityChange(
                                            product._id,
                                            Number(e.target.value)
                                          )
                                        }
                                        className="form-control text-center"
                                        style={{
                                          maxWidth: "80px",
                                          margin: "0 auto",
                                        }}
                                      />
                                    </td>
                                    <td className="text-center">
                                      <select
                                        value={product.selectedVariant || ""}
                                        onChange={(e) =>
                                          handleVariantChange(
                                            product._id,
                                            e.target.value
                                          )
                                        }
                                        className="form-control"
                                      >
                                        <option value="">Select Variant</option>
                                        {product.variantAttribute?.map(
                                          (variant, idx) => (
                                            <option key={idx} value={variant}>
                                              {variant}
                                            </option>
                                          )
                                        )}
                                      </select>
                                    </td>
                                    <td className="text-center">
                                      <select
                                        value={
                                          product.selectedVariantValue || ""
                                        }
                                        onChange={(e) =>
                                          handleVariantValueChange(
                                            product._id,
                                            e.target.value
                                          )
                                        }
                                        className="form-control"
                                        disabled={!product.selectedVariant}
                                      >
                                        <option value="">
                                          Select Variant Value
                                        </option>
                                        {product.variantValues
                                          ?.filter(
                                            (variantValue) =>
                                              variantValue.variantAttribute ===
                                              product.selectedVariant
                                          )
                                          .map((variantValue, idx) => (
                                            <option
                                              key={idx}
                                              value={variantValue.value}
                                            >
                                              {variantValue.value}
                                            </option>
                                          ))}
                                      </select>
                                    </td>
                                    <td className="text-center">
                                      {product.price}
                                    </td>{" "}
                                    {/* Price after calculation */}
                                    <td className="text-center">
                                      {product.discountAmount}
                                    </td>{" "}
                                    {/* Discount after calculation */}
                                    <td className="text-center">
                                      {product.itemCode}
                                    </td>
                                    <td className="text-center">
                                      {product.price}
                                    </td>{" "}
                                    {/* Total Price after discount */}
                                    <td
                                      className="text-center"
                                      onClick={() =>
                                        handleDeleteProduct(product)
                                      }
                                    >
                                      <ImageWithBasePath
                                        src="assets/img/icons/delete.svg"
                                        alt="img"
                                      />
                                    </td>
                                  </tr>
                                ))}
                              </tbody>
                            </table>
                          </div>
                        )}

                        {/* table end */}
                        <div className="row">
                          <div className="col-lg-6 ms-auto">
                            <div className="total-order w-100 max-widthauto m-auto mb-4">
                              <ul>
                                <li>
                                  <h4>Order Tax</h4>
                                  <h5> {totalOrderTax}</h5>
                                </li>
                                <li>
                                  <h4>Discount</h4>
                                  <h5>{totalDiscount}</h5>
                                </li>

                                <li>
                                  <h4>Grand Total</h4>
                                  <h5>{grandTotal}</h5>
                                </li>
                                <li>
                                  <h4>Payment</h4>
                                  <input
                                    type="text"
                                    className="form-control text-center"
                                    name="payment"
                                    value={pay}
                                    onChange={(e) => handlePaymentChange(e)}
                                  />
                                </li>
                                <li>
                                  <h4>Due</h4>
                                  <input
                                    type="text"
                                    className="form-control text-center"
                                    name="due"
                                    value={duePayment}
                                    readOnly
                                  />
                                </li>
                              </ul>
                            </div>
                          </div>
                        </div>
                        <div className="row">
                          <div className="col-lg-3 col-sm-6 col-12">
                            <div className="input-blocks mb-5">
                              <label>Status</label>
                              <Select
                                className="select"
                                options={status}
                                placeholder="status"
                                value={selectedStatus}
                                onChange={(option) => setSelectedStatus(option)}
                              />
                            </div>
                          </div>
                          <div className="col-lg-12 text-end">
                            <button
                              type="button"
                              className="btn btn-cancel add-cancel me-3"
                              data-bs-dismiss="modal"
                            >
                              Cancel
                            </button>
                            <button
                              type="submit"
                              data-bs-dismiss="modal"
                              className="btn btn-submit add-sale"
                            >
                              Submit
                            </button>
                          </div>
                        </div>
                      </form>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
        {/* /add popup */}
        {/* details popup */}
        <div className="modal fade" id="sales-details-new">
          <div className="modal-dialog sales-details-modal">
            <div className="modal-content" ref={salesDetailsRef}>
              <div className="page-wrapper details-blk">
                <div className="content p-0">
                  <div className="page-header p-4 mb-0">
                    <div className="add-item d-flex">
                      <div className="page-title modal-datail">
                        <h4>Sales Detail </h4>
                      </div>
                    </div>
                    <ul className="table-top-head">
                      <li>
                        <Link
                          data-bs-toggle="tooltip"
                          data-bs-placement="top"
                          title="Pdf"
                          onClick={() => handleDownloadPDF(salesDetailsRef)}
                        >
                          <ImageWithBasePath
                            src="assets/img/icons/pdf.svg"
                            alt="img"
                          />
                        </Link>
                      </li>
                      <li>
                        <Link
                          data-bs-toggle="tooltip"
                          data-bs-placement="top"
                          title="Excel"
                          onClick={() =>
                            handleDownloadExcel({
                              data: selectedOrder?.products?.map((product) => ({
                                Product: product.productName,
                                Quantity: product.quantity,
                                Code: product.itemCode,
                                Discount: product.discountAmount,
                                Tax: product.taxAmount,
                                Total: product.totalPrice,
                              })),
                              fileName: `sales-details-${selectedOrder.invoiceNumber}.xlsx`,
                              sheetName: "Sales Info",
                            })
                          }
                        >
                          <ImageWithBasePath
                            src="assets/img/icons/excel.svg"
                            alt="img"
                          />
                        </Link>
                      </li>
                      <li>
                        <Link
                          data-bs-toggle="tooltip"
                          data-bs-placement="top"
                          title="Print"
                          onClick={() => handlePrint(salesDetailsRef)}
                        >
                          <i
                            data-feather="printer"
                            className="feather-rotate-ccw"
                          />
                        </Link>
                      </li>
                    </ul>
                  </div>
                  <div className="card">
                    <div className="card-body">
                      <form>
                        <div
                          className="invoice-box table-height"
                          style={{
                            maxWidth: 1600,
                            width: "100%",
                            overflow: "auto",
                            padding: 0,
                            fontSize: 14,
                            lineHeight: 24,
                            color: "#555",
                          }}
                        >
                          <h5 className="order-text">Order Summary</h5>
                          <div className="table-responsive no-pagination">
                            <table className="table  datanew">
                              <thead>
                                <tr className="text-center">
                                  <th className="text-start">Product</th>
                                  <th>Qty</th>
                                  <th>Product Code</th>
                                  <th>Discount</th>
                                  <th>Tax </th>
                                  <th>Total </th>
                                </tr>
                              </thead>
                              <tbody>
                                {selectedOrder?.products?.map(
                                  (product, index) => (
                                    <tr key={index} className="text-center">
                                      <td>
                                        <div className="productimgname">
                                          <Link to="#">
                                            {product.productName}
                                          </Link>
                                        </div>
                                      </td>
                                      <td>
                                        <p>{product.quantity}</p>
                                      </td>
                                      <td>{product.itemCode}</td>
                                      <td>{product.discountAmount}</td>
                                      <td>{product.taxAmount}</td>
                                      <td>{product?.totalPrice}</td>
                                    </tr>
                                  )
                                )}
                              </tbody>
                            </table>
                          </div>
                        </div>
                        <div className="row">
                          <div className="row">
                            <div className="col-lg-6 ms-auto">
                              <div className="total-order w-100 max-widthauto m-auto mb-4">
                                <ul>
                                  <li>
                                    <h4>Order Tax</h4>
                                    <h5>{selectedOrder?.totalTax}</h5>
                                  </li>
                                  <li>
                                    <h4>Discount</h4>
                                    <h5>{selectedOrder?.totalDiscount}</h5>
                                  </li>
                                  <li>
                                    <h4>Grand Total</h4>
                                    <h5>{selectedOrder?.grandTotal}</h5>
                                  </li>
                                  <li>
                                    <h4>Paid</h4>
                                    <h5>{selectedOrder?.payment}</h5>
                                  </li>
                                  <li>
                                    <h4>Due</h4>
                                    <h5>{selectedOrder?.due}</h5>
                                  </li>
                                </ul>
                              </div>
                            </div>
                          </div>
                        </div>
                      </form>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
        {/* /details popup */}

        {/* show payment Modal */}
        <div
          className="modal fade"
          id="showpayment"
          tabIndex={-1}
          aria-labelledby="showpayment"
          aria-hidden="true"
        >
          <div className="modal-dialog modal-dialog-centered stock-adjust-modal">
            <div className="modal-content">
              <div className="page-wrapper-new p-0">
                <div className="content">
                  <div className="modal-header border-0 custom-modal-header">
                    <div className="page-title">
                      <h4>Show Payments</h4>
                    </div>
                    <button
                      type="button"
                      className="close"
                      data-bs-dismiss="modal"
                      aria-label="Close"
                    >
                      <span aria-hidden="true">×</span>
                    </button>
                  </div>
                  <div className="modal-body custom-modal-body">
                    <div className="row">
                      <div className="col-lg-12">
                        <div className="modal-body-table total-orders">
                          <div className="table-responsive">
                            <table className="table  datanew">
                              <thead>
                                <tr>
                                  <th>Date</th>
                                  <th>Amount</th>
                                  <th>Paid By</th>
                                  <th className="no-sort">Action</th>
                                </tr>
                              </thead>
                              <tbody>
                                {singelPaymentHistory?.map((item, index) => (
                                  <tr key={index}>
                                    <td>
                                      {new Date(
                                        item.createdAt
                                      ).toLocaleDateString("en-GB", {
                                        day: "2-digit",
                                        month: "short",
                                        year: "numeric",
                                      })}
                                    </td>

                                    <td>{item?.paymentAmount}</td>
                                    <td>{item?.method}</td>
                                    <td className="action-table-data">
                                      <div className="edit-delete-action">
                                        <p
                                          className="confirm-text p-2"
                                          onClick={() =>
                                            handleDeletePayment(item?._id)
                                          }
                                        >
                                          <i
                                            data-feather="trash-2"
                                            className="feather-trash-2"
                                          />
                                        </p>
                                      </div>
                                    </td>
                                  </tr>
                                ))}
                              </tbody>
                            </table>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
        {/* show payment Modal */}
        {/* Create payment Modal */}
        <div
          className="modal fade"
          id="createpayment"
          tabIndex={-1}
          aria-labelledby="createpayment"
          aria-hidden="true"
        >
          <div className="modal-dialog modal-lg modal-dialog-centered">
            <div className="modal-content">
              <div className="modal-header border-0 custom-modal-header">
                <div className="page-title">
                  <h4>Create Payments</h4>
                </div>
                <button
                  type="button"
                  className="close"
                  data-bs-dismiss="modal"
                  aria-label="Close"
                >
                  <span aria-hidden="true">×</span>
                </button>
              </div>
              <div className="modal-body custom-modal-body">
                <form onSubmit={handleCreatePayment}>
                  <div className="row">
                    <div className="col-lg-6">
                      <div className="input-blocks">
                        <label> Date</label>
                        <div className="input-groupicon calender-input">
                          <DatePicker
                            value={selectedDateForPayment}
                            onChange={handleDateChangeForCreatePayment}
                            className="filterdatepicker"
                            placeholder="Choose Date"
                            format="DD-MM-YYYY"
                            readOnly
                            disabled
                          />
                        </div>
                      </div>
                    </div>
                  </div>
                  <div className="row">
                    <div className="col-lg-3 col-sm-12 col-12">
                      <div className="input-blocks">
                        <label>Total due Amount</label>
                        <div className="input-groupicon calender-input">
                          <i data-feather="dollar-sign" className="info-img" />
                          <input
                            type="text"
                            name="due"
                            className="form-control text-center"
                            readOnly
                            value={selectedOrder?.due ?? 0}
                          />
                        </div>
                      </div>
                    </div>
                    <div className="col-lg-3 col-sm-12 col-12">
                      <div className="input-blocks">
                        <label>Paying Amount</label>
                        <div className="input-groupicon calender-input">
                          <i data-feather="dollar-sign" className="info-img" />
                          <input
                            type="number"
                            name="payingamount"
                            className="form-control text-center"
                            value={payingAmount ?? 0}
                            onChange={(e) =>
                              handlenextDue(e.target.value, selectedOrder?.due)
                            }
                          />
                        </div>
                      </div>
                    </div>
                    <div className="col-lg-3 col-sm-12 col-12">
                      <div className="input-blocks">
                        <label>Due Blance</label>
                        <div className="input-groupicon calender-input">
                          <i data-feather="dollar-sign" className="info-img" />
                          <input
                            type="number"
                            name="dueblance"
                            className="form-control text-center"
                            value={remaingDueAmount ?? 0}
                            readOnly
                          />
                        </div>
                      </div>
                    </div>
                    <div className="col-lg-3 col-sm-12 col-12">
                      <div className="input-blocks">
                        <label>Payment type</label>

                        <Select
                          className="select"
                          options={paymenttype}
                          placeholder="Newest"
                          value={method}
                          onChange={(options) => setMethod(options)}
                        />
                      </div>
                    </div>
                    <div className="col-lg-12">
                      <div className="input-blocks">
                        <label>Description</label>
                        <textarea
                          className="form-control"
                          name="description"
                          defaultValue={""}
                        />
                        <p>Maximum 60 Characters</p>
                      </div>
                    </div>
                  </div>
                  <div className="col-lg-12">
                    <div className="modal-footer-btn">
                      <button
                        type="button"
                        className="btn btn-cancel me-2"
                        data-bs-dismiss="modal"
                      >
                        Cancel
                      </button>
                      <button
                        type="submit"
                        className="btn btn-submit"
                        data-bs-dismiss="modal"
                      >
                        Submit
                      </button>
                    </div>
                  </div>
                </form>
              </div>
            </div>
          </div>
        </div>
        {/* Create payment Modal */}
        {/* edit payment Modal */}
        <div
          className="modal fade"
          id="editpayment"
          tabIndex={-1}
          aria-labelledby="editpayment"
          aria-hidden="true"
        >
          <div className="modal-dialog modal-lg modal-dialog-centered">
            <div className="modal-content">
              <div className="modal-header border-0 custom-modal-header">
                <div className="page-title">
                  <h4>Edit Payments</h4>
                </div>
                <button
                  type="button"
                  className="close"
                  data-bs-dismiss="modal"
                  aria-label="Close"
                >
                  <span aria-hidden="true">×</span>
                </button>
              </div>
              <div className="modal-body custom-modal-body">
                <form>
                  <div className="row">
                    <div className="col-lg-6">
                      <div className="input-blocks">
                        <label>19 Jan 2023</label>
                        <div className="input-groupicon calender-input">
                          <i data-feather="calendar" className="info-img" />
                          <input
                            type="text"
                            className="datetimepicker form-control"
                            placeholder="Select Date"
                          />
                        </div>
                      </div>
                    </div>
                    <div className="col-lg-6 col-sm-12 col-12">
                      <div className="input-blocks">
                        <label>Reference</label>
                        <input type="text" defaultValue="INV/SL0101" />
                      </div>
                    </div>
                  </div>
                  <div className="row">
                    <div className="col-lg-4 col-sm-12 col-12">
                      <div className="input-blocks">
                        <label>Received Amount</label>
                        <div className="input-groupicon calender-input">
                          <i data-feather="dollar-sign" className="info-img" />
                          <input type="text" defaultValue={1500} />
                        </div>
                      </div>
                    </div>
                    <div className="col-lg-4 col-sm-12 col-12">
                      <div className="input-blocks">
                        <label>Paying Amount</label>
                        <div className="input-groupicon calender-input">
                          <i data-feather="dollar-sign" className="info-img" />
                          <input type="text" defaultValue={1500} />
                        </div>
                      </div>
                    </div>
                    <div className="col-lg-4 col-sm-12 col-12">
                      <div className="input-blocks">
                        <label>Payment type</label>
                        <select className="select">
                          <option>Cash</option>
                          <option>Online</option>
                          <option>Inprogress</option>
                        </select>
                      </div>
                    </div>
                    <div className="col-lg-12">
                      <div className="input-blocks summer-description-box transfer">
                        <label>Description</label>
                        <textarea className="form-control" defaultValue={""} />
                      </div>
                      <p>Maximum 60 Characters</p>
                    </div>
                  </div>
                  <div className="col-lg-12">
                    <div className="modal-footer-btn mb-3 me-3">
                      <button
                        type="button"
                        className="btn btn-cancel me-2"
                        data-bs-dismiss="modal"
                      >
                        Cancel
                      </button>
                      <button type="submit" className="btn btn-submit">
                        Save Changes
                      </button>
                    </div>
                  </div>
                </form>
              </div>
            </div>
          </div>
        </div>
        {/* edit payment Modal */}
        <div className="customizer-links" id="setdata">
          <ul className="sticky-sidebar">
            <li className="sidebar-icons">
              <Link
                to="#"
                className="navigation-add"
                data-bs-toggle="tooltip"
                data-bs-placement="left"
                data-bs-original-title="Theme"
              >
                <i data-feather="settings" className="feather-five" />
              </Link>
            </li>
          </ul>
        </div>
      </>
    </div>
  );
};

export default SalesList;
