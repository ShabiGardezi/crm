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
import DateRangeSelector from "../DateRangeSelector";

export default function SingleEntriesPayments() {
  const apiUrl = process.env.REACT_APP_API_URL;
  const [startDate, setStartDate] = useState(
    new Date().toISOString().split("T")[0]
  );
  const [endDate, setEndDate] = useState(
    new Date().toISOString().split("T")[0]
  );
  const [startDateFilter, setStartDateFilter] = useState("");
  const [endDateFilter, setEndDateFilter] = useState("");
  const [tickets, setTickets] = useState([]); // State to store fetched data
  const [searchQuery, setSearchQuery] = useState("");
  const [filter, setFilter] = useState("All");

  const handleStartDateChange = (event) => {
    setStartDate(event.target.value);
  };

  const handleEndDateChange = (event) => {
    setEndDate(event.target.value);
  };

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
  const filteredTickets = tickets.filter((ticket) => {
    const paymentDates = ticket.payment_history.map((p) => new Date(p.date));
    const startDateFilterDate = startDateFilter
      ? new Date(startDateFilter)
      : null;
    const endDateFilterDate = endDateFilter ? new Date(endDateFilter) : null;

    return (
      (filter === "All" || ticket.businessdetails.work_status === filter) &&
      paymentDates.some(
        (date) =>
          (!startDateFilterDate || date >= startDateFilterDate) &&
          (!endDateFilterDate ||
            date <= endDateFilterDate.setDate(endDateFilterDate.getDate() + 1))
      )
    );
  });

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
      <TableContainer component={Paper}>
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
            <div style={{ marginRight: "3%" }}>
              <label htmlFor="filterDropdown">Services:</label>
              <select
                id="filterDropdown"
                value={filter}
                onChange={(e) => setFilter(e.target.value)}
              >
                <option value="All">All</option>
                <option value="GMB Full Optimization">
                  GMB Full Optimization
                </option>
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
            <div className="filter" style={{ marginRight: "3%" }}>
              <DateRangeSelector
                startDate={startDate}
                endDate={endDate}
                onStartDateChange={handleStartDateChange}
                onEndDateChange={handleEndDateChange}
                startDateFilter={startDateFilter}
                endDateFilter={endDateFilter}
                onStartDateFilterChange={(date) => setStartDateFilter(date)}
                onEndDateFilterChange={(date) => setEndDateFilter(date)}
              />
            </div>
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
              <TableCell>Fronter</TableCell>
              <TableCell>Closer</TableCell>
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
                          {ticket.businessdetails.businessName}
                        </TableCell>
                        <TableCell>{ticket.businessdetails.fronter}</TableCell>
                        <TableCell>{ticket.businessdetails.closer}</TableCell>
                        <TableCell>{ticket.majorAssignee.name}</TableCell>
                        <TableCell>
                          {new Date(p.date).toLocaleDateString()}
                        </TableCell>
                        <TableCell>
                          {ticket.businessdetails.work_status}
                        </TableCell>
                        {<TableCell>{`$${p.payment}`}</TableCell>}
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
