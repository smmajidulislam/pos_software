import React, { useEffect, useState } from "react";
import ImageWithBasePath from "../../core/img/imagewithbasebath";
import { Link } from "react-router-dom";
import Sawal from "sweetalert2";
import { uploadToCloudinary } from "../../utils/cloudnary";
import { useUpsertUserProfileMutation } from "../../core/redux/api/adminProfile/adminProfile";

const Profile = () => {
  const [formData, setFormData] = useState({
    profileImage: "assets/img/customer/customer5.jpg",
    firstName: "",
    lastName: "",
    email: "",
    phone: "",
    username: "",
    password: "",
  });
  const [upsertUserProfile] = useUpsertUserProfileMutation();

  useEffect(() => {
    const fetchUserData = async () => {
      const dataFromApi = {
        profileImage: "assets/img/customer/customer5.jpg",
        firstName: "",
        lastName: "",
        email: "",
        phone: "",
        username: "",
        password: "",
      };
      setFormData(dataFromApi);
    };

    fetchUserData();
  }, []);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleImageChange = async (e) => {
    const file = e.target.files[0];
    if (file) {
      const localUrl = URL.createObjectURL(file);
      setFormData((prev) => ({ ...prev, profileImage: localUrl }));

      const uploadedUrl = await uploadToCloudinary(file);
      setFormData((prev) => ({ ...prev, profileImage: uploadedUrl }));
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const res = await upsertUserProfile(formData).unwrap();
    if (res?.message === "Profile created") {
      Sawal.fire({
        icon: "success",
        title: "Profile created",
        showConfirmButton: false,
        timer: 1500,
      });
      setFormData({
        profileImage: "assets/img/customer/customer5.jpg",
        firstName: "",
        lastName: "",
        email: "",
        phone: "",
        username: "",
        password: "",
      });
    } else {
      Sawal.fire({
        icon: "error",
        title: "Profile not created",
        showConfirmButton: false,
        timer: 1500,
      });
    }
  };

  return (
    <div className="page-wrapper">
      <div className="content">
        <div className="page-header">
          <div className="page-title">
            <h4>Profile</h4>
            <h6>User Profile</h6>
          </div>
        </div>

        <div className="card">
          <div className="card-body">
            <form onSubmit={handleSubmit}>
              <div className="profile-set">
                <div className="profile-head"></div>
                <div className="profile-top">
                  <div className="profile-content">
                    <div className="profile-contentimg">
                      <img src={formData.profileImage} alt="img" id="blah" />
                      <div className="profileupload">
                        <input
                          type="file"
                          id="imgInp"
                          accept="image/*"
                          onChange={handleImageChange}
                        />
                        <Link to="#">
                          <ImageWithBasePath
                            src="assets/img/icons/edit-set.svg"
                            alt="img"
                          />
                        </Link>
                      </div>
                    </div>
                    <div className="profile-contentname">
                      <h2>
                        {formData.firstName} {formData.lastName}
                      </h2>
                      <h4>Updates Your Photo and Personal Details.</h4>
                    </div>
                  </div>
                </div>
              </div>

              <div className="row">
                <div className="col-lg-6 col-sm-12">
                  <div className="input-blocks">
                    <label className="form-label">First Name</label>
                    <input
                      type="text"
                      name="firstName"
                      className="form-control"
                      value={formData.firstName}
                      onChange={handleChange}
                    />
                  </div>
                </div>

                <div className="col-lg-6 col-sm-12">
                  <div className="input-blocks">
                    <label className="form-label">Last Name</label>
                    <input
                      type="text"
                      name="lastName"
                      className="form-control"
                      value={formData.lastName}
                      onChange={handleChange}
                    />
                  </div>
                </div>

                <div className="col-lg-6 col-sm-12">
                  <div className="input-blocks">
                    <label>Email</label>
                    <input
                      type="email"
                      name="email"
                      className="form-control"
                      value={formData.email}
                      onChange={handleChange}
                    />
                  </div>
                </div>

                <div className="col-lg-6 col-sm-12">
                  <div className="input-blocks">
                    <label className="form-label">Phone</label>
                    <input
                      type="text"
                      name="phone"
                      className="form-control"
                      value={formData.phone}
                      onChange={handleChange}
                    />
                  </div>
                </div>

                <div className="col-lg-6 col-sm-12">
                  <div className="input-blocks">
                    <label className="form-label">User Name</label>
                    <input
                      type="text"
                      name="username"
                      className="form-control"
                      value={formData.username}
                      onChange={handleChange}
                    />
                  </div>
                </div>

                <div className="col-lg-6 col-sm-12">
                  <div className="input-blocks">
                    <label className="form-label">Password</label>
                    <div className="pass-group">
                      <input
                        type="password"
                        name="password"
                        className="pass-input form-control"
                        value={formData.password}
                        onChange={handleChange}
                      />
                      <span className="fas toggle-password fa-eye-slash" />
                    </div>
                  </div>
                </div>

                <div className="col-12">
                  <button type="submit" className="btn btn-submit me-2">
                    Submit
                  </button>
                  <Link to="#" className="btn btn-cancel">
                    Cancel
                  </Link>
                </div>
              </div>
            </form>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Profile;
