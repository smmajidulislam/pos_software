import React, { useState, useEffect } from "react";
import { useUpdateUnitMutation } from "../../redux/api/unitApi/unitApi";
import { toast } from "react-toastify";

const EditUnit = ({ selectedUnit }) => {
  const [name, setName] = useState("");
  const [shortName, setShortName] = useState("");
  const [status, setStatus] = useState(true);

  const [updateUnit, { isLoading }] = useUpdateUnitMutation();

  useEffect(() => {
    if (selectedUnit) {
      setName(selectedUnit.name || "");
      setShortName(selectedUnit.shortName || "");
      setStatus(selectedUnit.status ?? true);
    }
  }, [selectedUnit]);

  const handleSubmit = async () => {
    try {
      const payload = {
        id: selectedUnit._id,
        data: {
          name,
          shortName,
          status,
        },
      };
      const res = await updateUnit(payload).unwrap();

      if (res) {
        toast.success("Unit updated successfully!");
      }
    } catch (error) {
      toast.error("Failed to update unit!");
    }
  };

  return (
    <div>
      <div className="modal fade" id="edit-units">
        <div className="modal-dialog modal-dialog-centered custom-modal-two">
          <div className="modal-content">
            <div className="page-wrapper-new p-0">
              <div className="content">
                <div className="modal-header border-0 custom-modal-header">
                  <div className="page-title">
                    <h4>Edit Unit</h4>
                  </div>
                  <button
                    id="edit-units-close-btn"
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
                          id="unit-status"
                          className="check"
                          checked={status}
                          onChange={() => setStatus(!status)}
                        />
                        <label htmlFor="unit-status" className="checktoggle" />
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
                        onClick={handleSubmit}
                        disabled={isLoading}
                        data-bs-dismiss="modal"
                      >
                        {isLoading ? "Saving..." : "Save Changes"}
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

export default EditUnit;
