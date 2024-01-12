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
  const [selectedFronter, setSelectedFronter] = useState("All");
  const [fronterTotalPayment, setFronterTotalPayment] = useState({});
  const [fronterCommission, setFronterCommission] = useState({});
  const [startDate, setStartDate] = useState(null);
  const [endDate, setEndDate] = useState(null);

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

  // Calculate total payment for each fronter
  const calculateTotalPayment = (fronterName, startDate, endDate) => {
    return tickets
      .filter((ticket) => {
        const createdAtDate = new Date(ticket.createdAt);

        // Check if the ticket's createdAt date is within the selected range
        return (
          ticket.businessdetails.fronter === fronterName &&
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
      selectedFronter,
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

  // Get unique fronter names
  const fronters = [
    ...new Set(tickets.map((ticket) => ticket.businessdetails.fronter)),
  ];

  // Calculate total payment for all fronters
  const calculateTotalPaymentForAll = () => {
    return fronters.reduce((total, fronter) => {
      const totalPayment = calculateTotalPayment(fronter, startDate, endDate);
      return total + totalPayment;
    }, 0);
  };
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

  return (
    <div>
      <Header />
      <Typography
        variant="h3"
        style={{ textAlign: "center", marginBottom: "2%" }}
        fontFamily={"revert-layer"}
      >
        Fronter's Salary Sheet
      </Typography>

      <TableContainer component={Paper}>
        <Table sx={{ minWidth: 800 }} aria-label="custom pagination table">
          <TableHead>
            <TableRow>
              <TableCell>Agent Name</TableCell>
              <TableCell>Total Salary</TableCell>
              <TableCell>Commissionable Amount</TableCell>
              <TableCell>Commission Rate</TableCell>
              <TableCell>Net Salary</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {fronters.map((fronter) => {
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
