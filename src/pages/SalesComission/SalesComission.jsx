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
            {tickets.map((ticket) => (
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
                        {new Date(
                          ticket.payment_history[0].date
                        ).toLocaleDateString()}
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
