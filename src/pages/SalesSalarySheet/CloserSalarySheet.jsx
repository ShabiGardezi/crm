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
  const [selectedCloser, setSelectedCloser] = useState("All");
  const [selectedMonth, setSelectedMonth] = useState(new Date().getMonth()); // Default to current month
  const [startDate, setStartDate] = useState(
    new Date(new Date().getFullYear(), new Date().getMonth(), 1)
  );
  const [endDate, setEndDate] = useState(
    new Date(new Date().getFullYear(), new Date().getMonth() + 1, 0)
  );

  const handleStartDateSelect = (date) => {
    setStartDate(date);
  };

  // Handle end date selection
  const handleEndDateSelect = (date) => {
    setEndDate(date);
  };
  const filteredTickets = tickets.filter((ticket) => {
    const createdAtDate = new Date(ticket.createdAt);

    // Check if the ticket's createdAt date is within the selected range
    return (
      (!startDate || createdAtDate >= startDate) &&
      (!endDate ||
        createdAtDate <= new Date(endDate.getTime() + 24 * 60 * 60 * 1000)) // Include end date
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
          ticket.businessdetails.closer === closerName &&
          (!startDate || createdAtDate >= startDate) &&
          (!endDate ||
            createdAtDate <= new Date(endDate.getTime() + 24 * 60 * 60 * 1000)) // Include end date
        );
      })
      .reduce((total, ticket) => total + parseFloat(ticket.quotation.price), 0);
  };

  // Calculate commission based on total payment
  const calculateCommission = () => {
    const totalPayment = calculateTotalPayment(
      selectedCloser,
      startDate,
      endDate
    );

    const commissionThresholdLow = 500;
    const commissionThresholdMedium = 800;
    const commissionThresholdHigh = 1500;
    const commissionThresholdVeryHigh = 2000;

    const ninetyPercent = 0.9 * totalPayment;

    if (totalPayment <= commissionThresholdLow) {
      return 0; // No commission
    } else if (totalPayment <= commissionThresholdMedium) {
      const commission = 0.025 * ninetyPercent;
      return roundCommission(commission);
    } else if (totalPayment <= commissionThresholdHigh) {
      const commission = 0.05 * ninetyPercent;
      return roundCommission(commission);
    } else if (totalPayment <= commissionThresholdVeryHigh) {
      const commission = 0.075 * ninetyPercent;
      return roundCommission(commission);
    } else {
      const commission = 0.1 * ninetyPercent;
      return roundCommission(commission);
    }
  };

  const roundCommission = (commission) => {
    // Round off to 2 decimal places with adjustment
    const roundedCommission = Math.round(commission * 100) / 100;
    return roundedCommission;
  };

  // Get unique closer names
  const closers = [
    ...new Set(tickets.map((ticket) => ticket.businessdetails.closer)),
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

  const calculateBountyAmount = (totalPayment) => {
    if (totalPayment >= 7000 && totalPayment <= 10000) {
      return 10000;
    } else if (totalPayment > 10000) {
      return 15000;
    } else {
      return 0;
    }
  };

  // Function to filter tickets for a specific month
  const filterTicketsByMonth = (tickets, month) => {
    return tickets.filter((ticket) => {
      const createdAtDate = new Date(ticket.createdAt);
      return createdAtDate.getMonth() === month;
    });
  };

  // Function to calculate monthly values for each closer
  const calculateMonthlyValues = async (closer, month) => {
    try {
      const response = await fetch(
        `${apiUrl}/api/tickets/all-departments-ticket`
      );

      if (!response.ok) {
        throw new Error("Failed to fetch tickets");
      }

      const data = await response.json();
      const monthlyTickets = filterTicketsByMonth(data.payload, month);

      const totalSalary = calculateTotalPaymentForCloser(
        closer,
        monthlyTickets
      );
      const commissionRate = calculateCommissionRate(totalSalary);
      const commissionableAmount = calculateCommissionableAmountForFronter(
        closer,
        monthlyTickets
      );
      const netSalary = totalSalary * 0.9 * (commissionRate / 100);
      const bountyAmount = calculateBountyAmount(totalSalary);

      return {
        totalSalary,
        commissionableAmount,
        commissionRate,
        netSalary,
        bountyAmount,
      };
    } catch (error) {
      console.error("Error fetching tickets:", error.message);
      return null; // Handle error gracefully
    }
  };

  // Function to calculate total payment for a closer with a specific set of tickets
  const calculateTotalPaymentForCloser = (closer, tickets) => {
    return tickets.reduce(
      (total, ticket) => total + parseFloat(ticket.quotation.price),
      0
    );
  };

  // Function to calculate commissionable amount for a closer with a specific set of tickets
  const calculateCommissionableAmountForFronter = (closer, tickets) => {
    const totalPayment = calculateTotalPaymentForCloser(closer, tickets);
    const commissionableAmount = 0.9 * totalPayment;
    return roundCommission(commissionableAmount);
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

  // Function to calculate recurring sales
  const calculateRecurringSalesForMonth = (closerPayments, selectedMonth) => {
    // Filter payments for the selected month
    const paymentsForMonth = closerPayments.filter((payment) => {
      const paymentDate = new Date(payment.date);
      return paymentDate.getMonth() === selectedMonth;
    });

    // Filter payments with non-zero payment amounts and associated users
    const validPayments = paymentsForMonth.filter(
      (payment) => payment.payment > 0 && payment.user
    );

    // Take 90% of each valid payment and multiply by 5%
    const recurringSales = validPayments
      .map((payment) => 0.9 * payment.payment * 0.05)
      .reduce((total, recurring) => total + recurring, 0);

    return recurringSales;
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
            const values = closers.map((closer) =>
              calculateMonthlyValues(closer, selectedMonth)
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
        Closer's Salary Sheet - {getMonthName(selectedMonth)}
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
              const totalSalary = calculateTotalPayment(
                closer,
                startDate,
                endDate
              );
              const sumOfTenPercent = calculateSumOfTenPercent(
                tickets,
                closer,
                selectedMonth
              );

              const bountyAmount = calculateBountyAmount(totalSalary);

              // Find the payment history for the current closer
              const closerPaymentHistory = tickets
                .filter((ticket) => ticket.businessdetails.closer === closer)
                .map((ticket) => ticket.payment_history.slice(1)) // Skip the entry at index 0
                .flat();

              // Separate payments for the closer and other users
              const closerPayments = [];
              const otherUserPayments = [];

              // Process each payment in the payment history
              closerPaymentHistory.forEach((payment) => {
                if (payment.user === closer) {
                  // Payment associated with the closer
                  closerPayments.push(payment);
                } else {
                  // Payment associated with another user
                  otherUserPayments.push(payment);
                }
              });
              const recurringSalesForMonth = calculateRecurringSalesForMonth(
                closerPayments,
                selectedMonth
              );
              return (
                <React.Fragment key={closer}>
                  {/* Row for Closer's Payments */}
                  <TableRow>
                    <TableCell>{closer}</TableCell>
                    <TableCell>
                      <b>{`$${totalSalary}`}</b>
                    </TableCell>
                    <TableCell>
                      <b>{`$${sumOfTenPercent.toFixed(2)}`}</b>
                    </TableCell>
                    <TableCell>
                      <b>{`${bountyAmount.toFixed(2)} PKR`}</b>
                    </TableCell>
                    <TableCell>
                      <b>{`$${calculateRecurringSalesForMonth(
                        closerPayments,
                        selectedMonth
                      ).toFixed(2)}`}</b>
                    </TableCell>
                  </TableRow>

                  {/* Rows for Other User's Payments */}
                  {otherUserPayments.map((payment, index) => (
                    <TableRow key={`${closer}-other-user-${index}`}>
                      <TableCell>{payment.user}</TableCell>
                      <TableCell colSpan={3}></TableCell>
                      <TableCell>
                        <b>{`$${calculateRecurringSalesForMonth(
                          otherUserPayments,
                          selectedMonth
                        ).toFixed(2)}`}</b>
                      </TableCell>
                    </TableRow>
                  ))}

                  {/* Row for Recurring Sales */}
                  {/* <TableRow>
                    <TableCell colSpan={4}></TableCell>
                    <TableCell>
                      <b>{`$${calculateRecurringSales(closerPayments).toFixed(
                        2
                      )}`}</b>
                    </TableCell>
                  </TableRow> */}
                </React.Fragment>
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
