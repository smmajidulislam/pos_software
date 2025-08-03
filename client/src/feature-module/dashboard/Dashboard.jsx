import React, { useEffect, useState } from "react";
import CountUp from "react-countup";
import {
  File,
  User,
  UserCheck,
} from "feather-icons-react/build/IconComponents";
import Chart from "react-apexcharts";
import { Link } from "react-router-dom";
import ImageWithBasePath from "../../core/img/imagewithbasebath";
import { ArrowRight } from "react-feather";
import withReactContent from "sweetalert2-react-content";
import Swal from "sweetalert2";
import { useAuth } from "../../hooks/AuthProvider";
import { useGetHomepageQuery } from "../../core/redux/api/homepageApi/homepageApi";
import { usePos } from "../../hooks/PosProvider";

const Dashboard = () => {
  const { data: homepageData, isLoading: homepageLoading } =
    useGetHomepageQuery();
  const [chartOptions, setChartOptions] = useState({
    series: [
      {
        name: "Sales",
        data: [130, 210, 300, 290, 150, 50, 210, 280, 105],
      },
      {
        name: "Purchase",
        data: [-150, -90, -50, -180, -50, -70, -100, -90, -105],
      },
    ],
    colors: ["#28C76F", "#EA5455"],
    chart: {
      type: "bar",
      height: 320,
      stacked: true,
      zoom: {
        enabled: true,
      },
    },
    responsive: [
      {
        breakpoint: 280,
        options: {
          legend: {
            position: "bottom",
            offsetY: 0,
          },
        },
      },
    ],
    plotOptions: {
      bar: {
        horizontal: false,
        borderRadius: 4,
        borderRadiusApplication: "end", // "around" / "end"
        borderRadiusWhenStacked: "all", // "all"/"last"
        columnWidth: "20%",
      },
    },
    dataLabels: {
      enabled: false,
    },
    yaxis: {
      min: -200,
      max: 300,
      tickAmount: 5,
    },
    xaxis: {
      categories: [
        "Jan",
        "Feb",
        "Mar",
        "Apr",
        "May",
        "Jun",
        "Jul",
        "Aug",
        "Sep",
      ],
    },
    legend: { show: false },
    fill: {
      opacity: 1,
    },
  });
  const { pos, loading: posLoading } = usePos();
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
  const { user, loading } = useAuth();
  useEffect(() => {
    if (!user && loading === false) {
      window.location.href = "/signin-3";
    }
  }, [user, loading]);
  useEffect(() => {
    if (!homepageLoading && homepageData?.data?.[7]) {
      const { labels, sales, purchases } = homepageData.data[7];

      setChartOptions({
        series: [
          {
            name: "Sales",
            data: sales || [],
          },
          {
            name: "Purchase",
            data: purchases.map((p) => -Math.abs(p)) || [], // negative value
          },
        ],
        options: {
          colors: ["#28C76F", "#EA5455"],
          chart: {
            type: "bar",
            height: 320,
            stacked: true,
            zoom: { enabled: true },
          },
          responsive: [
            {
              breakpoint: 280,
              options: {
                legend: {
                  position: "bottom",
                  offsetY: 0,
                },
              },
            },
          ],
          plotOptions: {
            bar: {
              horizontal: false,
              borderRadius: 4,
              borderRadiusApplication: "end",
              borderRadiusWhenStacked: "all",
              columnWidth: "20%",
            },
          },
          dataLabels: { enabled: false },
          yaxis: {
            min: Math.min(...purchases.map((p) => -Math.abs(p)), 0),
            max: Math.max(...sales, 300),
            tickAmount: 5,
          },
          xaxis: {
            categories: labels || [],
          },
          legend: { show: false },
          fill: {
            opacity: 1,
          },
        },
      });
    }
    if (!pos?._id && !posLoading) {
      Swal.fire({
        title: "Please select a POS",
        text: "select your pos first or your pos will not work! if you dont have any pos please create one",
      });
    }
  }, [homepageData, homepageLoading, posLoading, pos?._id]);
  return (
    <div>
      <div className="page-wrapper">
        <div className="content">
          <div className="row">
            <div className="col-xl-3 col-sm-6 col-12 d-flex">
              <div className="dash-widget w-100">
                <div className="dash-widgetimg">
                  <span>
                    <ImageWithBasePath
                      src="assets/img/icons/dash1.svg"
                      alt="img"
                    />
                  </span>
                </div>
                <div className="dash-widgetcontent">
                  <h5>
                    {!homepageLoading && homepageData ? (
                      <CountUp
                        start={0}
                        end={
                          homepageData.data.find(
                            (item) => item.totalsPurchaceAndDue
                          )?.totalsPurchaceAndDue?.totalDue || 0
                        }
                        duration={3}
                      />
                    ) : (
                      "0"
                    )}
                  </h5>
                  <h6>Total Purchase Due</h6>
                </div>
              </div>
            </div>
            <div className="col-xl-3 col-sm-6 col-12 d-flex">
              <div className="dash-widget dash1 w-100">
                <div className="dash-widgetimg">
                  <span>
                    <ImageWithBasePath
                      src="assets/img/icons/dash2.svg"
                      alt="img"
                    />
                  </span>
                </div>
                <div className="dash-widgetcontent">
                  <h5>
                    {!homepageLoading && homepageData ? (
                      <CountUp
                        start={0}
                        end={
                          homepageData.data.find((item) => item.totalSalesDue)
                            ?.totalSalesDue || 0
                        }
                        duration={3}
                      />
                    ) : (
                      "0"
                    )}
                  </h5>
                  <h6>Total Sales Due</h6>
                </div>
              </div>
            </div>
            <div className="col-xl-3 col-sm-6 col-12 d-flex">
              <div className="dash-widget dash2 w-100">
                <div className="dash-widgetimg">
                  <span>
                    <ImageWithBasePath
                      src="assets/img/icons/dash3.svg"
                      alt="img"
                    />
                  </span>
                </div>
                <div className="dash-widgetcontent">
                  <h5>
                    {!homepageLoading && homepageData ? (
                      <CountUp
                        start={0}
                        end={
                          homepageData.data.find((item) => item.totalsales)
                            ?.totalsales || 0
                        }
                        duration={3}
                      />
                    ) : (
                      "0"
                    )}
                  </h5>
                  <h6>Total Sale Amount</h6>
                </div>
              </div>
            </div>
            <div className="col-xl-3 col-sm-6 col-12 d-flex">
              <div className="dash-widget dash3 w-100">
                <div className="dash-widgetimg">
                  <span>
                    <ImageWithBasePath
                      src="assets/img/icons/dash4.svg"
                      alt="img"
                    />
                  </span>
                </div>
                <div className="dash-widgetcontent">
                  <h5>
                    {!homepageLoading && homepageData ? (
                      <CountUp
                        start={0}
                        end={
                          homepageData.data.find((item) => item.totalsexpense)
                            ?.totalsexpense
                        }
                        duration={3}
                      />
                    ) : (
                      "0"
                    )}
                  </h5>
                  <h6>Total Expense Amount</h6>
                </div>
              </div>
            </div>
            <div className="col-xl-3 col-sm-6 col-12 d-flex">
              <div className="dash-count">
                <div className="dash-counts">
                  <h4>
                    {!homepageLoading && homepageData
                      ? homepageData.data.find(
                          (item) => item.customer !== undefined
                        )?.customer || "0"
                      : "0"}
                  </h4>
                  <h5>Customers</h5>
                </div>
                <div className="dash-imgs">
                  <User />
                </div>
              </div>
            </div>
            <div className="col-xl-3 col-sm-6 col-12 d-flex">
              <div className="dash-count das1">
                <div className="dash-counts">
                  <h4>
                    {" "}
                    {!homepageLoading && homepageData
                      ? homepageData.data.find(
                          (item) => item.supplier !== undefined
                        )?.supplier || "0"
                      : "0"}
                  </h4>
                  <h5>Suppliers</h5>
                </div>
                <div className="dash-imgs">
                  <UserCheck />
                </div>
              </div>
            </div>
            <div className="col-xl-3 col-sm-6 col-12 d-flex">
              <div className="dash-count das2">
                <div className="dash-counts">
                  <h4>
                    {!homepageLoading && homepageData
                      ? homepageData.data.find(
                          (item) => item.purchaseInvoice !== undefined
                        )?.purchaseInvoice || "0"
                      : "0"}
                  </h4>
                  <h5>Purchase Invoice</h5>
                </div>
                <div className="dash-imgs">
                  <ImageWithBasePath
                    src="assets/img/icons/file-text-icon-01.svg"
                    className="img-fluid"
                    alt="icon"
                  />
                </div>
              </div>
            </div>
            <div className="col-xl-3 col-sm-6 col-12 d-flex">
              <div className="dash-count das3">
                <div className="dash-counts">
                  <h4>
                    {" "}
                    {!homepageLoading && homepageData
                      ? homepageData.data.find(
                          (item) => item.salesInvoice !== undefined
                        )?.salesInvoice || "0"
                      : "0"}
                  </h4>
                  <h5>Sales Invoice</h5>
                </div>
                <div className="dash-imgs">
                  <File />
                </div>
              </div>
            </div>
          </div>
          {/* Button trigger modal */}

          <div className="row">
            <div className="col-xl-7 col-sm-12 col-12 d-flex">
              <div className="card flex-fill">
                <div className="card-header d-flex justify-content-between align-items-center">
                  <h5 className="card-title mb-0">Purchase &amp; Sales</h5>
                  <div className="graph-sets">
                    <ul className="mb-0">
                      <li>
                        <span>Sales</span>
                      </li>
                      <li>
                        <span>Purchase</span>
                      </li>
                    </ul>
                    <div className="dropdown dropdown-wraper">
                      <button
                        className="btn btn-light btn-sm dropdown-toggle"
                        type="button"
                        id="dropdownMenuButton"
                        data-bs-toggle="dropdown"
                        aria-expanded="false"
                      >
                        2023
                      </button>
                      <ul
                        className="dropdown-menu"
                        aria-labelledby="dropdownMenuButton"
                      >
                        <li>
                          <Link to="#" className="dropdown-item">
                            2023
                          </Link>
                        </li>
                        <li>
                          <Link to="#" className="dropdown-item">
                            2022
                          </Link>
                        </li>
                        <li>
                          <Link to="#" className="dropdown-item">
                            2021
                          </Link>
                        </li>
                      </ul>
                    </div>
                  </div>
                </div>
                <div className="card-body">
                  <div id="sales_charts" />
                  <Chart
                    options={chartOptions}
                    series={chartOptions.series}
                    type="bar"
                    height={320}
                  />
                </div>
              </div>
            </div>
            <div className="col-xl-5 col-sm-12 col-12 d-flex">
              <div className="card flex-fill default-cover mb-4">
                <div className="card-header d-flex justify-content-between align-items-center">
                  <h4 className="card-title mb-0">Recent Products</h4>
                  <div className="view-all-link">
                    <Link to="#" className="view-all d-flex align-items-center">
                      View All
                      <span className="ps-2 d-flex align-items-center">
                        <ArrowRight className="feather-16" />
                      </span>
                    </Link>
                  </div>
                </div>
                <div className="card-body">
                  <div className="table-responsive dataview">
                    <table className="table dashboard-recent-products">
                      <thead>
                        <tr>
                          <th>#</th>
                          <th>Products</th>
                          <th>Price</th>
                        </tr>
                      </thead>
                      <tbody>
                        {!homepageLoading &&
                          homepageData?.data &&
                          homepageData.data
                            .find((item) => item.recenctProduct)
                            ?.recenctProduct?.map((item, index) => (
                              <tr key={index}>
                                <td>{index + 1}</td>
                                <td className="productimgname">
                                  <Link className="product-img">
                                    <ImageWithBasePath
                                      src={item.images[0]?.url}
                                      alt="product"
                                      isBase={true}
                                    />
                                  </Link>
                                  <Link>{item.productName}</Link>
                                </td>
                                <td>{item.price || "N/A"}</td>
                              </tr>
                            ))}
                      </tbody>
                    </table>
                  </div>
                </div>
              </div>
            </div>
          </div>
          <div className="card">
            <div className="card-header">
              <h4 className="card-title">Expired Products</h4>
            </div>
            <div className="card-body">
              <div className="table-responsive dataview">
                <table className="table dashboard-expired-products">
                  <thead>
                    <tr>
                      <th>Product</th>
                      <th>SKU</th>
                      <th>Manufactured Date</th>
                      <th>Expired Date</th>
                      <th className="no-sort">Action</th>
                    </tr>
                  </thead>
                  <tbody>
                    {!homepageLoading &&
                      homepageData?.data &&
                      homepageData.data
                        .find((item) => item.recenctProduct)
                        ?.recenctProduct?.map((item, index) => (
                          <tr key={index}>
                            <td>
                              <div className="productimgname">
                                <Link to="#" className="product-img stock-img">
                                  <ImageWithBasePath
                                    src={item.images[0]?.url}
                                    isBase={true}
                                    alt="product"
                                  />
                                </Link>
                                <Link to="#">{item.productName} </Link>
                              </div>
                            </td>
                            <td>
                              <Link to="#">{item?.reference}</Link>
                            </td>
                            <td>
                              {new Date(
                                item?.manufactureDate
                              ).toLocaleDateString("en-GB", {
                                day: "2-digit",
                                month: "short",
                                year: "numeric",
                              })}
                            </td>

                            <td>
                              {new Date(item?.expiryDate).toLocaleDateString(
                                "en-GB",
                                {
                                  day: "2-digit",
                                  month: "short",
                                  year: "numeric",
                                }
                              )}
                            </td>

                            <td className="action-table-data">
                              <div className="edit-delete-action">
                                <Link className="me-2 p-2" to="#">
                                  <i
                                    data-feather="edit"
                                    className="feather-edit"
                                  />
                                </Link>
                                <Link
                                  className=" confirm-text p-2"
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
                        ))}
                  </tbody>
                </table>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;
