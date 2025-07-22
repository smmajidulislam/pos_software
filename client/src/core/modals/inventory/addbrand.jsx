import { PlusCircle } from "feather-icons-react/build/IconComponents";
import React, { useState } from "react";
import { useCreateBrandMutation } from "../../redux/api/brandApi/brandApi";
import { uploadToCloudinary } from "../../../utils/cloudnary";
import { toast } from "react-toastify";
import { usePos } from "../../../hooks/PosProvider";

const AddBrand = () => {
  const [createBrand] = useCreateBrandMutation();

  const [brandName, setBrandName] = useState("");
  const [imageUrl, setImageUrl] = useState("");
  const [previewImage, setPreviewImage] = useState(null);
  const [status, setStatus] = useState(true);
  const { pos } = usePos();

  // Handle image upload and Cloudinary
  const handleImageUpload = async (event) => {
    const file = event.target.files[0];
    if (!file) return;
    const url = await uploadToCloudinary(file);
    setImageUrl(url); // store in form
    setPreviewImage(URL.createObjectURL(file)); // for preview only
  };

  // Submit brand
  const handleSubmit = async (e) => {
    e.preventDefault();

    document.body.style = "";
    const payload = {
      name: brandName,
      logo: imageUrl,
      status: status ? "active" : "inactive",
      posId: pos._id,
    };

    try {
      await createBrand(payload).unwrap();

      // reset form
      setBrandName("");
      setImageUrl("");
      setPreviewImage(null);
      setStatus(true);
    } catch (err) {
      toast.error(err?.data?.message || "Something went wrong!");
    }
  };

  return (
    <>
      <div className="modal fade" id="add-brand">
        <div className="modal-dialog modal-dialog-centered custom-modal-two">
          <div className="modal-content">
            <div className="page-wrapper-new p-0">
              <div className="content">
                <div className="modal-header border-0 custom-modal-header">
                  <div className="page-title">
                    <h4>Create Brand</h4>
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
                <div className="modal-body custom-modal-body new-employee-field">
                  <form onSubmit={handleSubmit}>
                    <div className="mb-3">
                      <label className="form-label">Brand</label>
                      <input
                        type="text"
                        className="form-control"
                        value={brandName}
                        onChange={(e) => setBrandName(e.target.value)}
                      />
                    </div>

                    <label className="form-label">Logo</label>
                    <div className="profile-pic-upload mb-3">
                      <div className="profile-pic brand-pic">
                        {previewImage ? (
                          <img
                            src={previewImage}
                            alt="Preview"
                            style={{
                              width: "80px",
                              height: "80px",
                              objectFit: "cover",
                              borderRadius: "5px",
                            }}
                          />
                        ) : (
                          <span>
                            <PlusCircle className="plus-down-add" /> Add Image
                          </span>
                        )}
                      </div>
                      <div className="image-upload mb-0">
                        <input type="file" onChange={handleImageUpload} />
                        <div className="image-uploads">
                          <h4>Change Image</h4>
                        </div>
                      </div>
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
                        Create Brand
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

export default AddBrand;
