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
  const [editDialogOpen, setEditDialogOpen] = useState(false);
  const [selectedPaymentIndex, setSelectedPaymentIndex] = useState(null);
  const [newPayment, setNewPayment] = useState("");
  const handleEditPayment = async () => {
    try {
      if (ticketSelected && selectedPaymentIndex !== null) {
        // Make the API request to update the payment at the selected index
        const response = await axios.put(
          `${apiUrl}/api/tickets/update_payment/${ticketSelected._id}/${selectedPaymentIndex}`,
          { payment: parseFloat(newPayment) }
        );

        if (response.status === 200) {
          // Update the local state with the edited payment
          const updatedTicket = response.data.payload;
          setTickets((prevTickets) =>
            prevTickets.map((t) =>
              t._id === updatedTicket._id ? updatedTicket : t
            )
          );
          // Close the dialog box
          setEditDialogOpen(false);
        } else {
          console.error("Error updating payment");
        }
      } else {
        console.error("Invalid ticket or payment index");
      }
    } catch (error) {
      console.error("Error updating payment", error);
    }
  };
  const handleRecurringDialogOpen = () => {
    setOpenRecurringDialog(true);
  };
  const handleRemainingPriceChange = (event) => {
    setRemainingPrice(event.target.value);
  };
  const handleRemainingEdit = (ticketId, remaining) => {
    // Convert empty string to 0
    const remainingValue = remaining === "" ? 0 : remaining;

    // Make an API request to update the notes in the database
    fetch(`${apiUrl}/api/tickets/remaining-update`, {
      method: "PUT",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        ticketId,
        remaining: remainingValue,
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
                  remainingPrice: remainingValue,
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
        departmentId: user.department._id,
        departmentName: user.department.name,
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
  const updateReportingDate = async (ticketId, newReportingDate) => {
    try {
      const response = await fetch(
        `${apiUrl}/api/tickets/reportingDate-update`,
        {
          method: "PUT",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            ticketId,
            reportingDate: newReportingDate.toISOString(),
          }),
        }
      );

      if (response.ok) {
        // Reporting Date updated successfully
        // Update the state to display the updated date
        setReportingDates((prevReportingDates) => ({
          ...prevReportingDates,
          [ticketId]: newReportingDate.toISOString(),
        }));
      } else {
        console.error("Error updating reporting date");
      }
    } catch (error) {
      console.error("Error updating reporting date", error);
    }
  };
  const handleReportingDateEdit = (ticketId, editedDate) => {
    // Convert the edited content back to a date format
    const newReportingDate = new Date(editedDate);

    // Call the updateReportingDate function
    updateReportingDate(ticketId, newReportingDate);
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
            <TableCell>Reporting Date</TableCell>
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
                  {ticket.businessdetails.businessName}
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
              <TableCell
                style={{
                  width: 160,
                  cursor: "pointer",
                  background:
                    new Date(ticket.reportingDate) <= new Date()
                      ? "red"
                      : "inherit",
                }}
                title="Format: MM-DD-YYYY" // Tooltip for date format
                align="left"
                contentEditable={true}
                onBlur={(e) =>
                  handleReportingDateEdit(ticket._id, e.target.innerText)
                }
              >
                {new Date(ticket.reportingDate).toLocaleDateString()}
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
                style={{
                  width: 180,
                  whiteSpace: "pre-line",
                  background: ticket.businessdetails.notes ? "red" : "white",
                  color: ticket.businessdetails.notes ? "white" : "black",
                }} // Apply the white-space property here
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
                        ? `Payment History - ${ticketSelected.businessdetails.businessName}`
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
                            ticketSelected?.payment_history.map(
                              (p, index) =>
                                // Check if payment is not null before rendering the row
                                p.payment !== null && (
                                  <tr key={p.date}>
                                    <td style={{ textAlign: "center" }}>
                                      {new Date(p.date).toLocaleDateString()}
                                    </td>
                                    <td style={{ textAlign: "center" }}>
                                      {
                                        ticketSelected.businessdetails
                                          .work_status
                                      }
                                    </td>
                                    <td style={{ textAlign: "center" }}>
                                      <div className="payment">
                                        {`$${p.payment}`}
                                        <button
                                          style={{
                                            marginLeft: "10px",
                                            background: "white",
                                            border: "none",
                                            textDecoration: "underline",
                                            cursor: "pointer",
                                          }}
                                          onClick={() => {
                                            setEditDialogOpen(true);
                                            setSelectedPaymentIndex(index);
                                          }}
                                        >
                                          Edit
                                        </button>
                                      </div>
                                    </td>
                                  </tr>
                                )
                            )}
                        </tbody>
                        <Dialog
                          open={editDialogOpen}
                          onClose={() => setEditDialogOpen(false)}
                        >
                          <DialogTitle>
                            {` Edit Payment: Old Payment is
                              $${ticketSelected?.payment_history[selectedPaymentIndex]?.payment}`}
                          </DialogTitle>
                          <DialogContent>
                            <TextField
                              label="New Payment"
                              value={newPayment}
                              onChange={(e) => setNewPayment(e.target.value)}
                              fullWidth
                            />
                          </DialogContent>
                          <DialogActions>
                            <Button onClick={() => setEditDialogOpen(false)}>
                              Cancel
                            </Button>
                            <Button
                              onClick={() => {
                                setEditDialogOpen(false);
                                setOpenRecurringDialog(false);
                                handleEditPayment();
                              }}
                              color="primary"
                            >
                              Save
                            </Button>
                          </DialogActions>
                        </Dialog>
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
                          >
                            {" "}
                            {`${ticketSelected?.quotation.remainingPrice}`}
                          </div>
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
