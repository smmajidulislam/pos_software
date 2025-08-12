import { DatePicker } from "antd";
import React, { useEffect, useState } from "react";
import Select from "react-select";
import { useGetSuppliersQuery } from "../../redux/api/supplierApi/supplierApi";
import { usePos } from "../../../hooks/PosProvider";
import dayjs from "dayjs";
import {
  useGetProductByIdQuery,
  useGetProductsQuery,
} from "../../redux/api/productapi/productApi";
import { useCreateParchaceMutation } from "../../redux/api/purchageApi/purchaceApi";
import Sawal from "sweetalert2";

const AddPurchases = () => {
  const { pos } = usePos();
  const [supplier, setSupplier] = useState([]);
  const [selectedSupllier, setSelectedSupplier] = useState(null);
  const [products, setProducts] = useState([]);
  const [Product, setProduct] = useState(null);
  const [selectedProduct, setSelectedProduct] = useState(null);

  const [unitPrice, setUnitPrice] = useState(0);
  const [discount, setDiscount] = useState(0);
  const [tax, setTax] = useState(0);

  const [payment, setPayment] = useState(0);
  const [dueAmount, setDueAmount] = useState(0);
  const [quantity, setQuantity] = useState(1);
  const [selectedStatus, setSelectedStatus] = useState(null);
  const [selectedDate, setSelectedDate] = useState(dayjs());

  // New state for unit selection
  const [unitOptions, setUnitOptions] = useState([]);
  const [selectedUnit, setSelectedUnit] = useState(null);

  const { data: supplierList, isLoading: supplierLoading } =
    useGetSuppliersQuery({ posId: pos?._id }, { skip: !pos?._id });

  const { data: productListById, isLoading: productLoadingById } =
    useGetProductByIdQuery(selectedProduct?.value, {
      skip: !selectedProduct,
    });

  const [createPurchace] = useCreateParchaceMutation();
  const { data: productList, isLoading: productLoading } = useGetProductsQuery(
    {
      pos: pos?._id,
      categoryId: "allCategory",
    },
    { skip: !pos?._id }
  );

  useEffect(() => {
    if (supplierList?.suppliers?.length > 0 && !supplierLoading) {
      const filteredData = supplierList.suppliers.map((item) => ({
        value: item?._id,
        label: item?.name,
      }));
      setSupplier(filteredData);
    }
    if (productList?.data?.length > 0 && !productLoading) {
      const filteredData = productList.data.map((item) => ({
        value: item?._id,
        label: item?.productName,
        reference: item?.reference || "REF-000000",
      }));
      setProducts(filteredData);
    }
    if (productListById?.data && !productLoadingById) {
      const prod = productListById.data;
      setProduct(prod);

      setUnitPrice(prod.parchacePrice || 0);
      setDiscount(prod.discountValue || 0);
      setTax(prod.taxValue || 0);
      setQuantity(1);
      setPayment(0);
      setDueAmount(0);

      // Unit dropdown (single option since unit is fixed from product)
      if (prod.unit) {
        const opt = { value: prod.unit._id, label: prod.unit.name };
        setUnitOptions([opt]);
        setSelectedUnit(opt);
      }
    }
  }, [
    supplierList,
    supplierLoading,
    productList,
    productLoading,
    productLoadingById,
    productListById,
    selectedProduct,
  ]);

  const handleDateChange = (date) => setSelectedDate(date);

  const handleQuantityChange = (e) => {
    const value = parseInt(e.target.value);
    if (!isNaN(value) && value > 0) {
      setQuantity(value);
    }
  };

  const handlePayment = (due) => {
    const numericDue = parseFloat(due) || 0;
    setPayment(numericDue);
    setDueAmount(totalCost - numericDue);
  };

  const handleUnitPriceChange = (e) => {
    const val = parseFloat(e.target.value);
    setUnitPrice(isNaN(val) ? 0 : val);
  };

  const handleDiscountChange = (e) => {
    const val = parseFloat(e.target.value);
    setDiscount(isNaN(val) ? 0 : val);
  };

  const handleTaxChange = (e) => {
    const val = parseFloat(e.target.value);
    setTax(isNaN(val) ? 0 : val);
  };

  const totalPurchasePrice = unitPrice * quantity;
  const totalDiscount = discount * quantity;
  const totalTax = tax * quantity;
  const totalCost = totalPurchasePrice + totalTax - totalDiscount;

  const handleSubmit = async (e) => {
    e.preventDefault();

    const purchaseDetails = {
      supplier: selectedSupllier?.value,
      pos: pos?._id,
      product: {
        ...Product,
        _id: selectedProduct?.value,
        parchacePrice: unitPrice,
        discountValue: discount,
        taxValue: tax,
        unit: selectedUnit?.value, // Send selected unit id
      },
      payment: payment,
      due: dueAmount,
      status: selectedStatus?.value,
      date: selectedDate.format("YYYY-MM-DD"),
      grandTotal: totalCost,
      quantity: quantity,
    };

    try {
      const res = await createPurchace(purchaseDetails).unwrap();
      if (res?.success) {
        Sawal.fire({
          icon: "success",
          title: "Purchase added successfully",
          showConfirmButton: false,
          timer: 1500,
        });
        setTimeout(() => {
          window.location.reload();
        }, 1500);
      }
    } catch (error) {
      console.error("Purchase creation failed:", error);
      Sawal.fire({
        icon: "error",
        title: "Failed to add purchase",
        text: error?.data?.message || error.message,
      });
    }
  };

  const statusOptions = [
    { value: "received", label: "Received" },
    { value: "pending", label: "Pending" },
  ];

  return (
    <div>
      <div className="modal fade" id="add-units">
        <div className="modal-dialog purchase modal-dialog-centered stock-adjust-modal">
          <div className="modal-content">
            <div className="page-wrapper-new p-0">
              <div className="content">
                <div className="modal-header border-0 custom-modal-header">
                  <div className="page-title">
                    <h4>Add Purchase</h4>
                  </div>
                  <button
                    type="button"
                    className="close"
                    data-bs-dismiss="modal"
                    aria-label="Close"
                  >
                    <span aria-hidden="true">&times;</span>
                  </button>
                </div>
                <div className="modal-body custom-modal-body">
                  <form onSubmit={handleSubmit}>
                    <div className="row">
                      <div className="col-lg-3 col-md-6">
                        <label>Supplier Name</label>
                        <Select
                          options={supplier}
                          className="select"
                          placeholder="Choose"
                          value={selectedSupllier}
                          onChange={setSelectedSupplier}
                        />
                      </div>
                      <div className="col-lg-3 col-md-6">
                        <label>Purchase Date</label>
                        <DatePicker
                          value={selectedDate}
                          onChange={handleDateChange}
                          disabled
                          format="DD-MM-YYYY"
                          className="filterdatepicker"
                        />
                      </div>
                      <div className="col-lg-3 col-md-6">
                        <label>Product Name</label>
                        <Select
                          options={products}
                          className="select"
                          placeholder="Choose"
                          value={selectedProduct}
                          onChange={(option) => {
                            setSelectedProduct(option);
                          }}
                        />
                      </div>
                      <div className="col-lg-3 col-md-6">
                        <label>Reference No</label>
                        <input
                          type="text"
                          className="form-control"
                          value={selectedProduct?.reference || ""}
                          readOnly
                        />
                      </div>
                    </div>

                    {/* UPDATED TABLE */}
                    <div className="row mt-3">
                      <div className="table-responsive">
                        <table className="table table-bordered text-center align-middle">
                          <thead className="table-light">
                            <tr>
                              <th>Product</th>
                              <th style={{ width: "80px" }}>Qty</th>
                              <th style={{ width: "150px" }}>Unit Name</th>
                              <th style={{ width: "120px" }}>Unit Price</th>
                              <th style={{ width: "120px" }}>Discount</th>
                              <th style={{ width: "120px" }}>Tax</th>
                              <th style={{ width: "100px" }}>Total</th>
                            </tr>
                          </thead>
                          <tbody>
                            <tr>
                              <td className="align-middle">
                                {Product?.productName || "-"}
                              </td>
                              <td>
                                <input
                                  type="number"
                                  value={quantity}
                                  min={1}
                                  className="form-control text-center"
                                  style={{ maxWidth: "80px", margin: "auto" }}
                                  onChange={handleQuantityChange}
                                />
                              </td>
                              <td>
                                <Select
                                  options={unitOptions}
                                  value={selectedUnit}
                                  onChange={setSelectedUnit}
                                  className="select"
                                  menuPortalTarget={document.body} // dropdown কে body এর মধ্যে পোর্টাল করবে
                                  styles={{
                                    menuPortal: (base) => ({
                                      ...base,
                                      zIndex: 9999,
                                    }),
                                  }}
                                />
                              </td>
                              <td>
                                <input
                                  type="number"
                                  value={unitPrice}
                                  min={0}
                                  step="any"
                                  className="form-control text-center"
                                  style={{ maxWidth: "120px", margin: "auto" }}
                                  onChange={handleUnitPriceChange}
                                />
                              </td>
                              <td>
                                <input
                                  type="number"
                                  value={discount}
                                  min={0}
                                  step="any"
                                  className="form-control text-center"
                                  style={{ maxWidth: "120px", margin: "auto" }}
                                  onChange={handleDiscountChange}
                                />
                              </td>
                              <td>
                                <input
                                  type="number"
                                  value={tax}
                                  min={0}
                                  step="any"
                                  className="form-control text-center"
                                  style={{ maxWidth: "120px", margin: "auto" }}
                                  onChange={handleTaxChange}
                                />
                              </td>
                              <td className="align-middle">
                                {totalCost.toFixed(2)}
                              </td>
                            </tr>
                          </tbody>
                        </table>
                      </div>
                    </div>

                    <div className="row mt-3">
                      <div className="col-lg-3 col-md-6">
                        <label>Status</label>
                        <Select
                          options={statusOptions}
                          className="select"
                          placeholder="Choose"
                          value={selectedStatus}
                          onChange={setSelectedStatus}
                        />
                      </div>
                      <div className="col-lg-3 col-md-6">
                        <label>Payment</label>
                        <input
                          type="number"
                          name="Payment"
                          className="form-control"
                          value={payment}
                          onChange={(e) => handlePayment(e.target.value)}
                        />
                      </div>
                      <div className="col-lg-3 col-md-6">
                        <label>Due</label>
                        <input
                          type="number"
                          name="due"
                          className="form-control"
                          value={dueAmount.toFixed(2)}
                          readOnly
                        />
                      </div>
                    </div>

                    <div className="modal-footer-btn mt-4 d-flex justify-content-end gap-2">
                      <button
                        type="button"
                        className="btn btn-cancel"
                        data-bs-dismiss="modal"
                      >
                        Cancel
                      </button>
                      <button type="submit" className="btn btn-submit">
                        Submit
                      </button>
                    </div>
                  </form>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AddPurchases;
