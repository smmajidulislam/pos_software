import React from "react";
import { Link } from "react-router-dom";
import { all_routes } from "../../../Router/all_routes";
import { useCreateCategoryMutation } from "../../redux/api/categoryApi/categoryApi";
import { toast } from "react-toastify";
import { useState } from "react";
import { usePos } from "../../../hooks/PosProvider";

const AddCategory = () => {
  const [categoryName, setCategoryName] = useState("");
  const { pos } = usePos();
  const [createCategory] = useCreateCategoryMutation();
  const handleOnSubmit = async () => {
    const payload = {
      posid: pos?._id,
      name: categoryName,
      type: "main",
    };
    if (!categoryName || !pos?._id) {
      return;
    }
    try {
      const res = await createCategory(payload).unwrap();
      if (res) {
        setCategoryName("");
      }
    } catch (error) {
      toast.error(error?.data?.message || "Something went wrong!");
    }
  };

  const route = all_routes;
  return (
    <>
      {/* Add Category */}
      <div className="modal fade" id="add-units-category">
        <div className="modal-dialog modal-dialog-centered custom-modal-two">
          <div className="modal-content">
            <div className="page-wrapper-new p-0">
              <div className="content">
                <div className="modal-header border-0 custom-modal-header">
                  <div className="page-title">
                    <h4>Add New Category</h4>
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
                    <label className="form-label">Name</label>
                    <input
                      type="text"
                      className="form-control"
                      value={categoryName}
                      onChange={(e) => setCategoryName(e.target.value)}
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
                      className="btn btn-submit"
                      onClick={handleOnSubmit}
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
      {/* /Add Category */}
    </>
  );
};

export default AddCategory;
