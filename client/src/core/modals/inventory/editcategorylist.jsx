import React, { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { useUpdateCategoryMutation } from "../../redux/api/categoryApi/categoryApi";
import { toast } from "react-toastify";

const EditCategoryList = ({ selectedCategory }) => {
  const [updateData, setUpdateData] = useState({
    name: "",
    slug: "",
    status: "inactive",
  });
  const [updateCategory] = useUpdateCategoryMutation();
  const handleInputChange = (e) => {
    const { name, type, value } = e.target;
    setUpdateData((prevData) => ({
      ...prevData,
      [name]: type === "checkbox" ? e.target.checked : value,
    }));
  };
  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const res = await updateCategory({
        id: selectedCategory._id,
        data: updateData,
      }).unwrap();
      setUpdateData({
        name: "",
        slug: "",
        status: "",
      });
      if (res) {
        toast.success("Category updated successfully!");
      }
    } catch (error) {
      toast.error("Failed to update category!");
    }
  };
  useEffect(() => {
    if (selectedCategory) {
      setUpdateData({
        name: selectedCategory.name || "",
        slug: selectedCategory.slug || "",
        status: selectedCategory.status || "inactive",
      });
    }
  }, [selectedCategory]);

  return (
    <div>
      {/* Edit Category */}
      <div className="modal fade" id="edit-category">
        <div className="modal-dialog modal-dialog-centered custom-modal-two">
          <div className="modal-content">
            <div className="page-wrapper-new p-0">
              <div className="content">
                <div className="modal-header border-0 custom-modal-header">
                  <div className="page-title">
                    <h4>Edit Category</h4>
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
                  <form>
                    <div className="mb-3">
                      <label className="form-label">Category</label>
                      <input
                        type="text"
                        name="name"
                        value={updateData.name}
                        onChange={handleInputChange}
                        className="form-control"
                      />
                    </div>
                    <div className="mb-3">
                      <label className="form-label">Category Slug</label>
                      <input
                        type="text"
                        name="slug"
                        value={updateData.slug}
                        onChange={handleInputChange}
                        className="form-control"
                      />
                    </div>
                    <div className="mb-0">
                      <div className="status-toggle modal-status d-flex justify-content-between align-items-center">
                        <span className="status-label">Status</span>
                        <input
                          id="user3"
                          type="checkbox"
                          name="status"
                          className="check"
                          checked={updateData.status === "active"}
                          onChange={(e) => {
                            setUpdateData((prev) => ({
                              ...prev,
                              status: e.target.checked ? "active" : "inactive",
                            }));
                          }}
                        />

                        <label htmlFor="user3" className="checktoggle" />
                      </div>
                    </div>
                    <div className="modal-footer-btn">
                      <button
                        type="button"
                        className="btn btn-cancel me-2"
                        data-bs-dismiss="modal"
                      >
                        Cancel
                      </button>
                      <Link
                        to="#"
                        className="btn btn-submit"
                        data-bs-dismiss="modal"
                        onClick={handleSubmit}
                      >
                        Save Changes
                      </Link>
                    </div>
                  </form>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
      {/* /Edit Category */}
    </div>
  );
};

export default EditCategoryList;
