import React, { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import Select from "react-select";
import { all_routes } from "../../Router/all_routes";
import { DatePicker } from "antd";
import Addunits from "../../core/modals/inventory/addunits";
import AddCategory from "../../core/modals/inventory/addcategory";
import AddBrand from "../../core/modals/addbrand";
import {
  ArrowLeft,
  Calendar,
  ChevronDown,
  ChevronUp,
  Info,
  LifeBuoy,
  List,
  PlusCircle,
  Trash2,
  X,
} from "feather-icons-react/build/IconComponents";
import { useDispatch, useSelector } from "react-redux";
import { setToogleHeader } from "../../core/redux/action";
import { OverlayTrigger, Tooltip } from "react-bootstrap";
import { useGetAllPosQuery } from "../../core/redux/api/posApi/posApi";
import { usePos } from "../../hooks/PosProvider";
import { useGetCategoriesQuery } from "../../core/redux/api/categoryApi/categoryApi";
import { useGetUnitsQuery } from "../../core/redux/api/unitApi/unitApi";
import { useGetAllBrandsQuery } from "../../core/redux/api/brandApi/brandApi";
import { useGetWareHousesQuery } from "../../core/redux/api/wareHouseApi/wareHouseApi";
import { useGetVariantsQuery } from "../../core/redux/api/variantApi/variantApi";
import { useCreateProductMutation } from "../../core/redux/api/productapi/productApi";
import { uploadToCloudinary } from "../../utils/cloudnary";
import ImageWithBasePath from "../../core/img/imagewithbasebath";
import { toast } from "react-toastify";

const AddProduct = () => {
  const route = all_routes;
  const dispatch = useDispatch();

  const data = useSelector((state) => state.toggle_header);
  const { data: posItems } = useGetAllPosQuery();
  const [store, setStore] = useState([]);
  const [warehouse, setWarehouse] = useState([]);
  const [createProduct] = useCreateProductMutation();

  const { pos } = usePos();

  const [product, setProduct] = useState({
    store: "",
    warehouse: "",
    productName: "",
    slug: "",
    sku: "",
    category: "",
    subCategory: "",
    subSubCategory: "",
    brand: "",
    unit: "",
    sellingType: "",
    barCodeSymbology: "",
    itemCode: "",
    descriptions: "",
    price: "",
    parchacePrice: "",
    discountValue: "",
    taxType: "",
    images: [],
    variantAttribute: "",
    variantValues: "red, black",
    warranties: false,
    manufacturer: false,
    expiry: false,
    discountType: "",
    manufactureDate: new Date(),
    expiryDate: new Date(),
    quantityAlert: "",
  });
  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setProduct((prevProduct) => ({
      ...prevProduct,
      [name]: value,
    }));
  };

  const handleCheckboxChange = (e) => {
    const { name, checked } = e.target;
    setProduct((prev) => ({ ...prev, [name]: checked }));
  };

  const handleSelectChange = (name, option) => {
    const value = option ? option.value : "";
    setProduct((prevProduct) => ({
      ...prevProduct,
      [name]: value,
    }));
  };

  const handleDateChange = (name, date) => {
    setProduct((prevProduct) => ({
      ...prevProduct,
      [name]: date,
    }));
  };

  const handleImageUpload = async (e) => {
    const files = Array.from(e.target.files);

    try {
      const urls = await Promise.all(
        files.map((file) => uploadToCloudinary(file))
      );

      const newImages = urls.map((url) => ({ url }));

      setProduct((prev) => ({
        ...prev,
        images: [...prev.images, ...newImages],
      }));
    } catch (err) {
      toast.error(err.message || "Something went wrong!");
    }
  };

  const handleRemoveImage = (indexToRemove) => {
    const updatedImages = product?.images.filter(
      (_, index) => index !== indexToRemove
    );

    setProduct((prevProduct) => ({
      ...prevProduct,
      images: updatedImages,
    }));

    return updatedImages;
  };

  const handleFromSubmit = async (e) => {
    e.preventDefault();
    try {
      await createProduct(product).unwrap();

      toast.success("Product created successfully!");
      setProduct({
        store: "",
        warehouse: "",
        productName: "",
        slug: "",
        sku: "",
        category: "",
        subCategory: "",
        subSubCategory: "",
        brand: "",
        unit: "",
        sellingType: "",
        barCodeSymbology: "",
        itemCode: "",
        descriptions: "",
        price: "",
        parchacePrice: "",
        discountValue: "",
        taxType: "",
        images: [],
        variantAttribute: "",
        variantValues: "red, black",
        warranties: false,
        manufacturer: false,
        expiry: false,
        discountType: "",
        manufactureDate: new Date(),
        expiryDate: new Date(),
        quantityAlert: "",
      });
    } catch (error) {
      toast.error(error.message || "Something went wrong in product creation!");
    }
  };

  // variant data  state
  const [variant, setVariant] = useState([]);
  // main category
  const [category, setCategory] = useState([]);
  const [subCategory, setSubCategory] = useState([]);
  const [subSubCategory, setSubSubCategory] = useState([]);
  // from data mangement
  const [unit, setUnit] = useState([]);
  const [brand, setBrand] = useState([]);
  const { data: mainCategoryItems, isLoading } = useGetCategoriesQuery(
    {
      type: "main",
      pos: pos?._id,
    },
    { skip: !pos }
  );

  const { data: subCategoryItems, isLoading: subCategoryLoading } =
    useGetCategoriesQuery(
      { type: "sub", pos: pos?._id, parent: product.category },
      {
        skip: !pos?._id || !product.category,
      }
    );

  const { data: subSubCategoryItems, isLoading: subSubCategoryLoading } =
    useGetCategoriesQuery(
      { type: "subsub", pos: pos?._id, parent: product.subCategory },
      {
        skip: !pos?._id || !product.subCategory,
      }
    );

  const { data: brandItems, isLoading: brandLoading } = useGetAllBrandsQuery(
    {
      posId: pos?._id,
    },
    {
      skip: !pos?._id,
    }
  );
  const { data: unitItems, isLoading: unitLoading } = useGetUnitsQuery(
    {
      posId: pos?._id,
    },
    {
      skip: !pos?._id,
    }
  );
  const { data: wareHouseData, isLoading: wareHouseLoading } =
    useGetWareHousesQuery(pos?._id, {
      skip: !pos?._id,
    });
  const { data: variantItems, isLoading: variantLoading } = useGetVariantsQuery(
    { search: "", status: "", date: "", sort: "", pos: pos?._id },
    {
      skip: !pos?._id,
    }
  );

  const renderCollapseTooltip = (props) => (
    <Tooltip id="refresh-tooltip" {...props}>
      Collapse
    </Tooltip>
  );

  const sellingtype = [
    { value: "choose", label: "Choose" },
    { value: "transactionalSelling", label: "Transactional selling" },
    { value: "solutionSelling", label: "Solution selling" },
  ];
  const barcodesymbol = [
    { value: "choose", label: "Choose" },
    { value: "code34", label: "Code34" },
    { value: "code35", label: "Code35" },
    { value: "code36", label: "Code36" },
  ];
  const taxtype = [
    { value: "exclusive", label: "Exclusive" },
    { value: "salesTax", label: "Sales Tax" },
  ];

  const discounttype = [
    { value: "choose", label: "Choose" },
    { value: "percentage", label: "Percentage" },
    { value: "cash", label: "Cash" },
  ];

  useEffect(() => {
    if (posItems) {
      setStore(posItems);
    }
  }, [posItems]);
  useEffect(() => {
    // parent category
    if (mainCategoryItems?.data?.length > 0 && !isLoading) {
      const formatted = [
        { value: "choose", label: "Choose" },
        ...mainCategoryItems.data.map((item) => ({
          value: item._id,
          label: item.name,
        })),
      ];
      setCategory(formatted);
    }
    // sub category
    if (subCategoryItems?.data?.length > 0 && !subCategoryLoading) {
      const formatted = [
        { value: "choose", label: "Choose" },
        ...subCategoryItems.data.map((item) => ({
          value: item._id,
          label: item.name,
        })),
      ];
      setSubCategory(formatted);
    } else {
      setSubCategory([]);
    }
    // sub sub category
    if (subSubCategoryItems?.data?.length > 0 && !subSubCategoryLoading) {
      const formatted = [
        { value: "choose", label: "Choose" },
        ...subSubCategoryItems.data.map((item) => ({
          value: item._id,
          label: item.name,
        })),
      ];
      setSubSubCategory(formatted);
    } else {
      setSubSubCategory([]);
    }

    if (unitItems?.data?.length > 0 && !unitLoading) {
      const formatted = [
        { value: "choose", label: "Choose" },
        ...unitItems.data.map((item) => ({
          value: item._id,
          label: item.name,
          name: item.name,
        })),
      ];
      setUnit(formatted);
    }
    if (brandItems?.data?.length > 0 && !brandLoading) {
      const formatted = [
        { value: "choose", label: "Choose" },
        ...brandItems.data.map((item) => ({
          value: item._id,
          label: item.name,
          name: item.name,
        })),
      ];
      setBrand(formatted);
    }
    if (wareHouseData?.data?.length > 0 && !wareHouseLoading) {
      const formatted = [
        ...wareHouseData.data.map((item) => ({
          value: item._id,
          label: item.label,
          name: item.label,
        })),
      ];
      setWarehouse(formatted);
    }
    if (variantItems?.variants?.length > 0 && !variantLoading) {
      const allValues = variantItems.variants.flatMap((v) => v.values);
      setVariant(allValues);
    }
  }, [
    mainCategoryItems,
    isLoading,
    subCategoryLoading,
    subCategoryItems,
    subSubCategoryItems,
    subSubCategoryLoading,
    unitItems,
    unitLoading,
    brandLoading,
    brandItems,
    wareHouseLoading,
    wareHouseData,
    variantLoading,
    variantItems,
  ]);
  return (
    <div className="page-wrapper">
      <div className="content">
        <div className="page-header">
          <div className="add-item d-flex">
            <div className="page-title">
              <h4>New Product</h4>
              <h6>Create new product</h6>
            </div>
          </div>
          <ul className="table-top-head">
            <li>
              <div className="page-btn">
                <Link to={route.productlist} className="btn btn-secondary">
                  <ArrowLeft className="me-2" />
                  Back to Product
                </Link>
              </div>
            </li>
            <li>
              <OverlayTrigger placement="top" overlay={renderCollapseTooltip}>
                <Link
                  data-bs-toggle="tooltip"
                  data-bs-placement="top"
                  title="Collapse"
                  id="collapse-header"
                  className={data ? "active" : ""}
                  onClick={() => {
                    dispatch(setToogleHeader(!data));
                  }}
                >
                  <ChevronUp className="feather-chevron-up" />
                </Link>
              </OverlayTrigger>
            </li>
          </ul>
        </div>
        {/* /add */}
        <form onSubmit={handleFromSubmit}>
          <div className="card">
            <div className="card-body add-product pb-0">
              <div
                className="accordion-card-one accordion"
                id="accordionExample"
              >
                <div className="accordion-item">
                  <div className="accordion-header" id="headingOne">
                    <div
                      className="accordion-button"
                      data-bs-toggle="collapse"
                      data-bs-target="#collapseOne"
                      aria-controls="collapseOne"
                    >
                      <div className="addproduct-icon">
                        <h5>
                          <Info className="add-info" />

                          <span>Product Information</span>
                        </h5>
                        <Link to="#">
                          <ChevronDown className="chevron-down-add" />
                        </Link>
                      </div>
                    </div>
                  </div>
                  <div
                    id="collapseOne"
                    className="accordion-collapse collapse show"
                    aria-labelledby="headingOne"
                    data-bs-parent="#accordionExample"
                  >
                    <div className="accordion-body">
                      <div className="row">
                        <div className="col-lg-4 col-sm-6 col-12">
                          <div className="mb-3 add-product">
                            <label className="form-label">Store</label>
                            <select
                              className="form-control"
                              name="store"
                              value={product.store}
                              onChange={handleInputChange}
                            >
                              <option value="" disabled>
                                Choose
                              </option>
                              {store.map((item) => (
                                <option key={item?._id} value={item?._id}>
                                  {item.label}
                                </option>
                              ))}
                            </select>
                          </div>
                        </div>
                        <div className="col-lg-4 col-sm-6 col-12">
                          <div className="mb-3 add-product">
                            <label className="form-label">Warehouse</label>
                            <Select
                              className="select"
                              options={warehouse}
                              placeholder="Choose"
                              value={warehouse.find(
                                (option) => option.value === product.warehouse
                              )}
                              onChange={(option) =>
                                handleSelectChange("warehouse", option)
                              }
                            />
                          </div>
                        </div>
                      </div>
                      <div className="row">
                        <div className="col-lg-4 col-sm-6 col-12">
                          <div className="mb-3 add-product">
                            <label className="form-label">Product Name</label>
                            <input
                              type="text"
                              name="productName"
                              className="form-control"
                              value={product.productName}
                              onChange={handleInputChange}
                            />
                          </div>
                        </div>
                        <div className="col-lg-4 col-sm-6 col-12">
                          <div className="mb-3 add-product">
                            <label className="form-label">Slug</label>
                            <input
                              type="text"
                              name="slug"
                              className="form-control"
                              value={product.slug}
                              onChange={handleInputChange}
                            />
                          </div>
                        </div>
                        <div className="col-lg-4 col-sm-6 col-12">
                          <div className="input-blocks add-product list">
                            <label>SKU</label>
                            <input
                              type="text"
                              name="sku"
                              className="form-control list"
                              placeholder="Enter SKU"
                              value={product.sku}
                              onChange={handleInputChange}
                            />
                            <Link
                              to={route.addproduct}
                              className="btn btn-primaryadd"
                            >
                              Generate Code
                            </Link>
                          </div>
                        </div>
                      </div>
                      <div className="addservice-info">
                        <div className="row">
                          <div className="col-lg-4 col-sm-6 col-12">
                            <div className="mb-3 add-product">
                              <div className="add-newplus">
                                <label className="form-label">Category</label>
                                <Link
                                  to="#"
                                  data-bs-toggle="modal"
                                  data-bs-target="#add-units-category"
                                >
                                  <PlusCircle className="plus-down-add" />
                                  <span>Add New</span>
                                </Link>
                              </div>

                              <Select
                                className="select"
                                options={category}
                                placeholder="Choose"
                                value={category.find(
                                  (option) => option.value === product.category
                                )}
                                onChange={(option) => {
                                  handleSelectChange("category", option);
                                  setProduct((prev) => ({
                                    ...prev,
                                    subCategory: "",
                                    subSubCategory: "",
                                  }));
                                }}
                              />
                            </div>
                          </div>
                          <div className="col-lg-4 col-sm-6 col-12">
                            <div className="mb-3 add-product">
                              <label className="form-label">Sub Category</label>
                              <Select
                                className="select"
                                options={subCategory}
                                placeholder="Choose"
                                value={subCategory.find(
                                  (option) =>
                                    option.value === product.subCategory
                                )}
                                onChange={(option) => {
                                  handleSelectChange("subCategory", option);
                                  setProduct((prev) => ({
                                    ...prev,
                                    subSubCategory: "",
                                  }));
                                }}
                              />
                            </div>
                          </div>
                          <div className="col-lg-4 col-sm-6 col-12">
                            <div className="mb-3 add-product">
                              <label className="form-label">
                                Sub Sub Category
                              </label>
                              <Select
                                className="select"
                                options={subSubCategory}
                                placeholder="Choose"
                                value={subSubCategory.find(
                                  (option) =>
                                    option.value === product.subSubCategory
                                )}
                                onChange={(option) =>
                                  handleSelectChange("subSubCategory", option)
                                }
                              />
                            </div>
                          </div>
                        </div>
                      </div>
                      <div className="add-product-new">
                        <div className="row">
                          <div className="col-lg-4 col-sm-6 col-12">
                            <div className="mb-3 add-product">
                              <div className="add-newplus">
                                <label className="form-label">Brand</label>
                                <Link
                                  to="#"
                                  data-bs-toggle="modal"
                                  data-bs-target="#add-units-brand"
                                >
                                  <PlusCircle className="plus-down-add" />
                                  <span>Add New</span>
                                </Link>
                              </div>
                              <Select
                                className="select"
                                options={brand}
                                placeholder="Choose"
                                value={brand.find(
                                  (option) => option.value === product.brand
                                )}
                                onChange={(option) => {
                                  handleSelectChange("brand", option);
                                }}
                              />
                            </div>
                          </div>
                          <div className="col-lg-4 col-sm-6 col-12">
                            <div className="mb-3 add-product">
                              <div className="add-newplus">
                                <label className="form-label">Unit</label>
                                <Link
                                  to="#"
                                  data-bs-toggle="modal"
                                  data-bs-target="#add-unit"
                                >
                                  <PlusCircle className="plus-down-add" />
                                  <span>Add New</span>
                                </Link>
                              </div>
                              <Select
                                className="select"
                                options={unit}
                                placeholder="Choose"
                                value={unit.find(
                                  (option) => option.value === product.unit
                                )}
                                onChange={(option) => {
                                  handleSelectChange("unit", option);
                                }}
                              />
                            </div>
                          </div>
                          <div className="col-lg-4 col-sm-6 col-12">
                            <div className="mb-3 add-product">
                              <label className="form-label">Selling Type</label>
                              <Select
                                className="select"
                                options={sellingtype}
                                placeholder="Choose"
                                value={sellingtype.find(
                                  (option) =>
                                    option.value === product.sellingType
                                )}
                                onChange={(option) => {
                                  handleSelectChange("sellingType", option);
                                }}
                              />
                            </div>
                          </div>
                        </div>
                      </div>
                      <div className="row">
                        <div className="col-lg-6 col-sm-6 col-12">
                          <div className="mb-3 add-product">
                            <label className="form-label">
                              Barcode Symbology
                            </label>
                            <Select
                              className="select"
                              options={barcodesymbol}
                              placeholder="Choose"
                              value={barcodesymbol.find(
                                (option) =>
                                  option.value === product.barCodeSymbology
                              )}
                              onChange={(option) => {
                                handleSelectChange("barCodeSymbology", option);
                              }}
                            />
                          </div>
                        </div>
                        <div className="col-lg-6 col-sm-6 col-12">
                          <div className="input-blocks add-product list">
                            <label>Item Code</label>
                            <input
                              type="text"
                              name="itemCode"
                              className="form-control list"
                              placeholder="Please Enter Item Code"
                              value={product.itemCode}
                              onChange={handleInputChange}
                            />
                            <Link
                              to={route.addproduct}
                              className="btn btn-primaryadd"
                            >
                              Generate Code
                            </Link>
                          </div>
                        </div>
                      </div>
                      {/* Editor */}
                      <div className="col-lg-12">
                        <div className="input-blocks summer-description-box transfer mb-3">
                          <label>Description</label>
                          <textarea
                            className="form-control h-100"
                            name="descriptions"
                            rows={5}
                            placeholder="Please Enter Description"
                            value={product.descriptions}
                            onChange={handleInputChange}
                          />
                          <p className="mt-1">Maximum 60 Characters</p>
                        </div>
                      </div>
                      {/* /Editor */}
                    </div>
                  </div>
                </div>
              </div>
              <div
                className="accordion-card-one accordion"
                id="accordionExample2"
              >
                <div className="accordion-item">
                  <div className="accordion-header" id="headingTwo">
                    <div
                      className="accordion-button"
                      data-bs-toggle="collapse"
                      data-bs-target="#collapseTwo"
                      aria-controls="collapseTwo"
                    >
                      <div className="text-editor add-list">
                        <div className="addproduct-icon list icon">
                          <h5>
                            <LifeBuoy className="add-info" />
                            <span>Pricing &amp; Stocks</span>
                          </h5>
                          <Link to="#">
                            <ChevronDown className="chevron-down-add" />
                          </Link>
                        </div>
                      </div>
                    </div>
                  </div>
                  <div
                    id="collapseTwo"
                    className="accordion-collapse collapse show"
                    aria-labelledby="headingTwo"
                    data-bs-parent="#accordionExample2"
                  >
                    <div className="accordion-body">
                      <div className="input-blocks add-products">
                        <label className="d-block">Product Type</label>
                        <div className="single-pill-product">
                          <ul
                            className="nav nav-pills"
                            id="pills-tab1"
                            role="tablist"
                          >
                            <li className="nav-item" role="presentation">
                              <span
                                className="custom_radio me-4 mb-0 active"
                                id="pills-home-tab"
                                data-bs-toggle="pill"
                                data-bs-target="#pills-home"
                                role="tab"
                                aria-controls="pills-home"
                                aria-selected="true"
                              >
                                <input
                                  type="radio"
                                  className="form-control"
                                  name="payment"
                                />
                                <span className="checkmark" /> Single Product
                              </span>
                            </li>
                            <li className="nav-item" role="presentation">
                              <span
                                className="custom_radio me-2 mb-0"
                                id="pills-profile-tab"
                                data-bs-toggle="pill"
                                data-bs-target="#pills-profile"
                                role="tab"
                                aria-controls="pills-profile"
                                aria-selected="false"
                              >
                                <input
                                  type="radio"
                                  className="form-control"
                                  name="sign"
                                />
                                <span className="checkmark" /> Variable Product
                              </span>
                            </li>
                          </ul>
                        </div>
                      </div>
                      <div className="tab-content" id="pills-tabContent">
                        <div
                          className="tab-pane fade show active"
                          id="pills-home"
                          role="tabpanel"
                          aria-labelledby="pills-home-tab"
                        >
                          <div className="row">
                            <div className="col-lg-3 col-sm-6 col-12">
                              <div className="input-blocks add-product">
                                <label>Price</label>
                                <input
                                  type="text"
                                  name="price"
                                  className="form-control"
                                  onChange={handleInputChange}
                                  value={product.price}
                                />
                              </div>
                            </div>
                            {/*  */}
                            <div className="col-lg-3 col-sm-6 col-12">
                              <div className="input-blocks add-product">
                                <label>Parchace Price</label>
                                <input
                                  type="text"
                                  name="parchacePrice"
                                  className="form-control"
                                  onChange={handleInputChange}
                                  value={product.parchacePrice}
                                />
                              </div>
                            </div>
                            {/*  */}
                            <div className="col-lg-3 col-sm-6 col-12">
                              <div className="input-blocks add-product">
                                <label>Discount Value</label>
                                <input
                                  type="text"
                                  name="discountValue"
                                  placeholder="Choose"
                                  className="form-control"
                                  onChange={handleInputChange}
                                  value={product.discountValue}
                                />
                              </div>
                            </div>
                            <div className="col-lg-3 col-sm-6 col-12">
                              <div className="input-blocks add-product">
                                <label>Tax Type</label>
                                <Select
                                  className="select"
                                  options={taxtype}
                                  placeholder="Select Option"
                                  value={taxtype.find(
                                    (option) => option.value === product.taxType
                                  )}
                                  onChange={(option) => {
                                    handleSelectChange("taxType", option);
                                  }}
                                />
                              </div>
                            </div>
                          </div>
                          <div className="row"></div>
                          <div
                            className="accordion-card-one accordion"
                            id="accordionExample3"
                          >
                            <div className="accordion-item">
                              <div
                                className="accordion-header"
                                id="headingThree"
                              >
                                <div
                                  className="accordion-button"
                                  data-bs-toggle="collapse"
                                  data-bs-target="#collapseThree"
                                  aria-controls="collapseThree"
                                >
                                  <div className="addproduct-icon list">
                                    <h5>
                                      <i
                                        data-feather="image"
                                        className="add-info"
                                      />
                                      <span>Images</span>
                                    </h5>
                                    <Link to="#">
                                      <ChevronDown className="chevron-down-add" />
                                    </Link>
                                  </div>
                                </div>
                              </div>
                              <div
                                id="collapseThree"
                                className="accordion-collapse collapse show"
                                aria-labelledby="headingThree"
                                data-bs-parent="#accordionExample3"
                              >
                                <div className="accordion-body">
                                  <div className="text-editor add-list add">
                                    <div className="col-lg-12">
                                      <div className="add-choosen">
                                        <div className="input-blocks">
                                          <div className="image-upload">
                                            <input
                                              type="file"
                                              multiple
                                              onChange={handleImageUpload}
                                            />
                                            <div className="image-uploads">
                                              <PlusCircle className="plus-down-add me-0" />
                                              <h4>Add Images</h4>
                                            </div>
                                          </div>
                                        </div>
                                        {product.images.map((img, index) => (
                                          <div
                                            className="phone-img"
                                            key={index}
                                          >
                                            <ImageWithBasePath
                                              src={img.url}
                                              alt="image"
                                              isBase={true}
                                              height={100}
                                              width={100}
                                            />
                                            <Link to="#">
                                              <X
                                                className="x-square-add remove-product"
                                                onClick={() =>
                                                  handleRemoveImage(index)
                                                }
                                              />
                                            </Link>
                                          </div>
                                        ))}
                                      </div>
                                    </div>
                                  </div>
                                </div>
                              </div>
                            </div>
                          </div>
                        </div>
                        <div
                          className="tab-pane fade"
                          id="pills-profile"
                          role="tabpanel"
                          aria-labelledby="pills-profile-tab"
                        >
                          <div className="row select-color-add">
                            <div className="col-lg-4 col-sm-6 col-12">
                              <div className="input-blocks add-product">
                                <label>Variant Attribute</label>
                                <div className="row">
                                  <div className="col-lg-10 col-sm-10 col-10">
                                    <select
                                      className="border p-2 rounded w-full"
                                      name="variantAttribute"
                                      value={product.variantAttribute}
                                      onChange={handleInputChange}
                                    >
                                      {variant.map((value, index) => (
                                        <option key={index} value={value}>
                                          {value}
                                        </option>
                                      ))}
                                    </select>
                                  </div>
                                </div>
                              </div>
                              <div
                                className="selected-hide-color"
                                id="input-show"
                              >
                                <div className="row align-items-center">
                                  <div className="col-sm-10">
                                    <div className="input-blocks">
                                      <input
                                        className="input-tags form-control"
                                        id="inputBox"
                                        type="text"
                                        data-role="tagsinput"
                                        name="variantValues"
                                        value={product.variantValues}
                                        onChange={handleInputChange}
                                      />
                                    </div>
                                  </div>
                                  <div className="col-lg-2">
                                    <div className="input-blocks ">
                                      <Link to="#" className="remove-color">
                                        <Trash2 />
                                      </Link>
                                    </div>
                                  </div>
                                </div>
                              </div>
                            </div>
                          </div>
                          <div
                            className="modal-body-table variant-table"
                            id="variant-table"
                          >
                            <div className="table-responsive">
                              <table className="table">
                                <thead>
                                  <tr>
                                    <th>Variantion</th>
                                    <th>Variant Value</th>
                                    <th>SKU</th>
                                    <th>Quantity</th>
                                    <th>Price</th>
                                    <th className="no-sort">Action</th>
                                  </tr>
                                </thead>
                                <tbody>
                                  <tr>
                                    <td>
                                      <div className="add-product">
                                        <input
                                          type="text"
                                          className="form-control"
                                          defaultValue="color"
                                        />
                                      </div>
                                    </td>
                                    <td>
                                      <div className="add-product">
                                        <input
                                          type="text"
                                          className="form-control"
                                          defaultValue="red"
                                        />
                                      </div>
                                    </td>
                                    <td>
                                      <div className="add-product">
                                        <input
                                          type="text"
                                          className="form-control"
                                          defaultValue={1234}
                                        />
                                      </div>
                                    </td>
                                    <td>
                                      <div className="product-quantity">
                                        <span className="quantity-btn">
                                          <i
                                            data-feather="minus-circle"
                                            className="feather-search"
                                          />
                                        </span>
                                        <input
                                          type="text"
                                          className="quntity-input"
                                          defaultValue={2}
                                        />
                                        <span className="quantity-btn">
                                          +
                                          <i
                                            data-feather="plus-circle"
                                            className="plus-circle"
                                          />
                                        </span>
                                      </div>
                                    </td>
                                    <td>
                                      <div className="add-product">
                                        <input
                                          type="text"
                                          className="form-control"
                                          defaultValue={50000}
                                        />
                                      </div>
                                    </td>
                                    <td className="action-table-data">
                                      <div className="edit-delete-action">
                                        <div className="input-block add-lists">
                                          <label className="checkboxs">
                                            <input
                                              type="checkbox"
                                              defaultChecked=""
                                            />
                                            <span className="checkmarks" />
                                          </label>
                                        </div>
                                        <Link
                                          className="me-2 p-2"
                                          to="#"
                                          data-bs-toggle="modal"
                                          data-bs-target="#add-variation"
                                        >
                                          <i
                                            data-feather="plus"
                                            className="feather-edit"
                                          />
                                        </Link>
                                        <Link
                                          className="confirm-text p-2"
                                          to="#"
                                        >
                                          <i
                                            data-feather="trash-2"
                                            className="feather-trash-2"
                                          />
                                        </Link>
                                      </div>
                                    </td>
                                  </tr>
                                  <tr>
                                    <td>
                                      <div className="add-product">
                                        <input
                                          type="text"
                                          className="form-control"
                                          defaultValue="color"
                                        />
                                      </div>
                                    </td>
                                    <td>
                                      <div className="add-product">
                                        <input
                                          type="text"
                                          className="form-control"
                                          defaultValue="black"
                                        />
                                      </div>
                                    </td>
                                    <td>
                                      <div className="add-product">
                                        <input
                                          type="text"
                                          className="form-control"
                                          defaultValue={2345}
                                        />
                                      </div>
                                    </td>
                                    <td>
                                      <div className="product-quantity">
                                        <span className="quantity-btn">
                                          <i
                                            data-feather="minus-circle"
                                            className="feather-search"
                                          />
                                        </span>
                                        <input
                                          type="text"
                                          className="quntity-input"
                                          defaultValue={3}
                                        />
                                        <span className="quantity-btn">
                                          +
                                          <i
                                            data-feather="plus-circle"
                                            className="plus-circle"
                                          />
                                        </span>
                                      </div>
                                    </td>
                                    <td>
                                      <div className="add-product">
                                        <input
                                          type="text"
                                          className="form-control"
                                          defaultValue={50000}
                                        />
                                      </div>
                                    </td>
                                    <td className="action-table-data">
                                      <div className="edit-delete-action">
                                        <div className="input-block add-lists">
                                          <label className="checkboxs">
                                            <input
                                              type="checkbox"
                                              defaultChecked=""
                                            />
                                            <span className="checkmarks" />
                                          </label>
                                        </div>
                                        <Link
                                          className="me-2 p-2"
                                          to="#"
                                          data-bs-toggle="modal"
                                          data-bs-target="#edit-units"
                                        >
                                          <i
                                            data-feather="plus"
                                            className="feather-edit"
                                          />
                                        </Link>
                                        <Link
                                          className="confirm-text p-2"
                                          to="#"
                                        >
                                          <i
                                            data-feather="trash-2"
                                            className="feather-trash-2"
                                          />
                                        </Link>
                                      </div>
                                    </td>
                                  </tr>
                                </tbody>
                              </table>
                            </div>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
              <div
                className="accordion-card-one accordion"
                id="accordionExample4"
              >
                <div className="accordion-item">
                  <div className="accordion-header" id="headingFour">
                    <div
                      className="accordion-button"
                      data-bs-toggle="collapse"
                      data-bs-target="#collapseFour"
                      aria-controls="collapseFour"
                    >
                      <div className="text-editor add-list">
                        <div className="addproduct-icon list">
                          <h5>
                            <List className="add-info" />
                            <span>Custom Fields</span>
                          </h5>
                          <Link to="#">
                            <ChevronDown className="chevron-down-add" />
                          </Link>
                        </div>
                      </div>
                    </div>
                  </div>
                  <div
                    id="collapseFour"
                    className="accordion-collapse collapse show"
                    aria-labelledby="headingFour"
                    data-bs-parent="#accordionExample4"
                  >
                    <div className="accordion-body">
                      <div className="text-editor add-list add">
                        <div className="custom-filed">
                          <div className="input-block add-lists">
                            <label className="checkboxs">
                              <input
                                type="checkbox"
                                name="warranties"
                                checked={product.warranties}
                                onChange={handleCheckboxChange}
                              />
                              <span className="checkmarks" />
                              Warranties
                            </label>
                            <label className="checkboxs">
                              <input
                                type="checkbox"
                                name="manufacturer"
                                checked={product.manufacturer}
                                onChange={handleCheckboxChange}
                              />
                              <span className="checkmarks" />
                              Manufacturer
                            </label>
                            <label className="checkboxs">
                              <input
                                type="checkbox"
                                name="expiry"
                                checked={product.expiry}
                                onChange={handleCheckboxChange}
                              />
                              <span className="checkmarks" />
                              Expiry
                            </label>
                          </div>
                        </div>
                        <div className="row">
                          <div className="col-lg-4 col-sm-6 col-12">
                            <div className="input-blocks add-product">
                              <label>Discount Type</label>
                              <Select
                                className="select"
                                options={discounttype}
                                placeholder="Choose"
                                value={discounttype.find(
                                  (option) =>
                                    option.value === product.discountType
                                )}
                                onChange={(option) =>
                                  handleSelectChange("discountType", option)
                                }
                              />
                            </div>
                          </div>
                        </div>
                        <div className="row">
                          <div className="col-lg-4 col-sm-6 col-12">
                            <div className="input-blocks add-product">
                              <label>Quantity Alert</label>
                              <input
                                type="text"
                                name="quantityAlert"
                                value={product.quantityAlert}
                                onChange={handleInputChange}
                                className="form-control"
                              />
                            </div>
                          </div>
                          <div className="col-lg-4 col-sm-6 col-12">
                            <div className="input-blocks">
                              <label>Manufactured Date</label>
                              <div className="input-groupicon calender-input">
                                <Calendar className="info-img" />
                                <DatePicker
                                  selected={product.manufactureDate}
                                  onChange={(date) =>
                                    handleDateChange("manufactureDate", date)
                                  }
                                  type="date"
                                  className="datetimepicker"
                                  dateFormat="dd-MM-yyyy"
                                  placeholder="Choose Date"
                                />
                              </div>
                            </div>
                          </div>
                          <div className="col-lg-4 col-sm-6 col-12">
                            <div className="input-blocks">
                              <label>Expiry On</label>
                              <div className="input-groupicon calender-input">
                                <Calendar className="info-img" />
                                <DatePicker
                                  selected={product.expiryDate}
                                  onChange={(date) =>
                                    handleDateChange("expiryDate", date)
                                  }
                                  type="date"
                                  className="datetimepicker"
                                  dateFormat="dd-MM-yyyy"
                                  placeholder="Choose Date"
                                />
                              </div>
                            </div>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
          <div className="col-lg-12">
            <div className="btn-addproduct mb-4">
              <button type="button" className="btn btn-cancel me-2">
                Cancel
              </button>
              <button type="submit" className="btn btn-submit">
                Save Product
              </button>
            </div>
          </div>
        </form>
        {/* /add */}
      </div>
      <Addunits />
      <AddCategory />
      <AddBrand />
    </div>
  );
};

export default AddProduct;
