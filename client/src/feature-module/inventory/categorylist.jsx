import React, { useEffect, useState } from "react";
import { OverlayTrigger, Tooltip } from "react-bootstrap";
import ImageWithBasePath from "../../core/img/imagewithbasebath";
import { Link } from "react-router-dom";
import {
  ChevronUp,
  Filter,
  PlusCircle,
  RotateCcw,
  Sliders,
  StopCircle,
  Zap,
} from "feather-icons-react/build/IconComponents";
import { useDispatch, useSelector } from "react-redux";
import { setToogleHeader } from "../../core/redux/action";
import Select from "react-select";
import { DatePicker } from "antd";
import AddCategoryList from "../../core/modals/inventory/addcategorylist";
import EditCategoryList from "../../core/modals/inventory/editcategorylist";
import withReactContent from "sweetalert2-react-content";
import Swal from "sweetalert2";
import Table from "../../core/pagination/datatable";
import {
  useDeleteCategoryMutation,
  useGetCategoriesQuery,
} from "../../core/redux/api/categoryApi/categoryApi";
import { usePos } from "../../hooks/PosProvider";

const CategoryList = () => {
  const dispatch = useDispatch();
  const data = useSelector((state) => state.toggle_header);
  const [dataSource, setDataSource] = useState([]);
  const [category, setCategory] = useState([]);
  const [selectedCategory, setSelectedCategory] = useState(null);

  const [isFilterVisible, setIsFilterVisible] = useState(false);
  const toggleFilterVisibility = () => {
    setIsFilterVisible((prevVisibility) => !prevVisibility);
  };

  const { pos } = usePos();

  const [searchValue, setSearchValue] = useState("");
  const [filterCategory, setFilterCategory] = useState(null);
  const [filterStatus, setFilterStatus] = useState(null);
  const [filterDate, setFilterDate] = useState(null);
  const [newestOrOldest, setNewestOrOldest] = useState({
    newest: "",
    oldest: "",
  });

  const queryParams = {
    type: "main",
    pos: pos?._id,
    ...(filterCategory?.value && { category: filterCategory.value }),
    ...(filterStatus?.value && { status: filterStatus.value }),
    ...(filterDate && { date: filterDate.toISOString() }),
    ...(searchValue && { search: searchValue }),
    newest: newestOrOldest.newest,
    oldest: newestOrOldest.oldest,
  };

  const { data: categoriesList, isLoading: isCategoriesLoading } =
    useGetCategoriesQuery(queryParams, {
      skip: !pos?._id,
    });
  const [deleteCategory] = useDeleteCategoryMutation();

  useEffect(() => {
    if (categoriesList?.data?.length > 0 && !isCategoriesLoading) {
      const filteredData = categoriesList.data.map((item) => ({
        ...item,
        key: item._id,
        category: item.name,
        categoryslug: item.slug,
        createdon: item.createdAt,
        status: item.status,
      }));
      setDataSource(filteredData);

      const filterOptions = categoriesList.data.map((item) => ({
        ...item,
        key: item._id,
        value: item._id,
        label: item.name,
      }));
      setCategory(filterOptions);
    } else {
      setDataSource([]);
      setCategory([]);
    }
  }, [categoriesList, isCategoriesLoading]);

  const oldandlatestvalue = [
    { value: "newest", label: "Newest" },
    { value: "oldest", label: "Oldest" },
  ];

  const status = [
    { value: "chooseStatus", label: "Choose Status" },
    { value: "active", label: "Active" },
    { value: "inactive", label: "Inactive" },
  ];

  const renderTooltip = (props, text) => <Tooltip {...props}>{text}</Tooltip>;

  const columns = [
    {
      title: "Category",
      dataIndex: "category",
      sorter: (a, b) => a.category.length - b.category.length,
    },
    {
      title: "Category Slug",
      dataIndex: "categoryslug",
      sorter: (a, b) => a.categoryslug.length - b.categoryslug.length,
    },
    {
      title: "Created On",
      dataIndex: "createdon",
      render: (text) =>
        new Date(text).toLocaleString("en-GB", {
          day: "2-digit",
          month: "2-digit",
          year: "numeric",
          hour: "2-digit",
          minute: "2-digit",
          hour12: true,
        }),
      sorter: (a, b) => new Date(a.createdon) - new Date(b.createdon),
    },
    {
      title: "Status",
      dataIndex: "status",
      render: (text) => (
        <span className="badge badge-linesuccess">
          <Link to="#">{text}</Link>
        </span>
      ),
      sorter: (a, b) => a.status.length - b.status.length,
    },
    {
      title: "Actions",
      key: "actions",
      render: (_, record) => (
        <div className="action-table-data">
          <div className="edit-delete-action">
            <Link
              className="me-2 p-2"
              to="#"
              data-bs-toggle="modal"
              data-bs-target="#edit-category"
              onClick={() => setSelectedCategory(record)}
            >
              <i data-feather="edit" className="feather-edit" />
            </Link>
            <Link className="confirm-text p-2" to="#">
              <i
                data-feather="trash-2"
                className="feather-trash-2"
                onClick={() => showConfirmationAlert(record._id)}
              />
            </Link>
          </div>
        </div>
      ),
    },
  ];

  const MySwal = withReactContent(Swal);

  const showConfirmationAlert = (id) => {
    MySwal.fire({
      title: "Are you sure?",
      text: "You won't be able to revert this!",
      showCancelButton: true,
      confirmButtonColor: "#00ff00",
      cancelButtonColor: "#ff0000",
      confirmButtonText: "Yes, delete it!",
      cancelButtonText: "Cancel",
    }).then(async (result) => {
      if (result.isConfirmed) {
        try {
          await deleteCategory(id);
          MySwal.fire("Deleted!", "Category has been deleted.", "success");
        } catch (error) {
          console.error("Delete failed:", error);
          MySwal.fire("Error", "Something went wrong!", "error");
        }
      }
    });
  };

  return (
    <div className="page-wrapper">
      <div className="content">
        <div className="page-header">
          <div className="add-item d-flex">
            <div className="page-title">
              <h4>Category</h4>
              <h6>Manage your categories</h6>
            </div>
          </div>
          <ul className="table-top-head">
            <li>
              <OverlayTrigger
                placement="top"
                overlay={(props) => renderTooltip(props, "Pdf")}
              >
                <Link>
                  <ImageWithBasePath src="assets/img/icons/pdf.svg" alt="img" />
                </Link>
              </OverlayTrigger>
            </li>
            <li>
              <OverlayTrigger
                placement="top"
                overlay={(props) => renderTooltip(props, "Excel")}
              >
                <Link>
                  <ImageWithBasePath
                    src="assets/img/icons/excel.svg"
                    alt="img"
                  />
                </Link>
              </OverlayTrigger>
            </li>
            <li>
              <OverlayTrigger
                placement="top"
                overlay={(props) => renderTooltip(props, "Printer")}
              >
                <Link>
                  <i data-feather="printer" className="feather-printer" />
                </Link>
              </OverlayTrigger>
            </li>
            <li>
              <OverlayTrigger
                placement="top"
                overlay={(props) => renderTooltip(props, "Refresh")}
              >
                <Link>
                  <RotateCcw />
                </Link>
              </OverlayTrigger>
            </li>
            <li>
              <OverlayTrigger
                placement="top"
                overlay={(props) => renderTooltip(props, "Collapse")}
              >
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
              data-bs-target="#add-category"
            >
              <PlusCircle className="me-2" /> Add New Category
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
                    value={searchValue}
                    onChange={(e) => setSearchValue(e.target.value)}
                    className="form-control form-control-sm formsearch"
                  />
                  <Link to="#" className="btn btn-searchset">
                    <i data-feather="search" className="feather-search" />
                  </Link>
                </div>
              </div>
              <div className="search-path">
                <Link
                  className={`btn btn-filter ${
                    isFilterVisible ? "setclose" : ""
                  }`}
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
                  onChange={(selectedOption) =>
                    setNewestOrOldest({
                      newest:
                        selectedOption.value === "newest"
                          ? selectedOption.value
                          : "",
                      oldest:
                        selectedOption.value === "oldest"
                          ? selectedOption.value
                          : "",
                    })
                  }
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
                      <Zap className="info-img" />
                      <Select
                        options={category}
                        className="select"
                        placeholder="Choose Category"
                        value={filterCategory}
                        onChange={(selectedOption) =>
                          setFilterCategory(selectedOption)
                        }
                      />
                    </div>
                  </div>
                  <div className="col-lg-3 col-sm-6 col-12">
                    <div className="input-blocks">
                      <i data-feather="calendar" className="info-img" />
                      <div className="input-groupicon">
                        <DatePicker
                          selected={filterDate}
                          onChange={(date) => setFilterDate(date)}
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
                        options={status}
                        className="select"
                        placeholder="Choose Status"
                        value={filterStatus}
                        onChange={(selectedOption) =>
                          setFilterStatus(selectedOption)
                        }
                      />
                    </div>
                  </div>
                  <div className="col-lg-3 col-sm-6 col-12 ms-auto">
                    <div className="input-blocks">
                      <Link className="btn btn-filters ms-auto">
                        <i data-feather="search" className="feather-search" />{" "}
                        Search{" "}
                      </Link>
                    </div>
                  </div>
                </div>
              </div>
            </div>
            <div className="table-responsive">
              <Table columns={columns} dataSource={dataSource} />
            </div>
          </div>
        </div>
      </div>
      <AddCategoryList />
      <EditCategoryList selectedCategory={selectedCategory} />
    </div>
  );
};

export default CategoryList;
