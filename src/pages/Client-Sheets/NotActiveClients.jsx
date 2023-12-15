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
import SearchIcon from "@mui/icons-material/Search";
import InputBase from "@mui/material/InputBase";
import Header from "../Header";
import Button from "@mui/material/Button";
import DisplayTicketDetails from "../Tickets/DisplayTicketDetails";
import VisibilityIcon from "@mui/icons-material/Visibility";
import ActiveNotActiveCard from "./ActiveNotActiveCard";
import axios from "axios";
import { Dialog, DialogTitle, DialogActions } from "@mui/material";
import { Typography, TextField } from "@material-ui/core";
import DialogContent from "@mui/material/DialogContent";
import OneTimeServiceClientsCard from "./OneTimeClientCard";
import CardsSocialMediaTrack from "./SocialMediaClientSheet/CardsSocialMedia/CardsSocialMediaTrack";
import TablePaginationActions from "../Tickets/TicketsTablePagination/TicketsPagination";
import InActiveWebsiteClients from "../ClientHistory/WordpressClientSheet/NotActiveWebsiteClients";
export default function NotActiveClients() {
  const apiUrl = process.env.REACT_APP_API_URL;
  const user = JSON.parse(localStorage.getItem("user"));
  const [page, setPage] = React.useState(0);
  const [rowsPerPage, setRowsPerPage] = React.useState(10);
  const [tickets, setTickets] = useState([]);
  const [searchQuery, setSearchQuery] = useState("");
  const [remainingPrice, setRemainingPrice] = useState("");
  const [reportingDates, setReportingDates] = useState({});
  const [isTicketDetailsOpen, setIsTicketDetailsOpen] = useState(false);
  const [selectedTicketDetails, setSelectedTicketDetails] = useState(null);
  const [ticketSelected, setTicketSelected] = useState();
  const [paymentRecieved, setPaymentRecieved] = useState(0);
  const [openRecurringDialog, setOpenRecurringDialog] = useState(false);

  <TablePaginationActions />;
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
  const handleRemainingPriceChange = (event) => {
    setRemainingPrice(event.target.value);
  };
  const handleRecurringDialogOpen = () => {
    setOpenRecurringDialog(true);
  };
  // Function to close the recurring dialog
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

  const closeTicketDetailsModal = () => {
    setIsTicketDetailsOpen(false);
  };

  const clearSelectedTicketDetails = () => {
    setSelectedTicketDetails(null);
  };
  // const depart_id = "651ada78819ff0aec6af1381" || "651b3409819ff0aec6af1387";

  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await fetch(
          `${apiUrl}/api/tickets?departmentId=${user?.department._id}&salesDep=true`
        );
        if (response.ok) {
          const data = await response.json();

          // Filter only the tickets with an "Not Active" status
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

  const handleChangePage = (event, newPage) => {
    setPage(newPage);
  };

  const handleChangeRowsPerPage = (event) => {
    setRowsPerPage(parseInt(event.target.value, 10));
    setPage(0);
  };

  // Function to update reporting date
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
  // Function to handle reporting date edit
  const handleReportingDateEdit = (ticketId, editedDate) => {
    // Convert the edited content back to a date format
    const newReportingDate = new Date(editedDate);

    // Call the updateReportingDate function
    updateReportingDate(ticketId, newReportingDate);
  };

  // Function to handle the "Recurring" button click
  const handleRecurringClick = (ticketId) => {
    // Get the current reporting date
    const currentReportingDate = new Date(reportingDates[ticketId]);

    // Calculate one month later date
    const oneMonthLaterDate = new Date(
      currentReportingDate.getFullYear(),
      currentReportingDate.getMonth() + 1,
      currentReportingDate.getDate()
    );

    // Make an API request to update the reporting date in the database
    fetch(`${apiUrl}/api/tickets/reportingDate-update`, {
      method: "PUT",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        ticketId,
        reportingDate: oneMonthLaterDate.toISOString(),
      }),
    })
      .then((response) => response.json())
      .then((data) => {
        if (data.payload) {
          // If the update is successful, update the local state with the new reporting date
          setReportingDates((prevReportingDates) => ({
            ...prevReportingDates,
            [ticketId]: oneMonthLaterDate.toISOString(),
          }));
        } else {
          console.error("Error updating reporting date");
        }
      })
      .catch((error) => {
        console.error("Error updating reporting date", error);
      });
  };
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
  // Function to handle submission of recurring data
  const handleRecurringSubmit = async () => {
    try {
      const currentReportingDate = new Date(reportingDates[ticketSelected._id]);
      const oneMonthLaterDate = new Date(
        currentReportingDate.getFullYear(),
        currentReportingDate.getMonth() + 1,
        currentReportingDate.getDate()
      );

      // Update the reporting date using the `api/tickets/reportingDate-update` endpoint
      await axios.put(`${apiUrl}/api/tickets/reportingDate-update`, {
        ticketId: ticketSelected._id,
        reportingDate: oneMonthLaterDate.toISOString(),
      });
      const response = await axios.post(
        `${apiUrl}/api/tickets/update_payment_history`,
        { ticketId: ticketSelected._id, payment: remainingPrice }
      );
    } catch (error) {}

    setOpenRecurringDialog(false);
  };
  return (
    <>
      <Header />
      <div className="cards">
        <ActiveNotActiveCard />
        {(user?.department._id === "651ada78819ff0aec6af1381" ||
          user?.department._id === "651ada98819ff0aec6af1382") && (
          <CardsSocialMediaTrack />
        )}
        {user?.department._id === "65195c8f504d80e8f11b0d15" && (
          <OneTimeServiceClientsCard />
        )}
      </div>
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
        {/* Social media and reviews */}
        {(user?.department._id === "651ada78819ff0aec6af1381" ||
          user?.department._id === "651ada98819ff0aec6af1382") && (
          <Table sx={{ minWidth: 800 }} aria-label="custom pagination table">
            <TableHead>
              <TableRow>
                <TableCell>Business Name</TableCell>
                <TableCell>Sales Person</TableCell>
                <TableCell>Active/Not Active</TableCell>
                <TableCell>Subscription Date</TableCell>
                <TableCell>Reporting Date</TableCell>
                <TableCell>Details</TableCell>
                <TableCell>Notes</TableCell>
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
                              ? "#049404"
                              : "red", // set background color for Select
                          color:
                            ticket.ActiveNotActive === "Active"
                              ? "white"
                              : "black",
                        }}
                      >
                        <MenuItem value="Active">Active</MenuItem>
                        <MenuItem value="Not Active">Not Active</MenuItem>
                      </Select>
                    </FormControl>
                  </TableCell>
                  <TableCell
                    style={{ width: 160, cursor: "pointer" }}
                    align="left"
                    title="Format: MM-DD-YYYY" // Tooltip for date format
                  >
                    {new Date(ticket.createdAt).toLocaleDateString()}
                  </TableCell>
                  <TableCell
                    style={{
                      width: 160,
                      cursor: "pointer",
                      color:
                        new Date(ticket.reportingDate) <= new Date()

                          ? "white"
                          : "black",
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
                    <IconButton onClick={() => fetchTicketDetails(ticket._id)}>
                      <VisibilityIcon />
                    </IconButton>
                  </TableCell>
                  <TableCell
                    style={{ width: 180, whiteSpace: "pre-line" }} // Apply the white-space property here
                    align="left"
                    contentEditable={true}
                    onBlur={(e) =>
                      handleNotesEdit(ticket._id, e.target.innerText)
                    }
                  >
                    {ticket.businessdetails.notes}
                  </TableCell>
                </TableRow>
              ))}
              {emptyRows > 0 && (
                <TableRow style={{ height: 53 * emptyRows }}>
                  <TableCell colSpan={8} />
                </TableRow>
              )}
            </TableBody>
            <TableFooter>
              <TableRow>
                <TablePagination
                  rowsPerPageOptions={[10, 20, 25, { label: "All", value: -1 }]}
                  colSpan={8}
                  count={tickets?.length ?? 0} // Ensure tickets and tickets.length are defined
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
                  ActionsComponent={TablePaginationActions}
                />
              </TableRow>
            </TableFooter>
          </Table>
        )}
        {/*Website SEO */}
        {user?.department._id === "65195c8f504d80e8f11b0d15" && (
          <Table sx={{ minWidth: 800 }} aria-label="custom pagination table">
            <TableHead>
              <TableRow>
                <TableCell>Business Name</TableCell>
                <TableCell>Sales Person</TableCell>
                <TableCell>Work Status</TableCell>
                <TableCell>Active/Not Active</TableCell>
                <TableCell>Subscription Date</TableCell>
                <TableCell>Reporting Date</TableCell>
                <TableCell>Details</TableCell>
                <TableCell>Notes</TableCell>
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
                  {ticket.businessdetails && (
                    <TableCell style={{ width: 160 }} align="left">
                      {ticket.businessdetails.workStatus}
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
                              ? "#049404"
                              : "red", // set background color for Select
                          color:
                            ticket.ActiveNotActive === "Active"
                              ? "white"
                              : "black",
                        }}
                      >
                        <MenuItem value="Active">Active</MenuItem>
                        <MenuItem value="Not Active">Not Active</MenuItem>
                      </Select>
                    </FormControl>
                  </TableCell>
                  <TableCell
                    style={{ width: 160, cursor: "pointer" }}
                    align="left"
                    title="Format: MM-DD-YYYY" // Tooltip for date format
                  >
                    {new Date(ticket.createdAt).toLocaleDateString()}
                  </TableCell>
                  <TableCell
                    style={{
                      width: 160,
                      cursor: "pointer",
                      color:
                        new Date(ticket.reportingDate) <= new Date()

                          ? "white"
                          : "black",
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
                    <IconButton onClick={() => fetchTicketDetails(ticket._id)}>
                      <VisibilityIcon />
                    </IconButton>
                  </TableCell>
                  <TableCell
                    style={{ width: 180, whiteSpace: "pre-line" }} // Apply the white-space property here
                    align="left"
                    contentEditable={true}
                    onBlur={(e) =>
                      handleNotesEdit(ticket._id, e.target.innerText)
                    }
                  >
                    {ticket.businessdetails.notes}
                  </TableCell>
                </TableRow>
              ))}
              {emptyRows > 0 && (
                <TableRow style={{ height: 53 * emptyRows }}>
                  <TableCell colSpan={8} />
                </TableRow>
              )}
            </TableBody>
            <TableFooter>
              <TableRow>
                <TablePagination
                  rowsPerPageOptions={[5, 10, 25, { label: "All", value: -1 }]}
                  colSpan={8}
                  count={tickets?.length ?? 0} // Ensure tickets and tickets.length are defined
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
                  ActionsComponent={TablePaginationActions}
                />
              </TableRow>
            </TableFooter>
          </Table>
        )}
        {/* Local SEO / GMB Optimization */}
        {user?.department._id === "65195c4b504d80e8f11b0d13" && (
          <Table sx={{ minWidth: 800 }} aria-label="custom pagination table">
            <TableHead>
              <TableRow>
                <TableCell>Business Name</TableCell>
                <TableCell>Sales Person</TableCell>
                <TableCell>Work Status</TableCell>
                <TableCell>Active/Not Active</TableCell>
                <TableCell>Subscription Date</TableCell>
                <TableCell>Reporting Date</TableCell>
                <TableCell>Details</TableCell>
                <TableCell>Notes</TableCell>
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
                  {ticket.businessdetails && (
                    <TableCell style={{ width: 160 }} align="left">
                      {ticket.businessdetails.workStatus}
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
                              ? "#049404"
                              : "red", // set background color for Select
                          color:
                            ticket.ActiveNotActive === "Active"
                              ? "white"
                              : "black",
                        }}
                      >
                        <MenuItem value="Active">Active</MenuItem>
                        <MenuItem value="Not Active">Not Active</MenuItem>
                      </Select>
                    </FormControl>
                  </TableCell>
                  <TableCell
                    style={{ width: 160, cursor: "pointer" }}
                    align="left"
                    title="Format: MM-DD-YYYY" // Tooltip for date format
                  >
                    {new Date(ticket.createdAt).toLocaleDateString()}
                  </TableCell>
                  <TableCell
                    style={{
                      width: 160,
                      cursor: "pointer",
                      color:
                        new Date(ticket.reportingDate) <= new Date()

                          ? "white"
                          : "black",
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
                    <IconButton onClick={() => fetchTicketDetails(ticket._id)}>
                      <VisibilityIcon />
                    </IconButton>
                  </TableCell>
                  <TableCell
                    style={{ width: 180, whiteSpace: "pre-line" }} // Apply the white-space property here
                    align="left"
                    contentEditable={true}
                    onBlur={(e) =>
                      handleNotesEdit(ticket._id, e.target.innerText)
                    }
                  >
                    {ticket.businessdetails.notes}
                  </TableCell>
                </TableRow>
              ))}
              {emptyRows > 0 && (
                <TableRow style={{ height: 53 * emptyRows }}>
                  <TableCell colSpan={8} />
                </TableRow>
              )}
            </TableBody>
            <TableFooter>
              <TableRow>
                <TablePagination
                  rowsPerPageOptions={[5, 10, 25, { label: "All", value: -1 }]}
                  colSpan={8}
                  count={tickets?.length ?? 0} // Ensure tickets and tickets.length are defined
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
                  ActionsComponent={TablePaginationActions}
                />
              </TableRow>
            </TableFooter>
          </Table>
        )}
        {/* Paid Marketing */}
        {user?.department._id === "651ada3c819ff0aec6af1380" && (
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
                              ? "#049404"
                              : "red", // set background color for Select
                          color:
                            ticket.ActiveNotActive === "Active"
                              ? "white"
                              : "black",
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
                    onBlur={(e) =>
                      handleNotesEdit(ticket._id, e.target.innerText)
                    }
                  >
                    {ticket.businessdetails.notes}
                  </TableCell>
                </TableRow>
              ))}
              {emptyRows > 0 && (
                <TableRow style={{ height: 53 * emptyRows }}>
                  <TableCell colSpan={8} />
                </TableRow>
              )}
            </TableBody>
            <TableFooter>
              <TableRow>
                <TablePagination
                  rowsPerPageOptions={[10, 20, 25, { label: "All", value: -1 }]}
                  colSpan={8}
                  count={tickets?.length ?? 0} // Ensure tickets and tickets.length are defined
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
                  ActionsComponent={TablePaginationActions}
                />
              </TableRow>
            </TableFooter>
          </Table>
        )}
        {/* Wordpress */}
        {user?.department._id === "65195c81504d80e8f11b0d14" && (
          <InActiveWebsiteClients />
        )}
      </TableContainer>
      {selectedTicketDetails && (
        <DisplayTicketDetails
          open={isTicketDetailsOpen}
          handleClose={closeTicketDetailsModal}
          ticketDetails={selectedTicketDetails}
        />
      )}
    </>
  );
}
