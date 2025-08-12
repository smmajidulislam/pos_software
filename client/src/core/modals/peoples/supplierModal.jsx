import React from "react";
import ImageWithBasePath from "../../img/imagewithbasebath";
import { useState } from "react";
import { uploadToCloudinary } from "../../../utils/cloudnary";
import {
  useCreateSupplierMutation,
  useUpdateSupplierMutation,
} from "../../redux/api/supplierApi/supplierApi";
import Swal from "sweetalert2";
import { usePos } from "../../../hooks/PosProvider";
import { useEffect } from "react";

const SupplierModal = ({ selectedSupplier }) => {
  const [imageUrl, setImageUrl] = useState("");
  const [imageUpdateUrl, setImageUpdateUrl] = useState("");
  const [loading, setLoading] = useState(false);
  const [createSupplier] = useCreateSupplierMutation();
  const [updateSupplier] = useUpdateSupplierMutation();

  const { pos } = usePos();

  const handleUpdateFormSubmit = async (event) => {
    event.preventDefault();
    const form = event.target;
    const formData = new FormData(form);

    const data = {
      image: imageUpdateUrl,
      name: formData.get("name"),
      email: formData.get("email"),
      phone: formData.get("phone"),
      address: formData.get("address"),
      description: formData.get("description"),
      posId: pos?._id,
    };
    try {
      const res = await updateSupplier({
        id: selectedSupplier._id,
        ...data,
      }).unwrap();
      if (res.message) {
        Swal.fire({
          icon: "success",
          title: res.message,
          showConfirmButton: false,
          timer: 1500,
        });
        setImageUpdateUrl("");

        form.reset();
      }
    } catch (error) {
      Swal.fire({
        icon: "error",
        title: error?.data?.message || "Something went wrong",
        showConfirmButton: false,
        timer: 1500,
      });
    }
  };

  const handleAddFromSubmit = async (event) => {
    event.preventDefault();

    const form = event.target;
    const formData = new FormData(form);

    const data = {
      image: imageUrl,
      name: formData.get("supplierName"),
      email: formData.get("email"),
      phone: formData.get("phone"),
      address: formData.get("address"),
      description: formData.get("description"),
      city: formData.get("city"),
      country: formData.get("country"),
      posId: pos?._id,
    };
    try {
      const res = await createSupplier(data).unwrap();
      if (res.message) {
        Swal.fire({
          icon: "success",
          title: res.message,
          showConfirmButton: false,
          timer: 1500,
        });
        setImageUrl("");
        form.reset();
      }
    } catch (error) {
      Swal.fire({
        icon: "error",
        title: error?.data?.message || "Something went wrong",
        showConfirmButton: false,
        timer: 1500,
      });
    }
  };
  const handleImageUpload = async (event) => {
    setLoading(true);
    const file = event.target.files[0];
    const url = await uploadToCloudinary(file);
    setImageUrl(url);
    setLoading(false);
  };
  const handleImageUpadateChange = async (event) => {
    setLoading(true);
    const file = event.target.files[0];
    const url = await uploadToCloudinary(file);
    setImageUpdateUrl(url);
    setLoading(false);
  };
  useEffect(() => {
    if (selectedSupplier) {
      setImageUpdateUrl(selectedSupplier?.image);
    }
  }, [selectedSupplier]);
  return (
    <div>
      {/* Add Supplier */}
      <div className="modal fade" id="add-units">
        <div className="modal-dialog modal-dialog-centered custom-modal-two">
          <div className="modal-content">
            <div className="page-wrapper-new p-0">
              <div className="content">
                <div className="modal-header border-0 custom-modal-header">
                  <div className="page-title">
                    <h4>Add Supplier</h4>
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
                  <form onSubmit={handleAddFromSubmit}>
                    <div className="row">
                      <div className="col-lg-12">
                        <div className="new-employee-field">
                          <span>Avatar</span>
                          <div className="profile-pic-upload mb-2">
                            <div className="profile-pic">
                              {imageUrl === "" ? (
                                <span>
                                  <i
                                    data-feather="plus-circle"
                                    className="plus-down-add"
                                  />{" "}
                                  Profile Photo
                                </span>
                              ) : (
                                <ImageWithBasePath
                                  src={imageUrl}
                                  isBase={true}
                                  className="img-fluid"
                                  alt="avatar"
                                  width={130}
                                  height={130}
                                />
                              )}
                            </div>
                            <div className="input-blocks mb-0">
                              <div className="image-upload mb-0">
                                <input
                                  type="file"
                                  name="avatar"
                                  onChange={handleImageUpload}
                                />
                                <div className="image-uploads">
                                  <h4>
                                    {loading ? "Uploading..." : "Change Image"}
                                  </h4>
                                </div>
                              </div>
                            </div>
                          </div>
                        </div>
                      </div>
                      <div className="col-lg-4">
                        <div className="input-blocks">
                          <label>Supplier Name</label>
                          <input
                            type="text"
                            className="form-control"
                            name="supplierName"
                          />
                        </div>
                      </div>
                      <div className="col-lg-4">
                        <div className="input-blocks">
                          <label>Email</label>
                          <input
                            type="email"
                            className="form-control"
                            name="email"
                          />
                        </div>
                      </div>
                      <div className="col-lg-4">
                        <div className="input-blocks">
                          <label>Phone</label>
                          <input
                            type="text"
                            className="form-control"
                            name="phone"
                          />
                        </div>
                      </div>
                      <div className="col-lg-12">
                        <div className="input-blocks">
                          <label>Address</label>
                          <input
                            type="text"
                            className="form-control"
                            name="address"
                          />
                        </div>
                      </div>
                      <div className="col-lg-6 col-sm-10 col-10">
                        <div className="input-blocks">
                          <label>City</label>

                          <input
                            type="text"
                            name="city"
                            className="form-control"
                          />
                        </div>
                      </div>
                      <div className="col-lg-6 col-sm-10 col-10">
                        <div className="input-blocks">
                          <label>Country</label>

                          <input
                            type="text"
                            name="country"
                            className="form-control"
                          />
                        </div>
                      </div>
                      <div className="col-md-12">
                        <div className="mb-0 input-blocks">
                          <label className="form-label">Descriptions</label>
                          <textarea
                            className="form-control mb-1"
                            name="description"
                            defaultValue={""}
                          />
                          <p>Maximum 600 Characters</p>
                        </div>
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
                      <button type="submit" className="btn btn-submit">
                        Submit
                      </button>
                    </div>
                  </form>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
      {/* /Add Supplier */}
      {/* Edit Supplier */}
      <div className="modal fade" id="edit-units">
        <div className="modal-dialog modal-dialog-centered custom-modal-two">
          <div className="modal-content">
            <div className="page-wrapper-new p-0">
              <div className="content">
                <div className="modal-header border-0 custom-modal-header">
                  <div className="page-title">
                    <h4>Edit Supplier</h4>
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
                  <form onSubmit={handleUpdateFormSubmit}>
                    <div className="row">
                      <div className="col-lg-12">
                        <div className="new-employee-field">
                          <span>Avatar</span>
                          <div className="profile-pic-upload edit-pic">
                            <div className="profile-pic">
                              <span>
                                <ImageWithBasePath
                                  src={
                                    imageUpdateUrl ||
                                    "assets/img/supplier/edit-supplier.jpg"
                                  }
                                  alt=""
                                  isBase={true}
                                />
                              </span>
                              <div className="close-img">
                                <i data-feather="x" className="info-img" />
                              </div>
                            </div>
                            <div className="input-blocks mb-0">
                              <div className="image-upload mb-0">
                                <input
                                  type="file"
                                  name="image"
                                  onChange={handleImageUpadateChange}
                                />
                                <div className="image-uploads">
                                  <h4>
                                    {loading ? "Uploading..." : "Change Image"}
                                  </h4>
                                </div>
                              </div>
                            </div>
                          </div>
                        </div>
                      </div>

                      <div className="col-lg-4">
                        <div className="input-blocks">
                          <label>Supplier Name</label>
                          <input
                            type="text"
                            name="name"
                            className="form-control"
                            defaultValue={selectedSupplier?.name}
                          />
                        </div>
                      </div>

                      <div className="col-lg-4">
                        <div className="input-blocks">
                          <label>Email</label>
                          <input
                            type="email"
                            name="email"
                            className="form-control"
                            defaultValue={selectedSupplier?.email}
                          />
                        </div>
                      </div>

                      <div className="col-lg-4">
                        <div className="input-blocks">
                          <label>Phone</label>
                          <input
                            type="text"
                            name="phone"
                            className="form-control"
                            defaultValue={selectedSupplier?.phone}
                          />
                        </div>
                      </div>

                      <div className="col-lg-12">
                        <div className="input-blocks">
                          <label>Address</label>
                          <input
                            type="text"
                            name="address"
                            className="form-control"
                            defaultValue={selectedSupplier?.address}
                          />
                        </div>
                      </div>

                      <div className="col-md-12">
                        <div className="mb-0 input-blocks">
                          <label className="form-label">Descriptions</label>
                          <textarea
                            className="form-control mb-1"
                            name="description"
                            placeholder="Write description..."
                            defaultValue={selectedSupplier?.description}
                          />
                          <p>Maximum 600 Characters</p>
                        </div>
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
                        Submit
                      </button>
                    </div>
                  </form>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
      {/* /Edit Supplier */}
    </div>
  );
};

export default SupplierModal;
