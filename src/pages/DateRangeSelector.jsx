import { TextField } from "@mui/material";
import React from "react";

const DateRangeSelector = ({
  startDate,
  endDate,
  onStartDateChange,
  onEndDateChange,
  startDateFilter,
  endDateFilter,
  onStartDateFilterChange,
  onEndDateFilterChange,
}) => {
  return (
    <>
      <div>
        {/* <label htmlFor="startDate">Start Date:</label> */}
        <input
          style={{ display: "none" }}
          type="date"
          id="startDate"
          value={startDate}
          onChange={(e) => onStartDateChange(e)}
        />

        {/* <label htmlFor="endDate">End Date:</label> */}
        <input
          style={{ display: "none" }}
          type="date"
          id="endDate"
          value={endDate}
          onChange={(e) => onEndDateChange(e)}
        />
      </div>
      <div style={{ display: "flex" }}>
        <div style={{ paddingRight: "1%", display: "flex" }}>
          <label htmlFor="startDateFilter">Start Date:</label>
          <input
            // style={{ paddingRight: "3%" }}
            type="date"
            id="startDateFilter"
            value={startDateFilter}
            onChange={(e) => onStartDateFilterChange(e.target.value)}
          />
        </div>
        <div style={{ paddingRight: "1%", display: "flex" }}>
          <label htmlFor="endDateFilter">End Date:</label>
          <input
            // style={{ paddingRight: "3%" }}
            type="date"
            id="endDateFilter"
            value={endDateFilter}
            onChange={(e) => onEndDateFilterChange(e.target.value)}
          />
        </div>
      </div>
    </>
  );
};

export default DateRangeSelector;
