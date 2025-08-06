import {
  ChevronUp,
  PlusCircle,
  RotateCcw,
  User,
} from "feather-icons-react/build/IconComponents";
import React from "react";
import { OverlayTrigger, Tooltip } from "react-bootstrap";
import { useDispatch, useSelector } from "react-redux";
import { Link } from "react-router-dom";
import { useForm } from "react-hook-form";
import Sawal from "sweetalert2";
import { setToogleHeader } from "../../../core/redux/action";
import { uploadToCloudinary } from "../../../utils/cloudnary";
import { useCreateUserMutation } from "../../../core/redux/api/userApi/userApi";
import { usePos } from "../../../hooks/PosProvider";

const GeneralSettings = () => {
  const dispatch = useDispatch();
  const toggleHeader = useSelector((state) => state.toggle_header);
  const [createUser] = useCreateUserMutation();
  const { pos } = usePos();

  const {
    register,
    handleSubmit,
    setValue,
    watch,
    reset,
    formState: { isSubmitting },
  } = useForm({
    defaultValues: {
      profileImage: "",
      firstName: "",
      lastName: "",
      username: "",
      email: "",
      phone: "",
      address: "",
      country: "",
      state: "",
      city: "",
      postalCode: "",
      password: "",
    },
  });

  const watchFields = watch();

  const handleImageUpload = async (e) => {
    const file = e.target.files[0];
    if (!file) return;
    const imageUrl = await uploadToCloudinary(file);
    setValue("profileImage", imageUrl);
  };

  const onSubmit = async (data) => {
    const payload = {
      name: `${data.firstName} ${data.lastName}`,
      username: data.username,
      email: data.email,
      phone: data.phone,
      address: data.address,
      password: data.password,
      image: data.profileImage,
      role: "salesman",
      posId: pos?._id,
    };

    try {
      const res = await createUser(payload).unwrap();
      if (res) {
        Sawal.fire({
          icon: "success",
          title: "User created successfully",
          showConfirmButton: false,
          timer: 1500,
        });
      }
      reset();
    } catch (err) {
      Sawal.fire({
        icon: "error",
        title: "User not created",
        showConfirmButton: false,
        timer: 1500,
      });
    }
  };

  const renderRefreshTooltip = (props) => (
    <Tooltip id="refresh-tooltip" {...props}>
      Refresh
    </Tooltip>
  );
  const renderCollapseTooltip = (props) => (
    <Tooltip id="collapse-tooltip" {...props}>
      Collapse
    </Tooltip>
  );

  return (
    <div className="page-wrapper">
      <div className="content settings-content">
        <div className="page-header settings-pg-header">
          <div className="add-item d-flex">
            <div className="page-title">
              <h4>Settings</h4>
              <h6>Manage your settings on portal</h6>
            </div>
          </div>
          <ul className="table-top-head">
            <li>
              <OverlayTrigger placement="top" overlay={renderRefreshTooltip}>
                <Link data-bs-toggle="tooltip">
                  <RotateCcw />
                </Link>
              </OverlayTrigger>
            </li>
            <li>
              <OverlayTrigger placement="top" overlay={renderCollapseTooltip}>
                <Link
                  id="collapse-header"
                  className={toggleHeader ? "active" : ""}
                  onClick={() => dispatch(setToogleHeader(!toggleHeader))}
                >
                  <ChevronUp />
                </Link>
              </OverlayTrigger>
            </li>
          </ul>
        </div>

        <div className="row">
          <div className="col-xl-12">
            <div className="settings-wrapper d-flex">
              <div className="settings-page-wrap">
                <form onSubmit={handleSubmit(onSubmit)}>
                  <div className="setting-title">
                    <h4>Profile Settings</h4>
                  </div>

                  <div className="card-title-head">
                    <h6>
                      <span>
                        <User className="feather-chevron-up" />
                      </span>
                      Employee Information
                    </h6>
                  </div>

                  <div className="profile-pic-upload">
                    <div className="profile-pic">
                      <span>
                        <PlusCircle className="plus-down-add" />
                        Profile Photo
                      </span>
                    </div>
                    <div className="new-employee-field">
                      <div className="image-upload mb-2">
                        <input
                          type="file"
                          onChange={handleImageUpload}
                          accept="image/*"
                        />
                        <div className="image-uploads">
                          <h4>Change Image</h4>
                        </div>
                      </div>
                      <span>
                        For better preview recommended size is 450px x 450px.
                        Max size 5MB.
                      </span>
                    </div>
                  </div>

                  {watchFields.profileImage && (
                    <div className="mb-3">
                      <img
                        src={watchFields.profileImage}
                        alt="Preview"
                        style={{
                          width: "150px",
                          height: "150px",
                          objectFit: "cover",
                          borderRadius: "5px",
                        }}
                      />
                    </div>
                  )}

                  <div className="row">
                    <div className="col-md-4 mb-3">
                      <label className="form-label">First Name</label>
                      <input
                        className="form-control"
                        {...register("firstName", { required: true })}
                      />
                    </div>
                    <div className="col-md-4 mb-3">
                      <label className="form-label">Last Name</label>
                      <input
                        className="form-control"
                        {...register("lastName", { required: true })}
                      />
                    </div>
                    <div className="col-md-4 mb-3">
                      <label className="form-label">User Name</label>
                      <input
                        className="form-control"
                        {...register("username", { required: true })}
                      />
                    </div>
                    <div className="col-md-4 mb-3">
                      <label className="form-label">Phone Number</label>
                      <input className="form-control" {...register("phone")} />
                    </div>
                    <div className="col-md-4 mb-3">
                      <label className="form-label">Email</label>
                      <input
                        className="form-control"
                        type="email"
                        {...register("email", { required: true })}
                      />
                    </div>
                    <div className="col-md-4 mb-3">
                      <label className="form-label">Password</label>
                      <input
                        className="form-control"
                        type="password"
                        {...register("password", { required: true })}
                      />
                    </div>
                  </div>

                  <div className="card-title-head">
                    <h6>
                      <span>
                        <i className="feather-chevron-up" />
                      </span>
                      Our Address
                    </h6>
                  </div>
                  <div className="row">
                    <div className="col-md-12 mb-3">
                      <label className="form-label">Address</label>
                      <input
                        className="form-control"
                        {...register("address")}
                      />
                    </div>
                    <div className="col-md-3 mb-3">
                      <label className="form-label">Country</label>
                      <input
                        className="form-control"
                        {...register("country")}
                      />
                    </div>
                    <div className="col-md-3 mb-3">
                      <label className="form-label">State / Province</label>
                      <input className="form-control" {...register("state")} />
                    </div>
                    <div className="col-md-3 mb-3">
                      <label className="form-label">City</label>
                      <input className="form-control" {...register("city")} />
                    </div>
                    <div className="col-md-3 mb-3">
                      <label className="form-label">Postal Code</label>
                      <input
                        className="form-control"
                        {...register("postalCode")}
                      />
                    </div>
                  </div>

                  <div className="text-end settings-bottom-btn">
                    <button type="button" className="btn btn-cancel me-2">
                      Cancel
                    </button>
                    <button
                      type="submit"
                      className="btn btn-submit"
                      disabled={isSubmitting}
                    >
                      {isSubmitting ? "Saving..." : "Save Changes"}
                    </button>
                  </div>
                </form>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default GeneralSettings;
