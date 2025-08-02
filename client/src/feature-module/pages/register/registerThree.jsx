import React, { useState } from "react";
import ImageWithBasePath from "../../../core/img/imagewithbasebath";
import { Link, useNavigate } from "react-router-dom";
import { all_routes } from "../../../Router/all_routes";
import { useSignUpMutation } from "../../../core/redux/api/authapi/authApi";
import { toast } from "react-toastify";

const RegisterThree = () => {
  const route = all_routes;
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    password: "",
    retype: "",
    isDisabled: false,
  });
  const [showPassword, setShowPassword] = useState(false);
  const [showRetypePassword, setShowRetypePassword] = useState(false);

  const [newUser, { isLoading }] = useSignUpMutation();
  const navigate = useNavigate();

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: type === "checkbox" ? checked : value,
    }));
  };

  const togglePasswordVisibility = () => {
    setShowPassword((prev) => !prev);
  };

  const toggleRetypePasswordVisibility = () => {
    setShowRetypePassword((prev) => !prev);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (formData.password !== formData.retype) {
      toast.error("Passwords do not match!");
      return;
    }

    try {
      const res = await newUser(formData).unwrap();
      toast.success(res.message);
      setFormData({
        name: "",
        email: "",
        password: "",
        retype: "",
        isDisabled: false,
      });
      navigate("/signin-3");
    } catch (error) {
      if (error?.data?.message) {
        toast.error(error.data.message);
      } else {
        toast.error("Something went wrong! Please try again.");
      }
    }
  };

  return (
    <div className="main-wrapper">
      <div className="account-content">
        <div className="login-wrapper login-new">
          <div className="login-content user-login">
            <div className="login-logo">
              <ImageWithBasePath src="assets/img/logo.png" alt="img" />
              <Link to={route.dashboard} className="login-logo logo-white">
                <ImageWithBasePath src="assets/img/logo-white.png" alt="" />
              </Link>
            </div>

            <form action="signin-3" onSubmit={handleSubmit}>
              <div className="login-userset">
                <div className="login-userheading">
                  <h3>Register</h3>
                  <h4>Create New Selo Pos Account</h4>
                </div>

                <div className="form-login">
                  <label>Name</label>
                  <div className="form-addons">
                    <input
                      type="text"
                      className="form-control"
                      name="name"
                      value={formData.name}
                      onChange={handleChange}
                    />
                    <ImageWithBasePath
                      src="assets/img/icons/user-icon.svg"
                      alt="img"
                    />
                  </div>
                </div>

                <div className="form-login">
                  <label>Email Address</label>
                  <div className="form-addons">
                    <input
                      type="text"
                      className="form-control"
                      name="email"
                      value={formData.email}
                      onChange={handleChange}
                    />
                    <ImageWithBasePath
                      src="assets/img/icons/mail.svg"
                      alt="img"
                    />
                  </div>
                </div>

                <div className="form-login">
                  <label>Password</label>
                  <div className="pass-group" style={{ position: "relative" }}>
                    <input
                      type={showPassword ? "text" : "password"}
                      className="pass-input"
                      name="password"
                      value={formData.password}
                      onChange={handleChange}
                      autoComplete="new-password"
                    />
                    <span
                      onClick={togglePasswordVisibility}
                      style={{
                        position: "absolute",
                        right: "15px",
                        top: "50%",
                        transform: "translateY(-50%)",
                        cursor: "pointer",
                        color: "#666",
                        userSelect: "none",
                      }}
                      className={`fas ${
                        showPassword ? "fa-eye" : "fa-eye-slash"
                      }`}
                      aria-label={
                        showPassword ? "Hide password" : "Show password"
                      }
                    />
                  </div>
                </div>

                <div className="form-login">
                  <label>Confirm Password</label>
                  <div className="pass-group" style={{ position: "relative" }}>
                    <input
                      type={showRetypePassword ? "text" : "password"}
                      className="pass-inputs"
                      name="retype"
                      value={formData.retype}
                      onChange={handleChange}
                      autoComplete="new-password"
                    />
                    <span
                      onClick={toggleRetypePasswordVisibility}
                      style={{
                        position: "absolute",
                        right: "15px",
                        top: "50%",
                        transform: "translateY(-50%)",
                        cursor: "pointer",
                        color: "#666",
                        userSelect: "none",
                      }}
                      className={`fas ${
                        showRetypePassword ? "fa-eye" : "fa-eye-slash"
                      }`}
                      aria-label={
                        showRetypePassword
                          ? "Hide confirm password"
                          : "Show confirm password"
                      }
                    />
                  </div>
                </div>

                <div className="form-login authentication-check">
                  <div className="row">
                    <div className="col-sm-8">
                      <div className="custom-control custom-checkbox justify-content-start">
                        <div className="custom-control custom-checkbox">
                          <label className="checkboxs ps-4 mb-0 pb-0 line-height-1">
                            <input
                              type="checkbox"
                              name="isDisabled"
                              checked={formData.isDisabled}
                              onChange={handleChange}
                            />
                            <span className="checkmarks" />I agree to the{" "}
                            <Link to="#" className="hover-a">
                              Terms &amp; Privacy
                            </Link>
                          </label>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>

                <div className="form-login">
                  <button
                    type="submit"
                    disabled={!formData.isDisabled || isLoading}
                    className="btn btn-login"
                  >
                    {isLoading ? "Signing Up..." : "Sign Up"}
                  </button>
                </div>

                <div className="signinform">
                  <h4>
                    Already have an account ?{" "}
                    <Link to={route.signinthree} className="hover-a">
                      Sign In Instead
                    </Link>
                  </h4>
                </div>

                <div className="form-setlogin or-text">
                  <h4>OR</h4>
                </div>

                <div className="form-sociallink">
                  <ul className="d-flex">
                    <li>
                      <Link to="#" className="facebook-logo">
                        <ImageWithBasePath
                          src="assets/img/icons/facebook-logo.svg"
                          alt="Facebook"
                        />
                      </Link>
                    </li>
                    <li>
                      <Link to="#">
                        <ImageWithBasePath
                          src="assets/img/icons/google.png"
                          alt="Google"
                        />
                      </Link>
                    </li>
                    <li>
                      <Link to="#" className="apple-logo">
                        <ImageWithBasePath
                          src="assets/img/icons/apple-logo.svg"
                          alt="Apple"
                        />
                      </Link>
                    </li>
                  </ul>
                </div>
              </div>
            </form>
          </div>

          <div className="my-4 d-flex justify-content-center align-items-center copyright-text">
            <p>Copyright © 2023 Selo Pos. All rights reserved.</p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default RegisterThree;
