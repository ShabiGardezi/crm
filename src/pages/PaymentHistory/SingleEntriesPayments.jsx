import React, { useState, useEffect } from "react";
import {
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableRow,
  TableHead,
  Paper,
  InputBase,
} from "@mui/material";
import Header from "../Header";
import SearchIcon from "@mui/icons-material/Search";

export default function SingleEntriesPayments() {
  const apiUrl = process.env.REACT_APP_API_URL;
  const user = JSON.parse(localStorage.getItem("user"));
  const [page, setPage] = React.useState(0);
  const [rowsPerPage, setRowsPerPage] = React.useState(-1); // Display all rows on one page
  const [tickets, setTickets] = useState([]); // State to store fetched data
  const [searchQuery, setSearchQuery] = useState("");
  const [totalPaymentForAllTickets, setTotalPaymentForAllTickets] = useState(0);
  const [totalRemainingForAllTickets, setTotalRemainingForAllTickets] =
    useState(0);

  const emptyRows =
    page > 0 ? Math.max(0, (1 + page) * rowsPerPage - tickets.length) : 0;

  const handleSearch = async (e) => {
    if (e.key === "Enter" && searchQuery) {
      try {
        const response = await fetch(
          `${apiUrl}/api/tickets/client-search?searchString=${searchQuery}`
        );
        if (response.ok) {
          const data = await response.json();
          setTickets(data.payload);
        } else {
          console.error("Error fetching search results");
        }
      } catch (error) {
        console.error("Error fetching search results", error);
      }
    }
  };

  const fetchRemainingPrice = async (ticketId) => {
    try {
      const response = await fetch(
        `${apiUrl}/api/tickets/remaining/${ticketId}`
      );
      if (response.ok) {
        const data = await response.json();
        return data.remainingPrice;
      } else {
        console.error("Error fetching remaining price");
        return null;
      }
    } catch (error) {
      console.error("Error fetching remaining price", error);
      return null;
    }
  };

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

        // Fetch and update remaining prices for all tickets
        const updatedTickets = await Promise.all(
          data.payload.map(async (ticket) => {
            const remainingPrice = await fetchRemainingPrice(ticket._id);
            return {
              ...ticket,
              quotation: {
                ...ticket.quotation,
                remainingPrice: remainingPrice !== null ? remainingPrice : 0,
              },
            };
          })
        );

        setTickets(updatedTickets);

        // Calculate and set the total payment and remaining for all tickets
        const sumOfPayments = updatedTickets.reduce(
          (total, ticket) =>
            total + calculateTotalPaymentForTicket(ticket.payment_history),
          0
        );
        setTotalPaymentForAllTickets(sumOfPayments);

        const sumOfRemaining = updatedTickets.reduce(
          (total, ticket) =>
            total +
            (parseFloat(calculateTotalRemainingForTicket(ticket.quotation)) ||
              0), // Convert to number before adding
          0
        );
        setTotalRemainingForAllTickets(sumOfRemaining.toFixed(2)); // Keep two decimal places

        setTotalRemainingForAllTickets(sumOfRemaining);
      } catch (error) {
        console.error("Error fetching tickets:", error.message);
      }
    };

    fetchTickets();
  }, []);

  const calculateTotalPaymentForTicket = (paymentHistory) => {
    let totalPayment = 0;
    paymentHistory.forEach((p) => {
      totalPayment += p.payment;
    });
    return totalPayment;
  };

  const calculateTotalRemainingForTicket = (quotation) => {
    return quotation.remainingPrice;
  };

  return (
    <div>
      <Header />
      <TableContainer component={Paper}>
        <div>
          <div
            className="search"
            style={{
              display: "flex",
              justifyContent: "flex-end",
              alignItems: "center",
              marginTop: "3%",
            }}
          >
            <div className="searchIcon">
              <SearchIcon />
            </div>
            <InputBase
              placeholder="Search Client..."
              inputProps={{ "aria-label": "search" }}
              onChange={(e) => setSearchQuery(e.target.value)}
              onKeyPress={handleSearch}
            />
          </div>
        </div>
        <Table sx={{ minWidth: 800 }} aria-label="custom pagination table">
          <TableHead>
            <TableRow>
              <TableCell>Business Name</TableCell>
              <TableCell>Sales Person</TableCell>
              <TableCell>Assign To</TableCell>
              <TableCell>Date</TableCell>
              <TableCell>Work Type</TableCell>
              <TableCell>Received</TableCell>
              <TableCell>Remaining</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {tickets.map((ticket) => (
              <React.Fragment key={ticket._id}>
                {ticket.payment_history.map(
                  (p) =>
                    p.payment !== null && (
                      <TableRow key={`${ticket._id}-${p.date}`}>
                        <TableCell>
                          {ticket.businessdetails.clientName}
                        </TableCell>
                        <TableCell>{ticket.TicketDetails.assignor}</TableCell>
                        <TableCell>{ticket.majorAssignee.name}</TableCell>
                        <TableCell>
                          {new Date(p.date).toLocaleDateString()}
                        </TableCell>
                        <TableCell>
                          {ticket.businessdetails.work_status}
                        </TableCell>
                        <TableCell>{`$${p.payment}`}</TableCell>
                        <TableCell>{`$${ticket.quotation.remainingPrice}`}</TableCell>
                      </TableRow>
                    )
                )}
              </React.Fragment>
            ))}
            {emptyRows > 0 && (
              <TableRow style={{ height: 53 * emptyRows }}>
                <TableCell colSpan={7} />
              </TableRow>
            )}
          </TableBody>
          <TableRow>
            <TableCell colSpan={7} style={{ textAlign: "right" }}>
              <strong>Total Received Payment:</strong>
              {`$${totalPaymentForAllTickets}`}
            </TableCell>
          </TableRow>
          <TableRow>
            <TableCell colSpan={7} style={{ textAlign: "right" }}>
              <strong>Total Remaining:</strong>
              {`$${totalRemainingForAllTickets}`}
            </TableCell>
          </TableRow>
        </Table>
      </TableContainer>
    </div>
  );
}
