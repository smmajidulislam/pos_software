import React, { useEffect, useState } from "react";
import { useUpdateVariantMutation } from "../../redux/api/variantApi/variantApi";

const EditVariant = ({ selectedVariant }) => {
  const [formData, setFormData] = useState({
    variant: "",
    values: "",
    status: "inactive",
  });
  const [updatedata] = useUpdateVariantMutation();

  useEffect(() => {
    if (selectedVariant) {
      setFormData({
        variant: Array.isArray(selectedVariant.variant)
          ? selectedVariant.variant.join(",")
          : selectedVariant.variant || "",

        values: Array.isArray(selectedVariant.values)
          ? selectedVariant.values.join(",")
          : selectedVariant.values || "",

        status: selectedVariant.status || "inactive",
      });
    }
  }, [selectedVariant]);

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
      status: e.target.checked ? "active" : "inactive",
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const updatedData = {
      variant: formData.variant.split(",").map((item) => item.trim()),
      values: formData.values.split(",").map((item) => item.trim()),
      status: formData.status,
    };
    await updatedata({
      id: selectedVariant?.id,
      updatedData,
    }).unwrap();
    setFormData({
      variant: "",
      values: "",
      status: "active",
    });
  };

  return (
    <>
      {/* Edit Unit Modal */}
      <div className="modal fade" id="edit-units">
        <div className="modal-dialog modal-dialog-centered custom-modal-two">
          <div className="modal-content">
            <div className="page-wrapper-new p-0">
              <div className="content">
                <div className="modal-header border-0 custom-modal-header">
                  <div className="page-title">
                    <h4>Edit Attributes</h4>
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
                    <div className="input-blocks mb-3">
                      <label className="form-label">Variant Name</label>
                      <input
                        type="text"
                        className="form-control"
                        name="variant"
                        value={formData.variant}
                        onChange={handleChange}
                        placeholder="e.g. Color, Size"
                      />
                      <span className="tag-text">
                        Enter multiple names separated by comma
                      </span>
                    </div>

                    {/* Values */}
                    <div className="input-blocks mb-3">
                      <label className="form-label">Values</label>
                      <input
                        type="text"
                        className="form-control"
                        name="values"
                        value={formData.values}
                        onChange={handleChange}
                        placeholder="e.g. Red, Green, Blue"
                      />
                      <span className="tag-text">
                        Enter multiple values separated by comma
                      </span>
                    </div>

                    {/* Status */}
                    <div className="mb-3">
                      <div className="status-toggle modal-status d-flex justify-content-between align-items-center">
                        <span className="status-label">Status</span>
                        <input
                          type="checkbox"
                          id="variantStatus"
                          className="check"
                          checked={formData.status === "active"}
                          onChange={handleCheckbox}
                        />
                        <label
                          htmlFor="variantStatus"
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
                        Save Changes
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

export default EditVariant;
