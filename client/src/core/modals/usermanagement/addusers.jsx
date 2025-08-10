import { PlusCircle } from "feather-icons-react/build/IconComponents";
import React, { useState } from "react";
import Select from "react-select";
import { uploadToCloudinary } from "../../../utils/cloudnary";
import { useCreateUserMutation } from "../../redux/api/userApi/userApi";

const AddUsers = () => {
  const statusOptions = [
    { value: "customer", label: "Customer" },
    { value: "salesman", label: "Salesman" },
    { value: "supplier", label: "Supplier" },
    { value: "manager", label: "Manager" },
    { value: "admin", label: "Admin" },
  ];

  const [formData, setFormData] = useState({
    name: "", // model অনুযায়ী username → name
    phone: "",
    email: "",
    role: "",
    password: "",
    confirmPassword: "",
    description: "",
    image: null, // url
    avatarPreview: null, // preview
  });

  const [createUser] = useCreateUserMutation();
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setConfirmPassword] = useState(false);

  // Input change handler
  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  // Role change handler
  const handleRoleChange = (selected) => {
    setFormData((prev) => ({ ...prev, role: selected?.value || "" }));
  };

  // Avatar change handler
  const handleAvatarChange = async (e) => {
    const file = e.target.files[0];
    if (file) {
      const uploadedUrl = await uploadToCloudinary(file);

      setFormData((prev) => ({
        ...prev,
        image: uploadedUrl,
        avatarPreview: URL.createObjectURL(file),
      }));
    }
  };

  // Submit handler
  const handleSubmit = async (e) => {
    e.preventDefault();

    // Confirm password check
    if (
      formData.role !== "customer" &&
      formData.password !== formData.confirmPassword
    ) {
      alert("Passwords do not match!");
      return;
    }

    // Payload prepare
    const payload = {
      name: formData.name,
      phone: formData.phone,
      email: formData.email,
      role: formData.role,
      description: formData.description,
      image: formData.image,
      ...(formData.role !== "customer" ? { password: formData.password } : {}),
    };

    try {
      const res = await createUser(payload).unwrap();
      console.log("User created:", res);
      alert("User created successfully!");
    } catch (error) {
      console.error("Error creating user:", error);
      alert("Failed to create user");
    }
  };

  return (
    <div>
      <div className="modal fade" id="add-units">
        <div className="modal-dialog modal-dialog-centered custom-modal-two">
          <div className="modal-content">
            <div className="page-wrapper-new p-0">
              <div className="content">
                <div className="modal-header border-0 custom-modal-header">
                  <div className="page-title">
                    <h4>Add User</h4>
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
                    <div className="row">
                      {/* Avatar */}
                      <div className="col-lg-12">
                        <div className="new-employee-field">
                          <span>Avatar</span>
                          <div className="profile-pic-upload mb-2">
                            <div className="profile-pic">
                              {formData.avatarPreview ? (
                                <img
                                  src={formData.avatarPreview}
                                  alt="Preview"
                                  style={{
                                    width: "80px",
                                    height: "80px",
                                    borderRadius: "50%",
                                    objectFit: "cover",
                                  }}
                                />
                              ) : (
                                <span>
                                  <PlusCircle className="plus-down-add" />
                                  Profile Photo
                                </span>
                              )}
                            </div>
                            <div className="input-blocks mb-0">
                              <div className="image-upload mb-0">
                                <input
                                  type="file"
                                  onChange={handleAvatarChange}
                                />
                                <div className="image-uploads">
                                  <h4>Change Image</h4>
                                </div>
                              </div>
                            </div>
                          </div>
                        </div>
                      </div>

                      {/* Name */}
                      <div className="col-lg-6">
                        <div className="input-blocks">
                          <label>Full Name</label>
                          <input
                            type="text"
                            name="name"
                            value={formData.name}
                            onChange={handleChange}
                            className="form-control"
                          />
                        </div>
                      </div>

                      {/* Phone */}
                      <div className="col-lg-6">
                        <div className="input-blocks">
                          <label>Phone</label>
                          <input
                            type="text"
                            name="phone"
                            value={formData.phone}
                            onChange={handleChange}
                            className="form-control"
                          />
                        </div>
                      </div>

                      {/* Email */}
                      <div className="col-lg-6">
                        <div className="input-blocks">
                          <label>Email</label>
                          <input
                            type="email"
                            name="email"
                            value={formData.email}
                            onChange={handleChange}
                            className="form-control"
                          />
                        </div>
                      </div>

                      {/* Role */}
                      <div className="col-lg-6">
                        <div className="input-blocks">
                          <label>Role</label>
                          <Select
                            className="select"
                            options={statusOptions}
                            placeholder="Choose Role"
                            onChange={handleRoleChange}
                          />
                        </div>
                      </div>

                      {/* Password */}
                      {formData.role !== "customer" && (
                        <>
                          <div className="col-lg-6">
                            <div className="input-blocks">
                              <label>Password</label>
                              <div className="pass-group">
                                <input
                                  type={showPassword ? "text" : "password"}
                                  name="password"
                                  value={formData.password}
                                  onChange={handleChange}
                                  className="pass-input"
                                  placeholder="Enter your password"
                                />
                                <span
                                  className={`fas toggle-password ${
                                    showPassword ? "fa-eye" : "fa-eye-slash"
                                  }`}
                                  onClick={() =>
                                    setShowPassword((prev) => !prev)
                                  }
                                />
                              </div>
                            </div>
                          </div>

                          <div className="col-lg-6">
                            <div className="input-blocks">
                              <label>Confirm Password</label>
                              <div className="pass-group">
                                <input
                                  type={
                                    showConfirmPassword ? "text" : "password"
                                  }
                                  name="confirmPassword"
                                  value={formData.confirmPassword}
                                  onChange={handleChange}
                                  className="pass-input"
                                  placeholder="Confirm password"
                                />
                                <span
                                  className={`fas toggle-password ${
                                    showConfirmPassword
                                      ? "fa-eye"
                                      : "fa-eye-slash"
                                  }`}
                                  onClick={() =>
                                    setConfirmPassword((prev) => !prev)
                                  }
                                />
                              </div>
                            </div>
                          </div>
                        </>
                      )}

                      {/* Description */}
                      <div className="col-lg-12">
                        <div className="mb-0 input-blocks">
                          <label className="form-label">Descriptions</label>
                          <textarea
                            name="description"
                            value={formData.description}
                            onChange={handleChange}
                            className="form-control mb-1"
                            placeholder="Type Message"
                          />
                          <p>Maximum 600 Characters</p>
                        </div>
                      </div>
                    </div>

                    {/* Footer */}
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
    </div>
  );
};

export default AddUsers;
