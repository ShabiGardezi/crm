import React, { useState, useEffect } from "react";
import {
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableFooter,
  TablePagination,
  TableRow,
  TableHead,
  Paper,
  InputBase,
} from "@mui/material";
import Header from "../Header";
import SearchIcon from "@mui/icons-material/Search";

export default function AllAddUpPayments() {
  const apiUrl = process.env.REACT_APP_API_URL;
  const user = JSON.parse(localStorage.getItem("user"));
  const [page, setPage] = React.useState(0);
  const [rowsPerPage, setRowsPerPage] = React.useState(-1); // Display all rows on one page
  const [tickets, setTickets] = useState([]); // State to store fetched data
  const [filter, setFilter] = useState("All");
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
        <label htmlFor="filterDropdown">Services:</label>
        <select
          id="filterDropdown"
          value={filter}
          onChange={(e) => setFilter(e.target.value)}
        >
          <option value="All">All</option>
          <option value="GMB Full Optimization">GMB Full Optimization</option>
          <option value="GMB Off Page">GMB Off Page</option>
          <option value="Paid-Guest-Posting">Paid-Guest-Posting</option>
          <option value="Monthly-SEO">Monthly-SEO</option>
          <option value="On-Page">On-Page</option>
          <option value="Backlinks">Backlinks</option>
          <option value="Extra-Backlinks">Extra-Backlinks</option>
          <option value="Facebook-Ads">Facebook-Ads</option>
          <option value="Google-Ads">Google-Ads</option>
          <option value="Other-Ads">Other-Ads</option>
          <option value="Ecommerce">Ecommerce</option>
          <option value="Redeisgn-Website">Redeisgn-Website</option>
          <option value="One-Page-Website">One-Page-Website</option>
          <option value="Full-Website">Full-Website</option>
          <option value="No. Of FB Reviews">No. Of FB Reviews</option>
          <option value="Likes/Followers">Likes/Followers</option>
          <option value="No.Of GMB Reviews">No.Of GMB Reviews</option>
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
              <TableCell>Work Type</TableCell>
              <TableCell>Payment Received</TableCell>
              <TableCell>Payment Remaining</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {filteredTickets.map((ticket) => (
              <TableRow key={ticket._id}>
                <TableCell component="th" scope="row">
                  {ticket.businessdetails.clientName}
                </TableCell>
                <TableCell style={{ width: 160 }} align="left">
                  {ticket.TicketDetails.assignor}
                </TableCell>
                <TableCell style={{ width: 160 }} align="left">
                  {ticket.majorAssignee.name}
                </TableCell>
                <TableCell style={{ width: 160 }} align="left">
                  {ticket.businessdetails.work_status}
                </TableCell>
                <TableCell style={{ width: 160 }} align="left">
                  <tr style={{ justifyContent: "center", display: "flex" }}>
                    <td
                      style={{ textAlign: "center" }}
                    >{`$${calculateTotalPaymentForTicket(
                      ticket.payment_history
                    )}`}</td>
                  </tr>
                </TableCell>
                <TableCell style={{ width: 160 }} align="left">
                  <tr style={{ justifyContent: "center", display: "flex" }}>
                    {`${ticket.quotation.remainingPrice}`}
                  </tr>
                </TableCell>
              </TableRow>
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
