import React, { useState, useEffect } from "react";
import Table from "@mui/material/Table";
import TableBody from "@mui/material/TableBody";
import TableCell from "@mui/material/TableCell";
import InputBase from "@mui/material/InputBase";
import SearchIcon from "@mui/icons-material/Search";
import TableRow from "@mui/material/TableRow";
import TableHead from "@mui/material/TableHead";
import IconButton from "@mui/material/IconButton";
import MenuItem from "@mui/material/MenuItem";
import FormControl from "@mui/material/FormControl";
import Select from "@mui/material/Select";
import VisibilityIcon from "@mui/icons-material/Visibility";
import axios from "axios";
import "../../../styles/Home/TicketCard.css";
import MarketingSalesCards from "./MarketingSalesCards";
import DisplayTicketDetails from "../../Tickets/DisplayTicketDetails";
import Header from "../../Header";
import {
  Button,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  TextField,
  Typography,
} from "@material-ui/core";

const PaidMarketingActiveClient = () => {
  const apiUrl = process.env.REACT_APP_API_URL;
  const user = JSON.parse(localStorage.getItem("user"));
  const [page, setPage] = React.useState(0);
  const [rowsPerPage, setRowsPerPage] = React.useState(5);
  const [tickets, setTickets] = useState([]);
  const [searchQuery, setSearchQuery] = useState("");
  const [reportingDates, setReportingDates] = useState({});
  const [isTicketDetailsOpen, setIsTicketDetailsOpen] = useState(false);
  const [selectedTicketDetails, setSelectedTicketDetails] = useState(null);
  const [openRecurringDialog, setOpenRecurringDialog] = useState(false);
  const [remainingPrice, setRemainingPrice] = useState("");
  const [ticketSelected, setTicketSelected] = useState();
  const [paymentRecieved, setPaymentRecieved] = useState(0);

  const handleRecurringDialogOpen = () => {
    setOpenRecurringDialog(true);
  };
  const handleRemainingPriceChange = (event) => {
    setRemainingPrice(event.target.value);
  };
  const handleRemainingEdit = (ticketId, remaining) => {
    // Make an API request to update the notes in the database
    fetch(`${apiUrl}/api/tickets/remaining-update`, {
      method: "PUT",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        ticketId,
        remaining: remaining,
      }),
    })
      .then((response) => response.json())
      .then((data) => {
        if (data.payload) {
          const updatedTickets = tickets.map((ticket) => {
            if (ticket._id === ticketId) {
              return {
                ...ticket,
                quotation: {
                  ...ticket.quotation,
                  remainingPrice: remaining,
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
  const handleRecurringDialogClose = () => {
    setOpenRecurringDialog(false);
  };
  // Function to fetch ticket details by ID
  const fetchTicketDetails = async (ticketId) => {
    try {
      const response = await fetch(`${apiUrl}/api/tickets/${ticketId}`);
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
  const closeTicketDetailsModal = () => {
    setIsTicketDetailsOpen(false);
  };
  const param1 = "651ada3c819ff0aec6af1380";
  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await fetch(
          `${apiUrl}/api/tickets?departmentId=${param1}&salesDep=true`
        );
        if (response.ok) {
          const data = await response.json();

          // Filter only the tickets with an "Active" status
          const activeTickets = data.payload.filter(
            (ticket) => ticket.ActiveNotActive === "Not Active"
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
        `${apiUrl}/api/tickets/reporting-date/${ticketId}`
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

  // Function to handle notes edit and update
  const handleNotesEdit = (ticketId, editedNotes) => {
    // Make an API request to update the notes in the database
    fetch(`${apiUrl}/api/tickets/notes-update`, {
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
    axios.put(`${apiUrl}/api/tickets/active-status/update`, {
      ticketId: ticket._id,
      status: temp,
    });
  };
  const handleRecurringSubmit = async () => {
    try {
      const response = await axios.post(
        `${apiUrl}/api/tickets/update_payment_history`,
        { ticketId: ticketSelected._id, payment: remainingPrice }
      );
    } catch (error) {}

    setOpenRecurringDialog(false);
  };
  return (
    <div>
      <Header />
      <MarketingSalesCards />
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
          placeholder="Search Clients..."
          inputProps={{ "aria-label": "search" }}
          onChange={(e) => setSearchQuery(e.target.value)}
          onKeyPress={handleSearch}
        />
      </div>
      <Table sx={{ minWidth: 800 }} aria-label="custom pagination table">
        <TableHead>
          <TableRow>
            <TableCell>Business Name</TableCell>
            <TableCell>Sales Person</TableCell>
            <TableCell>Active/Not Active</TableCell>
            <TableCell>Subscription Date</TableCell>
            <TableCell>Ad Platfrom</TableCell>
            <TableCell>Budget</TableCell>
            <TableCell>Details</TableCell>
            <TableCell>Notes</TableCell>
            {user?.department?._id === "651b3409819ff0aec6af1387" && (
              <TableCell>Recurring</TableCell>
            )}
          </TableRow>
        </TableHead>
        <TableBody>
          {tickets.map((ticket) => (
            <TableRow key={ticket._id}>
              {ticket.businessdetails && (
                <TableCell component="th" scope="row">
                  {ticket.businessdetails.clientName}
                </TableCell>
              )}
              {ticket.TicketDetails && (
                <TableCell style={{ width: 160 }} align="left">
                  {ticket.TicketDetails.assignor}
                </TableCell>
              )}
              <TableCell style={{ width: 160 }} align="left">
                <FormControl>
                  <Select
                    value={ticket.ActiveNotActive || "Active"}
                    onClick={() => handleClick(ticket)}
                    style={{
                      backgroundColor:
                        ticket.ActiveNotActive === "Active"
                          ? "#28a745"
                          : "#dc3545", // set background color for Select
                      color:
                        ticket.ActiveNotActive === "Active" ? "white" : "black", // set text color for better visibility
                    }}
                  >
                    <MenuItem value="Active">Active</MenuItem>
                    <MenuItem value="Not Active">Not Active</MenuItem>
                  </Select>
                </FormControl>
              </TableCell>
              <TableCell style={{ width: 160 }} align="left">
                {new Date(ticket.createdAt).toLocaleDateString()}
              </TableCell>
              <TableCell style={{ width: 160 }} align="left">
                {ticket.businessdetails.platform}
              </TableCell>
              <TableCell style={{ width: 160 }} align="left">
                {ticket.businessdetails.selectedBudget}
              </TableCell>
              <TableCell style={{ width: 160 }} align="left">
                <IconButton onClick={() => fetchTicketDetails(ticket._id)}>
                  <VisibilityIcon />
                </IconButton>
              </TableCell>
              <TableCell
                style={{ width: 180, whiteSpace: "pre-line" }} // Apply the white-space property here
                align="left"
                contentEditable={true}
                onBlur={(e) => handleNotesEdit(ticket._id, e.target.innerText)}
              >
                {ticket.businessdetails.notes}
              </TableCell>
              {user?.department?._id === "651b3409819ff0aec6af1387" && (
                <TableCell>
                  <Button
                    style={{ backgroundColor: "red" }}
                    variant="contained"
                    color="primary"
                    onClick={() => {
                      handleRecurringDialogOpen();
                      setTicketSelected(ticket);
                      setPaymentRecieved(() => {
                        let payment = 0;
                        ticket.payment_history.forEach((p) => {
                          payment = payment + p.payment;
                        });
                        return payment;
                      });
                    }}
                  >
                    Recurring
                  </Button>
                  {/* Recurring Dialog */}
                  <Dialog
                    open={openRecurringDialog}
                    onClose={handleRecurringDialogClose}
                  >
                    <DialogTitle style={{ textAlign: "center" }}>
                      {ticketSelected
                        ? `Payment History - ${ticketSelected.businessdetails.clientName}`
                        : "Payment History"}
                    </DialogTitle>
                    <DialogContent
                      style={{ overflowY: "auto", maxHeight: "500px" }}
                    >
                      <table style={{ width: "100%" }}>
                        <thead>
                          <tr>
                            <th>Date</th>
                            <th>Work Type</th>
                            <th>Received</th>
                          </tr>
                        </thead>
                        <tbody>
                          {ticketSelected &&
                            ticketSelected?.payment_history.map((p) => (
                              <tr key={p.date}>
                                <td style={{ textAlign: "center" }}>
                                  {new Date(p.date).toLocaleDateString()}
                                </td>
                                <td style={{ textAlign: "center" }}>
                                  {ticket.businessdetails.platform}
                                </td>
                                <td
                                  style={{ textAlign: "center" }}
                                >{`$${p.payment}`}</td>
                              </tr>
                            ))}
                        </tbody>
                      </table>
                      <hr
                        style={{
                          marginTop: "16px",
                          marginBottom: "16px",
                          border: "0",
                          borderTop: "2px solid #eee",
                        }}
                      />

                      <Typography>
                        <div
                          style={{
                            display: "flex",
                            justifyContent: "space-between",
                            fontWeight: "bold",
                          }}
                        >
                          <div>Payment Received:</div>
                          <div>{`$${paymentRecieved}`}</div>
                        </div>
                      </Typography>
                      <Typography>
                        <div
                          style={{
                            display: "flex",
                            justifyContent: "space-between",
                            fontWeight: "bold",
                          }}
                        >
                          <div>Remaining Charges:</div>
                          <div
                            class="remainingCharges"
                            contentEditable={true}
                            onBlur={(e) =>
                              handleRemainingEdit(
                                ticket._id,
                                e.target.innerText
                              )
                            }
                          >{`${ticket.quotation.remainingPrice}`}</div>
                        </div>
                      </Typography>
                      <TextField
                        label="Payment Received"
                        value={remainingPrice}
                        onChange={handleRemainingPriceChange}
                        fullWidth
                      />
                    </DialogContent>
                    <DialogActions>
                      <Button onClick={handleRecurringDialogClose}>
                        Cancel
                      </Button>
                      <Button onClick={handleRecurringSubmit} color="primary">
                        Save
                      </Button>
                    </DialogActions>
                  </Dialog>
                </TableCell>
              )}
            </TableRow>
          ))}
          {emptyRows > 0 && (
            <TableRow style={{ height: 53 * emptyRows }}>
              <TableCell colSpan={8} />
            </TableRow>
          )}
        </TableBody>
      </Table>
      {selectedTicketDetails && (
        <DisplayTicketDetails
          open={isTicketDetailsOpen}
          handleClose={closeTicketDetailsModal}
          ticketDetails={selectedTicketDetails}
        />
      )}
    </div>
  );
};

export default PaidMarketingActiveClient;
