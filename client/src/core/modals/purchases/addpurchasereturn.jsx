import React, { useEffect, useState } from "react";
import Select from "react-select";
import Swal from "sweetalert2";
import {
  useGetParchaseRetrunQuery,
  useCreatePurchaseReturnMutation,
} from "../../redux/api/purchageApi/purchaceApi";

const AddPurchaseReturn = () => {
  const [refarnce, setRefarnce] = useState("");
  const [customError, setCustomError] = useState("");
  const [quantity, setQuantity] = useState(0);
  const [unitPrice, setUnitPrice] = useState(0);
  const [perUnitDiscount, setPerUnitDiscount] = useState(0);
  const [totalDiscount, setTotalDiscount] = useState(0);
  const [totalAmount, setTotalAmount] = useState(0);
  const [payment, setPayment] = useState(0);
  const [due, setDue] = useState(0);
  const [selectedStatus, setSelectedStatus] = useState(null);
  const [maxQty, setMaxQty] = useState(0);

  const [createPurchaseReturn] = useCreatePurchaseReturnMutation();
  const { data: refarnces } = useGetParchaseRetrunQuery(refarnce, {
    skip: !refarnce,
  });

  const fetched = refarnces && refarnces.length > 0 ? refarnces[0] : null;

  useEffect(() => {
    if (fetched) {
      const qty = fetched.Qty || 0;
      const discountValue = fetched.product?.discountValue || 0;
      const productPrice = fetched.product?.price || 0;

      const perUnit = qty > 0 ? discountValue / qty : 0;

      setQuantity(qty);
      setMaxQty(qty);
      setPerUnitDiscount(perUnit);
      setUnitPrice(productPrice);
      setPayment(fetched.payment || 0);
      setCustomError("");
    } else if (refarnce) {
      setCustomError("Reference not found");
      setQuantity(0);
      setUnitPrice(0);
      setPerUnitDiscount(0);
      setPayment(0);
    }
  }, [refarnce, refarnces, fetched]);

  useEffect(() => {
    const discount = perUnitDiscount * quantity;
    const total = unitPrice * quantity + discount;
    const dueAmount = total - payment;

    setTotalDiscount(discount);
    setTotalAmount(total);
    setDue(dueAmount);
  }, [quantity, perUnitDiscount, payment, unitPrice]);

  const handleQuantityChange = (e) => {
    const val = parseInt(e.target.value);
    if (!isNaN(val) && val >= 0 && val <= maxQty) {
      setQuantity(val);
    }
  };

  const resetForm = () => {
    setRefarnce("");
    setCustomError("");
    setQuantity(0);
    setUnitPrice(0);
    setPerUnitDiscount(0);
    setTotalDiscount(0);
    setTotalAmount(0);
    setPayment(0);
    setDue(0);
    setSelectedStatus(null);
    setMaxQty(0);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!fetched) {
      Swal.fire("Error", "Please enter a valid reference.", "error");
      return;
    }

    if (!selectedStatus) {
      Swal.fire("Error", "Please select a status.", "error");
      return;
    }

    if (quantity === 0) {
      Swal.fire("Warning", "Quantity cannot be zero.", "warning");
      return;
    }
    if (!refarnce || refarnce.trim() === "") {
      Swal.fire("Error", "Please enter Reference No", "error");
      return;
    }

    const confirmResult = await Swal.fire({
      title: "Are you sure?",
      text: "Do you want to create this purchase return?",
      icon: "question",
      showCancelButton: true,
      confirmButtonText: "Yes, submit",
      cancelButtonText: "Cancel",
    });

    if (confirmResult.isConfirmed) {
      const formData = {
        reference: refarnce,
        product: fetched?.product?._id,
        pos: fetched?._id,
        quantity,
        unitPrice,
        discountPerUnit: perUnitDiscount,
        totalDiscount,
        totalAmount,
        payment,
        due,
        status: selectedStatus?.value,
      };

      try {
        const res = await createPurchaseReturn(formData).unwrap();
        if (res?.success) {
          Swal.fire(
            "Success",
            "Purchase Return Created Successfully!",
            "success"
          );
          resetForm();
        }
      } catch (err) {
        Swal.fire("Error", "Failed to create purchase return.", "error");
      }
    }
  };

  const statusOptions = [
    { value: "received", label: "Received" },
    { value: "pending", label: "Pending" },
  ];

  return (
    <div>
      <div
        className="modal fade"
        id="add-sales-new"
        tabIndex="-1"
        aria-hidden="true"
      >
        <div className="modal-dialog modal-lg modal-dialog-centered">
          <div className="modal-content">
            <div className="modal-header border-0">
              <h4 className="modal-title">Add Purchase Return</h4>
              <button
                type="button"
                className="btn-close"
                data-bs-dismiss="modal"
                aria-label="Close"
                onClick={resetForm} // Clear form on modal close button click
              ></button>
            </div>

            <div className="modal-body">
              <form onSubmit={handleSubmit}>
                <div className="row mb-3">
                  <div className="col-lg-4 col-md-6">
                    <label className="form-label">Reference No</label>
                    <input
                      type="text"
                      className="form-control"
                      value={refarnce}
                      onChange={(e) => setRefarnce(e.target.value)}
                      placeholder="Reference No"
                    />
                    {customError && (
                      <small className="text-danger">{customError}</small>
                    )}
                  </div>
                </div>

                {fetched && (
                  <div className="table-responsive">
                    <table className="table table-bordered text-center">
                      <thead className="table-light">
                        <tr>
                          <th>Product</th>
                          <th>Qty</th>
                          <th>Unit Price</th>
                          <th>Total Discount</th>
                          <th>Grand Total</th>
                        </tr>
                      </thead>
                      <tbody>
                        <tr>
                          <td>{fetched.product?.productName}</td>
                          <td>
                            <input
                              type="number"
                              value={quantity}
                              min={0}
                              max={maxQty}
                              className="form-control text-center"
                              style={{ width: "80px", margin: "auto" }}
                              onChange={handleQuantityChange}
                            />
                          </td>
                          <td>{unitPrice?.toFixed(2)}</td>
                          <td>{totalDiscount?.toFixed(2)}</td>
                          <td>{totalAmount?.toFixed(2)}</td>
                        </tr>
                      </tbody>
                    </table>
                  </div>
                )}

                <div className="row mt-3">
                  <div className="col-lg-4 col-md-6 mb-3">
                    <label className="form-label">Status</label>
                    <Select
                      options={statusOptions}
                      placeholder="Choose status"
                      value={selectedStatus}
                      onChange={setSelectedStatus}
                    />
                  </div>
                  <div className="col-lg-4 col-md-6 mb-3">
                    <label className="form-label">Payment</label>
                    <input
                      type="number"
                      className="form-control"
                      value={payment}
                      onChange={(e) =>
                        setPayment(parseFloat(e.target.value) || 0)
                      }
                    />
                  </div>
                  <div className="col-lg-4 col-md-6 mb-3">
                    <label className="form-label">Due</label>
                    <input
                      type="number"
                      className="form-control"
                      value={due.toFixed(2)}
                      readOnly
                    />
                  </div>
                </div>

                <div className="modal-footer mt-4">
                  <button
                    type="button"
                    className="btn btn-secondary me-2"
                    data-bs-dismiss="modal"
                    onClick={resetForm}
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    data-bs-dismiss="modal"
                    className="btn btn-primary"
                  >
                    Submit
                  </button>
                </div>
              </form>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AddPurchaseReturn;
