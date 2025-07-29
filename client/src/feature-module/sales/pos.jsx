import React, { useEffect, useMemo, useState } from "react";
import { Link } from "react-router-dom";
import { Box } from "react-feather";
import ImageWithBasePath from "../../core/img/imagewithbasebath";
import { RotateCw } from "feather-icons-react/build/IconComponents";
import { Check, CheckCircle, Trash2, UserPlus } from "react-feather";
import Select from "react-select";
import PlusCircle from "feather-icons-react/build/IconComponents/PlusCircle";
import MinusCircle from "feather-icons-react/build/IconComponents/MinusCircle";
import { OverlayTrigger, Tooltip } from "react-bootstrap";
import withReactContent from "sweetalert2-react-content";
import Swal from "sweetalert2";
import Slider from "react-slick";
import "slick-carousel/slick/slick.css";
import "slick-carousel/slick/slick-theme.css";
import { useDispatch } from "react-redux";
import {
  addProduct,
  removeProduct,
  clearCart,
} from "../../core/redux/actions/orderAction";
import { useSelector } from "react-redux";
import { useGetCategoriesQuery } from "../../core/redux/api/categoryApi/categoryApi";
import { usePos } from "../../hooks/PosProvider";
import { useGetProductsQuery } from "../../core/redux/api/productapi/productApi";
import { useCreateOrderMutation } from "../../core/redux/api/orderApi/orderApi";
import { useGetUsersQuery } from "../../core/redux/api/userApi/userApi";

const Pos = () => {
  // state mangement
  const [mainCategoryCount, setMainCategoryCount] = useState(0);
  const [mainCategoryListShowing, setMainCategoryListShowing] = useState([]);
  const [catchCategoryId, setCatchCategoryId] = useState("allCategory");
  const [quantity, setQuantity] = useState(1);
  const [customers, setCustomers] = useState([]);
  const [paidPayment, setPaidPayment] = useState(0);
  const [paymentMethod, setPaymentMethod] = useState("");
  const [selectedCustomer, setSelectedCustomer] = useState(null);

  const dispatch = useDispatch();
  const [createOrder] = useCreateOrderMutation();
  // data management
  const { pos } = usePos();
  const reduxStateOrders = useSelector((state) => state.posCart);
  // const [createUser]=useCreateUserMutation();
  const { data: categoriesList } = useGetCategoriesQuery(
    {
      pos: pos?._id,
    },
    { skip: !pos?._id }
  );

  const { data: productsList } = useGetProductsQuery(
    {
      pos: pos?._id,
      categoryId: catchCategoryId,
    },
    { skip: !pos?._id }
  );
  const { data: usersList, isLoading: usersLoading } = useGetUsersQuery(
    {
      posId: pos?._id,
      role: "customer",
    },
    {
      skip: !pos?._id,
    }
  );
  const handleProductOrder = (id) => {
    dispatch(addProduct(id));
  };
  useEffect(() => {
    if (categoriesList?.data) {
      setMainCategoryCount(categoriesList?.data.length);
      setMainCategoryListShowing(categoriesList?.data);
    }
    if (usersList && !usersLoading) {
      const customerList = usersList?.map((user) => ({
        value: user._id,
        label: user.name,
      }));
      setCustomers(customerList);
    }
  }, [categoriesList, usersLoading, usersList]);
  const orderTax = useMemo(() => {
    return reduxStateOrders?.products.reduce(
      (acc, curr) => acc + curr.taxValue * quantity,
      0
    );
  }, [reduxStateOrders?.products, quantity]);
  const discountAmount = useMemo(() => {
    return reduxStateOrders?.products.reduce(
      (acc, curr) => acc + curr.discountValue * quantity,
      0
    );
  }, [reduxStateOrders?.products, quantity]);
  const shippingValue = useMemo(() => {
    return reduxStateOrders?.products.reduce(
      (acc, curr) => acc + curr?.shippingValue * quantity,
      0
    );
  }, [reduxStateOrders?.products, quantity]);
  const subTotal = useMemo(() => {
    return reduxStateOrders?.products.reduce(
      (acc, curr) => acc + curr?.price * quantity,
      0
    );
  }, [reduxStateOrders?.products, quantity]);
  const subTotalWithOutDiscount = useMemo(() => {
    const total =
      Number(subTotal) + Number(orderTax) + (Number(shippingValue) || 0);
    return total;
  }, [orderTax, shippingValue, subTotal]);
  const grandTotal = useMemo(() => {
    return subTotalWithOutDiscount - discountAmount;
  }, [subTotalWithOutDiscount, discountAmount]);
  const deuPayment = useMemo(() => {
    return grandTotal - paidPayment;
  }, [grandTotal, paidPayment]);

  // data management end

  const tax = [
    { value: "exclusive", label: "Exclusive" },
    { value: "inclusive", label: "Inclusive" },
  ];
  const discounttype = [
    { value: "percentage", label: "Percentage" },
    { value: "earlyPaymentDiscounts", label: "Early payment discounts" },
  ];
  const units = [
    { value: "kilogram", label: "Kilogram" },
    { value: "grams", label: "Grams" },
  ];

  const handleDecrement = (product) => {
    if (
      (product.stock >= 1 && quantity < product.stock && quantity > 1) ||
      (product.stock >= 1 && quantity <= product.stock && quantity > 1)
    ) {
      setQuantity(quantity - 1);
    }
  };
  const handleIncrement = (product) => {
    if (product.stock >= 1 && quantity < product.stock) {
      setQuantity(quantity + 1);
    }
  };
  const handleOrderSubmit = async (statusType) => {
    try {
      const orderData = {
        customerId: selectedCustomer, // বা যেটা সিলেক্ট হবে
        posId: pos?._id,
        status: statusType, // "hold" | "void" | "Completed"
        paymentMethod: paymentMethod?.toLocaleLowerCase || "cash",
        products: reduxStateOrders?.products?.map((p) => ({
          productId: p._id,
          productName: p.productName,
          itemCode: p.itemCode,
          quantity: p.quantity || 1,
          rate: p.price,
          taxAmount: p.taxValue,
          discountAmount: p.discountValue,
          totalPrice:
            p.price + p.taxValue + (p.shippingValue || 0) - p.discountValue,
        })),
        orderTax,
        shipping: shippingValue,
        discount: discountAmount,
        totalDiscount: discountAmount,
        totalTax: orderTax,
        grandTotal,
        payment: paidPayment,
        due: deuPayment,
      };

      const result = await createOrder(orderData).unwrap();
      if (result?.message === "Order created successfully") {
        Swal.fire("Success", "Order submitted as " + statusType, "success");
      }
    } catch (err) {
      Swal.fire(
        "Error",
        "Failed to create order. please slect all field",
        "error"
      );
    }
  };

  const renderTooltip = (props) => (
    <Tooltip id="pdf-tooltip" {...props}>
      Pdf
    </Tooltip>
  );
  const renderExcelTooltip = (props) => (
    <Tooltip id="excel-tooltip" {...props}>
      Excel
    </Tooltip>
  );
  const renderPrinterTooltip = (props) => (
    <Tooltip id="printer-tooltip" {...props}>
      Printer
    </Tooltip>
  );
  //
  const settings = {
    dots: false,
    autoplay: false,
    speed: 500,
    margin: 0,
    slidesToShow:
      mainCategoryListShowing?.length && mainCategoryListShowing.length < 5
        ? mainCategoryListShowing.length
        : 1000,
    responsive: [
      {
        breakpoint: 992,
        settings: {
          slidesToShow:
            mainCategoryListShowing?.length < 5
              ? mainCategoryListShowing.length
              : 5,
        },
      },
      {
        breakpoint: 800,
        settings: {
          slidesToShow:
            mainCategoryListShowing?.length < 4
              ? mainCategoryListShowing.length
              : 4,
        },
      },
      {
        breakpoint: 776,
        settings: {
          slidesToShow:
            mainCategoryListShowing?.length < 2
              ? mainCategoryListShowing.length
              : 2,
        },
      },
      {
        breakpoint: 567,
        settings: {
          slidesToShow: 1,
        },
      },
    ],
  };

  const MySwal = withReactContent(Swal);

  const showConfirmationAlert = (id) => {
    MySwal.fire({
      title: "Are you sure?",
      text: "You won't be able to revert this!",
      showCancelButton: true,
      confirmButtonColor: "#00ff00",
      confirmButtonText: "Yes, delete it!",
      cancelButtonColor: "#ff0000",
      cancelButtonText: "Cancel",
    }).then((result) => {
      if (result.isConfirmed) {
        dispatch(removeProduct(id));
        MySwal.fire({
          title: "Deleted!",
          text: "Your file has been deleted.",
          className: "btn btn-success",
          confirmButtonText: "OK",
          customClass: {
            confirmButton: "btn btn-success",
          },
        });
      } else {
        MySwal.close();
      }
    });
  };
  const handleReset = () => {
    window.location.reload();
  };
  return (
    <div>
      <div className="page-wrapper pos-pg-wrapper ms-0">
        <div className="content pos-design p-0">
          <div className="btn-row d-sm-flex align-items-center">
            <button className="btn btn-info" onClick={handleReset}>
              <span className="me-1 d-flex  align-items-center">
                <RotateCw className="feather-16 mr-1" /> Reset
              </span>
            </button>
          </div>
          <div className="row align-items-start pos-wrapper">
            <div className="col-md-12 col-lg-8">
              <div className="pos-categories tabs_wrapper">
                <h5>Categories</h5>
                <p>Select From Below Categories</p>
                <Slider
                  {...settings}
                  className="tabs owl-carousel pos-category"
                >
                  <div
                    id="all"
                    className="pos-slick-item"
                    onClick={() => setCatchCategoryId("allCategory")}
                  >
                    <Link to="#">
                      <ImageWithBasePath
                        src="assets/img/categories/category-01.png"
                        alt="Categories"
                      />
                    </Link>
                    <h6>
                      <Link to="#">All Categories</Link>
                    </h6>
                    <span>{mainCategoryCount} Items</span>
                  </div>
                  {mainCategoryListShowing?.map((category, index) => (
                    <div
                      key={index}
                      className="pos-slick-item flex flex-col items-center p-3 rounded-lg bg-white shadow-sm hover:shadow-md transition-all"
                      onClick={() => setCatchCategoryId(category?._id)}
                    >
                      <div className="w-12 h-12 bg-blue-100 text-blue-600 rounded-full flex items-center justify-center mb-2">
                        <Box size={28} color="#3b82f6" />
                      </div>
                      <h6 className="text-sm font-semibold">{category.name}</h6>
                    </div>
                  ))}
                </Slider>
                <div className="pos-products">
                  <div className="d-flex align-items-center justify-content-between">
                    <h5 className="mb-3">Products</h5>
                  </div>
                  <div className="tabs_container">
                    {/* dummy */}
                    <div className="tab_content active" data-tab="all">
                      <div className="row">
                        {productsList?.data.length > 0 &&
                          productsList.data.map((product) => (
                            <div
                              key={product._id}
                              className="col-sm-2 col-md-6 col-lg-3 col-xl-3 pe-2"
                              onClick={() => handleProductOrder(product)}
                            >
                              <div className="product-info default-cover card">
                                <div className="img-bg">
                                  <ImageWithBasePath
                                    src={
                                      product?.images?.[0]?.url ||
                                      "assets/img/products/default.png"
                                    }
                                    width={137}
                                    alt={product?.productName}
                                    isBase={true}
                                  />
                                  <span>
                                    <Check className="feather-16" />
                                  </span>
                                </div>

                                <h6 className="cat-name">
                                  <Link to="#">
                                    {product?.categoryName || "Category"}
                                  </Link>
                                </h6>

                                <h6 className="product-name">
                                  <Link to="#">{product?.productName}</Link>
                                </h6>

                                <div className="d-flex align-items-center justify-content-between price">
                                  <span>
                                    {product?.stock || 0}{" "}
                                    {product?.unitName || "Pcs"}
                                  </span>
                                  <p>
                                    <span className="text-success fw-bold fs-5">
                                      ৳{"-"}
                                    </span>
                                    {product?.price}
                                  </p>
                                </div>
                              </div>
                            </div>
                          ))}
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
            <div className="col-md-12 col-lg-4 ps-0">
              <aside className="product-order-list">
                <div className="customer-info block-section">
                  <h6>Customer Information</h6>
                  <div className="input-block d-flex align-items-center">
                    <div className="flex-grow-1">
                      <Select
                        options={customers}
                        className="select"
                        onChange={(option) =>
                          setSelectedCustomer(option?.value)
                        }
                      />
                    </div>
                    <Link
                      to="#"
                      className="btn btn-primary btn-icon"
                      data-bs-toggle="modal"
                      data-bs-target="#create"
                    >
                      <UserPlus className="feather-16" />
                    </Link>
                  </div>
                </div>
                {/* ====================================================== */}
                <div className="product-added block-section">
                  <div className="head-text d-flex align-items-center justify-content-between">
                    <h6 className="d-flex align-items-center mb-0">
                      Product Added
                    </h6>
                    <Link
                      to="#"
                      className="d-flex align-items-center text-danger"
                    >
                      <span className="me-1">
                        <i data-feather="x" className="feather-16" />
                      </span>
                      Clear all
                    </Link>
                  </div>
                  <div className="product-wrap">
                    {reduxStateOrders?.products?.map((item, index) => (
                      <div
                        key={index}
                        className="product-list d-flex align-items-center justify-content-between"
                      >
                        <div
                          className="d-flex align-items-center product-info"
                          data-bs-toggle="modal"
                          data-bs-target="#products"
                        >
                          <Link to="#" className="img-bg">
                            <ImageWithBasePath
                              src={item?.images[0]?.url}
                              isBase={true}
                              alt="Products"
                            />
                          </Link>
                          <div className="info">
                            <span>
                              {item?.productName
                                ?.split(" ")
                                .slice(0, 2)
                                .join(" ")}
                            </span>
                            <h6>
                              <Link to="#">{item.slug}</Link>
                            </h6>
                            <p>{"৳ " + item.price}</p>
                          </div>
                        </div>
                        <div className="qty-item text-center">
                          <OverlayTrigger
                            placement="top"
                            overlay={
                              <Tooltip id="tooltip-minus">Minus</Tooltip>
                            }
                          >
                            <Link
                              to="#"
                              className="dec d-flex justify-content-center align-items-center"
                              onClick={() => handleDecrement(item)}
                            >
                              <MinusCircle className="feather-14" />
                            </Link>
                          </OverlayTrigger>

                          <input
                            type="text"
                            className="form-control text-center"
                            name="qty"
                            value={quantity}
                            readOnly
                          />
                          <OverlayTrigger
                            placement="top"
                            overlay={<Tooltip id="tooltip-plus">Plus</Tooltip>}
                          >
                            <Link
                              to="#"
                              onClick={() => handleIncrement(item)}
                              className="inc d-flex justify-content-center align-items-center"
                              data-bs-toggle="tooltip"
                              data-bs-placement="top"
                              title="plus"
                            >
                              <PlusCircle className="feather-14" />
                            </Link>
                          </OverlayTrigger>
                        </div>
                        <div className="d-flex align-items-center action">
                          <Link
                            onClick={() => showConfirmationAlert(item._id)}
                            className="btn-icon delete-icon confirm-text"
                            to="#"
                          >
                            <Trash2 className="feather-14" />
                          </Link>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
                <div className="block-section">
                  <div className="selling-info">
                    <div className="row">
                      <div className="col-12 col-sm-4">
                        <div className="input-block">
                          <label>Order Tax</label>
                          <input
                            type="number"
                            name="orderTax"
                            className="form-control text-center"
                            value={orderTax}
                            readOnly
                          />
                        </div>
                      </div>
                      <div className="col-12 col-sm-4">
                        <div className="input-block">
                          <label>Shipping</label>
                          <input
                            type="number"
                            name="shipping"
                            className="form-control text-center"
                            value={shippingValue || 0}
                            readOnly
                          />
                        </div>
                      </div>
                      <div className="col-12 col-sm-4">
                        <div className="input-block">
                          <label>Discount</label>
                          <input
                            type="number"
                            name="discount"
                            className="form-control text-center"
                            value={discountAmount}
                            readOnly
                          />
                        </div>
                      </div>
                    </div>
                  </div>
                  <div className="order-total">
                    <table className="table table-responsive table-borderless">
                      <tbody>
                        <tr>
                          <td>Sub Total</td>
                          <td className="text-end">{subTotal}</td>
                        </tr>
                        <tr>
                          <td>Tax </td>
                          <td className="text-end">{orderTax}</td>
                        </tr>
                        <tr>
                          <td>Shipping</td>
                          <td className="text-end">{shippingValue || 0}</td>
                        </tr>
                        <tr>
                          <td>Sub Total</td>
                          <td className="text-end">
                            {subTotalWithOutDiscount}
                          </td>
                        </tr>
                        <tr>
                          <td className="danger">Discount</td>
                          <td className="danger text-end">{discountAmount}</td>
                        </tr>
                        <tr>
                          <td>Total</td>
                          <td className="text-end">{grandTotal}</td>
                        </tr>
                        <tr>
                          <td>Payment</td>
                          <td className="text-end">
                            <>
                              <style>{`
                              input[type=number]::-webkit-inner-spin-button,
                              input[type=number]::-webkit-outer-spin-button {-webkit-appearance: none;
                              margin: 0;}
                              input[type=number] {-moz-appearance: textfield;}`}</style>

                              <input
                                type="number"
                                name="paidPayment"
                                className="form-control text-center"
                                value={paidPayment}
                                onChange={(e) => setPaidPayment(e.target.value)}
                              />
                            </>
                          </td>
                        </tr>
                        <tr>
                          <td>Deu</td>
                          <td className="text-end">{deuPayment}</td>
                        </tr>
                      </tbody>
                    </table>
                  </div>
                </div>
                <div className="block-section payment-method">
                  <h6>Payment Method</h6>
                  <div className="row d-flex align-items-center justify-content-center methods">
                    <div className="col-md-6 col-lg-4 item">
                      <div
                        className="default-cover"
                        onClick={() => setPaymentMethod("cash")}
                      >
                        <Link to="#">
                          <ImageWithBasePath
                            src="assets/img/icons/cash-pay.svg"
                            alt="Payment Method"
                          />
                          <span>Cash</span>
                        </Link>
                      </div>
                    </div>
                    <div className="col-md-6 col-lg-4 item">
                      <div
                        className="default-cover"
                        onClick={() => setPaymentMethod("card")}
                      >
                        <Link to="#">
                          <ImageWithBasePath
                            src="assets/img/icons/credit-card.svg"
                            alt="Payment Method"
                          />
                          <span>Debit Card</span>
                        </Link>
                      </div>
                    </div>
                    <div className="col-md-6 col-lg-4 item">
                      <div
                        className="default-cover"
                        onClick={() => setPaymentMethod("scan")}
                      >
                        <Link to="#">
                          <ImageWithBasePath
                            src="assets/img/icons/qr-scan.svg"
                            alt="Payment Method"
                          />
                          <span>Scan</span>
                        </Link>
                      </div>
                    </div>
                  </div>
                </div>
                <div className="d-grid btn-block">
                  <Link className="btn btn-secondary" to="#">
                    Grand Total : {"৳ " + grandTotal}
                  </Link>
                </div>

                <div className="btn-row d-sm-flex align-items-center justify-content-between">
                  <Link
                    to="#"
                    className="btn btn-info btn-icon flex-fill"
                    data-bs-toggle="modal"
                    data-bs-target="#hold-order"
                    onClick={() => handleOrderSubmit("hold")}
                  >
                    <span className="me-1 d-flex align-items-center">
                      <i data-feather="pause" className="feather-16" />
                    </span>
                    Hold
                  </Link>
                  <Link
                    to="#"
                    className="btn btn-danger btn-icon flex-fill"
                    onClick={() => handleOrderSubmit("void")}
                  >
                    <span className="me-1 d-flex align-items-center">
                      <i data-feather="trash-2" className="feather-16" />
                    </span>
                    Void
                  </Link>
                  <Link
                    to="#"
                    className="btn btn-success btn-icon flex-fill"
                    data-bs-toggle="modal"
                    data-bs-target="#payment-completed"
                    onClick={() => handleOrderSubmit("Completed")}
                  >
                    <span className="me-1 d-flex align-items-center">
                      <i data-feather="credit-card" className="feather-16" />
                    </span>
                    Payment
                  </Link>
                </div>
              </aside>
            </div>
          </div>
        </div>
      </div>

      {/* Payment Completed */}
      <div
        className="modal fade modal-default"
        id="payment-completed"
        aria-labelledby="payment-completed"
      >
        <div className="modal-dialog modal-dialog-centered">
          <div className="modal-content">
            <div className="modal-body text-center">
              <form>
                <div className="icon-head">
                  <Link to="#">
                    <CheckCircle className="feather-40" />
                  </Link>
                </div>
                <h4>Payment Completed</h4>
                <p className="mb-0">
                  Do you want to Print Receipt for the Completed Order
                </p>
                <div className="modal-footer d-sm-flex justify-content-between">
                  <button
                    type="button"
                    className="btn btn-primary flex-fill me-1"
                    data-bs-toggle="modal"
                    data-bs-target="#print-receipt"
                  >
                    Print Receipt
                  </button>
                  <Link
                    to="#"
                    className="btn btn-secondary flex-fill"
                    data-bs-dismiss="modal"
                    onClick={() => {
                      setPaidPayment(0);
                      dispatch(clearCart());
                    }}
                  >
                    Next Order
                  </Link>
                </div>
              </form>
            </div>
          </div>
        </div>
      </div>
      {/* /Payment Completed */}
      {/* Print Receipt */}
      <div
        className="modal fade modal-default"
        id="print-receipt"
        aria-labelledby="print-receipt"
      >
        <div className="modal-dialog modal-dialog-centered">
          <div className="modal-content">
            <div className="d-flex justify-content-end">
              <button
                type="button"
                className="close p-0"
                data-bs-dismiss="modal"
                aria-label="Close"
              >
                <span aria-hidden="true">×</span>
              </button>
            </div>
            <div className="modal-body">
              <div className="icon-head text-center">
                <Link to="#">
                  <ImageWithBasePath
                    src="assets/img/logo.png"
                    width={100}
                    height={30}
                    alt="Receipt Logo"
                  />
                </Link>
              </div>
              <div className="text-center info text-center">
                <h6>Dreamguys Technologies Pvt Ltd.,</h6>
                <p className="mb-0">Phone Number: +1 5656665656</p>
                <p className="mb-0">
                  Email:{" "}
                  <Link to="mailto:example@gmail.com">example@gmail.com</Link>
                </p>
              </div>
              <div className="tax-invoice">
                <h6 className="text-center">Tax Invoice</h6>
                <div className="row">
                  <div className="col-sm-12 col-md-6">
                    <div className="invoice-user-name">
                      <span>Name: </span>
                      <span>John Doe</span>
                    </div>
                    <div className="invoice-user-name">
                      <span>Invoice No: </span>
                      <span>CS132453</span>
                    </div>
                  </div>
                  <div className="col-sm-12 col-md-6">
                    <div className="invoice-user-name">
                      <span>Customer Id: </span>
                      <span>#LL93784</span>
                    </div>
                    <div className="invoice-user-name">
                      <span>Date: </span>
                      <span>01.07.2022</span>
                    </div>
                  </div>
                </div>
              </div>
              <table className="table-borderless w-100 table-fit">
                <thead>
                  <tr>
                    <th># Item</th>
                    <th>Price</th>
                    <th>Qty</th>
                    <th className="text-end">Total</th>
                  </tr>
                </thead>
                <tbody>
                  <tr>
                    <td>1. Red Nike Laser</td>
                    <td>$50</td>
                    <td>3</td>
                    <td className="text-end">$150</td>
                  </tr>
                  <tr>
                    <td>2. Iphone 14</td>
                    <td>$50</td>
                    <td>2</td>
                    <td className="text-end">$100</td>
                  </tr>
                  <tr>
                    <td>3. Apple Series 8</td>
                    <td>$50</td>
                    <td>3</td>
                    <td className="text-end">$150</td>
                  </tr>
                  <tr>
                    <td colSpan={4}>
                      <table className="table-borderless w-100 table-fit">
                        <tbody>
                          <tr>
                            <td>Sub Total :</td>
                            <td className="text-end">$700.00</td>
                          </tr>
                          <tr>
                            <td>Discount :</td>
                            <td className="text-end">-$50.00</td>
                          </tr>
                          <tr>
                            <td>Shipping :</td>
                            <td className="text-end">0.00</td>
                          </tr>
                          <tr>
                            <td>Tax (5%) :</td>
                            <td className="text-end">$5.00</td>
                          </tr>
                          <tr>
                            <td>Total Bill :</td>
                            <td className="text-end">$655.00</td>
                          </tr>
                          <tr>
                            <td>Due :</td>
                            <td className="text-end">$0.00</td>
                          </tr>
                          <tr>
                            <td>Total Payable :</td>
                            <td className="text-end">$655.00</td>
                          </tr>
                        </tbody>
                      </table>
                    </td>
                  </tr>
                </tbody>
              </table>
              <div className="text-center invoice-bar">
                <p>
                  **VAT against this challan is payable through central
                  registration. Thank you for your business!
                </p>
                <Link to="#">
                  <ImageWithBasePath
                    src="assets/img/barcode/barcode-03.jpg"
                    alt="Barcode"
                  />
                </Link>
                <p>Sale 31</p>
                <p>Thank You For Shopping With Us. Please Come Again</p>
                <Link to="#" className="btn btn-primary">
                  Print Receipt
                </Link>
              </div>
            </div>
          </div>
        </div>
      </div>
      {/* /Print Receipt */}
      {/* Products */}
      <div
        className="modal fade modal-default pos-modal"
        id="products"
        aria-labelledby="products"
      >
        <div className="modal-dialog modal-dialog-centered">
          <div className="modal-content">
            <div className="modal-header p-4 d-flex align-items-center justify-content-between">
              <div className="d-flex align-items-center">
                <h5 className="me-4">Products</h5>
                <span className="badge bg-info d-inline-block mb-0">
                  Order ID : #666614
                </span>
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
            <div className="modal-body p-4">
              <form>
                <div className="product-wrap">
                  <div className="product-list d-flex align-items-center justify-content-between">
                    <div className="d-flex align-items-center flex-fill">
                      <Link to="#" className="img-bg me-2">
                        <ImageWithBasePath
                          src="assets/img/products/pos-product-16.png"
                          alt="Products"
                        />
                      </Link>
                      <div className="info d-flex align-items-center justify-content-between flex-fill">
                        <div>
                          <span>PT0005</span>
                          <h6>
                            <Link to="#">Red Nike Laser</Link>
                          </h6>
                        </div>
                        <p>$2000</p>
                      </div>
                    </div>
                  </div>
                  <div className="product-list d-flex align-items-center justify-content-between">
                    <div className="d-flex align-items-center flex-fill">
                      <Link to="#" className="img-bg me-2">
                        <ImageWithBasePath
                          src="assets/img/products/pos-product-17.png"
                          alt="Products"
                        />
                      </Link>
                      <div className="info d-flex align-items-center justify-content-between flex-fill">
                        <div>
                          <span>PT0235</span>
                          <h6>
                            <Link to="#">Iphone 14</Link>
                          </h6>
                        </div>
                        <p>$3000</p>
                      </div>
                    </div>
                  </div>
                  <div className="product-list d-flex align-items-center justify-content-between">
                    <div className="d-flex align-items-center flex-fill">
                      <Link to="#" className="img-bg me-2">
                        <ImageWithBasePath
                          src="assets/img/products/pos-product-16.png"
                          alt="Products"
                        />
                      </Link>
                      <div className="info d-flex align-items-center justify-content-between flex-fill">
                        <div>
                          <span>PT0005</span>
                          <h6>
                            <Link to="#">Red Nike Laser</Link>
                          </h6>
                        </div>
                        <p>$2000</p>
                      </div>
                    </div>
                  </div>
                  <div className="product-list d-flex align-items-center justify-content-between">
                    <div className="d-flex align-items-center flex-fill">
                      <Link to="#" className="img-bg me-2">
                        <ImageWithBasePath
                          src="assets/img/products/pos-product-17.png"
                          alt="Products"
                        />
                      </Link>
                      <div className="info d-flex align-items-center justify-content-between flex-fill">
                        <div>
                          <span>PT0005</span>
                          <h6>
                            <Link to="#">Red Nike Laser</Link>
                          </h6>
                        </div>
                        <p>$2000</p>
                      </div>
                    </div>
                  </div>
                </div>
                <div className="modal-footer d-sm-flex justify-content-end">
                  <button
                    type="button"
                    className="btn btn-secondary"
                    data-bs-dismiss="modal"
                  >
                    Cancel
                  </button>
                  <Link to="#" className="btn btn-primary">
                    Submit
                  </Link>
                </div>
              </form>
            </div>
          </div>
        </div>
      </div>
      {/* /Products */}
      <div
        className="modal fade"
        id="create"
        tabIndex={-1}
        aria-labelledby="create"
        aria-hidden="true"
      >
        <div
          className="modal-dialog modal-lg modal-dialog-centered"
          role="document"
        >
          <div className="modal-content">
            <div className="modal-header">
              <h5 className="modal-title">Create</h5>
              <button
                type="button"
                className="close"
                data-bs-dismiss="modal"
                aria-label="Close"
              >
                <span aria-hidden="true">×</span>
              </button>
            </div>
            <div className="modal-body">
              <form>
                <div className="row">
                  <div className="col-lg-6 col-sm-12 col-12">
                    <div className="input-blocks">
                      <label>Customer Name</label>
                      <input type="text" className="form-control" />
                    </div>
                  </div>
                  <div className="col-lg-6 col-sm-12 col-12">
                    <div className="input-blocks">
                      <label>Email</label>
                      <input type="email" className="form-control" />
                    </div>
                  </div>
                  <div className="col-lg-6 col-sm-12 col-12">
                    <div className="input-blocks">
                      <label>Phone</label>
                      <input type="text" className="form-control" />
                    </div>
                  </div>
                  <div className="col-lg-6 col-sm-12 col-12">
                    <div className="input-blocks">
                      <label>Country</label>
                      <input type="text" className="form-control" />
                    </div>
                  </div>
                  <div className="col-lg-6 col-sm-12 col-12">
                    <div className="input-blocks">
                      <label>City</label>
                      <input type="text" />
                    </div>
                  </div>
                  <div className="col-lg-6 col-sm-12 col-12">
                    <div className="input-blocks">
                      <label>Address</label>
                      <input type="text" />
                    </div>
                  </div>
                </div>
                <div className="modal-footer d-sm-flex justify-content-end">
                  <button
                    type="button"
                    className="btn btn-cancel"
                    data-bs-dismiss="modal"
                  >
                    Cancel
                  </button>
                  <Link to="#" className="btn btn-submit me-2">
                    Submit
                  </Link>
                </div>
              </form>
            </div>
          </div>
        </div>
      </div>
      {/* Hold */}
      <div
        className="modal fade modal-default pos-modal"
        id="hold-order"
        aria-labelledby="hold-order"
      >
        <div className="modal-dialog modal-dialog-centered">
          <div className="modal-content">
            <div className="modal-header p-4">
              <h5>Hold order</h5>
              <button
                type="button"
                className="close"
                data-bs-dismiss="modal"
                aria-label="Close"
              >
                <span aria-hidden="true">×</span>
              </button>
            </div>
            <div className="modal-body p-4">
              <form>
                <h2 className="text-center p-4">4500.00</h2>
                <div className="input-block">
                  <label>Order Reference</label>
                  <input
                    className="form-control"
                    type="text"
                    defaultValue=""
                    placeholder=""
                  />
                </div>
                <p>
                  The current order will be set on hold. You can retreive this
                  order from the pending order button. Providing a reference to
                  it might help you to identify the order more quickly.
                </p>
                <div className="modal-footer d-sm-flex justify-content-end">
                  <button
                    type="button"
                    className="btn btn-secondary"
                    data-bs-dismiss="modal"
                  >
                    Cancel
                  </button>
                  <Link to="#" className="btn btn-primary">
                    Confirm
                  </Link>
                </div>
              </form>
            </div>
          </div>
        </div>
      </div>
      {/* /Hold */}
      {/* Edit Product */}
      <div
        className="modal fade modal-default pos-modal"
        id="edit-product"
        aria-labelledby="edit-product"
      >
        <div className="modal-dialog modal-dialog-centered">
          <div className="modal-content">
            <div className="modal-header p-4">
              <h5>Red Nike Laser</h5>
              <button
                type="button"
                className="close"
                data-bs-dismiss="modal"
                aria-label="Close"
              >
                <span aria-hidden="true">×</span>
              </button>
            </div>
            <div className="modal-body p-4">
              <form>
                <div className="row">
                  <div className="col-lg-6 col-sm-12 col-12">
                    <div className="input-blocks add-product">
                      <label>
                        Product Name <span>*</span>
                      </label>
                      <input type="text" placeholder={45} />
                    </div>
                  </div>
                  <div className="col-lg-6 col-sm-12 col-12">
                    <div className="input-blocks add-product">
                      <label>
                        Tax Type <span>*</span>
                      </label>
                      <Select
                        className="select"
                        options={tax}
                        placeholder="Select Option"
                      />
                    </div>
                  </div>
                  <div className="col-lg-6 col-sm-12 col-12">
                    <div className="input-blocks add-product">
                      <label>
                        Tax <span>*</span>
                      </label>
                      <input type="text" placeholder="% 15" />
                    </div>
                  </div>
                  <div className="col-lg-6 col-sm-12 col-12">
                    <div className="input-blocks add-product">
                      <label>
                        Discount Type <span>*</span>
                      </label>
                      <Select
                        className="select"
                        options={discounttype}
                        placeholder="Select Option"
                      />
                    </div>
                  </div>
                  <div className="col-lg-6 col-sm-12 col-12">
                    <div className="input-blocks add-product">
                      <label>
                        Discount <span>*</span>
                      </label>
                      <input type="text" placeholder={15} />
                    </div>
                  </div>
                  <div className="col-lg-6 col-sm-12 col-12">
                    <div className="input-blocks add-product">
                      <label>
                        Sale Unit <span>*</span>
                      </label>
                      <Select
                        className="select"
                        options={units}
                        placeholder="Select Option"
                      />
                    </div>
                  </div>
                </div>
                <div className="modal-footer d-sm-flex justify-content-end">
                  <button
                    type="button"
                    className="btn btn-secondary"
                    data-bs-dismiss="modal"
                  >
                    Cancel
                  </button>
                  <Link to="#" className="btn btn-primary">
                    Submit
                  </Link>
                </div>
              </form>
            </div>
          </div>
        </div>
      </div>
      {/* /Edit Product */}
      {/* Recent Transactions */}
      <div
        className="modal fade pos-modal"
        id="recents"
        tabIndex={-1}
        aria-hidden="true"
      >
        <div
          className="modal-dialog modal-lg modal-dialog-centered"
          role="document"
        >
          <div className="modal-content">
            <div className="modal-header p-4">
              <h5 className="modal-title">Recent Transactions</h5>
              <button
                type="button"
                className="close"
                data-bs-dismiss="modal"
                aria-label="Close"
              >
                <span aria-hidden="true">×</span>
              </button>
            </div>
            <div className="modal-body p-4">
              <div className="tabs-sets">
                <ul className="nav nav-tabs" id="myTab" role="tablist">
                  <li className="nav-item" role="presentation">
                    <button
                      className="nav-link active"
                      id="purchase-tab"
                      data-bs-toggle="tab"
                      data-bs-target="#purchase"
                      type="button"
                      aria-controls="purchase"
                      aria-selected="true"
                      role="tab"
                    >
                      Purchase
                    </button>
                  </li>
                  <li className="nav-item" role="presentation">
                    <button
                      className="nav-link"
                      id="payment-tab"
                      data-bs-toggle="tab"
                      data-bs-target="#payment"
                      type="button"
                      aria-controls="payment"
                      aria-selected="false"
                      role="tab"
                    >
                      Payment
                    </button>
                  </li>
                  <li className="nav-item" role="presentation">
                    <button
                      className="nav-link"
                      id="return-tab"
                      data-bs-toggle="tab"
                      data-bs-target="#return"
                      type="button"
                      aria-controls="return"
                      aria-selected="false"
                      role="tab"
                    >
                      Return
                    </button>
                  </li>
                </ul>
                <div className="tab-content">
                  <div
                    className="tab-pane fade show active"
                    id="purchase"
                    role="tabpanel"
                    aria-labelledby="purchase-tab"
                  >
                    <div className="table-top">
                      <div className="search-set">
                        <div className="search-input">
                          <input
                            type="text"
                            placeholder="Search"
                            className="form-control form-control-sm formsearch"
                          />
                          <Link to className="btn btn-searchset">
                            <i
                              data-feather="search"
                              className="feather-search"
                            />
                          </Link>
                        </div>
                      </div>
                      <div className="wordset">
                        <ul>
                          <li>
                            <OverlayTrigger
                              placement="top"
                              overlay={renderTooltip}
                            >
                              <Link>
                                <ImageWithBasePath
                                  src="assets/img/icons/pdf.svg"
                                  alt="img"
                                />
                              </Link>
                            </OverlayTrigger>
                          </li>
                          <li>
                            <OverlayTrigger
                              placement="top"
                              overlay={renderExcelTooltip}
                            >
                              <Link
                                data-bs-toggle="tooltip"
                                data-bs-placement="top"
                              >
                                <ImageWithBasePath
                                  src="assets/img/icons/excel.svg"
                                  alt="img"
                                />
                              </Link>
                            </OverlayTrigger>
                          </li>
                          <li>
                            <OverlayTrigger
                              placement="top"
                              overlay={renderPrinterTooltip}
                            >
                              <Link
                                data-bs-toggle="tooltip"
                                data-bs-placement="top"
                              >
                                <i
                                  data-feather="printer"
                                  className="feather-printer"
                                />
                              </Link>
                            </OverlayTrigger>
                          </li>
                        </ul>
                      </div>
                    </div>
                    <div className="table-responsive">
                      <table className="table datanew">
                        <thead>
                          <tr>
                            <th>Date</th>
                            <th>Reference</th>
                            <th>Customer</th>
                            <th>Amount </th>
                            <th className="no-sort">Action</th>
                          </tr>
                        </thead>
                        <tbody>
                          <tr>
                            <td>19 Jan 2023</td>
                            <td>INV/SL0101</td>
                            <td>Walk-in Customer</td>
                            <td>$1500.00</td>
                            <td className="action-table-data">
                              <div className="edit-delete-action">
                                <Link className="me-2 p-2" to="#">
                                  <i
                                    data-feather="eye"
                                    className="feather-eye"
                                  />
                                </Link>
                                <Link className="me-2 p-2" to="#">
                                  <i
                                    data-feather="edit"
                                    className="feather-edit"
                                  />
                                </Link>
                                <Link
                                  onClick={showConfirmationAlert}
                                  className="p-2 confirm-text"
                                  to="#"
                                >
                                  <i
                                    data-feather="trash-2"
                                    className="feather-trash-2"
                                  />
                                </Link>
                              </div>
                            </td>
                          </tr>
                          <tr>
                            <td>19 Jan 2023</td>
                            <td>INV/SL0102</td>
                            <td>Walk-in Customer</td>
                            <td>$1500.00</td>
                            <td className="action-table-data">
                              <div className="edit-delete-action">
                                <Link className="me-2 p-2" to="#">
                                  <i
                                    data-feather="eye"
                                    className="feather-eye"
                                  />
                                </Link>
                                <Link className="me-2 p-2" to="#">
                                  <i
                                    data-feather="edit"
                                    className="feather-edit"
                                  />
                                </Link>
                                <Link
                                  onClick={showConfirmationAlert}
                                  className="p-2 confirm-text"
                                  to="#"
                                >
                                  <i
                                    data-feather="trash-2"
                                    className="feather-trash-2"
                                  />
                                </Link>
                              </div>
                            </td>
                          </tr>
                          <tr>
                            <td>19 Jan 2023</td>
                            <td>INV/SL0103</td>
                            <td>Walk-in Customer</td>
                            <td>$1500.00</td>
                            <td className="action-table-data">
                              <div className="edit-delete-action">
                                <Link className="me-2 p-2" to="#">
                                  <i
                                    data-feather="eye"
                                    className="feather-eye"
                                  />
                                </Link>
                                <Link className="me-2 p-2" to="#">
                                  <i
                                    data-feather="edit"
                                    className="feather-edit"
                                  />
                                </Link>
                                <Link
                                  onClick={showConfirmationAlert}
                                  className="p-2 confirm-text"
                                  to="#"
                                >
                                  <i
                                    data-feather="trash-2"
                                    className="feather-trash-2"
                                  />
                                </Link>
                              </div>
                            </td>
                          </tr>
                          <tr>
                            <td>19 Jan 2023</td>
                            <td>INV/SL0104</td>
                            <td>Walk-in Customer</td>
                            <td>$1500.00</td>
                            <td className="action-table-data">
                              <div className="edit-delete-action">
                                <Link className="me-2 p-2" to="#">
                                  <i
                                    data-feather="eye"
                                    className="feather-eye"
                                  />
                                </Link>
                                <Link className="me-2 p-2" to="#">
                                  <i
                                    data-feather="edit"
                                    className="feather-edit"
                                  />
                                </Link>
                                <Link
                                  onClick={showConfirmationAlert}
                                  className="p-2 confirm-text"
                                  to="#"
                                >
                                  <i
                                    data-feather="trash-2"
                                    className="feather-trash-2"
                                  />
                                </Link>
                              </div>
                            </td>
                          </tr>
                          <tr>
                            <td>19 Jan 2023</td>
                            <td>INV/SL0105</td>
                            <td>Walk-in Customer</td>
                            <td>$1500.00</td>
                            <td className="action-table-data">
                              <div className="edit-delete-action">
                                <Link className="me-2 p-2" to="#">
                                  <i
                                    data-feather="eye"
                                    className="feather-eye"
                                  />
                                </Link>
                                <Link className="me-2 p-2" to="#">
                                  <i
                                    data-feather="edit"
                                    className="feather-edit"
                                  />
                                </Link>
                                <Link
                                  onClick={showConfirmationAlert}
                                  className="p-2 confirm-text"
                                  to="#"
                                >
                                  <i
                                    data-feather="trash-2"
                                    className="feather-trash-2"
                                  />
                                </Link>
                              </div>
                            </td>
                          </tr>
                          <tr>
                            <td>19 Jan 2023</td>
                            <td>INV/SL0106</td>
                            <td>Walk-in Customer</td>
                            <td>$1500.00</td>
                            <td className="action-table-data">
                              <div className="edit-delete-action">
                                <Link className="me-2 p-2" to="#">
                                  <i
                                    data-feather="eye"
                                    className="feather-eye"
                                  />
                                </Link>
                                <Link className="me-2 p-2" to="#">
                                  <i
                                    data-feather="edit"
                                    className="feather-edit"
                                  />
                                </Link>
                                <Link
                                  onClick={showConfirmationAlert}
                                  className="p-2 confirm-text"
                                  to="#"
                                >
                                  <i
                                    data-feather="trash-2"
                                    className="feather-trash-2"
                                  />
                                </Link>
                              </div>
                            </td>
                          </tr>
                          <tr>
                            <td>19 Jan 2023</td>
                            <td>INV/SL0107</td>
                            <td>Walk-in Customer</td>
                            <td>$1500.00</td>
                            <td className="action-table-data">
                              <div className="edit-delete-action">
                                <Link className="me-2 p-2" to="#">
                                  <i
                                    data-feather="eye"
                                    className="feather-eye"
                                  />
                                </Link>
                                <Link className="me-2 p-2" to="#">
                                  <i
                                    data-feather="edit"
                                    className="feather-edit"
                                  />
                                </Link>
                                <Link
                                  onClick={showConfirmationAlert}
                                  className="p-2 confirm-text"
                                  to="#"
                                >
                                  <i
                                    data-feather="trash-2"
                                    className="feather-trash-2"
                                  />
                                </Link>
                              </div>
                            </td>
                          </tr>
                        </tbody>
                      </table>
                    </div>
                  </div>
                  <div className="tab-pane fade" id="payment" role="tabpanel">
                    <div className="table-top">
                      <div className="search-set">
                        <div className="search-input">
                          <input
                            type="text"
                            placeholder="Search"
                            className="form-control form-control-sm formsearch"
                          />
                          <Link to className="btn btn-searchset">
                            <i
                              data-feather="search"
                              className="feather-search"
                            />
                          </Link>
                        </div>
                      </div>
                      <div className="wordset">
                        <ul>
                          <li>
                            <OverlayTrigger
                              placement="top"
                              overlay={renderTooltip}
                            >
                              <Link>
                                <ImageWithBasePath
                                  src="assets/img/icons/pdf.svg"
                                  alt="img"
                                />
                              </Link>
                            </OverlayTrigger>
                          </li>
                          <li>
                            <OverlayTrigger
                              placement="top"
                              overlay={renderExcelTooltip}
                            >
                              <Link
                                data-bs-toggle="tooltip"
                                data-bs-placement="top"
                              >
                                <ImageWithBasePath
                                  src="assets/img/icons/excel.svg"
                                  alt="img"
                                />
                              </Link>
                            </OverlayTrigger>
                          </li>
                          <li>
                            <OverlayTrigger
                              placement="top"
                              overlay={renderPrinterTooltip}
                            >
                              <Link
                                data-bs-toggle="tooltip"
                                data-bs-placement="top"
                              >
                                <i
                                  data-feather="printer"
                                  className="feather-printer"
                                />
                              </Link>
                            </OverlayTrigger>
                          </li>
                        </ul>
                      </div>
                    </div>
                    <div className="table-responsive">
                      <table className="table datanew">
                        <thead>
                          <tr>
                            <th>Date</th>
                            <th>Reference</th>
                            <th>Customer</th>
                            <th>Amount </th>
                            <th className="no-sort">Action</th>
                          </tr>
                        </thead>
                        <tbody>
                          <tr>
                            <td>19 Jan 2023</td>
                            <td>INV/SL0101</td>
                            <td>Walk-in Customer</td>
                            <td>$1500.00</td>
                            <td className="action-table-data">
                              <div className="edit-delete-action">
                                <Link className="me-2 p-2" to="#">
                                  <i
                                    data-feather="eye"
                                    className="feather-eye"
                                  />
                                </Link>
                                <Link className="me-2 p-2" to="#">
                                  <i
                                    data-feather="edit"
                                    className="feather-edit"
                                  />
                                </Link>
                                <Link
                                  onClick={showConfirmationAlert}
                                  className="p-2 confirm-text"
                                  to="#"
                                >
                                  <i
                                    data-feather="trash-2"
                                    className="feather-trash-2"
                                  />
                                </Link>
                              </div>
                            </td>
                          </tr>
                          <tr>
                            <td>19 Jan 2023</td>
                            <td>INV/SL0102</td>
                            <td>Walk-in Customer</td>
                            <td>$1500.00</td>
                            <td className="action-table-data">
                              <div className="edit-delete-action">
                                <Link className="me-2 p-2" to="#">
                                  <i
                                    data-feather="eye"
                                    className="feather-eye"
                                  />
                                </Link>
                                <Link className="me-2 p-2" to="#">
                                  <i
                                    data-feather="edit"
                                    className="feather-edit"
                                  />
                                </Link>
                                <Link
                                  onClick={showConfirmationAlert}
                                  className="p-2 confirm-text"
                                  to="#"
                                >
                                  <i
                                    data-feather="trash-2"
                                    className="feather-trash-2"
                                  />
                                </Link>
                              </div>
                            </td>
                          </tr>
                          <tr>
                            <td>19 Jan 2023</td>
                            <td>INV/SL0103</td>
                            <td>Walk-in Customer</td>
                            <td>$1500.00</td>
                            <td className="action-table-data">
                              <div className="edit-delete-action">
                                <Link className="me-2 p-2" to="#">
                                  <i
                                    data-feather="eye"
                                    className="feather-eye"
                                  />
                                </Link>
                                <Link className="me-2 p-2" to="#">
                                  <i
                                    data-feather="edit"
                                    className="feather-edit"
                                  />
                                </Link>
                                <Link
                                  onClick={showConfirmationAlert}
                                  className="p-2 confirm-text"
                                  to="#"
                                >
                                  <i
                                    data-feather="trash-2"
                                    className="feather-trash-2"
                                  />
                                </Link>
                              </div>
                            </td>
                          </tr>
                          <tr>
                            <td>19 Jan 2023</td>
                            <td>INV/SL0104</td>
                            <td>Walk-in Customer</td>
                            <td>$1500.00</td>
                            <td className="action-table-data">
                              <div className="edit-delete-action">
                                <Link className="me-2 p-2" to="#">
                                  <i
                                    data-feather="eye"
                                    className="feather-eye"
                                  />
                                </Link>
                                <Link className="me-2 p-2" to="#">
                                  <i
                                    data-feather="edit"
                                    className="feather-edit"
                                  />
                                </Link>
                                <Link
                                  onClick={showConfirmationAlert}
                                  className="p-2 confirm-text"
                                  to="#"
                                >
                                  <i
                                    data-feather="trash-2"
                                    className="feather-trash-2"
                                  />
                                </Link>
                              </div>
                            </td>
                          </tr>
                          <tr>
                            <td>19 Jan 2023</td>
                            <td>INV/SL0105</td>
                            <td>Walk-in Customer</td>
                            <td>$1500.00</td>
                            <td className="action-table-data">
                              <div className="edit-delete-action">
                                <Link className="me-2 p-2" to="#">
                                  <i
                                    data-feather="eye"
                                    className="feather-eye"
                                  />
                                </Link>
                                <Link className="me-2 p-2" to="#">
                                  <i
                                    data-feather="edit"
                                    className="feather-edit"
                                  />
                                </Link>
                                <Link
                                  onClick={showConfirmationAlert}
                                  className="p-2 confirm-text"
                                  to="#"
                                >
                                  <i
                                    data-feather="trash-2"
                                    className="feather-trash-2"
                                  />
                                </Link>
                              </div>
                            </td>
                          </tr>
                          <tr>
                            <td>19 Jan 2023</td>
                            <td>INV/SL0106</td>
                            <td>Walk-in Customer</td>
                            <td>$1500.00</td>
                            <td className="action-table-data">
                              <div className="edit-delete-action">
                                <Link className="me-2 p-2" to="#">
                                  <i
                                    data-feather="eye"
                                    className="feather-eye"
                                  />
                                </Link>
                                <Link className="me-2 p-2" to="#">
                                  <i
                                    data-feather="edit"
                                    className="feather-edit"
                                  />
                                </Link>
                                <Link
                                  onClick={showConfirmationAlert}
                                  className="p-2 confirm-text"
                                  to="#"
                                >
                                  <i
                                    data-feather="trash-2"
                                    className="feather-trash-2"
                                  />
                                </Link>
                              </div>
                            </td>
                          </tr>
                          <tr>
                            <td>19 Jan 2023</td>
                            <td>INV/SL0107</td>
                            <td>Walk-in Customer</td>
                            <td>$1500.00</td>
                            <td className="action-table-data">
                              <div className="edit-delete-action">
                                <Link className="me-2 p-2" to="#">
                                  <i
                                    data-feather="eye"
                                    className="feather-eye"
                                  />
                                </Link>
                                <Link className="me-2 p-2" to="#">
                                  <i
                                    data-feather="edit"
                                    className="feather-edit"
                                  />
                                </Link>
                                <Link
                                  onClick={showConfirmationAlert}
                                  className="p-2 confirm-text"
                                  to="#"
                                >
                                  <i
                                    data-feather="trash-2"
                                    className="feather-trash-2"
                                  />
                                </Link>
                              </div>
                            </td>
                          </tr>
                        </tbody>
                      </table>
                    </div>
                  </div>
                  <div className="tab-pane fade" id="return" role="tabpanel">
                    <div className="table-top">
                      <div className="search-set">
                        <div className="search-input">
                          <input
                            type="text"
                            placeholder="Search"
                            className="form-control form-control-sm formsearch"
                          />
                          <Link to className="btn btn-searchset">
                            <i
                              data-feather="search"
                              className="feather-search"
                            />
                          </Link>
                        </div>
                      </div>
                      <div className="wordset">
                        <ul>
                          <li>
                            <OverlayTrigger
                              placement="top"
                              overlay={renderTooltip}
                            >
                              <Link>
                                <ImageWithBasePath
                                  src="assets/img/icons/pdf.svg"
                                  alt="img"
                                />
                              </Link>
                            </OverlayTrigger>
                          </li>
                          <li>
                            <OverlayTrigger
                              placement="top"
                              overlay={renderExcelTooltip}
                            >
                              <Link
                                data-bs-toggle="tooltip"
                                data-bs-placement="top"
                              >
                                <ImageWithBasePath
                                  src="assets/img/icons/excel.svg"
                                  alt="img"
                                />
                              </Link>
                            </OverlayTrigger>
                          </li>
                          <li>
                            <OverlayTrigger
                              placement="top"
                              overlay={renderPrinterTooltip}
                            >
                              <Link
                                data-bs-toggle="tooltip"
                                data-bs-placement="top"
                              >
                                <i
                                  data-feather="printer"
                                  className="feather-printer"
                                />
                              </Link>
                            </OverlayTrigger>
                          </li>
                        </ul>
                      </div>
                    </div>
                    <div className="table-responsive">
                      <table className="table datanew">
                        <thead>
                          <tr>
                            <th>Date</th>
                            <th>Reference</th>
                            <th>Customer</th>
                            <th>Amount </th>
                            <th className="no-sort">Action</th>
                          </tr>
                        </thead>
                        <tbody>
                          <tr>
                            <td>19 Jan 2023</td>
                            <td>INV/SL0101</td>
                            <td>Walk-in Customer</td>
                            <td>$1500.00</td>
                            <td className="action-table-data">
                              <div className="edit-delete-action">
                                <Link className="me-2 p-2" to="#">
                                  <i
                                    data-feather="eye"
                                    className="feather-eye"
                                  />
                                </Link>
                                <Link className="me-2 p-2" to="#">
                                  <i
                                    data-feather="edit"
                                    className="feather-edit"
                                  />
                                </Link>
                                <Link
                                  onClick={showConfirmationAlert}
                                  className="p-2 confirm-text"
                                  to="#"
                                >
                                  <i
                                    data-feather="trash-2"
                                    className="feather-trash-2"
                                  />
                                </Link>
                              </div>
                            </td>
                          </tr>
                          <tr>
                            <td>19 Jan 2023</td>
                            <td>INV/SL0102</td>
                            <td>Walk-in Customer</td>
                            <td>$1500.00</td>
                            <td className="action-table-data">
                              <div className="edit-delete-action">
                                <Link className="me-2 p-2" to="#">
                                  <i
                                    data-feather="eye"
                                    className="feather-eye"
                                  />
                                </Link>
                                <Link className="me-2 p-2" to="#">
                                  <i
                                    data-feather="edit"
                                    className="feather-edit"
                                  />
                                </Link>
                                <Link
                                  onClick={showConfirmationAlert}
                                  className="p-2 confirm-text"
                                  to="#"
                                >
                                  <i
                                    data-feather="trash-2"
                                    className="feather-trash-2"
                                  />
                                </Link>
                              </div>
                            </td>
                          </tr>
                          <tr>
                            <td>19 Jan 2023</td>
                            <td>INV/SL0103</td>
                            <td>Walk-in Customer</td>
                            <td>$1500.00</td>
                            <td className="action-table-data">
                              <div className="edit-delete-action">
                                <Link className="me-2 p-2" to="#">
                                  <i
                                    data-feather="eye"
                                    className="feather-eye"
                                  />
                                </Link>
                                <Link className="me-2 p-2" to="#">
                                  <i
                                    data-feather="edit"
                                    className="feather-edit"
                                  />
                                </Link>
                                <Link
                                  onClick={showConfirmationAlert}
                                  className="p-2 confirm-text"
                                  to="#"
                                >
                                  <i
                                    data-feather="trash-2"
                                    className="feather-trash-2"
                                  />
                                </Link>
                              </div>
                            </td>
                          </tr>
                          <tr>
                            <td>19 Jan 2023</td>
                            <td>INV/SL0104</td>
                            <td>Walk-in Customer</td>
                            <td>$1500.00</td>
                            <td className="action-table-data">
                              <div className="edit-delete-action">
                                <Link className="me-2 p-2" to="#">
                                  <i
                                    data-feather="eye"
                                    className="feather-eye"
                                  />
                                </Link>
                                <Link className="me-2 p-2" to="#">
                                  <i
                                    data-feather="edit"
                                    className="feather-edit"
                                  />
                                </Link>
                                <Link
                                  onClick={showConfirmationAlert}
                                  className="p-2 confirm-text"
                                  to="#"
                                >
                                  <i
                                    data-feather="trash-2"
                                    className="feather-trash-2"
                                  />
                                </Link>
                              </div>
                            </td>
                          </tr>
                          <tr>
                            <td>19 Jan 2023</td>
                            <td>INV/SL0105</td>
                            <td>Walk-in Customer</td>
                            <td>$1500.00</td>
                            <td className="action-table-data">
                              <div className="edit-delete-action">
                                <Link className="me-2 p-2" to="#">
                                  <i
                                    data-feather="eye"
                                    className="feather-eye"
                                  />
                                </Link>
                                <Link className="me-2 p-2" to="#">
                                  <i
                                    data-feather="edit"
                                    className="feather-edit"
                                  />
                                </Link>
                                <Link
                                  onClick={showConfirmationAlert}
                                  className="p-2 confirm-text"
                                  to="#"
                                >
                                  <i
                                    data-feather="trash-2"
                                    className="feather-trash-2"
                                  />
                                </Link>
                              </div>
                            </td>
                          </tr>
                          <tr>
                            <td>19 Jan 2023</td>
                            <td>INV/SL0106</td>
                            <td>Walk-in Customer</td>
                            <td>$1500.00</td>
                            <td className="action-table-data">
                              <div className="edit-delete-action">
                                <Link className="me-2 p-2" to="#">
                                  <i
                                    data-feather="eye"
                                    className="feather-eye"
                                  />
                                </Link>
                                <Link className="me-2 p-2" to="#">
                                  <i
                                    data-feather="edit"
                                    className="feather-edit"
                                  />
                                </Link>
                                <Link
                                  onClick={showConfirmationAlert}
                                  className="p-2 confirm-text"
                                  to="#"
                                >
                                  <i
                                    data-feather="trash-2"
                                    className="feather-trash-2"
                                  />
                                </Link>
                              </div>
                            </td>
                          </tr>
                          <tr>
                            <td>19 Jan 2023</td>
                            <td>INV/SL0107</td>
                            <td>Walk-in Customer</td>
                            <td>$1500.00</td>
                            <td className="action-table-data">
                              <div className="edit-delete-action">
                                <Link className="me-2 p-2" to="#">
                                  <i
                                    data-feather="eye"
                                    className="feather-eye"
                                  />
                                </Link>
                                <Link className="me-2 p-2" to="#">
                                  <i
                                    data-feather="edit"
                                    className="feather-edit"
                                  />
                                </Link>
                                <Link
                                  onClick={showConfirmationAlert}
                                  className="p-2 confirm-text"
                                  to="#"
                                >
                                  <i
                                    data-feather="trash-2"
                                    className="feather-trash-2"
                                  />
                                </Link>
                              </div>
                            </td>
                          </tr>
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
      {/* /Recent Transactions */}

      {/* Recent Transactions */}
      <div
        className="modal fade pos-modal"
        id="orders"
        tabIndex={-1}
        aria-hidden="true"
      >
        <div
          className="modal-dialog modal-md modal-dialog-centered"
          role="document"
        >
          <div className="modal-content">
            <div className="modal-header p-4">
              <h5 className="modal-title">Orders</h5>
              <button
                type="button"
                className="close"
                data-bs-dismiss="modal"
                aria-label="Close"
              >
                <span aria-hidden="true">×</span>
              </button>
            </div>
            <div className="modal-body p-4">
              <div className="tabs-sets">
                <ul className="nav nav-tabs" id="myTabs" role="tablist">
                  <li className="nav-item" role="presentation">
                    <button
                      className="nav-link active"
                      id="onhold-tab"
                      data-bs-toggle="tab"
                      data-bs-target="#onhold"
                      type="button"
                      aria-controls="onhold"
                      aria-selected="true"
                      role="tab"
                    >
                      Onhold
                    </button>
                  </li>
                  <li className="nav-item" role="presentation">
                    <button
                      className="nav-link"
                      id="unpaid-tab"
                      data-bs-toggle="tab"
                      data-bs-target="#unpaid"
                      type="button"
                      aria-controls="unpaid"
                      aria-selected="false"
                      role="tab"
                    >
                      Unpaid
                    </button>
                  </li>
                  <li className="nav-item" role="presentation">
                    <button
                      className="nav-link"
                      id="paid-tab"
                      data-bs-toggle="tab"
                      data-bs-target="#paid"
                      type="button"
                      aria-controls="paid"
                      aria-selected="false"
                      role="tab"
                    >
                      Paid
                    </button>
                  </li>
                </ul>
                <div className="tab-content">
                  <div
                    className="tab-pane fade show active"
                    id="onhold"
                    role="tabpanel"
                    aria-labelledby="onhold-tab"
                  >
                    <div className="table-top">
                      <div className="search-set w-100 search-order">
                        <div className="search-input w-100">
                          <input
                            type="text"
                            placeholder="Search"
                            className="form-control form-control-sm formsearch w-100"
                          />
                          <Link to className="btn btn-searchset">
                            <i
                              data-feather="search"
                              className="feather-search"
                            />
                          </Link>
                        </div>
                      </div>
                    </div>
                    <div className="order-body">
                      <div className="default-cover p-4 mb-4">
                        <span className="badge bg-secondary d-inline-block mb-4">
                          Order ID : #666659
                        </span>
                        <div className="row">
                          <div className="col-sm-12 col-md-6 record mb-3">
                            <table>
                              <tbody>
                                <tr className="mb-3">
                                  <td>Cashier</td>
                                  <td className="colon">:</td>
                                  <td className="text">admin</td>
                                </tr>
                                <tr>
                                  <td>Customer</td>
                                  <td className="colon">:</td>
                                  <td className="text">Botsford</td>
                                </tr>
                              </tbody>
                            </table>
                          </div>
                          <div className="col-sm-12 col-md-6 record mb-3">
                            <table>
                              <tbody>
                                <tr>
                                  <td>Total</td>
                                  <td className="colon">:</td>
                                  <td className="text">$900</td>
                                </tr>
                                <tr>
                                  <td>Date</td>
                                  <td className="colon">:</td>
                                  <td className="text">29-08-2023 13:39:11</td>
                                </tr>
                              </tbody>
                            </table>
                          </div>
                        </div>
                        <p className="p-4">
                          Customer need to recheck the product once
                        </p>
                        <div className="btn-row d-sm-flex align-items-center justify-content-between">
                          <Link
                            to="#"
                            className="btn btn-info btn-icon flex-fill"
                          >
                            Open
                          </Link>
                          <Link
                            to="#"
                            className="btn btn-danger btn-icon flex-fill"
                          >
                            Products
                          </Link>
                          <Link
                            to="#"
                            className="btn btn-success btn-icon flex-fill"
                          >
                            Print
                          </Link>
                        </div>
                      </div>
                      <div className="default-cover p-4 mb-4">
                        <span className="badge bg-secondary d-inline-block mb-4">
                          Order ID : #666660
                        </span>
                        <div className="row">
                          <div className="col-sm-12 col-md-6 record mb-3">
                            <table>
                              <tbody>
                                <tr className="mb-3">
                                  <td>Cashier</td>
                                  <td className="colon">:</td>
                                  <td className="text">admin</td>
                                </tr>
                                <tr>
                                  <td>Customer</td>
                                  <td className="colon">:</td>
                                  <td className="text">Smith</td>
                                </tr>
                              </tbody>
                            </table>
                          </div>
                          <div className="col-sm-12 col-md-6 record mb-3">
                            <table>
                              <tbody>
                                <tr>
                                  <td>Total</td>
                                  <td className="colon">:</td>
                                  <td className="text">$15000</td>
                                </tr>
                                <tr>
                                  <td>Date</td>
                                  <td className="colon">:</td>
                                  <td className="text">30-08-2023 15:59:11</td>
                                </tr>
                              </tbody>
                            </table>
                          </div>
                        </div>
                        <p className="p-4">
                          Customer need to recheck the product once
                        </p>
                        <div className="btn-row d-flex align-items-center justify-content-between">
                          <Link
                            to="#"
                            className="btn btn-info btn-icon flex-fill"
                          >
                            Open
                          </Link>
                          <Link
                            to="#"
                            className="btn btn-danger btn-icon flex-fill"
                          >
                            Products
                          </Link>
                          <Link
                            to="#"
                            className="btn btn-success btn-icon flex-fill"
                          >
                            Print
                          </Link>
                        </div>
                      </div>
                      <div className="default-cover p-4">
                        <span className="badge bg-secondary d-inline-block mb-4">
                          Order ID : #666661
                        </span>
                        <div className="row">
                          <div className="col-sm-12 col-md-6 record mb-3">
                            <table>
                              <tbody>
                                <tr className="mb-3">
                                  <td>Cashier</td>
                                  <td className="colon">:</td>
                                  <td className="text">admin</td>
                                </tr>
                                <tr>
                                  <td>Customer</td>
                                  <td className="colon">:</td>
                                  <td className="text">John David</td>
                                </tr>
                              </tbody>
                            </table>
                          </div>
                          <div className="col-sm-12 col-md-6 record mb-3">
                            <table>
                              <tbody>
                                <tr>
                                  <td>Total</td>
                                  <td className="colon">:</td>
                                  <td className="text">$2000</td>
                                </tr>
                                <tr>
                                  <td>Date</td>
                                  <td className="colon">:</td>
                                  <td className="text">01-09-2023 13:15:00</td>
                                </tr>
                              </tbody>
                            </table>
                          </div>
                        </div>
                        <p className="p-4 mb-4">
                          Customer need to recheck the product once
                        </p>
                        <div className="btn-row d-flex align-items-center justify-content-between">
                          <Link
                            to="#"
                            className="btn btn-info btn-icon flex-fill"
                          >
                            Open
                          </Link>
                          <Link
                            to="#"
                            className="btn btn-danger btn-icon flex-fill"
                          >
                            Products
                          </Link>
                          <Link
                            to="#"
                            className="btn btn-success btn-icon flex-fill"
                          >
                            Print
                          </Link>
                        </div>
                      </div>
                    </div>
                  </div>
                  <div className="tab-pane fade" id="unpaid" role="tabpanel">
                    <div className="table-top">
                      <div className="search-set w-100 search-order">
                        <div className="search-input w-100">
                          <input
                            type="text"
                            placeholder="Search"
                            className="form-control form-control-sm formsearch w-100"
                          />
                          <Link to className="btn btn-searchset">
                            <i
                              data-feather="search"
                              className="feather-search"
                            />
                          </Link>
                        </div>
                      </div>
                    </div>
                    <div className="order-body">
                      <div className="default-cover p-4 mb-4">
                        <span className="badge bg-info d-inline-block mb-4">
                          Order ID : #666662
                        </span>
                        <div className="row">
                          <div className="col-sm-12 col-md-6 record mb-3">
                            <table>
                              <tbody>
                                <tr className="mb-3">
                                  <td>Cashier</td>
                                  <td className="colon">:</td>
                                  <td className="text">admin</td>
                                </tr>
                                <tr>
                                  <td>Customer</td>
                                  <td className="colon">:</td>
                                  <td className="text">Anastasia</td>
                                </tr>
                              </tbody>
                            </table>
                          </div>
                          <div className="col-sm-12 col-md-6 record mb-3">
                            <table>
                              <tbody>
                                <tr>
                                  <td>Total</td>
                                  <td className="colon">:</td>
                                  <td className="text">$2500</td>
                                </tr>
                                <tr>
                                  <td>Date</td>
                                  <td className="colon">:</td>
                                  <td className="text">10-09-2023 17:15:11</td>
                                </tr>
                              </tbody>
                            </table>
                          </div>
                        </div>
                        <p className="p-4">
                          Customer need to recheck the product once
                        </p>
                        <div className="btn-row d-flex align-items-center justify-content-between">
                          <Link
                            to="#"
                            className="btn btn-info btn-icon flex-fill"
                          >
                            Open
                          </Link>
                          <Link
                            to="#"
                            className="btn btn-danger btn-icon flex-fill"
                          >
                            Products
                          </Link>
                          <Link
                            to="#"
                            className="btn btn-success btn-icon flex-fill"
                          >
                            Print
                          </Link>
                        </div>
                      </div>
                      <div className="default-cover p-4 mb-4">
                        <span className="badge bg-info d-inline-block mb-4">
                          Order ID : #666663
                        </span>
                        <div className="row">
                          <div className="col-sm-12 col-md-6 record mb-3">
                            <table>
                              <tbody>
                                <tr className="mb-3">
                                  <td>Cashier</td>
                                  <td className="colon">:</td>
                                  <td className="text">admin</td>
                                </tr>
                                <tr>
                                  <td>Customer</td>
                                  <td className="colon">:</td>
                                  <td className="text">Lucia</td>
                                </tr>
                              </tbody>
                            </table>
                          </div>
                          <div className="col-sm-12 col-md-6 record mb-3">
                            <table>
                              <tbody>
                                <tr>
                                  <td>Total</td>
                                  <td className="colon">:</td>
                                  <td className="text">$1500</td>
                                </tr>
                                <tr>
                                  <td>Date</td>
                                  <td className="colon">:</td>
                                  <td className="text">11-09-2023 14:50:11</td>
                                </tr>
                              </tbody>
                            </table>
                          </div>
                        </div>
                        <p className="p-4">
                          Customer need to recheck the product once
                        </p>
                        <div className="btn-row d-flex align-items-center justify-content-between">
                          <Link
                            to="#"
                            className="btn btn-info btn-icon flex-fill"
                          >
                            Open
                          </Link>
                          <Link
                            to="#"
                            className="btn btn-danger btn-icon flex-fill"
                          >
                            Products
                          </Link>
                          <Link
                            to="#"
                            className="btn btn-success btn-icon flex-fill"
                          >
                            Print
                          </Link>
                        </div>
                      </div>
                      <div className="default-cover p-4 mb-4">
                        <span className="badge bg-info d-inline-block mb-4">
                          Order ID : #666664
                        </span>
                        <div className="row">
                          <div className="col-sm-12 col-md-6 record mb-3">
                            <table>
                              <tbody>
                                <tr className="mb-3">
                                  <td>Cashier</td>
                                  <td className="colon">:</td>
                                  <td className="text">admin</td>
                                </tr>
                                <tr>
                                  <td>Customer</td>
                                  <td className="colon">:</td>
                                  <td className="text">Diego</td>
                                </tr>
                              </tbody>
                            </table>
                          </div>
                          <div className="col-sm-12 col-md-6 record mb-3">
                            <table>
                              <tbody>
                                <tr>
                                  <td>Total</td>
                                  <td className="colon">:</td>
                                  <td className="text">$30000</td>
                                </tr>
                                <tr>
                                  <td>Date</td>
                                  <td className="colon">:</td>
                                  <td className="text">12-09-2023 17:22:11</td>
                                </tr>
                              </tbody>
                            </table>
                          </div>
                        </div>
                        <p className="p-4 mb-4">
                          Customer need to recheck the product once
                        </p>
                        <div className="btn-row d-flex align-items-center justify-content-between">
                          <Link
                            to="#"
                            className="btn btn-info btn-icon flex-fill"
                          >
                            Open
                          </Link>
                          <Link
                            to="#"
                            className="btn btn-danger btn-icon flex-fill"
                          >
                            Products
                          </Link>
                          <Link
                            to="#"
                            className="btn btn-success btn-icon flex-fill"
                          >
                            Print
                          </Link>
                        </div>
                      </div>
                    </div>
                  </div>
                  <div className="tab-pane fade" id="paid" role="tabpanel">
                    <div className="table-top">
                      <div className="search-set w-100 search-order">
                        <div className="search-input w-100">
                          <input
                            type="text"
                            placeholder="Search"
                            className="form-control form-control-sm formsearch w-100"
                          />
                          <Link to className="btn btn-searchset">
                            <i
                              data-feather="search"
                              className="feather-search"
                            />
                          </Link>
                        </div>
                      </div>
                    </div>
                    <div className="order-body">
                      <div className="default-cover p-4 mb-4">
                        <span className="badge bg-primary d-inline-block mb-4">
                          Order ID : #666665
                        </span>
                        <div className="row">
                          <div className="col-sm-12 col-md-6 record mb-3">
                            <table>
                              <tbody>
                                <tr className="mb-3">
                                  <td>Cashier</td>
                                  <td className="colon">:</td>
                                  <td className="text">admin</td>
                                </tr>
                                <tr>
                                  <td>Customer</td>
                                  <td className="colon">:</td>
                                  <td className="text">Hugo</td>
                                </tr>
                              </tbody>
                            </table>
                          </div>
                          <div className="col-sm-12 col-md-6 record mb-3">
                            <table>
                              <tbody>
                                <tr>
                                  <td>Total</td>
                                  <td className="colon">:</td>
                                  <td className="text">$5000</td>
                                </tr>
                                <tr>
                                  <td>Date</td>
                                  <td className="colon">:</td>
                                  <td className="text">13-09-2023 19:39:11</td>
                                </tr>
                              </tbody>
                            </table>
                          </div>
                        </div>
                        <p className="p-4">
                          Customer need to recheck the product once
                        </p>
                        <div className="btn-row d-flex align-items-center justify-content-between">
                          <Link
                            to="#"
                            className="btn btn-info btn-icon flex-fill"
                          >
                            Open
                          </Link>
                          <Link
                            to="#"
                            className="btn btn-danger btn-icon flex-fill"
                          >
                            Products
                          </Link>
                          <Link
                            to="#"
                            className="btn btn-success btn-icon flex-fill"
                          >
                            Print
                          </Link>
                        </div>
                      </div>
                      <div className="default-cover p-4 mb-4">
                        <span className="badge bg-primary d-inline-block mb-4">
                          Order ID : #666666
                        </span>
                        <div className="row">
                          <div className="col-sm-12 col-md-6 record mb-3">
                            <table>
                              <tbody>
                                <tr className="mb-3">
                                  <td>Cashier</td>
                                  <td className="colon">:</td>
                                  <td className="text">admin</td>
                                </tr>
                                <tr>
                                  <td>Customer</td>
                                  <td className="colon">:</td>
                                  <td className="text">Antonio</td>
                                </tr>
                              </tbody>
                            </table>
                          </div>
                          <div className="col-sm-12 col-md-6 record mb-3">
                            <table>
                              <tbody>
                                <tr>
                                  <td>Total</td>
                                  <td className="colon">:</td>
                                  <td className="text">$7000</td>
                                </tr>
                                <tr>
                                  <td>Date</td>
                                  <td className="colon">:</td>
                                  <td className="text">15-09-2023 18:39:11</td>
                                </tr>
                              </tbody>
                            </table>
                          </div>
                        </div>
                        <p className="p-4">
                          Customer need to recheck the product once
                        </p>
                        <div className="btn-row d-flex align-items-center justify-content-between">
                          <Link
                            to="#"
                            className="btn btn-info btn-icon flex-fill"
                          >
                            Open
                          </Link>
                          <Link
                            to="#"
                            className="btn btn-danger btn-icon flex-fill"
                          >
                            Products
                          </Link>
                          <Link
                            to="#"
                            className="btn btn-success btn-icon flex-fill"
                          >
                            Print
                          </Link>
                        </div>
                      </div>
                      <div className="default-cover p-4 mb-4">
                        <span className="badge bg-primary d-inline-block mb-4">
                          Order ID : #666667
                        </span>
                        <div className="row">
                          <div className="col-sm-12 col-md-6 record mb-3">
                            <table>
                              <tbody>
                                <tr className="mb-3">
                                  <td>Cashier</td>
                                  <td className="colon">:</td>
                                  <td className="text">admin</td>
                                </tr>
                                <tr>
                                  <td>Customer</td>
                                  <td className="colon">:</td>
                                  <td className="text">MacQuoid</td>
                                </tr>
                              </tbody>
                            </table>
                          </div>
                          <div className="col-sm-12 col-md-6 record mb-3">
                            <table>
                              <tbody>
                                <tr>
                                  <td>Total</td>
                                  <td className="colon">:</td>
                                  <td className="text">$7050</td>
                                </tr>
                                <tr>
                                  <td>Date</td>
                                  <td className="colon">:</td>
                                  <td className="text">17-09-2023 19:39:11</td>
                                </tr>
                              </tbody>
                            </table>
                          </div>
                        </div>
                        <p className="p-4 mb-4">
                          Customer need to recheck the product once
                        </p>
                        <div className="btn-row d-flex align-items-center justify-content-between">
                          <Link
                            to="#"
                            className="btn btn-info btn-icon flex-fill"
                          >
                            Open
                          </Link>
                          <Link
                            to="#"
                            className="btn btn-danger btn-icon flex-fill"
                          >
                            Products
                          </Link>
                          <Link
                            to="#"
                            className="btn btn-success btn-icon flex-fill"
                          >
                            Print
                          </Link>
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
      {/* /Recent Transactions */}
    </div>
  );
};

export default Pos;
