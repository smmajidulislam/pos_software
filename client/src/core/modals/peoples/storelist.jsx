import React, { useState } from "react";
import { Link } from "react-router-dom";
import { Filter, Sliders } from "react-feather";
import Select from "react-select";
import { Edit, Eye, Globe, Trash2, User } from "react-feather";
import { Table } from "antd";
import Swal from "sweetalert2";
import withReactContent from "sweetalert2-react-content";
import ImageWithBasePath from "../../img/imagewithbasebath";
import Breadcrumbs from "../../breadcrumbs";
import CustomerModal from "./customerModal";
import { useGetAllPosQuery } from "../../redux/api/posApi/posApi";

const StoreList = () => {
  const { data: posdata } = useGetAllPosQuery();

  const [isFilterVisible, setIsFilterVisible] = useState(false);
  const toggleFilterVisibility = () => {
    setIsFilterVisible((prevVisibility) => !prevVisibility);
  };

  const options = [
    { value: "sortByDate", label: "Sort by Date" },
    { value: "140923", label: "14 09 23" },
    { value: "110923", label: "11 09 23" },
  ];
  const optionsTwo = [
    { label: "Choose Store Name", value: "" },
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
      title: "Store Name",
      dataIndex: "label",
      sorter: (a, b) => a.label.localeCompare(b.label),
      align: "center",
    },
    {
      title: "Code",
      dataIndex: "value",
      sorter: (a, b) => a.value.localeCompare(b.value),
      align: "center",
    },
    {
      title: "Admin Name",
      dataIndex: "admin",
      render: (admin) => admin?.name,
      sorter: (a, b) => a.admin?.name.localeCompare(b.admin?.name),
      align: "center",
    },
    {
      title: "Created At",
      dataIndex: "createdAt",
      render: (text) => new Date(text).toLocaleDateString("en-GB"),
      sorter: (a, b) => new Date(a.createdAt) - new Date(b.createdAt),
      align: "center",
    },
    {
      title: "Action",
      dataIndex: "action",
      render: (_, record) => (
        <div className="action-table-data">
          <div className="edit-delete-action">
            <Link className="me-2 p-2" to="#">
              <Eye size={16} className="feather-view" />
            </Link>
            <Link
              className="me-2 p-2"
              to="#"
              data-bs-toggle="modal"
              data-bs-target="#edit-units"
            >
              <Edit size={16} className="feather-edit" />
            </Link>
            <Link
              className="confirm-text p-2"
              to="#"
              onClick={() => showConfirmationAlert(record._id)}
            >
              <Trash2 size={16} className="feather-trash-2" />
            </Link>
          </div>
        </div>
      ),
      align: "center",
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
          maintitle="Store List"
          subtitle="Manage Your Store"
          addButton="Add Store"
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
                        placeholder="Choose Store Name"
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
                dataSource={posdata}
                rowKey={(record) => record?._id}
                // pagination={true}
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

export default StoreList;
