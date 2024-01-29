import React, { useState, useEffect } from "react";
import {
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableRow,
  TableHead,
  Paper,
  Typography,
  Button,
} from "@mui/material";
import Header from "../Header";
import { parse } from "date-fns";

export default function CloserComissionSheet() {
  const apiUrl = process.env.REACT_APP_API_URL;
  const [tickets, setTickets] = useState([]);
  const [selectedCloser, setSelectedCloser] = useState("All");
  const [selectedSalesType, setSelectedSalesType] = useState("All"); // Add state for selected Sales Type
  const [fronterTotalPayment, setFronterTotalPayment] = useState({});
  const [startDate, setStartDate] = useState(null);
  const [endDate, setEndDate] = useState(null);
  const handleStartDateSelect = (date) => {
    setStartDate(date);
  };
  // Handle Sales Type selection in dropdown
  const handleSalesTypeSelect = (salesType) => {
    setSelectedSalesType(salesType);
  };
  // Handle end date selection
  const handleEndDateSelect = (date) => {
    setEndDate(date);
  };
  const filteredTickets = tickets.filter((ticket) => {
    const createdAtDate = new Date(ticket.createdAt);

    // Set the time components to the start and end of the day
    const startOfDay = new Date(startDate);
    startOfDay.setHours(0, 0, 0, 0);

    const endOfDay = new Date(endDate);
    endOfDay.setHours(23, 59, 59, 999);

    // Check if the ticket's createdAt date is within the selected range
    return (
      (!startDate || createdAtDate >= startOfDay) &&
      (!endDate || createdAtDate <= endOfDay)
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

  // Calculate total payment for each closer
  const calculateTotalPayment = (closerName, startDate, endDate) => {
    return tickets
      .filter((ticket) => {
        const createdAtDate = new Date(ticket.createdAt);

        // Check if the ticket's createdAt date is within the selected range
        return (
          (ticket.businessdetails.closer === closerName ||
            ticket.payment_history.some(
              (payment) => payment.closer === closerName
            )) &&
          (!startDate || createdAtDate >= startDate) &&
          (!endDate ||
            createdAtDate <= new Date(endDate.getTime() + 24 * 60 * 60 * 1000)) // Include end date
        );
      })
      .reduce((total, ticket) => {
        // Add the quotation price if the closer matches
        if (ticket.businessdetails.closer === closerName) {
          total += parseFloat(ticket.quotation.price);
        }

        // Add payments from payment_history if the closer matches
        total += ticket.payment_history
          .filter((payment) => payment.closer === closerName)
          .reduce((paymentTotal, payment) => paymentTotal + payment.payment, 0);

        return total;
      }, 0);
  };

  // Handle closer selection in dropdown
  const handleFronterSelect = (closer) => {
    setSelectedCloser(closer);

    // Calculate and store total payment for the selected closer
    const totalPayment = calculateTotalPayment(closer);
    setFronterTotalPayment((prevTotalPayment) => ({
      ...prevTotalPayment,
      [closer]: totalPayment,
    }));
  };

  // Get unique closer names from businessdetails.closer and payment_history array
  const closers = [
    ...new Set(tickets.map((ticket) => ticket.businessdetails.closer)),
  ];

  // Calculate total payment for all closers
  const calculateTotalPaymentForAll = () => {
    return tickets.reduce((total, ticket) => {
      // Add the quotation price if available
      if (ticket.quotation && ticket.quotation.price) {
        total += parseFloat(ticket.quotation.price);
      }

      // Add payments from payment_history starting from index 1
      total += ticket.payment_history
        .slice(1)
        .reduce((paymentTotal, payment) => {
          // Convert the payment to a number if it's a string
          const paymentAmount =
            typeof payment.payment === "string"
              ? parseFloat(payment.payment)
              : payment.payment;
          return paymentTotal + paymentAmount;
        }, 0);

      return total;
    }, 0);
  };
  const [currentPage, setCurrentPage] = useState(1);
  const RowsPerPage = 100; // Set the number of rows per page

  const totalRows = filteredTickets.length;
  const totalPages = Math.ceil(filteredTickets.length / RowsPerPage);

  const startIndex = (currentPage - 1) * RowsPerPage;
  const endIndex = startIndex + RowsPerPage;

  const visibleRows = filteredTickets.slice(
    (currentPage - 1) * RowsPerPage,
    currentPage * RowsPerPage
  );
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
              <label id="start-date-label">Start Date: </label>
              <input
                style={{ marginRight: "10px" }}
                type="date"
                id="start-date"
                onChange={(e) =>
                  handleStartDateSelect(new Date(e.target.value))
                }
              />

              <label id="end-date-label">End Date: </label>
              <input
                type="date"
                id="end-date"
                onChange={(e) => handleEndDateSelect(new Date(e.target.value))}
              />
            </div>
          </div>
          <div style={{ margin: "10px" }}>
            <label id="closer-select-label">Select Closer: </label>
            <select
              labelId="closer-select-label"
              id="closer-select"
              value={selectedCloser}
              onChange={(e) => handleFronterSelect(e.target.value)}
            >
              <option value="All">All</option>
              {closers.map((closer) => (
                <option key={closer} value={closer}>
                  {closer}
                </option>
              ))}
            </select>
          </div>
        </div>
      </div>
      <Typography
        variant="h3"
        style={{ textAlign: "center", marginBottom: "2%" }}
        fontFamily={"revert-layer"}
      >
        Closer Daily Sheet
      </Typography>
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
              <TableCell>Sales Type</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {visibleRows.map((visibleTicket) => (
              <React.Fragment key={visibleTicket._id}>
                {(selectedCloser === "All" ||
                  visibleTicket.businessdetails.closer === selectedCloser) && (
                  <>
                    <TableRow>
                      <TableCell>
                        {visibleTicket.businessdetails.businessName}
                      </TableCell>
                      <TableCell>
                        {visibleTicket.businessdetails.fronter}
                      </TableCell>
                      <TableCell>
                        <strong>{visibleTicket.businessdetails.closer}</strong>
                      </TableCell>
                      <TableCell>{visibleTicket.majorAssignee.name}</TableCell>
                      <TableCell>
                        {new Date(visibleTicket.createdAt).toLocaleDateString()}
                      </TableCell>
                      <TableCell>
                        {visibleTicket.businessdetails.work_status ||
                          visibleTicket.businessdetails.departmentName}
                      </TableCell>
                      <TableCell>{`$${visibleTicket.quotation.price}`}</TableCell>
                      <TableCell>
                        {visibleTicket.payment_history[0].payment !== 0
                          ? "Recurring"
                          : visibleTicket.businessdetails.fronter !==
                            visibleTicket.businessdetails.closer
                          ? "New Sales"
                          : "Up Sales"}
                      </TableCell>
                    </TableRow>
                  </>
                )}
              </React.Fragment>
            ))}

            {visibleRows.map((visibleTicket) => (
              <React.Fragment key={`${visibleTicket._id}-payment`}>
                {/* Display payment history for the current ticket */}
                {visibleTicket.payment_history
                  .slice(1)
                  .map((payment, index) => {
                    if (
                      selectedCloser !== "All" &&
                      payment.closer !== selectedCloser
                    )
                      return null;

                    return (
                      <TableRow key={`${visibleTicket._id}-payment-${index}`}>
                        <TableCell>
                          {visibleTicket.businessdetails.businessName}
                        </TableCell>
                        <TableCell>
                          {visibleTicket.businessdetails.fronter}
                        </TableCell>
                        <TableCell>
                          <strong>{payment.closer}</strong>
                        </TableCell>
                        <TableCell>
                          {visibleTicket.majorAssignee.name}
                        </TableCell>
                        <TableCell>
                          {new Date(payment.date).toLocaleDateString()}
                        </TableCell>
                        <TableCell>
                          {visibleTicket.businessdetails.work_status ||
                            visibleTicket.businessdetails.departmentName}
                        </TableCell>
                        <TableCell>{`$${payment.payment}`}</TableCell>
                        <TableCell>{"Recurring"}</TableCell>
                      </TableRow>
                    );
                  })}
              </React.Fragment>
            ))}

            {selectedCloser === "All" && (
              <TableRow>
                <TableCell colSpan={5}></TableCell>
                <TableCell>
                  <b>Total payment for all closers is:</b>
                </TableCell>
                <TableCell>
                  <b>{`$${calculateTotalPaymentForAll()}`}</b>
                </TableCell>
              </TableRow>
            )}
          </TableBody>

          {/* Display total payment for the selected closer */}
          {selectedCloser !== "All" && (
            <TableBody>
              <TableRow>
                <TableCell colSpan={5}></TableCell>
                <TableCell>
                  <b> {`Total payment from ${selectedCloser} is: `}</b>
                </TableCell>
                <TableCell>
                  <b>
                    {`$${calculateTotalPayment(
                      selectedCloser,
                      startDate,
                      endDate
                    )}`}
                  </b>
                </TableCell>
              </TableRow>
            </TableBody>
          )}
        </Table>
      </TableContainer>
      <div style={{ textAlign: "center", marginTop: "10px" }}>
        <Typography variant="body2" color="textSecondary" component="p">
          Page {currentPage} of {totalPages}
        </Typography>
        <Button
          variant="outlined"
          disabled={currentPage === 1}
          onClick={() => setCurrentPage((prev) => prev - 1)}
          style={{ margin: "2%" }}
        >
          Previous
        </Button>
        <Button
          variant="outlined"
          disabled={currentPage === totalPages}
          onClick={() => setCurrentPage((prev) => prev + 1)}
        >
          Next
        </Button>
      </div>
    </div>
  );
}
