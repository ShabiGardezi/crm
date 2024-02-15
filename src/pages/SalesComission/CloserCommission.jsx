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

export default function CloserComissionSheet() {
  const apiUrl = process.env.REACT_APP_API_URL;
  const [tickets, setTickets] = useState([]);
  const [selectedCloser, setSelectedCloser] = useState("All");
  const [selectedSalesType, setSelectedSalesType] = useState("All"); // Add state for selected Sales Type
  const [fronterTotalPayment, setFronterTotalPayment] = useState({});
  const [startDate, setStartDate] = useState(null);
  const [endDate, setEndDate] = useState(null);
  const [newSalesTotalPayment, setNewSalesTotalPayment] = useState(0);
  const [upSalesTotalPayment, setUpSalesTotalPayment] = useState(0);
  const [recurringSalesTotalPayment, setRecurringSalesTotalPayment] =
    useState(0);

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
    const startOfDay = new Date(startDate);
    startOfDay.setHours(0, 0, 0, 0);
    const endOfDay = new Date(endDate);
    endOfDay.setHours(23, 59, 59, 999);

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
  useEffect(() => {
    const calculateNewSalesTotalPayment = () => {
      let total = 0;
      filteredTickets.forEach((ticket) => {
        ticket.payment_history.forEach((paymentEntry) => {
          if (paymentEntry.salesType === "New Sales") {
            total += paymentEntry.payment;
          }
        });
      });
      return total;
    };

    const total = calculateNewSalesTotalPayment();
    setNewSalesTotalPayment(total);
    const calculateUpSalesTotalPayment = () => {
      let total = 0;
      filteredTickets.forEach((ticket) => {
        ticket.payment_history.forEach((paymentEntry) => {
          if (paymentEntry.salesType === "Up Sales") {
            total += paymentEntry.payment;
          }
        });
      });
      return total;
    };

    const calculateRecurringSalesTotalPayment = () => {
      let total = 0;
      filteredTickets.forEach((ticket) => {
        ticket.payment_history.forEach((paymentEntry) => {
          if (paymentEntry.salesType === "Recurring Sales") {
            total += paymentEntry.payment;
          }
        });
      });
      return total;
    };

    const upSalesTotal = calculateUpSalesTotalPayment();
    const recurringSalesTotal = calculateRecurringSalesTotalPayment();

    setUpSalesTotalPayment(upSalesTotal);
    setRecurringSalesTotalPayment(recurringSalesTotal);
  }, [filteredTickets]);
  // Calculate total payment for each closer
  const calculateTotalPayment = (closerName, startDate, endDate) => {
    return tickets
      .filter((ticket) => {
        const createdAtDate = new Date(ticket.createdAt);

        // Check if the ticket's createdAt date is within the selected range
        return (
          ticket.payment_history.some(
            (payment) => payment.closer === closerName
          ) &&
          (!startDate || createdAtDate >= startDate) &&
          (!endDate ||
            createdAtDate <= new Date(endDate.getTime() + 24 * 60 * 60 * 1000)) // Include end date
        );
      })
      .reduce((total, ticket) => {
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
    let totalPayment = 0; // Initialize total payment

    // Iterate over filtered tickets
    filteredTickets.forEach((ticket) => {
      // Iterate over payment history of the current ticket
      ticket.payment_history.forEach((payment) => {
        // Add the payment amount to the total payment
        totalPayment += payment.payment;
      });
    });

    return totalPayment.toFixed(2); // Format total payment as a string with 2 decimal places
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
          <div style={{ margin: "10px" }}>
            <label id="sales-type-select-label">Select Sales Type: </label>
            <select
              labelId="sales-type-select-label"
              id="sales-type-select"
              value={selectedSalesType}
              onChange={(e) => handleSalesTypeSelect(e.target.value)}
            >
              <option value="All">All</option>
              <option value="New Sales">New Sales</option>
              <option value="Up Sales">Up Sales</option>
              <option value="Recurring Sales">Recurring Sales</option>
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
            {filteredTickets.map((ticket) => (
              <React.Fragment key={ticket._id}>
                {(selectedCloser === "All" ||
                  ticket.businessdetails.closer === selectedCloser) && (
                  <>
                    {ticket.payment_history.map(
                      (paymentEntry, index) =>
                        // Check if the payment entry matches the selected sales type
                        (selectedSalesType === "All" ||
                          paymentEntry.salesType === selectedSalesType) && (
                          <TableRow key={`${ticket._id}-${index}`}>
                            <TableCell>
                              {ticket.businessdetails.businessName}
                            </TableCell>
                            <TableCell>{paymentEntry.fronter}</TableCell>
                            <TableCell>
                              <strong>{paymentEntry.closer} </strong>
                            </TableCell>
                            <TableCell>{ticket.majorAssignee.name}</TableCell>
                            <TableCell>
                              {new Date(ticket.createdAt).toLocaleDateString()}
                            </TableCell>
                            <TableCell>
                              {ticket.businessdetails.work_status ||
                                ticket.businessdetails.departmentName}
                            </TableCell>
                            <TableCell>${paymentEntry.payment}</TableCell>
                            <TableCell>{paymentEntry.salesType}</TableCell>
                          </TableRow>
                        )
                    )}
                  </>
                )}
              </React.Fragment>
            ))}

            {/* {visibleRows.map((ticket) => (
              <React.Fragment key={`${ticket._id}-payment`}>
                {ticket.payment_history
                  .slice(1)
                  .map((payment, index) => {
                    if (
                      selectedCloser !== "All" &&
                      payment.closer !== selectedCloser
                    )
                      return null;

                    return (
                      <TableRow key={`${ticket._id}-payment-${index}`}>
                        <TableCell>
                          {ticket.businessdetails.businessName}
                        </TableCell>
                        <TableCell>
                          {ticket.businessdetails.fronter}
                        </TableCell>
                        <TableCell>
                          <strong>{payment.closer}</strong>
                        </TableCell>
                        <TableCell>
                          {ticket.majorAssignee.name}
                        </TableCell>
                        <TableCell>
                          {new Date(payment.date).toLocaleDateString()}
                        </TableCell>
                        <TableCell>
                          {ticket.businessdetails.work_status ||
                            ticket.businessdetails.departmentName}
                        </TableCell>
                        <TableCell>{`$${payment.payment}`}</TableCell>
                        <TableCell>{"Recurring"}</TableCell>
                      </TableRow>
                    );
                  })}
              </React.Fragment>
            ))} */}
            <TableRow>
              <TableCell colSpan={6}></TableCell>
              <TableCell style={{ display: "flex", justifyContent: "end" }}>
                {selectedSalesType === "New Sales" && (
                  <div style={{ marginTop: "10px" }}>
                    <p>Total payment for New Sales: ${newSalesTotalPayment}</p>
                  </div>
                )}
                {selectedSalesType === "Up Sales" && (
                  <div style={{ marginTop: "10px" }}>
                    <p>Total payment for Up Sales: ${upSalesTotalPayment}</p>
                  </div>
                )}

                {selectedSalesType === "Recurring Sales" && (
                  <div style={{ marginTop: "10px" }}>
                    <p>
                      Total payment for Recurring Sales: $
                      {recurringSalesTotalPayment}
                    </p>
                  </div>
                )}
              </TableCell>
            </TableRow>
            {selectedCloser === "All" && selectedSalesType === "All" && (
              <TableRow>
                <TableCell colSpan={6}></TableCell>
                <TableCell>
                  <b>
                    Total payment for {selectedSalesType} is:{" "}
                    <b>{`$${calculateTotalPaymentForAll()}`}</b>
                  </b>
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
