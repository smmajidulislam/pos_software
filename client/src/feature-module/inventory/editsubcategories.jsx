import React, { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import Select from "react-select";
import {
  useGetCategoriesQuery,
  useUpdateCategoryMutation,
} from "../../core/redux/api/categoryApi/categoryApi";
import { usePos } from "../../hooks/PosProvider";

const EditSubcategories = ({ editData }) => {
  const [categories, setCategories] = useState([]);
  const { pos } = usePos();
  const { data: categoryItems, isLoading: categoryLoading } =
    useGetCategoriesQuery(
      { type: "main", pos: pos?._id },
      {
        skip: !pos?._id,
      }
    );
  const [updateCategory] = useUpdateCategoryMutation();
  const [formData, setFormData] = useState({
    parentCategory: null,
    category: "",
    categorycode: "",
    description: "",
    status: "",
  });
  const handleUpdate = async (e) => {
    e.preventDefault();

    const preparedData = {
      parent: formData?.parentCategory?._id,
      name: formData?.category,
      code: formData?.categorycode,
      description: formData?.description,
      status: formData?.status,
    };
    await updateCategory({
      id: editData.id,
      data: preparedData,
    }).unwrap();
  };
  // Fill data from editData
  useEffect(() => {
    if (editData && categoryItems?.data?.length > 0) {
      const matchedCategory = categoryItems.data.find(
        (item) => item._id === editData.parentCategoryId
      );
      setFormData({
        parentCategory: matchedCategory
          ? { value: matchedCategory._id, label: matchedCategory.name }
          : null,
        category: editData.category || "",
        categorycode: editData.categorycode || "",
        description: editData.description || "",
        status: editData.status,
      });
    }
  }, [editData, categoryItems, categoryLoading]);
  // Set category options
  useEffect(() => {
    if (categoryItems?.data?.length > 0 && !categoryLoading) {
      const filterData = categoryItems.data.map((item) => ({
        value: item._id,
        label: item.name,
        _id: item._id,
      }));
      setCategories(filterData);
    }
  }, [categoryItems, categoryLoading]);
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
                    <h4>Edit Sub Category</h4>
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
                      <label className="form-label">Parent Category</label>
                      <Select
                        className="select"
                        options={categories}
                        value={formData.parentCategory}
                        onChange={(selected) =>
                          setFormData({ ...formData, parentCategory: selected })
                        }
                      />
                    </div>

                    <div className="mb-3">
                      <label className="form-label">Category Name</label>
                      <input
                        type="text"
                        className="form-control"
                        value={formData.category}
                        onChange={(e) =>
                          setFormData({ ...formData, category: e.target.value })
                        }
                      />
                    </div>

                    <div className="mb-3">
                      <label className="form-label">Category Code</label>
                      <input
                        type="text"
                        className="form-control"
                        value={formData.categorycode}
                        onChange={(e) =>
                          setFormData({
                            ...formData,
                            categorycode: e.target.value,
                          })
                        }
                      />
                    </div>

                    <div className="mb-3 input-blocks">
                      <label className="form-label">Description</label>
                      <textarea
                        className="form-control"
                        value={formData.description}
                        onChange={(e) =>
                          setFormData({
                            ...formData,
                            description: e.target.value,
                          })
                        }
                      />
                    </div>

                    <div className="mb-0">
                      <div className="status-toggle modal-status d-flex justify-content-between align-items-center">
                        <span className="status-label">Status</span>
                        <input
                          type="checkbox"
                          id="user3"
                          className="check"
                          checked={formData.status === "active"}
                          onChange={(e) =>
                            setFormData({
                              ...formData,
                              status: e.target.checked ? "active" : "inactive",
                            })
                          }
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
                        onClick={handleUpdate}
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

export default EditSubcategories;
