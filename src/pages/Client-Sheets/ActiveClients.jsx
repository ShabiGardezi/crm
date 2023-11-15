import React, { useState, useEffect } from "react";
import Table from "@mui/material/Table";
import TableBody from "@mui/material/TableBody";
import TableCell from "@mui/material/TableCell";
import TableContainer from "@mui/material/TableContainer";
import TableFooter from "@mui/material/TableFooter";
import TablePagination from "@mui/material/TablePagination";
import TableRow from "@mui/material/TableRow";
import TableHead from "@mui/material/TableHead";
import Paper from "@mui/material/Paper";
import IconButton from "@mui/material/IconButton";
import MenuItem from "@mui/material/MenuItem";
import FormControl from "@mui/material/FormControl";
import Select from "@mui/material/Select";
import Header from "../Header";
import VisibilityIcon from "@mui/icons-material/Visibility";
import ActiveNotSctiveCard from "./ActiveNotActiveCard";
import axios from "axios";
import OneTimeServiceClientsCard from "./OneTimeClientCard";
import DisplayTicketDetails from "../Tickets/DisplayTicketDetails";
import "../../styles/Home/TicketCard.css";
import CardsSocialMediaTrack from "./SocialMediaClientSheet/CardsSocialMedia/CardsSocialMediaTrack";
import TablePaginationActions from "../Tickets/TicketsTablePagination/TicketsPagination";
import LocalSeoActiveClients from "../ActiveClients/LocalSeoActiveClients";
import SocialMedia_ReviewsActiveClients from "../ActiveClients/SocialMedia_ReviewsActiveClients";
import PaidMarketingActiveClient from "../ActiveClients/PaidMarketingActiveClient";
import ActiveWebsiteClients from "../ActiveClients/ActiveWesbiteClients";
export default function ActiveClients() {
  const user = JSON.parse(localStorage.getItem("user"));
  const [page, setPage] = React.useState(0);
  const [rowsPerPage, setRowsPerPage] = React.useState(5);
  const [tickets, setTickets] = useState([]);
  const [reportingDates, setReportingDates] = useState({});
  const [isTicketDetailsOpen, setIsTicketDetailsOpen] = useState(false);
  const [selectedTicketDetails, setSelectedTicketDetails] = useState(null);
  <TablePaginationActions />;
  // Function to fetch ticket details by ID
  const fetchTicketDetails = async (ticketId) => {
    try {
      const response = await fetch(
        `http://localhost:5000/api/tickets/${ticketId}`
      );
      if (response.ok) {
        const data = await response.json();
        setSelectedTicketDetails(data.payload);
        setIsTicketDetailsOpen(true);
      } else {
        console.error("Error fetching ticket details");
      }
    } catch (error) {
      console.error("Error fetching ticket details", error);
    }
  };

  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await fetch(
          `http://localhost:5000/api/tickets?departmentId=${user?.department?._id}`
        );
        if (response.ok) {
          const data = await response.json();

          // Filter only the tickets with an "Active" status
          const activeTickets = data.payload.filter(
            (ticket) => ticket.ActiveNotActive === "Active"
          );

          setTickets(activeTickets);
          data.payload.forEach((ticket) => {
            fetchReportingDate(ticket._id);
          });
        } else {
          console.error("Error fetching data");
        }
      } catch (error) {
        console.error("Error fetching data", error);
      }
    };

    fetchData();
  }, []);

  const fetchReportingDate = async (ticketId) => {
    try {
      const response = await fetch(
        `http://localhost:5000/api/tickets/reporting-date/${ticketId}`
      );
      if (response.ok) {
        const data = await response.json();
        if (data.payload) {
          setReportingDates((prevReportingDates) => ({
            ...prevReportingDates,
            [ticketId]: data.payload,
          }));
        } else {
          // Set the reporting date to one month later than createdAt
          const createdAtDate = new Date(
            tickets.find((ticket) => ticket._id === ticketId).createdAt
          );
          const oneMonthLaterDate = new Date(
            createdAtDate.getFullYear(),
            createdAtDate.getMonth() + 1,
            createdAtDate.getDate()
          );
          setReportingDates((prevReportingDates) => ({
            ...prevReportingDates,
            [ticketId]: oneMonthLaterDate.toISOString(),
          }));
        }
      } else {
        console.error("Error fetching reporting date");
      }
    } catch (error) {
      console.error("Error fetching reporting date", error);
    }
  };

  const emptyRows =
    page > 0 ? Math.max(0, (1 + page) * rowsPerPage - tickets.length) : 0;

  const handleChangePage = (event, newPage) => {
    setPage(newPage);
  };

  const handleChangeRowsPerPage = (event) => {
    setRowsPerPage(parseInt(event.target.value, 10));
    setPage(0);
  };

  // Function to handle notes edit and update
  const handleNotesEdit = (ticketId, editedNotes) => {
    // Make an API request to update the notes in the database
    fetch("http://localhost:5000/api/tickets/notes-update", {
      method: "PUT",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        ticketId,
        notes: editedNotes,
      }),
    })
      .then((response) => response.json())
      .then((data) => {
        if (data.payload) {
          // If the update is successful, update the local state with the edited notes
          const updatedTickets = tickets.map((ticket) => {
            if (ticket._id === ticketId) {
              return {
                ...ticket,
                businessdetails: {
                  ...ticket.businessdetails,
                  notes: editedNotes,
                },
              };
            }
            return ticket;
          });
          setTickets(updatedTickets);
        } else {
          console.error("Error updating notes");
        }
      })
      .catch((error) => {
        console.error("Error updating notes", error);
      });
  };

  const handleClick = (ticket) => {
    let temp = "";
    if (ticket.ActiveNotActive === "Active") {
      temp = "Not Active";
    } else temp = "Active";
    const newState = tickets.map((p) => {
      if (p._id === ticket._id) return { ...p, ActiveNotActive: temp };
      return p;
    });
    setTickets(newState);
    axios.put("http://localhost:5000/api/tickets/active-status/update", {
      ticketId: ticket._id,
      status: temp,
    });
  };
  return (
    <>
      <Header />
      <div className="cards">
        <ActiveNotSctiveCard />
        {user?.department._id === "65195c8f504d80e8f11b0d15" && (
          <OneTimeServiceClientsCard />
        )}
      </div>
      {/* Social Media / Customer Reviews Management and Reviews */}
      {(user?.department._id === "651ada78819ff0aec6af1381" ||
        user?.department._id === "651ada98819ff0aec6af1382") && (
        <CardsSocialMediaTrack />
      )}
      <TableContainer component={Paper}>
        {/* Social Media / Customer Reviews Management and Reviews */}
        {(user?.department._id === "651ada78819ff0aec6af1381" ||
          user?.department._id === "651ada98819ff0aec6af1382") && (
          <SocialMedia_ReviewsActiveClients />
        )}
        {/* Paid Marketing */}
        {user?.department._id === "651ada3c819ff0aec6af1380" && (
          <PaidMarketingActiveClient />
        )}
        {/* Local Seo & Web Seo */}
        {(user?.department._id === "65195c4b504d80e8f11b0d13" ||
          user?.department._id === "65195c8f504d80e8f11b0d15") && (
          <LocalSeoActiveClients />
        )}
      </TableContainer>
    </>
  );
}
