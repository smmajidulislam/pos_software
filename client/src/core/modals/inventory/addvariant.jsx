import React, { useState } from "react";
import { useCreateVariantMutation } from "../../redux/api/variantApi/variantApi";
import { usePos } from "../../../hooks/PosProvider";

const AddVariant = () => {
  const [formData, setFormData] = useState({
    variant: "",
    values: "",
    status: "active",
  });

  const [createVariant] = useCreateVariantMutation();
  const { pos } = usePos();
  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleCheckbox = (e) => {
    setFormData((prev) => ({
      ...prev,
      status: e.target.checked ? "active" : "inActive",
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    const payload = {
      variant: formData.variant.split(",").map((v) => v.trim()),
      values: formData.values.split(",").map((v) => v.trim()),
      status: formData.status,
      pos: pos?._id, // must be passed as prop
    };

    try {
      await createVariant(payload).unwrap();

      // Optional: Reset form
      setFormData({
        variant: "",
        values: "",
        status: "active",
      });
    } catch (error) {
      console.error("Variant create failed", error);
    }
  };

  return (
    <>
      <div className="modal fade" id="add-units">
        <div className="modal-dialog modal-dialog-centered custom-modal-two">
          <div className="modal-content">
            <div className="page-wrapper-new p-0">
              <div className="content">
                <div className="modal-header border-0 custom-modal-header">
                  <div className="page-title">
                    <h4>Create Attributes</h4>
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
                    {/* Variant */}
                    <div className="mb-3">
                      <label className="form-label">Variant Name</label>
                      <input
                        type="text"
                        className="form-control"
                        name="variant"
                        value={formData.variant}
                        onChange={handleChange}
                        placeholder="e.g. Size, Color"
                      />
                      <span className="tag-text">
                        Enter values separated by comma
                      </span>
                    </div>

                    {/* Values */}
                    <div className="mb-3">
                      <label className="form-label">Variant Values</label>
                      <input
                        type="text"
                        className="form-control"
                        name="values"
                        value={formData.values}
                        onChange={handleChange}
                        placeholder="e.g. S,M,L"
                      />
                      <span className="tag-text">
                        Enter values separated by comma
                      </span>
                    </div>

                    {/* Status */}
                    <div className="mb-3">
                      <div className="status-toggle modal-status d-flex justify-content-between align-items-center">
                        <span className="status-label">Status</span>
                        <input
                          type="checkbox"
                          id="variant-status"
                          className="check"
                          checked={formData.status === "active"}
                          onChange={handleCheckbox}
                        />
                        <label
                          htmlFor="variant-status"
                          className="checktoggle"
                        />
                      </div>
                    </div>

                    {/* Buttons */}
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
                        Create Attributes
                      </button>
                    </div>
                  </form>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </>
  );
};

export default AddVariant;
