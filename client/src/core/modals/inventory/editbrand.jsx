import React, { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { X } from "feather-icons-react/build/IconComponents";
import ImageWithBasePath from "../../img/imagewithbasebath";
import { toast } from "react-toastify";
import { useUpdateBrandMutation } from "../../redux/api/brandApi/brandApi";
import { uploadToCloudinary } from "../../../utils/cloudnary";

const EditBrand = ({ brand }) => {
  const [name, setName] = useState("");
  const [status, setStatus] = useState(true);
  const [logoPreview, setLogoPreview] = useState("");
  const [logoUrl, setLogoUrl] = useState("");

  const [updateBrand] = useUpdateBrandMutation();

  // Brand loaded হলে ফর্ম ভরে দাও
  useEffect(() => {
    if (brand) {
      setName(brand.name || "");
      setStatus(brand.status === "active");
      setLogoPreview(brand.logo || "");
    }
  }, [brand]);

  // Handle logo file change
  const handleImageChange = async (e) => {
    const file = e.target.files[0];
    if (file) {
      try {
        const uploadedUrl = await uploadToCloudinary(file);
        if (uploadedUrl) {
          setLogoUrl(uploadedUrl);
          setLogoPreview(URL.createObjectURL(file));
        }
      } catch (err) {
        toast.error("Image upload failed");
      }
    }
  };

  // Save update
  const handleSubmit = async (e) => {
    e.preventDefault();
    const updatedData = {
      name,
      status: status ? "active" : "inactive",
      logo: logoUrl,
    };

    try {
      await updateBrand({
        id: brand._id,
        data: updatedData,
      }).unwrap();
    } catch (error) {
      toast.error("Failed to update brand");
    }
  };

  return (
    <div>
      {/* Edit Brand Modal */}
      <div className="modal fade" id="edit-brand">
        <div className="modal-dialog modal-dialog-centered custom-modal-two">
          <div className="modal-content">
            <div className="page-wrapper-new p-0">
              <div className="content">
                <div className="modal-header border-0 custom-modal-header">
                  <div className="page-title">
                    <h4>Edit Brand</h4>
                  </div>
                  <button
                    type="button"
                    className="close"
                    data-bs-dismiss="modal"
                  >
                    <span aria-hidden="true">×</span>
                  </button>
                </div>

                <div className="modal-body custom-modal-body new-employee-field">
                  <form onSubmit={handleSubmit}>
                    {/* Name */}
                    <div className="mb-3">
                      <label className="form-label">Brand</label>
                      <input
                        type="text"
                        className="form-control"
                        value={name}
                        onChange={(e) => setName(e.target.value)}
                      />
                    </div>

                    {/* Logo */}
                    <label className="form-label">Logo</label>
                    <div className="profile-pic-upload mb-3">
                      {logoPreview && (
                        <div className="profile-pic brand-pic">
                          <span>
                            <ImageWithBasePath
                              height={50}
                              width={50}
                              src={logoPreview}
                              isBase={true}
                              alt="Brand logo"
                            />
                          </span>
                          <Link
                            to="#"
                            className="remove-photo"
                            onClick={() => {
                              setLogoPreview("");
                            }}
                          >
                            <X className="x-square-add" />
                          </Link>
                        </div>
                      )}
                      <div className="image-upload mb-0">
                        <input type="file" onChange={handleImageChange} />
                        <div className="image-uploads">
                          <h4>Change Image</h4>
                        </div>
                      </div>
                    </div>

                    {/* Status */}
                    <div className="mb-0">
                      <div className="status-toggle modal-status d-flex justify-content-between align-items-center">
                        <span className="status-label">Status</span>
                        <input
                          type="checkbox"
                          id="editStatus"
                          className="check"
                          checked={status}
                          onChange={() => setStatus(!status)}
                        />
                        <label htmlFor="editStatus" className="checktoggle" />
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
    </div>
  );
};

export default EditBrand;
