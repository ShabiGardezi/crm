import React, { useEffect, useState } from "react";
import axios from "axios";
import {
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Paper,
} from "@mui/material";
import Header from "./Header";

const TicketList = () => {
  const [tickets, setTickets] = useState([]);

  //   useEffect(() => {
  // Fetch tickets from your server using an API call
  // Example:
  // axios.get("http://localhost:5000/api/tickets")
  //   .then((response) => {
  //     setTickets(response.data.payload);
  //   })
  //   .catch((error) => {
  //     // Handle error
  //   });
  //   }, []);

  return (
    <div>
      <Header />
      <h2>Ticket List</h2>
      <TableContainer component={Paper}>
        <Table>
          <TableHead>
            <TableRow>
              <TableCell>Data</TableCell>
              <TableCell>Created By</TableCell>
              <TableCell>Major Assignee</TableCell>
              <TableCell>Status</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {tickets.map((ticket) => (
              <TableRow key={ticket._id}>
                <TableCell>{ticket.data}</TableCell>
                <TableCell>{ticket.created_by}</TableCell>
                <TableCell>{ticket.majorAssignee}</TableCell>
                <TableCell>{ticket.status}</TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </TableContainer>
    </div>
  );
};

export default TicketList;
