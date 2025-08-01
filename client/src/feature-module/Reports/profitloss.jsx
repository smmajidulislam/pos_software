import React, { useState } from "react";
import DateRangePicker from "react-bootstrap-daterangepicker";
import { DatePicker } from "antd";
import Breadcrumbs from "../../core/breadcrumbs";
import { useGetProfitAndLossReportQuery } from "../../core/redux/api/sellsInvoice/sellInvoice";

const ProfitLoss = () => {
  const [selectedDate, setSelectedDate] = useState(new Date());
  const {
    data: profitAnsLossData,
    isLoading,
    error,
  } = useGetProfitAndLossReportQuery();

  const handleDateChange = (date) => {
    setSelectedDate(date);
  };

  const initialSettings = {
    endDate: new Date("2020-08-11T12:30:00.000Z"),
    ranges: {
      "Last 30 Days": [
        new Date("2020-07-12T04:57:17.076Z"),
        new Date("2020-08-10T04:57:17.076Z"),
      ],
      "Last 7 Days": [
        new Date("2020-08-04T04:57:17.076Z"),
        new Date("2020-08-10T04:57:17.076Z"),
      ],
      "Last Month": [
        new Date("2020-06-30T18:30:00.000Z"),
        new Date("2020-07-31T18:29:59.999Z"),
      ],
      "This Month": [
        new Date("2020-07-31T18:30:00.000Z"),
        new Date("2020-08-31T18:29:59.999Z"),
      ],
      Today: [
        new Date("2020-08-10T04:57:17.076Z"),
        new Date("2020-08-10T04:57:17.076Z"),
      ],
      Yesterday: [
        new Date("2020-08-09T04:57:17.076Z"),
        new Date("2020-08-09T04:57:17.076Z"),
      ],
    },
    startDate: new Date("2020-08-04T04:57:17.076Z"),
    timePicker: false,
  };

  const months = profitAnsLossData?.data?.map((item) => item.month) || [];

  const getRowData = (field) =>
    profitAnsLossData?.data?.map(
      (item) =>
        `$${parseFloat(item[field] || 0).toLocaleString("en-US", {
          minimumFractionDigits: 2,
        })}`
    ) || [];

  return (
    <div className="page-wrapper">
      <div className="content">
        <Breadcrumbs
          maintitle="Profit & Loss Report"
          subtitle="Manage Your Profit & Loss Report"
        />

        <div className="card table-list-card border-0 mb-0">
          <div className="card-body mb-3">
            <div className="table-top mb-0 profit-table-top">
              <div className="search-path profit-head">
                <div className="input-blocks mb-0">
                  <i data-feather="calendar" className="info-img" />
                  <div className="input-groupicon">
                    <DatePicker
                      selected={selectedDate}
                      onChange={handleDateChange}
                      className="form-control floating datetimepicker"
                      type="date"
                      dateFormat="dd-MM-yyyy"
                    />
                  </div>
                </div>
              </div>
              <div className="position-relative daterange-wraper input-blocks mb-0">
                <DateRangePicker initialSettings={initialSettings}>
                  <input
                    className="form-control col-4 input-range"
                    type="text"
                    style={{ border: "none" }}
                  />
                </DateRangePicker>
              </div>
              <div className="date-btn">
                <button className="btn btn-secondary d-flex align-items-center">
                  <i
                    data-feather="database"
                    className="feather-14 info-img me-2"
                  />
                  Display Date
                </button>
              </div>
            </div>
          </div>
        </div>

        {isLoading ? (
          <p>Loading...</p>
        ) : error ? (
          <p>Error fetching data.</p>
        ) : (
          <div className="table-responsive">
            <table className="table profit-table">
              <thead className="profit-table-bg">
                <tr>
                  <th></th>
                  {months.map((m, idx) => (
                    <th key={idx}>{m}</th>
                  ))}
                </tr>
              </thead>
              <tbody>
                <tr className="table-heading">
                  <td>Income</td>
                  {months.map((_, idx) => (
                    <td key={idx}></td>
                  ))}
                </tr>
                <tr>
                  <td>Sales</td>
                  {getRowData("sales").map((val, idx) => (
                    <td key={idx}>{val}</td>
                  ))}
                </tr>
                <tr>
                  <td>Service</td>
                  {getRowData("service").map((val, idx) => (
                    <td key={idx}>{val}</td>
                  ))}
                </tr>
                <tr>
                  <td>Purchase Return</td>
                  {getRowData("purchaseReturn").map((val, idx) => (
                    <td key={idx}>{val}</td>
                  ))}
                </tr>
                <tr className="profit-table-bg">
                  <td>Gross Profit</td>
                  {getRowData("grossProfit").map((val, idx) => (
                    <td key={idx}>{val}</td>
                  ))}
                </tr>
                <tr className="table-heading">
                  <td>Expenses</td>
                  {months.map((_, idx) => (
                    <td key={idx}></td>
                  ))}
                </tr>
                <tr>
                  <td>Sales</td>
                  {getRowData("sales").map((val, idx) => (
                    <td key={idx}>{val}</td>
                  ))}
                </tr>
                <tr>
                  <td>Purchase</td>
                  {getRowData("purchase").map((val, idx) => (
                    <td key={idx}>{val}</td>
                  ))}
                </tr>
                <tr>
                  <td>Sales Return</td>
                  {getRowData("salesReturn").map((val, idx) => (
                    <td key={idx}>{val}</td>
                  ))}
                </tr>
                <tr className="profit-table-bg">
                  <td>Total Expense</td>
                  {getRowData("totalExpense").map((val, idx) => (
                    <td key={idx}>{val}</td>
                  ))}
                </tr>
                <tr className="profit-table-bg">
                  <td>Net Profit</td>
                  {getRowData("netProfit").map((val, idx) => (
                    <td key={idx}>{val}</td>
                  ))}
                </tr>
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  );
};

export default ProfitLoss;
