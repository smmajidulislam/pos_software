import React, { useState } from "react";
import { Link } from "react-router-dom";
import { all_routes } from "../../../Router/all_routes";
import { useCreateUnitMutation } from "../../redux/api/unitApi/unitApi";
import { usePos } from "../../../hooks/PosProvider";
import { toast } from "react-toastify";

const Addunits = () => {
  const [unit, setUnit] = useState("");
  const { pos } = usePos();
  const [createUnit] = useCreateUnitMutation();
  const handleOnSubmit = async () => {
    if (!unit || !pos) {
      return;
    }
    const payload = {
      name: unit,
      pos: pos?._id,
    };
    try {
      const res = await createUnit(payload).unwrap();
      if (res) {
        setUnit("");
      }
    } catch (error) {
      toast.error("Failed to create unit!");
    }
  };
  const route = all_routes;
  return (
    <>
      {/* Add Unit */}
      <div className="modal fade" id="add-unit">
        <div className="modal-dialog modal-dialog-centered custom-modal-two">
          <div className="modal-content">
            <div className="page-wrapper-new p-0">
              <div className="content">
                <div className="modal-header border-0 custom-modal-header">
                  <div className="page-title">
                    <h4>Add Unit</h4>
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
                    <label className="form-label">Unit</label>
                    <input
                      type="text"
                      className="form-control"
                      value={unit}
                      onChange={(e) => setUnit(e.target.value)}
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
      {/* /Add Unit */}
    </>
  );
};

export default Addunits;
