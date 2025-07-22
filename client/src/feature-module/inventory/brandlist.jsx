import React, { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { Link } from "react-router-dom/dist";
import AddBrand from "../../core/modals/inventory/addbrand";
import EditBrand from "../../core/modals/inventory/editbrand";
import Swal from "sweetalert2";
import Table from "../../core/pagination/datatable";
import Select from "react-select";
import Sliders from "feather-icons-react/build/IconComponents/Sliders";
import {
  ChevronUp,
  Filter,
  PlusCircle,
  RotateCcw,
  StopCircle,
  Zap,
} from "feather-icons-react/build/IconComponents";
import { DatePicker } from "antd";
import { OverlayTrigger, Tooltip } from "react-bootstrap";
import ImageWithBasePath from "../../core/img/imagewithbasebath";
import { setToogleHeader } from "../../core/redux/action";
import withReactContent from "sweetalert2-react-content";
import {
  useDeleteBrandMutation,
  useGetAllBrandsQuery,
} from "../../core/redux/api/brandApi/brandApi";
import { usePos } from "../../hooks/PosProvider";
import { toast } from "react-toastify";
const BrandList = () => {
  // const dataSource = useSelector((state) => state.brand_list);
  const dispatch = useDispatch();
  const data = useSelector((state) => state.toggle_header);
  // all branditems
  const [brandOptions, setBrandOptions] = useState([]);
  // filtering

  const [filter, setFilter] = useState({
    brand: "",
    status: "",
    time: "",
    search: "",
    newest: "",
    oldest: "",
  });
  const { pos } = usePos();
  const { data: brandItems } = useGetAllBrandsQuery(
    { ...filter, posId: pos?._id },
    {
      skip: !pos?._id,
    }
  );
  const [selectedBrand, setSelectedBrand] = useState(null);

  const { data: allBrandItems, isLoading } = useGetAllBrandsQuery(
    { posId: pos?._id },
    {
      skip: !pos?._id,
    }
  );

  const [deleteBrand] = useDeleteBrandMutation();

  // For input fields like <input type="text" />
  const handleInputFilterChange = (e) => {
    const { name, value } = e.target;
    setFilter((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  // For react-select "Sort"
  const handleSortChange = (selectedOption) => {
    setFilter((prev) => ({
      ...prev,
      newest: selectedOption?.value === "newest" ? selectedOption.value : "",
      oldest: selectedOption?.value === "oldest" ? selectedOption.value : "",
    }));
  };

  // For react-select "Brand"
  const handleBrandChange = (selectedOption) => {
    setFilter((prev) => ({
      ...prev,
      brand: selectedOption?.value || "",
    }));
  };

  // For react-select "Status"
  const handleStatusChange = (selectedOption) => {
    setFilter((prev) => ({
      ...prev,
      status: selectedOption?.value || "",
    }));
  };

  // For antd DatePicker
  const handleDateChange = (date, dateString) => {
    setFilter((prev) => ({
      ...prev,
      time: dateString,
    }));
  };
  // delete
  const handleDeleteBrand = async (id) => {
    try {
      const result = await deleteBrand(id).unwrap();
      if (result) {
        toast.success("Brand deleted successfully");
      }
    } catch (error) {
      toast.error("Failed to delete brand");
    }
  };

  const oldandlatestvalue = [
    { value: "date", label: "Sort by Date" },
    { value: "newest", label: "Newest", name: "newest" },
    { value: "oldest", label: "Oldest", name: "oldest" },
  ];

  const status = [
    { value: "choose Status", label: "Choose Status", name: "Choose Status" },
    { value: "active", label: "Active", name: "Active" },
    { value: "inactive", label: "InActive", name: "InActive" },
  ];
  const [isFilterVisible, setIsFilterVisible] = useState(false);
  const toggleFilterVisibility = () => {
    setIsFilterVisible((prevVisibility) => !prevVisibility);
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
  const columns = [
    {
      title: "Brand",
      dataIndex: "name",
      sorter: (a, b) => a.brand.length - b.brand.length,
    },

    {
      title: "Logo",
      dataIndex: "logo",
      render: (text, record) => (
        <span className="productimgname">
          <Link to="#" className="product-img stock-img">
            <ImageWithBasePath
              alt="icon/images"
              src={record.logo}
              isBase={true}
            />
          </Link>
        </span>
      ),
      sorter: (a, b) => a.logo.length - b.logo.length,
      width: "5%",
    },
    {
      title: "Created Time",
      dataIndex: "createdAt",
      render: (text) => {
        const date = new Date(text);
        const day = date.getDate().toString().padStart(2, "0"); // 15
        const month = (date.getMonth() + 1).toString().padStart(2, "0"); // 07
        const year = date.getFullYear(); // 2025

        let hours = date.getHours(); // 23
        const minutes = date.getMinutes().toString().padStart(2, "0"); // 30
        const ampm = hours >= 12 ? "PM" : "AM";
        hours = hours % 12 || 12; // convert 0 to 12, and 13+ to 1-12

        return `${day}/${month}/${year} ${hours}:${minutes} ${ampm}`;
      },

      sorter: (a, b) => new Date(a.createdAt) - new Date(b.createdAt),
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
              data-bs-target="#edit-brand"
              onClick={() => setSelectedBrand(record)}
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
  // delete logic willl be here
  const showConfirmationAlert = (id) => {
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
        handleDeleteBrand(id);
      } else {
        MySwal.close();
      }
    });
  };
  useEffect(() => {
    if (allBrandItems?.data?.length > 0 && !isLoading) {
      const formattedOptions = allBrandItems.data.map((brand) => ({
        id: brand._id,
        value: brand.name,
        label: brand.name,
        name: brand.name,
      }));
      setBrandOptions([
        { value: "", label: "Choose Brand" },
        ...formattedOptions,
      ]);
    }
  }, [allBrandItems, isLoading, brandItems]);

  return (
    <div>
      <div className="page-wrapper">
        <div className="content">
          <div className="page-header">
            <div className="add-item d-flex">
              <div className="page-title">
                <h4>Brand</h4>
                <h6>Manage your brands</h6>
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
              <Link
                to="#"
                className="btn btn-added"
                data-bs-toggle="modal"
                data-bs-target="#add-brand"
              >
                <PlusCircle className="me-2" />
                Add New Brand
              </Link>
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
                      name="search"
                      value={filter.search}
                      onChange={handleInputFilterChange}
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
                <div className="form-sort">
                  <Sliders className="info-img" />
                  <Select
                    className="select"
                    options={oldandlatestvalue}
                    placeholder="Sort by Date"
                    onChange={handleSortChange}
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
                          options={brandOptions}
                          placeholder="Choose Brand"
                          onChange={handleBrandChange}
                        />
                      </div>
                    </div>
                    <div className="col-lg-3 col-sm-6 col-12">
                      <div className="input-blocks">
                        <div className="input-groupicon">
                          <DatePicker
                            onChange={handleDateChange}
                            className="filterdatepicker"
                            format="DD-MM-YYYY"
                            placeholder="Choose Date"
                          />
                        </div>
                      </div>
                    </div>
                    <div className="col-lg-3 col-sm-6 col-12">
                      <div className="input-blocks">
                        <i data-feather="stop-circle" className="info-img" />
                        <StopCircle className="info-img" />
                        <Select
                          className="select"
                          options={status}
                          placeholder="Choose Status"
                          onChange={handleStatusChange}
                        />
                      </div>
                    </div>
                    <div className="col-lg-3 col-sm-6 col-12 ms-auto">
                      <div className="input-blocks">
                        <Link className="btn btn-filters ms-auto">
                          {" "}
                          <i
                            data-feather="search"
                            className="feather-search"
                          />{" "}
                          Search{" "}
                        </Link>
                      </div>
                    </div>
                  </div>
                </div>
              </div>

              {/* /Filter */}
              <div className="table-responsive">
                <Table
                  columns={columns}
                  dataSource={brandItems?.data || []}
                  rowKey={(record) => record?._id}
                />
              </div>
            </div>
            {/* /product list */}
          </div>
        </div>
      </div>
      <AddBrand />
      <EditBrand brand={selectedBrand} />
    </div>
  );
};

export default BrandList;
