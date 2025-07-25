import React, { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { Link } from "react-router-dom";
import Table from "../../core/pagination/datatable";
import AddUnit from "../../core/modals/inventory/addunit";
import EditUnit from "../../core/modals/inventory/editunit";
import Swal from "sweetalert2";
import {
  Calendar,
  ChevronUp,
  Filter,
  PlusCircle,
  RotateCcw,
  Sliders,
  StopCircle,
  Zap,
} from "feather-icons-react/build/IconComponents";
import Select from "react-select";
import { DatePicker } from "antd";
import withReactContent from "sweetalert2-react-content";
import { OverlayTrigger, Tooltip } from "react-bootstrap";
import ImageWithBasePath from "../../core/img/imagewithbasebath";
import { setToogleHeader } from "../../core/redux/action";
import {
  useDeleteUnitMutation,
  useGetUnitsQuery,
} from "../../core/redux/api/unitApi/unitApi";
import { usePos } from "../../hooks/PosProvider";

export const Units = () => {
  // const dataSource = useSelector((state) => state.unit_data);
  const dispatch = useDispatch();
  const data = useSelector((state) => state.toggle_header);
  const [selectedDate, setSelectedDate] = useState(false);
  const [deleteUnit] = useDeleteUnitMutation();
  const [isFilterVisible, setIsFilterVisible] = useState(false);
  const [dataSource, setDataSource] = useState([]);
  const [unit, setUnit] = useState([]);
  // filtering handle
  const [selectedUnit, setSelectedUnit] = useState(false);
  const [selectedStatus, setSelectedStatus] = useState(false);
  const [search, setSearch] = useState(false);
  const [selectedUnitData, setSelectedUnitData] = useState(null);
  // filtering handle end
  const { pos } = usePos();
  const { data: unitItems, isLoading: isUnitLoading } = useGetUnitsQuery(
    {
      posId: pos?._id,
      unitName: selectedUnit,
      status: selectedStatus,
      time: selectedDate ? selectedDate.toISOString() : "",
      search: search,
    },
    {
      skip: !pos?._id,
    }
  );
  useEffect(() => {
    if (unitItems) {
      const filteredData = unitItems?.data?.map((item) => ({
        ...item,
        value: item?._id,
        label: item?.name,
        shortname: item?.shortName,
      }));
      setUnit(filteredData);
    }
    if (unitItems) {
      const filterdataForTable = unitItems?.data?.map((item) => ({
        ...item,
        key: item?._id,
        unit: item?.name,
        shortname: item?.shortName,
        noofproducts: item?.products?.length,
        createdon: item?.createdAt,
        status: item?.status,
      }));
      setDataSource(filterdataForTable);
    }
  }, [unitItems, isUnitLoading]);
  // ✅ Step 1: Helper Function

  const oldandlatestvalue = [
    { value: "date", label: "Sort by Date" },
    { value: "newest", label: "Newest" },
    { value: "oldest", label: "Oldest" },
  ];
  const status = [
    { value: "choose Status", label: "Choose Status" },
    { value: "active", label: "Active" },
    { value: "inactive", label: "InActive" },
  ];
  const handleDateChange = (date) => {
    setSelectedDate(date);
  };
  const renderTooltip = (props) => (
    <Tooltip id="pdf-tooltip" {...props}>
      Pdf
    </Tooltip>
  );
  const renderExcelTooltip = (props) => (
    <Tooltip id="excel-tooltip" {...props}>
      Excel
    </Tooltip>
  );
  const renderPrinterTooltip = (props) => (
    <Tooltip id="printer-tooltip" {...props}>
      Printer
    </Tooltip>
  );
  const renderRefreshTooltip = (props) => (
    <Tooltip id="refresh-tooltip" {...props}>
      Refresh
    </Tooltip>
  );
  const renderCollapseTooltip = (props) => (
    <Tooltip id="refresh-tooltip" {...props}>
      Collapse
    </Tooltip>
  );
  const toggleFilterVisibility = () => {
    setIsFilterVisible((prevVisibility) => !prevVisibility);
  };

  const columns = [
    {
      title: "Unit",
      dataIndex: "unit",
      sorter: (a, b) => a.unit.length - b.unit.length,
    },
    {
      title: "Short Name",
      dataIndex: "shortname",
      sorter: (a, b) => a.shortname.length - b.shortname.length,
    },

    {
      title: "NO of Products",
      dataIndex: "noOfProducts",
      sorter: (a, b) => a.noofproducts.length - b.noofproducts.length,
    },
    {
      title: "Created On",
      dataIndex: "createdon",
      sorter: (a, b) => new Date(a.createdon) - new Date(b.createdon),
      render: (text) => {
        const date = new Date(text);
        return date.toLocaleString("en-GB", {
          day: "2-digit",
          month: "2-digit",
          year: "numeric",
          hour: "2-digit",
          minute: "2-digit",
          hour12: true,
        });
      },
    },

    {
      title: "Status",
      dataIndex: "status",
      render: (text) => (
        <span className="badge badge-linesuccess">
          <Link to="#"> {text}</Link>
        </span>
      ),
      sorter: (a, b) => a.status.length - b.status.length,
    },

    {
      title: "Actions",
      dataIndex: "actions",
      key: "actions",
      render: (_, record) => (
        <div className="action-table-data">
          <div className="edit-delete-action">
            <Link
              className="me-2 p-2"
              to="#"
              data-bs-toggle="modal"
              data-bs-target="#edit-units"
              onClick={() => setSelectedUnitData(record)} // 🔥 এখানে পাঠানো হচ্ছে
            >
              <i data-feather="edit" className="feather-edit"></i>
            </Link>
            <Link className="confirm-text p-2" to="#">
              <i
                data-feather="trash-2"
                className="feather-trash-2"
                onClick={() => showConfirmationAlert(record._id)}
              ></i>
            </Link>
          </div>
        </div>
      ),
    },
  ];
  const MySwal = withReactContent(Swal);

  const showConfirmationAlert = (unitId) => {
    MySwal.fire({
      title: "Are you sure?",
      text: "You won't be able to revert this!",
      showCancelButton: true,
      confirmButtonColor: "#00ff00",
      confirmButtonText: "Yes, delete it!",
      cancelButtonColor: "#ff0000",
      cancelButtonText: "Cancel",
    }).then(async (result) => {
      if (result.isConfirmed) {
        try {
          await deleteUnit(unitId).unwrap();
          MySwal.fire({
            title: "Deleted!",
            text: "Unit has been deleted successfully.",
            icon: "success",
            confirmButtonText: "OK",
            customClass: {
              confirmButton: "btn btn-success",
            },
          });
        } catch (error) {
          MySwal.fire({
            title: "Error!",
            text: error?.data?.message || "Failed to delete.",
            icon: "error",
            confirmButtonText: "OK",
          });
        }
      } else {
        MySwal.close();
      }
    });
  };

  return (
    <>
      <div className="page-wrapper">
        <div className="content">
          <div className="page-header">
            <div className="add-item d-flex">
              <div className="page-title">
                <h4>Units</h4>
                <h6>Manage your units</h6>
              </div>
            </div>
            <ul className="table-top-head">
              <li>
                <OverlayTrigger placement="top" overlay={renderTooltip}>
                  <Link>
                    <ImageWithBasePath
                      src="assets/img/icons/pdf.svg"
                      alt="img"
                    />
                  </Link>
                </OverlayTrigger>
              </li>
              <li>
                <OverlayTrigger placement="top" overlay={renderExcelTooltip}>
                  <Link data-bs-toggle="tooltip" data-bs-placement="top">
                    <ImageWithBasePath
                      src="assets/img/icons/excel.svg"
                      alt="img"
                    />
                  </Link>
                </OverlayTrigger>
              </li>
              <li>
                <OverlayTrigger placement="top" overlay={renderPrinterTooltip}>
                  <Link data-bs-toggle="tooltip" data-bs-placement="top">
                    <i data-feather="printer" className="feather-printer" />
                  </Link>
                </OverlayTrigger>
              </li>
              <li>
                <OverlayTrigger placement="top" overlay={renderRefreshTooltip}>
                  <Link data-bs-toggle="tooltip" data-bs-placement="top">
                    <RotateCcw />
                  </Link>
                </OverlayTrigger>
              </li>
              <li>
                <OverlayTrigger placement="top" overlay={renderCollapseTooltip}>
                  <Link
                    data-bs-toggle="tooltip"
                    data-bs-placement="top"
                    id="collapse-header"
                    className={data ? "active" : ""}
                    onClick={() => {
                      dispatch(setToogleHeader(!data));
                    }}
                  >
                    <ChevronUp />
                  </Link>
                </OverlayTrigger>
              </li>
            </ul>
            <div className="page-btn">
              <a
                to="#"
                className="btn btn-added"
                data-bs-toggle="modal"
                data-bs-target="#add-units"
              >
                <PlusCircle className="me-2" />
                Add New Unit
              </a>
            </div>
          </div>
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
                      onChange={(e) => setSearch(e.target.value)}
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
                <div className="form-sort">
                  <Sliders className="info-img" />
                  <Select
                    className="select"
                    options={oldandlatestvalue}
                    placeholder="Newest"
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
                        <Zap className="info-img" />
                        <Select
                          className="select"
                          options={unit}
                          placeholder="Choose Brand"
                          onChange={(e) => setSelectedUnit(e.value)}
                        />
                      </div>
                    </div>
                    <div className="col-lg-3 col-sm-6 col-12">
                      <div className="input-blocks">
                        <Calendar className="info-img" />
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
                          className="select"
                          options={status}
                          placeholder="Choose Brand"
                          onChange={(e) => setSelectedStatus(e.value)}
                        />
                      </div>
                    </div>
                    <div className="col-lg-3 col-sm-6 col-12 ms-auto">
                      <div className="input-blocks">
                        <button className="btn btn-filters ms-auto">
                          <i data-feather="search" className="feather-search" />{" "}
                          Search
                        </button>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
              {/* /Filter */}
              <div className="table-responsive">
                <Table columns={columns} dataSource={dataSource} />
              </div>
            </div>
          </div>
          {/* /product list */}
        </div>
        <AddUnit />
        <EditUnit selectedUnit={selectedUnitData} />
      </div>
    </>
  );
};
