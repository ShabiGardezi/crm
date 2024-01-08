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
  const [tickets, setTickets] = useState([]); // State to store fetched data
  const [searchQuery, setSearchQuery] = useState("");
  const [filter, setFilter] = useState("All");

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
      } catch (error) {
        console.error("Error fetching tickets:", error.message);
      }
    };

    fetchTickets();
  }, []);

  const filteredTickets =
    filter === "All"
      ? tickets
      : tickets.filter(
          (ticket) => ticket.businessdetails.work_status === filter
        );
  const calculateTotalPaymentForTicket = (paymentHistory) => {
    let totalPayment = 0;
    paymentHistory.forEach((p) => {
      totalPayment += p.payment;
    });
    return totalPayment;
  };

  const calculateTotalPaymentForFilteredTickets = (filteredTickets) => {
    const totalPayment = filteredTickets.reduce((total, ticket) => {
      return total + calculateTotalPaymentForTicket(ticket.payment_history);
    }, 0);
    return totalPayment.toFixed(2);
  };
  const calculateTotalRemainingForFilteredTickets = (filteredTickets) => {
    const totalRemaining = filteredTickets.reduce((total, ticket) => {
      return total + parseFloat(ticket.quotation.remainingPrice);
    }, 0);

    return totalRemaining.toFixed(2);
  };

  return (
    <div>
      <Header />
      <div>
        <label htmlFor="filterDropdown">Filter:</label>
        <select
          id="filterDropdown"
          value={filter}
          onChange={(e) => setFilter(e.target.value)}
        >
          <option value="All">All</option>
          <option value="Backlinks">Backlinks</option>
          <option value="Extra-Backlinks">Extra-Backlinks</option>
          <option value="Full-Website">Full-Website</option>
        </select>
      </div>
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
            {filteredTickets.map((ticket) => (
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
          </TableBody>
          <TableRow>
            <TableCell colSpan={7} style={{ textAlign: "right" }}>
              <strong>Total Received Payment:</strong>
              {`$${calculateTotalPaymentForFilteredTickets(filteredTickets)}`}
            </TableCell>
          </TableRow>
          <TableRow>
            <TableCell colSpan={7} style={{ textAlign: "right" }}>
              <strong>Total Remaining:</strong>
              {`$${calculateTotalRemainingForFilteredTickets(filteredTickets)}`}
            </TableCell>
          </TableRow>
        </Table>
      </TableContainer>
    </div>
  );
}
