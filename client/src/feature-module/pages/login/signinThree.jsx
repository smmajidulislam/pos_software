import React, { useState } from "react";
import ImageWithBasePath from "../../../core/img/imagewithbasebath";
import { Link } from "react-router-dom";
import { all_routes } from "../../../Router/all_routes";
import { useAuth } from "../../../hooks/AuthProvider";
import { useNavigate } from "react-router-dom";
import { useLoginMutation } from "../../../core/redux/api/authapi/authApi";
import { toast } from "react-toastify";

const SigninThree = () => {
  const [formData, setFormData] = useState({
    email: "",
    password: "",
    remember: false,
  });
  const [loginUser] = useLoginMutation();
  const navigate = useNavigate();
  const { login } = useAuth();
  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;

    setFormData((prev) => ({
      ...prev,
      [name]: type === "checkbox" ? checked : value,
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const res = await loginUser(formData).unwrap();

      if (res.message) {
        toast.success(res.message);

        if (formData.remember) {
          login(res.token, formData.remember);
        } else {
          login(res.token);
        }

        setFormData({
          email: "",
          password: "",
          remember: false,
        });

        // Redirect to home or dashboard
        navigate("/");
      }
    } catch (error) {
      toast.error(error?.data?.message || "Login failed");
    }
  };

  const route = all_routes;
  return (
    <div className="main-wrapper">
      <div className="account-content">
        <div className="login-wrapper login-new">
          <div className="container">
            <div className="login-content user-login">
              <div className="login-logo">
                <ImageWithBasePath src="assets/img/logo.png" alt="img" />
                <Link to={route.dashboard} className="login-logo logo-white">
                  <ImageWithBasePath
                    src="assets/img/logo-white.png"
                    alt="img"
                  />
                </Link>
              </div>
              <form onSubmit={handleSubmit}>
                <div className="login-userset">
                  <div className="login-userheading">
                    <h3>Sign In</h3>
                    <h4>
                      Access the Dreamspos panel using your email and passcode.
                    </h4>
                  </div>
                  <div className="form-login">
                    <label className="form-label">Email Address</label>
                    <div className="form-addons">
                      <input
                        type="text"
                        name="email"
                        className="form-control"
                        value={formData.email}
                        onChange={handleChange}
                        required
                      />
                      <ImageWithBasePath
                        src="assets/img/icons/mail.svg"
                        alt="img"
                      />
                    </div>
                  </div>
                  <div className="form-login">
                    <label>Password</label>
                    <div className="pass-group">
                      <input
                        type="password"
                        name="password"
                        className="pass-input"
                        value={formData.password}
                        onChange={handleChange}
                        required
                      />
                      <span className="fas toggle-password fa-eye-slash" />
                    </div>
                  </div>
                  <div className="form-login authentication-check">
                    <div className="row">
                      <div className="col-6">
                        <div className="custom-control custom-checkbox">
                          <label className="checkboxs ps-4 mb-0 pb-0 line-height-1">
                            <input
                              type="checkbox"
                              name="remember"
                              checked={formData.remember}
                              onChange={handleChange}
                            />
                            <span className="checkmarks" />
                            Remember me
                          </label>
                        </div>
                      </div>
                      <div className="col-6 text-end">
                        <Link
                          className="forgot-link"
                          to={route.forgotPasswordThree}
                        >
                          Forgot Password?
                        </Link>
                      </div>
                    </div>
                  </div>
                  <div className="form-login">
                    <button type="submit" className="btn btn-login">
                      Sign In
                    </button>
                  </div>
                  <div className="signinform">
                    <h4>
                      New on our platform?
                      <Link to={route.registerThree} className="hover-a">
                        {" "}
                        Create an account
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
              <p>Copyright © 2023 DreamsPOS. All rights reserved</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default SigninThree;
