import React, { useEffect, useState } from "react";
import Select from "react-select";
import { useGetParchaseRetrunQuery } from "../../redux/api/purchageApi/purchaceApi";

const AddPurchaseReturn = () => {
  const [payment, setPayment] = useState(0);
  const [refarnce, setRefarnce] = useState("");
  const [customError, setCustomError] = useState("");
  const [quantity, setQuantity] = useState(1);
  const [selectedStatus, setSelectedStatus] = useState(null);

  const { data: refarnces = [] } = useGetParchaseRetrunQuery(refarnce, {
    skip: !refarnce,
  });

  useEffect(() => {
    if (refarnce) {
      if (!refarnces || refarnces.length === 0) {
        setCustomError("Reference not found");
      } else {
        setCustomError("");
        const fetched = refarnces[0];
        setQuantity(fetched.Qty || 1);
        setPayment(fetched.payment || 0);
      }
    }
  }, [refarnce, refarnces]);

  const handleQuantityChange = (e) => {
    const value = parseInt(e.target.value);
    if (!isNaN(value) && value > 0) {
      setQuantity(value);
    }
  };

  const handlePayment = (due) => {
    const numericDue = parseFloat(due) || 0;
    setPayment(numericDue);
  };

  const statusOptions = [
    { value: "received", label: "Received" },
    { value: "pending", label: "Pending" },
  ];

  const fetched = refarnces && refarnces.length > 0 ? refarnces[0] : null;

  // Calculate Unit Price (basic version)
  const unitPrice =
    fetched && fetched.Qty > 0 ? fetched.grandTotal / fetched.Qty : 0;

  return (
    <div>
      <div className="modal fade" id="add-sales-new">
        <div className="modal-dialog add-centered">
          <div className="modal-content">
            <div className="page-wrapper-new p-0">
              <div className="content">
                <div className="modal-header border-0 custom-modal-header">
                  <div className="page-title">
                    <h4>Add Purchase Return</h4>
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
                  <form>
                    <div className="row">
                      <div className="col-lg-3 col-md-6">
                        <label>Reference No</label>
                        <input
                          type="text"
                          name="Reference"
                          placeholder="Reference No"
                          className="form-control"
                          value={refarnce}
                          onChange={(e) => setRefarnce(e.target.value)}
                        />
                        {customError && (
                          <span className="text-danger">{customError}</span>
                        )}
                      </div>
                    </div>

                    {fetched && (
                      <div className="row mt-3">
                        <div className="table-responsive">
                          <table className="table datanew text-center">
                            <thead>
                              <tr>
                                <th>Product</th>
                                <th>Qty</th>
                                <th>Unit Price</th>
                                <th>Discount</th>
                                <th>Tax</th>
                                <th>Total</th>
                              </tr>
                            </thead>
                            <tbody>
                              <tr className="text-center">
                                <td>{fetched.product?.productName || "-"}</td>
                                <td>
                                  <input
                                    type="number"
                                    value={quantity}
                                    min={1}
                                    className="form-control text-center"
                                    style={{ width: "80px" }}
                                    onChange={handleQuantityChange}
                                  />
                                </td>
                                <td>{unitPrice.toFixed(2)}</td>
                                <td>0.00</td>
                                <td>0.00</td>
                                <td>{(unitPrice * quantity).toFixed(2)}</td>
                              </tr>
                            </tbody>
                          </table>
                        </div>
                      </div>
                    )}

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
                          value={
                            fetched
                              ? ((unitPrice * quantity || 0) - payment).toFixed(
                                  2
                                )
                              : 0
                          }
                          readOnly
                        />
                      </div>
                    </div>

                    <div className="modal-footer-btn mt-4">
                      <button
                        type="button"
                        className="btn btn-cancel me-2"
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

export default AddPurchaseReturn;
