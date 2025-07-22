import React from "react";
import Breadcrumbs from "../../core/breadcrumbs";
import { Link } from "react-router-dom";
import { Sliders, Edit, Trash2 } from "react-feather";
import Select from "react-select";
import { Table } from "antd";
import Swal from "sweetalert2";
import withReactContent from "sweetalert2-react-content";
import SupplierModal from "../../core/modals/peoples/supplierModal";
import { useState } from "react";
import {
  useGetSuppliersQuery,
  useDeleteSupplierMutation,
} from "../../core/redux/api/supplierApi/supplierApi";
import { usePos } from "../../hooks/PosProvider";
const Suppliers = () => {
  const [selectedOption, setSelectedOption] = useState("");
  const [selectedSupplier, setSelectedSupplier] = useState(null);
  const [deleteSupplier] = useDeleteSupplierMutation();

  const [preaparedData, setPreaparedData] = useState({
    search: "",
    filter: "",
  });
  const { pos } = usePos();
  const handleSelectChange = (selectedOption) => {
    setSelectedOption(selectedOption);
    setPreaparedData({ ...preaparedData, filter: selectedOption.value });
  };
  const options = [
    { value: "newest", label: "Latest" },
    { value: "oldest", label: "Oldest" },
  ];
  const { data: suppliers } = useGetSuppliersQuery(
    {
      posId: pos?._id,
      ...preaparedData,
    },
    {
      skip: !pos?._id,
    }
  );
  const columns = [
    {
      title: "Supplier Name",
      dataIndex: "supplierName",
      render: (text, record) => (
        <span className="productimgname">
          <Link to="#" className="product-img stock-img">
            <span>{record.name}</span>
          </Link>
          <Link to="#">{text}</Link>
        </span>
      ),
      sorter: (a, b) => a.supplierName.length - b.supplierName.length,
    },

    {
      title: "Email",
      dataIndex: "email",
      sorter: (a, b) => a.email.length - b.email.length,
    },

    {
      title: "Phone",
      dataIndex: "phone",
      sorter: (a, b) => a.phone.length - b.phone.length,
    },

    {
      title: "Status",
      dataIndex: "status",
      sorter: (a, b) => a.country.length - b.country.length,
    },

    {
      title: "Action",
      dataIndex: "action",
      render: (_, record) => (
        <div className="action-table-data">
          <div className="edit-delete-action">
            <div className="input-block add-lists"></div>

            <Link
              className="me-2 p-2"
              to="#"
              data-bs-toggle="modal"
              data-bs-target="#edit-units"
              onClick={() => setSelectedSupplier(record)}
            >
              <Edit className="feather-edit" size={16} />
            </Link>

            <Link
              className="confirm-text p-2"
              to="#"
              onClick={() => showConfirmationAlert(record._id)}
            >
              <Trash2 className="feather-trash-2" size={16} />
            </Link>
          </div>
        </div>
      ),
      sorter: (a, b) => a.createdby.length - b.createdby.length,
    },
  ];

  const MySwal = withReactContent(Swal);

  const showConfirmationAlert = (id) => {
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
        await deleteSupplier(id);
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
          maintitle="Supplier List "
          subtitle="Manage Your Supplier"
          addButton="Add New Supplier"
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
                    value={preaparedData?.search}
                    onChange={(e) => {
                      setPreaparedData({
                        ...preaparedData,
                        search: e.target.value,
                      });
                    }}
                  />
                  <Link to className="btn btn-searchset">
                    <i data-feather="search" className="feather-search" />
                  </Link>
                </div>
              </div>

              <div className="form-sort stylewidth">
                <Sliders className="info-img" />

                <Select
                  className="select"
                  options={options}
                  placeholder="Sort by Date"
                  value={selectedOption}
                  onChange={(selected) => handleSelectChange(selected)}
                />
              </div>
            </div>

            <div className="table-responsive">
              <Table
                className="table datanew"
                columns={columns}
                dataSource={suppliers?.suppliers ?? []}
                rowKey={(record) => record._id}
                // pagination={true}
              />
            </div>
          </div>
        </div>
        {/* /product list */}
      </div>

      <SupplierModal selectedSupplier={selectedSupplier} />
    </div>
  );
};

export default Suppliers;
