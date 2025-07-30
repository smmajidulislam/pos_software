import React, { useState } from "react";
import { Filter, Sliders } from "react-feather";
import { Link } from "react-router-dom";
import ImageWithBasePath from "../../core/img/imagewithbasebath";
import Select from "react-select";
import { StopCircle, User } from "react-feather";
import Breadcrumbs from "../../core/breadcrumbs";
import { useGetCustomerReportQuery } from "../../core/redux/api/sellsInvoice/sellInvoice";

const CustomerReport = () => {
  const [isFilterVisible, setIsFilterVisible] = useState(false);
  const toggleFilterVisibility = () => {
    setIsFilterVisible((prevVisibility) => !prevVisibility);
  };
  const { data: customerData, isLoading: isCustomerLoading } =
    useGetCustomerReportQuery();
  const options = [
    { value: "sortByDate", label: "Sort by Date" },
    { value: "140923", label: "14 09 23" },
    { value: "110923", label: "11 09 23" },
  ];

  const optionsName = [
    { value: "Rose", label: "Rose" },
    { value: "Kaitlin", label: "Kaitlin" },
  ];

  const optionsID = [
    { value: "CT_0003", label: "CT_0003" },
    { value: "CT_0004", label: "CT_0004" },
    { value: "CT_0005", label: "CT_0005" },
  ];

  const optionsStatus = [
    { value: "Completed", label: "Completed" },
    { value: "Incompleted", label: "Incompleted" },
  ];

  const optionsPaymentStatus = [
    { value: "Paid", label: "Paid" },
    { value: "Unpaid", label: "Unpaid" },
    { value: "Overdue", label: "Overdue" },
  ];
  return (
    <div className="page-wrapper">
      <div className="content">
        <Breadcrumbs
          maintitle="Customer Report"
          subtitle="Manage Your Customer Report"
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
                  <div className="col-lg-2 col-sm-6 col-12">
                    <div className="input-blocks">
                      <User className="info-img" />
                      <Select
                        className="select"
                        options={optionsName}
                        placeholder="Choose Name"
                      />
                    </div>
                  </div>
                  <div className="col-lg-2 col-sm-6 col-12">
                    <div className="input-blocks">
                      <User className="info-img" />
                      <Select
                        className="select"
                        options={optionsID}
                        placeholder="Choose ID"
                      />
                    </div>
                  </div>
                  <div className="col-lg-2 col-sm-6 col-12">
                    <div className="input-blocks">
                      <StopCircle className="info-img" />
                      <Select
                        className="select"
                        options={optionsStatus}
                        placeholder="Choose Status"
                      />
                    </div>
                  </div>
                  <div className="col-lg-3 col-sm-6 col-12">
                    <div className="input-blocks">
                      <ImageWithBasePath
                        src="assets/img/icons/payment-status.svg"
                        className="info-img status-icon"
                        alt="Icon"
                      />
                      <Select
                        className="select"
                        options={optionsPaymentStatus}
                        placeholder="Choose Payment Status"
                      />
                    </div>
                  </div>
                  <div className="col-lg-3 col-sm-6 col-12">
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
              <table className="table datanew">
                <thead>
                  <tr>
                    <th>Customer ID</th>
                    <th>Customer Name</th>
                    <th>Amount</th>
                    <th>Paid</th>
                    <th>Due Amount</th>
                    <th>Status</th>
                    <th>Payment Status</th>
                  </tr>
                </thead>
                <tbody>
                  {!isCustomerLoading &&
                    customerData?.map((item, index) => (
                      <tr key={index}>
                        <td>{item?.customerId}</td>
                        <td>{item?.customerName}</td>
                        <td>{item?.amount}</td>
                        <td>{item?.paid}</td>
                        <td>{item?.dueAmount}</td>
                        <td>
                          <span className="badges status-badge">
                            {item?.status}
                          </span>
                        </td>
                        <td>
                          <span className="badge-linesuccess">
                            {item?.paymentStatus}
                          </span>
                        </td>
                      </tr>
                    ))}
                </tbody>
              </table>
            </div>
          </div>
        </div>
        {/* /product list */}
      </div>
    </div>
  );
};

export default CustomerReport;
