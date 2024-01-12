import React, { useState, useEffect } from "react";
import {
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableRow,
  TableHead,
  Paper,
} from "@mui/material";
import Header from "../Header";

export default function SalesComissionSheet() {
  const apiUrl = process.env.REACT_APP_API_URL;
  const [tickets, setTickets] = useState([]);
  const [selectedFronter, setSelectedFronter] = useState("All");
  const [fronterTotalPayment, setFronterTotalPayment] = useState({});
  const [fronterCommission, setFronterCommission] = useState({});
  const [startDate, setStartDate] = useState(null);
  const [endDate, setEndDate] = useState(null);
  const handleStartDateSelect = (date) => {
    setStartDate(date);
  };

  // Handle end date selection
  const handleEndDateSelect = (date) => {
    setEndDate(date);
  };
  const filteredTickets = tickets.filter((ticket) => {
    const createdAtDate = new Date(ticket.createdAt);

    // Check if the ticket's createdAt date is within the selected range
    return (
      (!startDate || createdAtDate >= startDate) &&
      (!endDate ||
        createdAtDate <= new Date(endDate.getTime() + 24 * 60 * 60 * 1000)) // Include end date
    );
  });
  useEffect(() => {
    const fetchTickets = async () => {
      try {
        const response = await fetch(
          `${apiUrl}/api/tickets/all-departments-ticket`
        );

        if (!response.ok) {
          throw new Error("Failed to fetch tickets");
        }

        const data = await response.json();
        setTickets(data.payload);
      } catch (error) {
        console.error("Error fetching tickets:", error.message);
      }
    };

    fetchTickets();
  }, []);

  // Calculate total payment for each fronter
  const calculateTotalPayment = (fronterName) => {
    return tickets
      .filter((ticket) => ticket.businessdetails.fronter === fronterName)
      .reduce((total, ticket) => total + parseFloat(ticket.quotation.price), 0);
  };

  // Calculate commission based on total payment
  const calculateCommission = (totalPayment) => {
    const commissionThresholdLow = 500;
    const commissionThresholdMedium = 800;
    const commissionThresholdHigh = 1500;
    const commissionThresholdVeryHigh = 2000;

    const ninetyPercent = 0.9 * totalPayment;

    if (totalPayment <= commissionThresholdLow) {
      return 0; // No commission
    } else if (totalPayment <= commissionThresholdMedium) {
      const commission = 0.025 * ninetyPercent;
      return roundCommission(commission);
    } else if (totalPayment <= commissionThresholdHigh) {
      const commission = 0.05 * ninetyPercent;
      return roundCommission(commission);
    } else if (totalPayment <= commissionThresholdVeryHigh) {
      const commission = 0.075 * ninetyPercent;
      return roundCommission(commission);
    } else {
      const commission = 0.1 * ninetyPercent;
      return roundCommission(commission);
    }
  };

  const roundCommission = (commission) => {
    // Round off to 2 decimal places with adjustment
    const roundedCommission = Math.round(commission * 100) / 100;
    return roundedCommission;
  };

  // Handle fronter selection in dropdown
  const handleFronterSelect = (fronter) => {
    setSelectedFronter(fronter);

    // Calculate and store total payment for the selected fronter
    const totalPayment = calculateTotalPayment(fronter);
    setFronterTotalPayment((prevTotalPayment) => ({
      ...prevTotalPayment,
      [fronter]: totalPayment,
    }));

    // Calculate and store commission for the selected fronter
    const commission = calculateCommission(totalPayment);
    setFronterCommission((prevCommission) => ({
      ...prevCommission,
      [fronter]: commission,
    }));
  };

  // Set to keep track of processed ticket IDs
  const processedTicketIds = new Set();

  // Get unique fronter names
  const fronters = [
    ...new Set(tickets.map((ticket) => ticket.businessdetails.fronter)),
  ];

  return (
    <div>
      <Header />
      <div>
        <div
          style={{
            display: "flex",
            justifyContent: "flex-end",
            alignItems: "center",
            marginTop: "2%",
            marginBottom: "2%",
          }}
        >
          <div style={{ marginRight: "3%" }}></div>
          <div className="filter" style={{ marginRight: "3%" }}>
            <div style={{ marginRight: "20px" }}>
              <label id="start-date-label">Start Date</label>
              <input
                style={{ marginRight: "10px" }}
                type="date"
                id="start-date"
                onChange={(e) =>
                  handleStartDateSelect(new Date(e.target.value))
                }
              />

              <label id="end-date-label">End Date</label>
              <input
                type="date"
                id="end-date"
                onChange={(e) => handleEndDateSelect(new Date(e.target.value))}
              />
            </div>
          </div>
          <div style={{ margin: "10px" }}>
            <label id="fronter-select-label">Select Fronter</label>
            <select
              labelId="fronter-select-label"
              id="fronter-select"
              value={selectedFronter}
              onChange={(e) => handleFronterSelect(e.target.value)}
            >
              <option value="All">All</option>
              {fronters.map((fronter) => (
                <option key={fronter} value={fronter}>
                  {fronter}
                </option>
              ))}
            </select>
          </div>
        </div>
      </div>
      <TableContainer component={Paper}>
        <Table sx={{ minWidth: 800 }} aria-label="custom pagination table">
          <TableHead>
            <TableRow>
              <TableCell>Business Name</TableCell>
              <TableCell>Fronter</TableCell>
              <TableCell>Closer</TableCell>
              <TableCell>Assign To</TableCell>
              <TableCell>Date</TableCell>
              <TableCell>Work Type</TableCell>
              <TableCell>Client Payment</TableCell>
              <TableCell>Total Payment</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {filteredTickets.map((ticket) => (
              <React.Fragment key={ticket._id}>
                {(selectedFronter === "All" ||
                  ticket.businessdetails.fronter === selectedFronter) && (
                  <>
                    <TableRow>
                      <TableCell>{ticket.businessdetails.clientName}</TableCell>
                      <TableCell>{ticket.businessdetails.fronter}</TableCell>
                      <TableCell>{ticket.businessdetails.closer}</TableCell>
                      <TableCell>{ticket.majorAssignee.name}</TableCell>
                      <TableCell>
                        {new Date(ticket.createdAt).toLocaleDateString()}
                      </TableCell>
                      <TableCell>
                        {ticket.businessdetails.work_status}
                      </TableCell>
                      <TableCell>{`$${ticket.quotation.price}`}</TableCell>
                      <TableCell>
                        {`$${calculateTotalPayment(
                          ticket.businessdetails.fronter
                        )}`}
                      </TableCell>
                    </TableRow>
                  </>
                )}
              </React.Fragment>
            ))}
          </TableBody>
          {/* Display total payment for the selected fronter */}
          {selectedFronter !== "All" && (
            <TableBody>
              <TableRow>
                <TableCell colSpan={6}></TableCell>
                <TableCell>Total Payment for {selectedFronter}:</TableCell>
                <TableCell>{`$${
                  fronterTotalPayment[selectedFronter] || 0
                }`}</TableCell>
              </TableRow>
              <TableRow>
                <TableCell colSpan={6}></TableCell>
                <TableCell>Commission for {selectedFronter}:</TableCell>
                <TableCell>{`$${
                  fronterCommission[selectedFronter] || 0
                }`}</TableCell>
              </TableRow>
            </TableBody>
          )}
        </Table>
      </TableContainer>
    </div>
  );
}
