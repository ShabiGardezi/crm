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
export default function FronterSalarySheet() {
  const apiUrl = process.env.REACT_APP_API_URL;
  const [tickets, setTickets] = useState([]);
  const [selectedMonth, setSelectedMonth] = useState(new Date().getMonth()); // Default to current month
  const [startDate, setStartDate] = useState(
    new Date(new Date().getFullYear(), new Date().getMonth(), 1)
  );
  const [endDate, setEndDate] = useState(
    new Date(new Date().getFullYear(), new Date().getMonth() + 1, 0)
  );

  const filteredTickets = tickets.filter((ticket) => {
    const createdAtDate = new Date(ticket.createdAt);

    // Check if the ticket's createdAt date is within the selected range
    return (
      (!startDate || createdAtDate >= startDate) &&
      (!endDate ||
        createdAtDate <= new Date(endDate.getTime() + 24 * 60 * 60 * 1000)) &&
      ticket.businessdetails.fronter !== ticket.businessdetails.closer
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

  // Calculate total payment for each fronter
  const calculateTotalPayment = (fronterName, startDate, endDate) => {
    return tickets
      .filter((ticket) => {
        const createdAtDate = new Date(ticket.createdAt);

        // Check if the ticket's createdAt date is within the selected range
        // Exclude tickets where fronter name is the same as closer name
        return (
          ticket.businessdetails.fronter === fronterName &&
          ticket.businessdetails.fronter !== ticket.businessdetails.closer &&
          (!startDate || createdAtDate >= startDate) &&
          (!endDate ||
            createdAtDate <= new Date(endDate.getTime() + 24 * 60 * 60 * 1000)) // Include end date
        );
      })
      .reduce((total, ticket) => {
        // Calculate the sum of payments from payment history for the current fronter
        const paymentHistoryTotal = ticket.payment_history.reduce(
          (paymentTotal, paymentEntry) => paymentTotal + paymentEntry.payment,
          0
        );
        return total + paymentHistoryTotal;
      }, 0);
  };

  const roundCommission = (commission) => {
    // Round off to 2 decimal places with adjustment
    const roundedCommission = Math.round(commission * 100) / 100;
    return roundedCommission;
  };

  // Get unique fronter names
  const fronters = [
    ...new Set(tickets.map((ticket) => ticket.businessdetails.fronter)),
  ];

  const calculateCommissionRate = (totalSalary) => {
    const commissionThresholdLow = 500;
    const commissionThresholdMedium = 800;
    const commissionThresholdHigh = 1500;
    const commissionThresholdVeryHigh = 2000;

    const ninetyPercent = 0.9 * totalSalary;

    if (totalSalary <= commissionThresholdLow) {
      return 0; // No commission
    } else if (totalSalary <= commissionThresholdMedium) {
      return 2.5; // Commission rate for medium threshold
    } else if (totalSalary <= commissionThresholdHigh) {
      return 5; // Commission rate for high threshold
    } else if (totalSalary <= commissionThresholdVeryHigh) {
      return 7.5; // Commission rate for very high threshold
    } else {
      return 10; // Commission rate for exceeding very high threshold
    }
  };
  const calculateCommissionableAmount = (fronterName, startDate, endDate) => {
    const totalPayment = calculateTotalPayment(fronterName, startDate, endDate);
    const commissionableAmount = 0.9 * totalPayment;
    return roundCommission(commissionableAmount);
  };

  // Function to filter tickets for a specific month
  const filterTicketsByMonth = (tickets, month) => {
    return tickets.filter((ticket) => {
      const createdAtDate = new Date(ticket.createdAt);
      return createdAtDate.getMonth() === month;
    });
  };

  // Function to calculate monthly values for each fronter
  const calculateMonthlyValues = async (fronter, month) => {
    try {
      const response = await fetch(
        `${apiUrl}/api/tickets/all-departments-ticket`
      );

      if (!response.ok) {
        throw new Error("Failed to fetch tickets");
      }

      const data = await response.json();
      const monthlyTickets = filterTicketsByMonth(data.payload, month);

      const totalSalary = calculateTotalPaymentForFronter(
        fronter,
        monthlyTickets
      );
      const commissionRate = calculateCommissionRate(totalSalary);
      const commissionableAmount = calculateCommissionableAmountForFronter(
        fronter,
        monthlyTickets
      );
      const netSalary = totalSalary * 0.9 * (commissionRate / 100);

      return {
        totalSalary,
        commissionableAmount,
        commissionRate,
        netSalary,
      };
    } catch (error) {
      console.error("Error fetching tickets:", error.message);
      return null; // Handle error gracefully
    }
  };

  // Function to calculate total payment for a fronter with a specific set of tickets
  const calculateTotalPaymentForFronter = (fronter, tickets) => {
    return tickets.reduce(
      (total, ticket) => total + parseFloat(ticket.quotation.advanceprice),
      0
    );
  };
  // Function to calculate commissionable amount for a fronter with a specific set of tickets
  const calculateCommissionableAmountForFronter = (fronter, tickets) => {
    const totalPayment = calculateTotalPaymentForFronter(fronter, tickets);
    const commissionableAmount = 0.9 * totalPayment;
    return roundCommission(commissionableAmount);
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
            const values = fronters.map((fronter) =>
              calculateMonthlyValues(fronter, selectedMonth)
            );
            // Update state with selected start and end dates
            setStartDate(
              new Date(selectedDate.getFullYear(), selectedMonth, 1)
            );
            setEndDate(
              new Date(selectedDate.getFullYear(), selectedMonth + 1, 0)
            );
            setSelectedMonth(selectedMonth);
          }}
        />
      </div>

      <Typography
        variant="h3"
        style={{ textAlign: "center", marginBottom: "2%" }}
        fontFamily={"revert-layer"}
      >
        Fronter Commission Sheet - {getMonthName(selectedMonth)}
      </Typography>

      <TableContainer component={Paper}>
        <Table sx={{ minWidth: 800 }} aria-label="custom pagination table">
          <TableHead>
            <TableRow>
              <TableCell>Agent Name</TableCell>
              <TableCell>Total Payment</TableCell>
              <TableCell>90% of all payments</TableCell>
              <TableCell>Commission Rate</TableCell>
              <TableCell>Net Commission</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {fronters
              .filter((fronter) => {
                // Check if the current fronter has tickets where closer and fronter names are different
                return filteredTickets.some(
                  (ticket) =>
                    ticket.businessdetails.fronter === fronter &&
                    ticket.businessdetails.closer !== fronter
                );
              })
              .map((fronter) => {
                const totalSalary = calculateTotalPayment(
                  fronter,
                  startDate,
                  endDate
                );
                const commissionRate = calculateCommissionRate(totalSalary);
                const commissionableAmount = calculateCommissionableAmount(
                  fronter,
                  startDate,
                  endDate
                );

                const netSalary = totalSalary * 0.9 * (commissionRate / 100);

                return (
                  <TableRow key={fronter}>
                    <TableCell>{fronter}</TableCell>
                    <TableCell>
                      <b>{`$${totalSalary}`}</b>
                    </TableCell>
                    <TableCell>{`$${roundCommission(
                      0.9 * totalSalary
                    )}`}</TableCell>
                    <TableCell>{`${commissionRate}%`}</TableCell>
                    <TableCell>{`$${roundCommission(netSalary)}`}</TableCell>
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
