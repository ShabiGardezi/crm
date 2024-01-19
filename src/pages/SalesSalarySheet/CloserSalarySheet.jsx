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
} from "@mui/material";
import Header from "../Header";

export default function CloserSalarySheet() {
  const apiUrl = process.env.REACT_APP_API_URL;
  const [tickets, setTickets] = useState([]);
  const [selectedMonth, setSelectedMonth] = useState(new Date().getMonth()); // Default to current month

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

  // Get unique closer names
  const closers = [
    ...new Set(tickets.map((ticket) => ticket.businessdetails.closer)),
  ];

  const calculateBountyAmount = (totalPayment) => {
    if (totalPayment >= 7000 && totalPayment <= 10000) {
      return 10000;
    } else if (totalPayment > 10000) {
      return 15000;
    } else {
      return 0;
    }
  };

  const calculateSumOfTenPercent = (tickets, closer, selectedMonth) => {
    const closerTickets = tickets.filter(
      (ticket) =>
        ticket.businessdetails.closer === closer &&
        isTicketInSelectedMonth(ticket, selectedMonth)
    );

    if (closerTickets.length === 0) {
      return 0; // Return 0 if there are no tickets for the closer in the selected month
    }

    return closerTickets.reduce((total, ticket) => {
      const ninetyPercent = 0.9 * parseFloat(ticket.quotation.price);
      const tenPercentOfNinetyPercent = 0.1 * ninetyPercent;
      return total + tenPercentOfNinetyPercent;
    }, 0);
  };

  // Function to check if a ticket's createdAt date is within the selected month
  const isTicketInSelectedMonth = (ticket, selectedMonth) => {
    const createdAtDate = new Date(ticket.createdAt);
    return createdAtDate.getMonth() === selectedMonth;
  };
  const calculateTotalForCloser = (closerName, selectedMonth) => {
    // Point 1: Calculate total from quotation.price for the selected month
    const totalFromQuotation = tickets
      .filter((ticket) => {
        const createdAtDate = new Date(ticket.createdAt);
        return (
          ticket.businessdetails.closer === closerName &&
          createdAtDate.getMonth() === selectedMonth
        );
      })
      .reduce((total, ticket) => total + parseFloat(ticket.quotation.price), 0);

    // Point 2: Check payment_history for each ticket for the selected month
    const totalFromPaymentHistory = tickets
      .map((ticket) => ticket.payment_history)
      .filter((paymentHistory) => paymentHistory.length > 1) // Check if payment_history has more than one entry
      .reduce((total, paymentHistory) => {
        // Start from 1st index
        for (let i = 1; i < paymentHistory.length; i++) {
          const paymentDate = new Date(paymentHistory[i].date);
          if (
            paymentHistory[i].closer === closerName &&
            paymentDate.getMonth() === selectedMonth
          ) {
            total += paymentHistory[i].payment;
          }
        }
        return total;
      }, 0);

    // Calculate the overall total for the selected month
    const overallTotal = totalFromQuotation + totalFromPaymentHistory;

    return overallTotal;
  };

  return (
    <div>
      <Header />
      <div style={{ textAlign: "center", marginTop: "2%", marginBottom: "2%" }}>
        <Typography variant="h6">Select Month:</Typography>
        <input
          type="month"
          onChange={(e) => {
            const selectedDate = new Date(e.target.value);
            const selectedMonth = selectedDate.getMonth();
            setSelectedMonth(selectedMonth);
          }}
        />
      </div>

      <Typography
        variant="h3"
        style={{ textAlign: "center", marginBottom: "2%" }}
        fontFamily={"revert-layer"}
      >
        Closer Commission Sheet - {getMonthName(selectedMonth)}
      </Typography>

      <TableContainer component={Paper}>
        <Table sx={{ minWidth: 800 }} aria-label="custom pagination table">
          <TableHead>
            <TableRow>
              <TableCell>Agent Name</TableCell>
              <TableCell>Total Payment</TableCell>
              <TableCell>10% Of Sales</TableCell>
              <TableCell>Bounty On Total Sales</TableCell>
              <TableCell>Recurring Sales</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {closers.map((closer) => {
              const totalSalary = calculateTotalForCloser(
                closer,
                selectedMonth
              ); // Calculate total for the closer

              const sumOfTenPercent = calculateSumOfTenPercent(
                tickets,
                closer,
                selectedMonth
              );

              const bountyAmount = calculateBountyAmount(totalSalary);

              return (
                <TableRow key={closer}>
                  <TableCell>{closer}</TableCell>
                  <TableCell>
                    <b>{`$${totalSalary.toFixed(2)}`}</b>
                  </TableCell>
                  <TableCell>
                    <b>{`$${sumOfTenPercent.toFixed(2)}`}</b>
                  </TableCell>
                  <TableCell>
                    <b>{`${bountyAmount.toFixed(2)} PKR`}</b>
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

// Helper function to get month name
const getMonthName = (monthIndex) => {
  const months = [
    "January",
    "February",
    "March",
    "April",
    "May",
    "June",
    "July",
    "August",
    "September",
    "October",
    "November",
    "December",
  ];
  return months[monthIndex];
};
