import React, { useEffect, useState } from "react";
import Select from "react-select";
import {
  useGetCategoriesQuery,
  useCreateCategoryMutation,
} from "../../redux/api/categoryApi/categoryApi";
import { usePos } from "../../../hooks/PosProvider";

const AddSubcategory = () => {
  const [categories, setCategories] = useState([]);
  const { pos } = usePos();

  const [formData, setFormData] = useState({
    name: "",
    slug: "",
    status: "active",
    type: "sub",
    parent: null,
    code: "",
    description: "",
    posid: pos?._id || "",
  });

  const [createCategory] = useCreateCategoryMutation();

  const { data: categoryItems, isLoading: categoryLoading } =
    useGetCategoriesQuery(
      { type: "main", pos: pos?._id },
      {
        skip: !pos?._id,
      }
    );

  useEffect(() => {
    if (categoryItems?.data?.length > 0 && !categoryLoading) {
      const filterData = categoryItems.data.map((item) => ({
        value: item._id,
        label: item.name,
      }));
      setCategories(filterData);
    }
  }, [categoryItems, categoryLoading]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({
      ...formData,
      [name]: value,
    });
  };

  const handleCheckbox = (e) => {
    setFormData({
      ...formData,
      status: e.target.checked ? "active" : "inactive",
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    const preparedData = {
      name: formData.name,
      slug: formData.slug,
      status: formData.status,
      type: formData.type,
      parent: formData.parent?.value || "",
      code: formData.code,
      description: formData.description,
      posid: pos?._id || "",
    };

    try {
      await createCategory(preparedData);
    } catch (error) {
      console.error("Create category failed", error);
    }
  };

  return (
    <div>
      <div className="modal fade" id="add-category">
        <div className="modal-dialog modal-dialog-centered custom-modal-two">
          <div className="modal-content">
            <div className="page-wrapper-new p-0">
              <div className="content">
                <div className="modal-header border-0 custom-modal-header">
                  <div className="page-title">
                    <h4>Create Sub Category</h4>
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
                    <div className="mb-3">
                      <label className="form-label">Parent Category</label>
                      <Select
                        className="select"
                        options={categories}
                        value={formData.parent}
                        onChange={(selected) =>
                          setFormData({ ...formData, parent: selected })
                        }
                        placeholder="Select Parent Category"
                      />
                    </div>

                    <div className="mb-3">
                      <label className="form-label">Category Name</label>
                      <input
                        type="text"
                        className="form-control"
                        name="name"
                        value={formData.name}
                        onChange={handleChange}
                      />
                    </div>

                    <div className="mb-3">
                      <label className="form-label">Category Slug</label>
                      <input
                        type="text"
                        className="form-control"
                        name="slug"
                        value={formData.slug}
                        onChange={handleChange}
                      />
                    </div>

                    <div className="mb-3">
                      <label className="form-label">Category Code</label>
                      <input
                        type="text"
                        className="form-control"
                        name="code"
                        value={formData.code}
                        onChange={handleChange}
                      />
                    </div>

                    <div className="mb-3 input-blocks">
                      <label className="form-label">Description</label>
                      <textarea
                        className="form-control"
                        name="description"
                        value={formData.description}
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
                          checked={formData.status === "active"}
                          onChange={handleCheckbox}
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
                      <button
                        type="submit"
                        className="btn btn-submit"
                        data-bs-dismiss="modal"
                      >
                        Create Subcategory
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

export default AddSubcategory;
