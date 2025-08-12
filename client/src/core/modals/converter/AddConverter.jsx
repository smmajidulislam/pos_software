import React, { useState } from "react";

const AddConverter = () => {
  const [formData, setFormData] = useState({
    productRef: "",
    from: "",
    qty: "",
    to: "",
  });

  // Input change handler
  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  // Submit handler
  const handleSubmit = async (e) => {
    e.preventDefault();
  };
  const handleGetProduct = async () => {};

  return (
    <div>
      <div className="modal fade" id="add-converter">
        <div className="modal-dialog modal-dialog-centered custom-modal-two">
          <div className="modal-content">
            <div className="page-wrapper-new p-0">
              <div className="content">
                <div className="modal-header border-0 custom-modal-header">
                  <div className="page-title">
                    <h4>Add a Convert</h4>
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
                  <form onSubmit={handleSubmit}>
                    <div className="row">
                      <div className="col-lg-8">
                        <div className="input-blocks">
                          <label>Product Ref </label>
                          <input
                            type="text"
                            name="productRef"
                            value={formData.productRef}
                            onChange={handleChange}
                            className="form-control"
                          />
                        </div>
                      </div>
                      <div className="col-lg-4 mt-4">
                        <button
                          onClick={handleGetProduct}
                          className="btn btn-primary mt-2"
                        >
                          Submit
                        </button>
                      </div>
                    </div>

                    <div className="row">
                      {/* from */}
                      <div className="col-lg-4">
                        <div className="input-blocks">
                          <label>From</label>
                          <input
                            type="text"
                            name="from"
                            value={formData.from}
                            onChange={handleChange}
                            className="form-control"
                          />
                        </div>
                      </div>
                      {/* Quantity */}
                      <div className="col-lg-4">
                        <div className="input-blocks">
                          <label>Quantity</label>
                          <input
                            type="text"
                            name="qty"
                            value={formData.qty}
                            onChange={handleChange}
                            className="form-control"
                          />
                        </div>
                      </div>
                      {/* to */}
                      <div className="col-lg-4">
                        <div className="input-blocks">
                          <label>To</label>
                          <input
                            type="text"
                            name="to"
                            value={formData.to}
                            onChange={handleChange}
                            className="form-control"
                          />
                        </div>
                      </div>
                    </div>

                    {/* Footer */}
                    <div className="modal-footer-btn">
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

export default AddConverter;
