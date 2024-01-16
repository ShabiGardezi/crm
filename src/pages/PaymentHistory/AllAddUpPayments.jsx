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
  Typography,
} from "@mui/material";
import Header from "../Header";
import SearchIcon from "@mui/icons-material/Search";

export default function AllAddUpPayments() {
  const apiUrl = process.env.REACT_APP_API_URL;
  const [tickets, setTickets] = useState([]); // State to store fetched data
  const [searchQuery, setSearchQuery] = useState("");

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

  const calculateTotalPaymentForTicket = (paymentHistory) => {
    let totalPayment = 0;
    paymentHistory.forEach((p) => {
      totalPayment += p.payment;
    });
    return totalPayment;
  };
  const calculateTotalPaymentForFilteredTickets = (tickets, clientName) => {
    const totalPayment = tickets.reduce((total, ticket) => {
      if (ticket.businessdetails.clientName === clientName) {
        return total + calculateTotalPaymentForTicket(ticket.payment_history);
      }
      return total;
    }, 0);
    return totalPayment.toFixed(2);
  };
  const calculateTotalRemainingForFilteredTickets = (tickets, clientName) => {
    const totalRemaining = tickets.reduce((total, ticket) => {
      if (ticket.businessdetails.clientName === clientName) {
        return total + parseFloat(ticket.quotation.remainingPrice);
      }
      return total;
    }, 0);
    return totalRemaining.toFixed(2);
  };
  return (
    <div>
      <Header />
      <Typography
        variant="h4"
        style={{ textAlign: "center", marginTop: "2%" }}
        fontFamily={"revert-layer"}
      >
        Clients Payment Info
      </Typography>

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
              <TableCell>Payment Received</TableCell>
              <TableCell>Payment Remaining</TableCell>
              <TableCell>Charge Back</TableCell>
              <TableCell>Refund</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {tickets
              .reduce((uniqueClients, ticket) => {
                if (
                  !uniqueClients.includes(ticket.businessdetails.clientName)
                ) {
                  uniqueClients.push(ticket.businessdetails.clientName);
                  return uniqueClients;
                }
                return uniqueClients;
              }, [])
              .map((clientName) => {
                const totalPayment = calculateTotalPaymentForFilteredTickets(
                  tickets,
                  clientName
                );
                const totalRemaining =
                  calculateTotalRemainingForFilteredTickets(
                    tickets,
                    clientName
                  );

                return (
                  <TableRow key={clientName}>
                    <TableCell component="th" scope="row">
                      {clientName}
                    </TableCell>
                    <TableCell style={{ width: 180 }} align="left">
                      <tr style={{ justifyContent: "center", display: "flex" }}>
                        <td style={{ textAlign: "center" }}>
                          <strong>{`$${totalPayment}`}</strong>
                        </td>
                      </tr>
                    </TableCell>
                    <TableCell style={{ width: 180 }} align="left">
                      <tr style={{ justifyContent: "center", display: "flex" }}>
                        <strong>{`$${totalRemaining}`}</strong>
                      </tr>
                    </TableCell>
                    <TableCell style={{ width: 180 }} align="left">
                      <tr style={{ justifyContent: "left", display: "flex" }}>
                        Charge Back
                      </tr>
                    </TableCell>
                    <TableCell style={{ width: 180 }} align="left">
                      <tr style={{ justifyContent: "left", display: "flex" }}>
                        Refund
                      </tr>
                    </TableCell>
                  </TableRow>
                );
              })}
          </TableBody>
        </Table>
      </TableContainer>
    </div>
  );
}