import React, { useState, useEffect } from "react";
import Table from "@mui/material/Table";
import TableBody from "@mui/material/TableBody";
import TableCell from "@mui/material/TableCell";
import InputBase from "@mui/material/InputBase";
import SearchIcon from "@mui/icons-material/Search";
import TableFooter from "@mui/material/TableFooter";
import TablePagination from "@mui/material/TablePagination";
import TableRow from "@mui/material/TableRow";
import TableHead from "@mui/material/TableHead";
import IconButton from "@mui/material/IconButton";
import MenuItem from "@mui/material/MenuItem";
import FormControl from "@mui/material/FormControl";
import Select from "@mui/material/Select";
import VisibilityIcon from "@mui/icons-material/Visibility";
import axios from "axios";
import "../../styles/Home/TicketCard.css";
import Button from "@mui/material/Button";
import Dialog from "@mui/material/Dialog";
import DialogTitle from "@mui/material/DialogTitle";
import DialogContent from "@mui/material/DialogContent";
import DialogActions from "@mui/material/DialogActions";
import TextField from "@mui/material/TextField";

import TablePaginationActions from "../Tickets/TicketsTablePagination/TicketsPagination";
import DisplayTicketDetails from "../Tickets/DisplayTicketDetails";
export default function LocalSeoActiveClients() {
  const apiUrl = process.env.REACT_APP_API_URL;
  const user = JSON.parse(localStorage.getItem("user"));
  const [page, setPage] = React.useState(0);
  const [rowsPerPage, setRowsPerPage] = React.useState(10);
  const [tickets, setTickets] = useState([]);
  const [searchQuery, setSearchQuery] = useState("");
  const [reportingDates, setReportingDates] = useState({});
  const [isTicketDetailsOpen, setIsTicketDetailsOpen] = useState(false);
  const [selectedTicketDetails, setSelectedTicketDetails] = useState(null);
  const [clientReportDate, setClientReportDate] = useState(0);
  const [nextReportDate, setNextReportDate] = useState("");
  const [openReportsDialog, setOpenReportsDialog] = useState(false);
  const [ticketSelected, setTicketSelected] = useState();
  const [editDialogOpen, setEditDialogOpen] = useState(false);
  const [selectedDateIndex, setSelectedDateIndex] = useState(null);
  const [newDate, setNewDate] = useState("");

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
  const handleReportDateChange = (event) => {
    setNextReportDate(event.target.value);
  };
  const handleReportsDialogClose = () => {
    setOpenReportsDialog(false);
  };
  const handleReportsDialogOpen = () => {
    setOpenReportsDialog(true);
  };
  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await fetch(
          `${apiUrl}/api/tickets?departmentId=${user?.department?._id}&salesDep=true`
        );
        if (response.ok) {
          const data = await response.json();

          // Filter only the tickets with an "Active" status
          const activeTickets = data.payload.filter(
            (ticket) => ticket.ActiveNotActive === "Active"
          );

          setTickets(activeTickets);
        } else {
          console.error("Error fetching data");
        }
      } catch (error) {
        console.error("Error fetching data", error);
      }
    };

    fetchData();
  }, []);

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
  // Function to handle the submission of a new report date
  const handleReportDateSubmit = async () => {
    try {
      if (ticketSelected && nextReportDate) {
        // Make the API request to update the report history with the new date
        const response = await axios.post(
          `${apiUrl}/api/tickets/update_report_history`,
          {
            reportDate: nextReportDate,
            ticketId: ticketSelected._id,
          }
        );

        if (response.status === 200) {
          // Update the local state with the updated ticket
          const updatedTicket = response.data.payload;
          setTickets((prevTickets) =>
            prevTickets.map((t) =>
              t._id === updatedTicket._id ? updatedTicket : t
            )
          );

          // Close the reports dialog
          handleReportsDialogClose();
        } else {
          console.error("Error updating report date");
        }
      } else {
        console.error("Invalid ticket or report date");
      }
    } catch (error) {
      console.error("Error updating report date", error);
    }
  };
  const handleEditReportingDate = async () => {
    try {
      if (ticketSelected && newDate) {
        const response = await axios.put(
          `${apiUrl}/api/tickets/update_client_reporting/${ticketSelected._id}/${selectedDateIndex}`,
          {
            clientReporting: newDate,
          }
        );

        if (response.status === 200) {
          const updatedTicket = response.data.payload;
          setTickets((prevTickets) =>
            prevTickets.map((t) =>
              t._id === updatedTicket._id ? updatedTicket : t
            )
          );

          // Close the reports dialog
          handleReportsDialogClose();
        } else {
          console.error("Error updating client reporting");
        }
      } else {
        console.error("Invalid ticket or client reporting date");
      }
    } catch (error) {
      console.error("Error updating client reporting", error);
    }
  };

  return (
    <>
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
            placeholder="Search Clients..."
            inputProps={{ "aria-label": "search" }}
            onChange={(e) => setSearchQuery(e.target.value)}
            onKeyPress={handleSearch}
          />
        </div>
      </div>
      <Table sx={{ minWidth: 800 }} aria-label="custom pagination table">
        <TableHead>
          <TableRow>
            <TableCell style={{ width: 160 }}>Business Name</TableCell>
            <TableCell style={{ width: 160 }}>Sales Person</TableCell>
            <TableCell style={{ width: 160 }}>Work Type</TableCell>
            <TableCell style={{ width: 160 }}>Active/Not Active</TableCell>
            <TableCell style={{ width: 160 }}>Subscription Date</TableCell>
            <TableCell style={{ width: 160 }}>Reporting Date</TableCell>
            <TableCell style={{ width: 160 }}>Details</TableCell>
            <TableCell style={{ width: 160 }}>Notes</TableCell>
            {user?.role === "Tier-1" || user?.role === "Tier-3" ? (
              <TableCell>Report To Client</TableCell>
            ) : null}
          </TableRow>
        </TableHead>
        <TableBody>
          {tickets
            .slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage)
            .map((ticket) => (
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
                {ticket.businessdetails && (
                  <TableCell style={{ width: 160 }} align="left">
                    {ticket.businessdetails.work_status}
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
                    background:
                      new Date(ticket.reportingDate) <= new Date()
                        ? "#ed08088f"
                        : "inherit",

                    color:
                      new Date(ticket.reportingDate) <= new Date()
                        ? "white"
                        : "black",
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
                  style={{
                    width: 180,
                    whiteSpace: "pre-line",
                    background: ticket.businessdetails.notes
                      ? "#ed08088f"
                      : "white",
                    color: ticket.businessdetails.notes ? "white" : "black",
                  }} // Apply the white-space property here
                  align="left"
                  contentEditable={true}
                  onBlur={(e) =>
                    handleNotesEdit(ticket._id, e.target.innerText)
                  }
                >
                  {ticket.businessdetails.notes}
                </TableCell>
                {user?.role === "Tier-1" || user?.role === "Tier-3" ? (
                  <TableCell style={{ width: 160 }}>
                    <Button
                      style={{ backgroundColor: "red" }}
                      variant="contained"
                      color="primary"
                      onClick={() => {
                        handleReportsDialogOpen();
                        setTicketSelected(ticket);
                        setClientReportDate(() => {
                          return ticket.clientReporting &&
                            ticket.clientReporting.length > 1
                            ? ticket.clientReporting
                                .slice(1)
                                .map((report, index) => (
                                  <li key={index + 1}>
                                    {report.clientReporting}
                                  </li>
                                ))
                            : "No Reports";
                        });
                      }}
                    >
                      Client Report
                    </Button>
                    <Dialog
                      open={openReportsDialog}
                      onClose={handleReportsDialogClose}
                    >
                      <DialogTitle style={{ textAlign: "center" }}>
                        {ticketSelected
                          ? `Reporting Dates - ${ticketSelected.businessdetails.businessName}`
                          : "Reporting Dates"}
                      </DialogTitle>
                      <DialogContent
                        style={{
                          overflowY: "auto",
                          maxHeight: "500px",
                        }}
                      >
                        <table style={{ width: "100%" }}>
                          <thead>
                            <tr>
                              <th>Work Type</th>
                              <th>Report Date</th>
                            </tr>
                          </thead>
                          <tbody>
                            {ticketSelected &&
                              ticketSelected?.clientReporting.map(
                                (p, index) =>
                                  p.clientReporting !== null && (
                                    <tr key={p.date}>
                                      <td style={{ textAlign: "center" }}>
                                        {
                                          ticketSelected.businessdetails
                                            .work_status
                                        }
                                      </td>
                                      <td style={{ textAlign: "center" }}>
                                        <div className="payment">
                                          {`${p.clientReporting}`}
                                          <button
                                            style={{
                                              marginLeft: "10px",
                                            }}
                                            onClick={() => {
                                              setEditDialogOpen(true);
                                              setSelectedDateIndex(index);
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

                          <TextField
                            label="Enter Report Date"
                            value={nextReportDate}
                            onChange={handleReportDateChange}
                            fullWidth
                          />
                          <Dialog
                            open={editDialogOpen}
                            onClose={() => setEditDialogOpen(false)}
                          >
                            <DialogTitle>
                              {` Edit Date: Old Date is
                           ${ticketSelected?.clientReporting[selectedDateIndex]?.clientReporting}`}
                            </DialogTitle>
                            <DialogContent>
                              <TextField
                                label="New Date"
                                value={newDate}
                                onChange={(e) => setNewDate(e.target.value)}
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
                                  setOpenReportsDialog(false);
                                  handleEditReportingDate();
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
                      </DialogContent>
                      <DialogActions>
                        <Button onClick={handleReportsDialogClose}>
                          Cancel
                        </Button>
                        <Button
                          onClick={handleReportDateSubmit}
                          color="primary"
                        >
                          Save
                        </Button>
                      </DialogActions>
                    </Dialog>
                  </TableCell>
                ) : null}
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
