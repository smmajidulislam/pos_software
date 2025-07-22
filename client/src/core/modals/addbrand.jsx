import React, { useState } from "react";
import { Link } from "react-router-dom";
import { all_routes } from "../../Router/all_routes";
import { useCreateBrandMutation } from "../redux/api/brandApi/brandApi";
import { usePos } from "../../hooks/PosProvider";
import { toast } from "react-toastify";

const AddBrand = () => {
  const [brandName, setBrandName] = useState("");
  const { pos } = usePos();
  const [createBrand] = useCreateBrandMutation();
  const handleOnSubmit = async () => {
    const payload = {
      posId: pos?._id,
      name: brandName,
    };
    if (!brandName || !pos?._id) {
      return;
    }
    try {
      const res = await createBrand(payload).unwrap();
      if (res) {
        setBrandName("");
      }
    } catch (error) {
      toast.error(error?.data?.message || "Something went wrong!");
    }
  };
  const route = all_routes;
  return (
    <>
      {/* Add Brand */}
      <div className="modal fade" id="add-units-brand">
        <div className="modal-dialog modal-dialog-centered custom-modal-two">
          <div className="modal-content">
            <div className="page-wrapper-new p-0">
              <div className="content">
                <div className="modal-header border-0 custom-modal-header">
                  <div className="page-title">
                    <h4>Add New Brand</h4>
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
                  <div className="mb-3">
                    <label className="form-label">Brand</label>
                    <input
                      type="text"
                      className="form-control"
                      value={brandName}
                      onChange={(e) => setBrandName(e.target.value)}
                    />
                  </div>
                  <div className="modal-footer-btn">
                    <Link
                      to="#"
                      className="btn btn-cancel me-2"
                      data-bs-dismiss="modal"
                    >
                      Cancel
                    </Link>
                    <Link
                      to={route.addproduct}
                      onClick={handleOnSubmit}
                      className="btn btn-submit"
                      data-bs-dismiss="modal"
                    >
                      Submit
                    </Link>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
      {/* /Add Brand */}
    </>
  );
};

export default AddBrand;
