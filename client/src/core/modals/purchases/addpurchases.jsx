import { DatePicker } from "antd";
import React, { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import Select from "react-select";
import { useGetSuppliersQuery } from "../../redux/api/supplierApi/supplierApi";
import { usePos } from "../../../hooks/PosProvider";
import dayjs from "dayjs";
import {
  useGetProductByIdQuery,
  useGetProductsQuery,
} from "../../redux/api/productapi/productApi";

const AddPurchases = () => {
  const { pos, loading: posLoading } = usePos();
  const [supplier, setSupplier] = useState([]);
  const [selectedSupllier, setSelectedSupplier] = useState(null);
  const [products, setProducts] = useState([]);
  const [usePosId, setUsePosId] = useState("");
  const [Product, setProduct] = useState([]);
  const [selectedProduct, setSelectedProduct] = useState(null);
  const {
    data: supplierList,
    isLoading: supplierLoading,
    error,
  } = useGetSuppliersQuery(
    {
      posId: pos?._id,
    },
    {
      skip: !pos?._id,
    }
  );
  const { data: productListById, isLoading: productLoadingById } =
    useGetProductByIdQuery(selectedProduct?.value, {
      skip: !selectedProduct,
    });
  const { data: productList, isLoading: productLoading } = useGetProductsQuery(
    {
      pos: !usePosId,
      categoryId: "allCategory",
    },
    {
      skip: !usePosId,
    }
  );
  console.log(
    "============>",
    usePosId,
    supplierList,
    productList,
    productListById,
    Product,
    error,
    "usePosId",
    usePosId
  );
  useEffect(() => {
    if (supplierList?.suppliers?.length > 0 && !supplierLoading) {
      const filteredData = supplierList.suppliers.map((item) => ({
        value: item?._id,
        label: item?.name,
      }));
      setSupplier(filteredData);
    }
    if (productList?.data?.length > 0 && !productLoading) {
      const filteredData = productList.data.map((item) => ({
        value: item?._id,
        label: item?.productName,
        reference: item?.reference || "REF-000000",
      }));
      setProducts(filteredData);
    }
    if (productListById?.data && !productLoadingById) {
      setProduct(productListById.data);
    }
    if (pos?._id && !posLoading) {
      setUsePosId(pos?._id);
      console.log("aadddddddd ==========>", pos?._id);
    }
  }, [
    supplierList,
    supplierLoading,
    productList,
    productLoading,
    productLoadingById,
    productListById,
    posLoading,
    pos?._id,
  ]);
  const status = [
    { value: "received", label: "Received" },
    { value: "pending", label: "Pending" },
  ];

  const [selectedDate, setSelectedDate] = useState(dayjs());
  const handleDateChange = (date) => {
    setSelectedDate(date);
  };

  return (
    <div>
      {/* Add Purchase */}
      <div className="modal fade" id="add-units">
        <div className="modal-dialog purchase modal-dialog-centered stock-adjust-modal">
          <div className="modal-content">
            <div className="page-wrapper-new p-0">
              <div className="content">
                <div className="modal-header border-0 custom-modal-header">
                  <div className="page-title">
                    <h4>Add Purchase</h4>
                  </div>
                  <button
                    type="button"
                    className="close"
                    data-bs-dismiss="modal"
                    aria-label="Close"
                  >
                    <span aria-hidden="true">×</span>
                  </button>
                </div>
                <div className="modal-body custom-modal-body">
                  <form>
                    <div className="row">
                      <div className="col-lg-3 col-md-6 col-sm-12">
                        <div className="input-blocks add-product">
                          <label>Supplier Name</label>
                          <div className="row">
                            <div className="col-lg-10 col-sm-10 col-10">
                              <Select
                                options={supplier}
                                className="select"
                                placeholder="Choose"
                                value={selectedSupllier}
                                onChange={setSelectedSupplier}
                              />
                            </div>
                          </div>
                        </div>
                      </div>
                      <div className="col-lg-3 col-md-6 col-sm-12">
                        <div className="input-blocks">
                          <label>Purchase Date</label>
                          <div className="input-groupicon calender-input">
                            <DatePicker
                              value={selectedDate}
                              onChange={handleDateChange}
                              disabled
                              format="DD-MM-YYYY"
                              className="filterdatepicker"
                            />
                          </div>
                        </div>
                      </div>
                      <div className="col-lg-3 col-md-6 col-sm-12">
                        <div className="input-blocks">
                          <label>Product Name</label>
                          <Select
                            options={products}
                            className="select"
                            placeholder="Choose"
                            value={selectedProduct}
                            onChange={(option) => setSelectedProduct(option)}
                          />
                        </div>
                      </div>
                      <div className="col-lg-3 col-md-6 col-sm-12">
                        <div className="input-blocks">
                          <label>Reference No</label>
                          <input
                            type="text"
                            className="form-control"
                            defaultValue={selectedProduct?.reference}
                            readOnly
                          />
                        </div>
                      </div>
                    </div>
                    <div className="row">
                      <div className="col-lg-12">
                        <div className="modal-body-table">
                          <div className="table-responsive">
                            <table className="table  datanew">
                              <thead>
                                <tr className="text-center">
                                  <th>Product</th>
                                  <th>Qty</th>
                                  <th>Purchase Price</th>
                                  <th>Discount</th>
                                  <th>Tax</th>
                                  <th>Tax Amount</th>
                                  <th>Unit Cost</th>
                                  <th>Total Cost</th>
                                </tr>
                              </thead>
                              <tbody>
                                <tr>
                                  <td className="p-5">0</td>
                                  <td className="p-5">0</td>
                                  <td className="p-5">0</td>
                                  <td className="p-5">0</td>
                                  <td className="p-5">0</td>
                                  <td className="p-5">0</td>
                                  <td className="p-5">0</td>
                                  <td className="p-5">0</td>
                                </tr>
                              </tbody>
                            </table>
                          </div>
                        </div>
                      </div>
                      <div className="row">
                        <div className="col-lg-3 col-md-6 col-sm-12">
                          <div className="input-blocks">
                            <label>Status</label>
                            <Select
                              options={status}
                              className="select"
                              placeholder="Choose"
                            />
                          </div>
                        </div>
                      </div>
                    </div>

                    <div className="col-lg-12">
                      <div className="modal-footer-btn">
                        <button
                          type="button"
                          className="btn btn-cancel me-2"
                          data-bs-dismiss="modal"
                        >
                          Cancel
                        </button>
                        <Link to="#" className="btn btn-submit">
                          Submit
                        </Link>
                      </div>
                    </div>
                  </form>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
      {/* /Add Purchase */}
    </div>
  );
};

export default AddPurchases;
