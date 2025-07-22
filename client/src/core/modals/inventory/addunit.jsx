import React, { useState } from "react";
import { usePos } from "../../../hooks/PosProvider";
import { useCreateUnitMutation } from "../../../core/redux/api/unitApi/unitApi";
import { toast } from "react-toastify";
const AddUnit = () => {
  const { pos } = usePos();
  const [createUnit, { isLoading }] = useCreateUnitMutation();

  const [name, setName] = useState("");
  const [shortName, setShortName] = useState("");
  const [status, setStatus] = useState(true);
  const handleCreateUnit = async () => {
    const payload = {
      name,
      shortName,
      status: status ? "active" : "inactive",
      pos: pos._id,
    };

    try {
      const res = await createUnit(payload).unwrap();

      if (res) {
        toast.success("Unit created successfully!");
      }
      setName("");
      setShortName("");
      setStatus(true);
    } catch (error) {
      toast.error("Failed to create unit!");
    }
  };

  return (
    <div>
      {/* Add Unit */}
      <div className="modal fade" id="add-units">
        <div className="modal-dialog modal-dialog-centered custom-modal-two">
          <div className="modal-content">
            <div className="page-wrapper-new p-0">
              <div className="content">
                <div className="modal-header border-0 custom-modal-header">
                  <div className="page-title">
                    <h4>Create Unit</h4>
                  </div>
                  <button
                    id="add-units-close-btn"
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
                    <div className="mb-3">
                      <label className="form-label">Name</label>
                      <input
                        type="text"
                        className="form-control"
                        value={name}
                        onChange={(e) => setName(e.target.value)}
                      />
                    </div>
                    <div className="mb-3">
                      <label className="form-label">Short Name</label>
                      <input
                        type="text"
                        className="form-control"
                        value={shortName}
                        onChange={(e) => setShortName(e.target.value)}
                      />
                    </div>
                    <div className="mb-0">
                      <div className="status-toggle modal-status d-flex justify-content-between align-items-center">
                        <span className="status-label">Status</span>
                        <input
                          type="checkbox"
                          id="user2"
                          className="check"
                          checked={status}
                          onChange={() => setStatus(!status)}
                        />
                        <label htmlFor="user2" className="checktoggle" />
                      </div>
                    </div>
                    <div className="modal-footer-btn mt-3">
                      <button
                        type="button"
                        className="btn btn-cancel me-2"
                        data-bs-dismiss="modal"
                      >
                        Cancel
                      </button>
                      <button
                        type="button"
                        className="btn btn-submit"
                        onClick={handleCreateUnit}
                        disabled={isLoading}
                        data-bs-dismiss="modal"
                      >
                        {isLoading ? "Creating..." : "Create Unit"}
                      </button>
                    </div>
                  </form>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
      {/* /Add Unit */}
    </div>
  );
};

export default AddUnit;
