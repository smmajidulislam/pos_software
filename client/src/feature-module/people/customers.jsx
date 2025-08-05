import React, { useState } from "react";
import Breadcrumbs from "../../core/breadcrumbs";
import { Link } from "react-router-dom";
import { Filter, Sliders } from "react-feather";
import ImageWithBasePath from "../../core/img/imagewithbasebath";
import Select from "react-select";
import { Edit, Eye, Globe, Trash2, User } from "react-feather";
import { Table } from "antd";
import CustomerModal from "../../core/modals/peoples/customerModal";
import Swal from "sweetalert2";
import withReactContent from "sweetalert2-react-content";
import { useGetUsersQuery } from "../../core/redux/api/userApi/userApi";

const Customers = () => {
  const [isFilterVisible, setIsFilterVisible] = useState(false);
  const { data: customerData } = useGetUsersQuery({
    role: "customer",
  });
  const toggleFilterVisibility = () => {
    setIsFilterVisible((prevVisibility) => !prevVisibility);
  };

  const options = [
    { value: "sortByDate", label: "Sort by Date" },
    { value: "140923", label: "14 09 23" },
    { value: "110923", label: "11 09 23" },
  ];
  const optionsTwo = [
    { label: "Choose Customer Name", value: "" },
    { label: "Benjamin", value: "Benjamin" },
    { label: "Ellen", value: "Ellen" },
    { label: "Freda", value: "Freda" },
    { label: "Kaitlin", value: "Kaitlin" },
  ];

  const countries = [
    { label: "Choose Country", value: "" },
    { label: "India", value: "India" },
    { label: "USA", value: "USA" },
  ];

  const columns = [
    {
      title: "Customer Name",
      dataIndex: "name",
      sorter: (a, b) => a.name.localeCompare(b.name),
    },
    {
      title: "Email",
      dataIndex: "email",
      sorter: (a, b) => a.email.localeCompare(b.email),
    },
    {
      title: "Role",
      dataIndex: "role",
      sorter: (a, b) => a.role.localeCompare(b.role),
    },
    {
      title: "Shift",
      dataIndex: "shift",
      sorter: (a, b) => a.shift.localeCompare(b.shift),
    },
    {
      title: "Status",
      dataIndex: "status",
      sorter: (a, b) => a.status.localeCompare(b.status),
    },
    {
      title: "Action",
      dataIndex: "action",
      render: () => (
        <div className="action-table-data flex gap-2">
          <Link className="p-1" to="#">
            <Eye size={16} className="text-gray-600" />
          </Link>

          <Link
            className="p-1"
            to="#"
            data-bs-toggle="modal"
            data-bs-target="#edit-units"
          >
            <Edit size={16} className="text-blue-600" />
          </Link>

          <Link className="p-1" to="#" onClick={showConfirmationAlert}>
            <Trash2 size={16} className="text-red-600" />
          </Link>
        </div>
      ),
    },
  ];

  const MySwal = withReactContent(Swal);

  const showConfirmationAlert = () => {
    MySwal.fire({
      title: "Are you sure?",
      text: "You won't be able to revert this!",
      showCancelButton: true,
      confirmButtonColor: "#00ff00",
      confirmButtonText: "Yes, delete it!",
      cancelButtonColor: "#ff0000",
      cancelButtonText: "Cancel",
    }).then((result) => {
      if (result.isConfirmed) {
        MySwal.fire({
          title: "Deleted!",
          text: "Your file has been deleted.",
          className: "btn btn-success",
          confirmButtonText: "OK",
          customClass: {
            confirmButton: "btn btn-success",
          },
        });
      } else {
        MySwal.close();
      }
    });
  };
  return (
    <div className="page-wrapper">
      <div className="content">
        <Breadcrumbs
          maintitle="Customer List"
          subtitle="Manage Your Expense Category"
          addButton="Add New Customer"
        />

        {/* /product list */}
        <div className="card table-list-card">
          <div className="card-body">
            <div className="table-top">
              <div className="search-set">
                <div className="search-input">
                  <input
                    type="text"
                    placeholder="Search"
                    className="form-control form-control-sm formsearch"
                  />
                  <Link to className="btn btn-searchset">
                    <i data-feather="search" className="feather-search" />
                  </Link>
                </div>
              </div>
              <div className="search-path">
                <Link
                  className={`btn btn-filter ${
                    isFilterVisible ? "setclose" : ""
                  }`}
                  id="filter_search"
                >
                  <Filter
                    className="filter-icon"
                    onClick={toggleFilterVisibility}
                  />
                  <span onClick={toggleFilterVisibility}>
                    <ImageWithBasePath
                      src="assets/img/icons/closes.svg"
                      alt="img"
                    />
                  </span>
                </Link>
              </div>
              <div className="form-sort stylewidth">
                <Sliders className="info-img" />

                <Select
                  className="select "
                  options={options}
                  placeholder="Sort by Date"
                />
              </div>
            </div>
            {/* /Filter */}
            <div
              className={`card${isFilterVisible ? " visible" : ""}`}
              id="filter_inputs"
              style={{ display: isFilterVisible ? "block" : "none" }}
            >
              <div className="card-body pb-0">
                <div className="row">
                  <div className="col-lg-3 col-sm-6 col-12">
                    <div className="input-blocks">
                      <User className="info-img" />
                      <Select
                        options={optionsTwo}
                        placeholder="Choose Customer Name"
                      />
                    </div>
                  </div>
                  <div className="col-lg-3 col-sm-6 col-12">
                    <div className="input-blocks">
                      <Globe className="info-img" />
                      <Select
                        options={countries}
                        placeholder="Choose Country"
                      />
                    </div>
                  </div>
                  <div className="col-lg-3 col-sm-6 col-12 ms-auto">
                    <div className="input-blocks">
                      <a className="btn btn-filters ms-auto">
                        {" "}
                        <i
                          data-feather="search"
                          className="feather-search"
                        />{" "}
                        Search{" "}
                      </a>
                    </div>
                  </div>
                </div>
              </div>
            </div>
            {/* /Filter */}
            <div className="table-responsive">
              <Table
                className="table datanew"
                columns={columns}
                dataSource={customerData || []}
                rowKey={(record) => record._id}
              />
            </div>
          </div>
        </div>
        {/* /product list */}
      </div>
      <CustomerModal />
    </div>
  );
};

export default Customers;
