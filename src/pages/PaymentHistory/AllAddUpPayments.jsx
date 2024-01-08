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
  const [searchQuery, setSearchQuery] = useState("");
  console.log(tickets);
  const emptyRows =
    page > 0 ? Math.max(0, (1 + page) * rowsPerPage - tickets.length) : 0;

  const handleChangePage = (event, newPage) => {
    setPage(newPage);
  };

  const handleChangeRowsPerPage = (event) => {
    setRowsPerPage(parseInt(event.target.value, 10));
    setPage(0);
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

  const calculateTotalPaymentForTicket = (paymentHistory) => {
    let totalPayment = 0;
    paymentHistory.forEach((p) => {
      totalPayment += p.payment;
    });
    return totalPayment;
  };

  const calculateTotalPaymentForAllTickets = (tickets) => {
    let sumOfPayments = 0;
    tickets.forEach((ticket) => {
      // Check if paymentHistory is defined before iterating over it
      if (ticket.payment_history && Array.isArray(ticket.payment_history)) {
        ticket.payment_history.forEach((p) => {
          sumOfPayments += p.payment;
        });
      }
    });
    return sumOfPayments;
  };

  // Calculate total payment for all tickets
  const totalPaymentForAllTickets = calculateTotalPaymentForAllTickets(tickets);

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
              <TableCell>Date</TableCell>
              <TableCell>Business Name</TableCell>
              <TableCell>Sales Person</TableCell>
              <TableCell>Assign To</TableCell>
              <TableCell>Work Type</TableCell>
              <TableCell>Payment Received</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {tickets.map((ticket) => (
              <TableRow key={ticket._id}>
                <TableCell style={{ width: 160 }} align="left">
                  {new Date(ticket.createdAt).toISOString().substr(0, 10)}
                </TableCell>
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
                {/* <TableCell style={{ width: 160 }} align="left">
                  <tr style={{ justifyContent: "center", display: "flex" }}>
                    {`${ticket.quotation.remainingPrice}`}
                  </tr>
                </TableCell> */}
              </TableRow>
            ))}
            {emptyRows > 0 && (
              <TableRow style={{ height: 53 * emptyRows }}>
                <TableCell colSpan={7} />
              </TableRow>
            )}
          </TableBody>
        </Table>
        <TableFooter>
          <TableRow>
            <TablePagination
              rowsPerPageOptions={[]}
              colSpan={7}
              count={tickets?.length ?? 0}
              rowsPerPage={rowsPerPage}
              page={page}
              SelectProps={{
                inputProps: {
                  "aria-label": "rows per page",
                },
                native: true,
              }}
              onPageChange={handleChangePage}
              onRowsPerPageChange={handleChangeRowsPerPage}
            />
          </TableRow>
          <TableRow>
            <TableCell colSpan={5} style={{ textAlign: "right" }}>
              <strong>Total Payment for All Tickets:</strong>{" "}
              {`$${totalPaymentForAllTickets}`}
            </TableCell>
          </TableRow>
        </TableFooter>
      </TableContainer>
    </div>
  );
}
