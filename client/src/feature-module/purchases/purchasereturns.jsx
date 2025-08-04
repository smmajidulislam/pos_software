import React, { useState } from "react";
import ImageWithBasePath from "../../core/img/imagewithbasebath";
import { Link } from "react-router-dom";
import { OverlayTrigger, Tooltip } from "react-bootstrap";
import { setToogleHeader } from "../../core/redux/action";
import { useDispatch, useSelector } from "react-redux";
import {
  ChevronUp,
  PlusCircle,
  RotateCcw,
  Sliders,
  StopCircle,
} from "feather-icons-react/build/IconComponents";
import { Filter } from "react-feather";
import Select from "react-select";
import { DatePicker } from "antd";
import AddPurchaseReturn from "../../core/modals/purchases/addpurchasereturn";
import EditPurchaseReturns from "../../core/modals/purchases/editpurchasereturns";
import Swal from "sweetalert2";
import withReactContent from "sweetalert2-react-content";
import { useGetAllPurchaseReturnsQuery } from "../../core/redux/api/purchageApi/purchaceApi";

const PurchaseReturns = () => {
  const { data: purchaseReturn } = useGetAllPurchaseReturnsQuery();
  console.log(purchaseReturn);

  const oldandlatestvalue = [
    { value: "date", label: "Sort by Date" },
    { value: "newest", label: "Newest" },
    { value: "oldest", label: "Oldest" },
  ];
  const supplier = [
    { value: "chooseSupplier", label: "Choose Supplier" },
    { value: "apexComputers", label: "Apex Computers" },
    { value: "modernAutomobile", label: "Modern Automobile" },
    { value: "aimInfotech", label: "AIM Infotech" },
  ];

  const [selectedDate, setSelectedDate] = useState(new Date());
  const handleDateChange = (date) => {
    setSelectedDate(date);
  };

  const dispatch = useDispatch();
  const data = useSelector((state) => state.toggle_header);
  const [isFilterVisible, setIsFilterVisible] = useState(false);
  const toggleFilterVisibility = () => {
    setIsFilterVisible((prevVisibility) => !prevVisibility);
  };

  const renderTooltip = (props) => <Tooltip {...props}>Pdf</Tooltip>;
  const renderExcelTooltip = (props) => <Tooltip {...props}>Excel</Tooltip>;
  const renderPrinterTooltip = (props) => <Tooltip {...props}>Printer</Tooltip>;
  const renderRefreshTooltip = (props) => <Tooltip {...props}>Refresh</Tooltip>;
  const renderCollapseTooltip = (props) => (
    <Tooltip {...props}>Collapse</Tooltip>
  );

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
        <div className="page-header">
          <div className="add-item d-flex">
            <div className="page-title">
              <h4>Purchase Return List</h4>
              <h6>Manage your Returns</h6>
            </div>
          </div>
          <ul className="table-top-head">
            <li>
              <OverlayTrigger placement="top" overlay={renderTooltip}>
                <Link>
                  <ImageWithBasePath src="assets/img/icons/pdf.svg" alt="img" />
                </Link>
              </OverlayTrigger>
            </li>
            <li>
              <OverlayTrigger placement="top" overlay={renderExcelTooltip}>
                <Link>
                  <ImageWithBasePath
                    src="assets/img/icons/excel.svg"
                    alt="img"
                  />
                </Link>
              </OverlayTrigger>
            </li>
            <li>
              <OverlayTrigger placement="top" overlay={renderPrinterTooltip}>
                <Link>
                  <i data-feather="printer" className="feather-printer" />
                </Link>
              </OverlayTrigger>
            </li>
            <li>
              <OverlayTrigger placement="top" overlay={renderRefreshTooltip}>
                <Link>
                  <RotateCcw />
                </Link>
              </OverlayTrigger>
            </li>
            <li>
              <OverlayTrigger placement="top" overlay={renderCollapseTooltip}>
                <Link
                  id="collapse-header"
                  className={data ? "active" : ""}
                  onClick={() => dispatch(setToogleHeader(!data))}
                >
                  <ChevronUp />
                </Link>
              </OverlayTrigger>
            </li>
          </ul>
          <div className="page-btn">
            <Link
              to="#"
              className="btn btn-added"
              data-bs-toggle="modal"
              data-bs-target="#add-sales-new"
            >
              <PlusCircle className="me-2" />
              Add Purchase Return
            </Link>
          </div>
        </div>

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
                  <Link className="btn btn-searchset">
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
              <div className="form-sort">
                <Sliders className="info-img" />
                <Select
                  className="select"
                  options={oldandlatestvalue}
                  placeholder="Newest"
                />
              </div>
            </div>

            <div
              className={`card${isFilterVisible ? " visible" : ""}`}
              id="filter_inputs"
              style={{ display: isFilterVisible ? "block" : "none" }}
            >
              <div className="card-body pb-0">
                <div className="row">
                  <div className="col-lg-3 col-sm-6 col-12">
                    <div className="input-blocks">
                      <i data-feather="calendar" className="info-img" />
                      <div className="input-groupicon">
                        <DatePicker
                          selected={selectedDate}
                          onChange={handleDateChange}
                          type="date"
                          className="filterdatepicker"
                          dateFormat="dd-MM-yyyy"
                          placeholder="Choose Date"
                        />
                      </div>
                    </div>
                  </div>
                  <div className="col-lg-3 col-sm-6 col-12">
                    <div className="input-blocks">
                      <StopCircle className="info-img" />
                      <Select
                        options={supplier}
                        className="select"
                        placeholder="Choose Supplier"
                      />
                    </div>
                  </div>
                  <div className="col-lg-3 col-sm-6 col-12">
                    <div className="input-blocks">
                      <i data-feather="stop-circle" className="info-img" />
                      <Select
                        options={supplier}
                        className="select"
                        placeholder="Choose Supplier"
                      />
                    </div>
                  </div>
                  <div className="col-lg-3 col-sm-6 col-12 ms-auto">
                    <div className="input-blocks">
                      <Link className="btn btn-filters ms-auto">
                        <i data-feather="search" className="feather-search" />{" "}
                        Search
                      </Link>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            <div className="table-responsive">
              <table className="table datanew">
                <thead>
                  <tr>
                    <th>Product Name</th>
                    <th>Reference</th>
                    <th>Status</th>
                    <th>Grand Total ($)</th>
                    <th>Paid ($)</th>
                    <th>Due ($)</th>
                    <th>Payment Status</th>
                    <th className="no-sort">Action</th>
                  </tr>
                </thead>
                <tbody>
                  {purchaseReturn?.data?.map((item) => {
                    const productName = item?.product?.productName || "N/A";
                    const paymentStatus =
                      item.due > 0 ? (
                        <span className="badges bg-lightred">Due</span>
                      ) : (
                        <span className="badges bg-lightgreen">Paid</span>
                      );
                    const statusBadge = (
                      <span
                        className={`badges ${
                          item.status === "received"
                            ? "bg-lightgreen"
                            : "bg-lightred"
                        }`}
                      >
                        {item.status.charAt(0).toUpperCase() +
                          item.status.slice(1)}
                      </span>
                    );

                    return (
                      <tr key={item._id}>
                        <td>{productName}</td>
                        <td>{item.reference}</td>
                        <td>{statusBadge}</td>
                        <td>{item.totalAmount.toLocaleString()}</td>
                        <td>{item.payment.toLocaleString()}</td>
                        <td>{item.due.toLocaleString()}</td>
                        <td>{paymentStatus}</td>
                        <td className="action-table-data">
                          <div className="edit-delete-action">
                            <Link
                              className="me-2 p-2"
                              to="#"
                              data-bs-toggle="modal"
                              data-bs-target="#edit-sales-new"
                            >
                              <i data-feather="edit" className="feather-edit" />
                            </Link>
                            <Link
                              className="confirm-text p-2"
                              to="#"
                              onClick={showConfirmationAlert}
                            >
                              <i
                                data-feather="trash-2"
                                className="feather-trash-2"
                              />
                            </Link>
                          </div>
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      </div>
      <AddPurchaseReturn />
      <EditPurchaseReturns />
    </div>
  );
};

export default PurchaseReturns;
