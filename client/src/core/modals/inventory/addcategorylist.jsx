import React, { useState } from "react";
import { Link } from "react-router-dom";
import { toast } from "react-toastify";
import { useCreateCategoryMutation } from "../../redux/api/categoryApi/categoryApi";
import { usePos } from "../../../hooks/PosProvider";

const AddCategoryList = () => {
  const [data, setData] = useState({
    slug: "",
    name: "",
    type: "main",
  });
  const [createCategory] = useCreateCategoryMutation();
  const { pos } = usePos();
  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    setData({
      ...data,
      [name]: type === "checkbox" ? checked : value,
    });
  };
  const handleOnSubmit = async () => {
    const payload = {
      name: data.name,
      slug: data.slug,
      type: data.type,
      posid: pos._id,
    };
    try {
      const res = await createCategory(payload).unwrap();
      if (res) {
        setData({
          slug: "",
          name: "",
          type: "main",
        });
      }
    } catch (error) {
      toast.error(error?.data?.message || "Something went wrong!");
    }
  };
  return (
    <div>
      {/* Add Category */}
      <div className="modal fade" id="add-category">
        <div className="modal-dialog modal-dialog-centered custom-modal-two">
          <div className="modal-content">
            <div className="page-wrapper-new p-0">
              <div className="content">
                <div className="modal-header border-0 custom-modal-header">
                  <div className="page-title">
                    <h4>Create Category</h4>
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
                        className="form-control"
                        value={data.name}
                        name="name"
                        onChange={handleChange}
                      />
                    </div>
                    <div className="mb-3">
                      <label className="form-label">Category Slug</label>
                      <input
                        type="text"
                        className="form-control"
                        value={data.slug}
                        name="slug"
                        onChange={handleChange}
                      />
                    </div>
                    <div className="mb-0">
                      <div className="status-toggle modal-status d-flex justify-content-between align-items-center">
                        <span className="status-label">Status</span>
                        <input
                          type="checkbox"
                          id="user2"
                          className="check"
                          name="type"
                          checked={data.type === "main"}
                          onChange={handleChange}
                        />
                        <label htmlFor="user2" className="checktoggle" />
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
                        onClick={handleOnSubmit}
                      >
                        Create Category
                      </Link>
                    </div>
                  </form>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
      {/* /Add Category */}
    </div>
  );
};

export default AddCategoryList;
