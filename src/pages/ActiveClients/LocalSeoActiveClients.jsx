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
import { Button } from "@mui/material";
import MenuItem from "@mui/material/MenuItem";
import FormControl from "@mui/material/FormControl";
import Select from "@mui/material/Select";
import VisibilityIcon from "@mui/icons-material/Visibility";
import axios from "axios";
import "../../styles/Home/TicketCard.css";
import TablePaginationActions from "../Tickets/TicketsTablePagination/TicketsPagination";
import { Dialog, DialogTitle, DialogActions } from "@mui/material";
import DisplayTicketDetails from "../Tickets/DisplayTicketDetails";
export default function LocalSeoActiveClients() {
  const apiUrl = process.env.REACT_APP_API_URL;
  const user = JSON.parse(localStorage.getItem("user"));
  const [page, setPage] = React.useState(0);
  const [rowsPerPage, setRowsPerPage] = React.useState(10);
  const [tickets, setTickets] = useState([]);
  const [searchQuery, setSearchQuery] = useState("");
  const [openRecurringDialog, setOpenRecurringDialog] = useState(false);
  const [reportingDates, setReportingDates] = useState({});
  const [isTicketDetailsOpen, setIsTicketDetailsOpen] = useState(false);
  const [selectedTicketDetails, setSelectedTicketDetails] = useState(null);
  const [price, setPrice] = useState("");
  const [advancePrice, setAdvancePrice] = useState("");
  const [remainingPrice, setRemainingPrice] = useState("");
  // Function to open the recurring dialog and reset state values
  const handleRecurringDialogOpen = () => {
    setOpenRecurringDialog(true);
    setPrice(""); // Set price to an empty string or 0 if needed
    setAdvancePrice(""); // Set advancePrice to an empty string or 0 if needed
    setRemainingPrice(""); // Set remainingPrice to an empty string or 0 if needed
  };

  // Function to close the recurring dialog
  const handleRecurringDialogClose = () => {
    setOpenRecurringDialog(false);
  };
  // Function to handle submission of recurring data
  const handleRecurringSubmit = () => {
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

  // Function to handle form field changes
  const handlePriceChange = (event) => {
    const { value } = event.target;

    // Convert the input value to a float, or 0 if it's not a valid number
    const updatedPrice = parseFloat(value) || 0;
    const updatedAdvancePrice = parseFloat(advancePrice) || 0;

    // Calculate the remaining price
    const remaining = updatedPrice - updatedAdvancePrice;

    // Update the state variables for price and remaining price
    setPrice(updatedPrice);
    setRemainingPrice(remaining);
  };

  const handleAdvancePriceChange = (event) => {
    const { value } = event.target;

    // Convert the input value to a float, or 0 if it's not a valid number
    const updatedPrice = parseFloat(price) || 0;
    const updatedAdvancePrice = parseFloat(value) || 0;

    // Calculate the remaining price
    const remaining = updatedPrice - updatedAdvancePrice;

    // Update the state variables for advance price and remaining price
    setAdvancePrice(updatedAdvancePrice);
    setRemainingPrice(remaining);
  };

  const handleRemainingPriceChange = (event) => {
    setRemainingPrice(event.target.value);
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
            <TableCell>Business Name</TableCell>
            <TableCell>Sales Person</TableCell>
            <TableCell>Work Type</TableCell>
            <TableCell>Active/Not Active</TableCell>
            <TableCell>Subscription Date</TableCell>
            <TableCell>Reporting Date</TableCell>
            <TableCell>Details</TableCell>
            <TableCell>Notes</TableCell>
            <TableCell>Recurring</TableCell>
          </TableRow>
        </TableHead>
        <TableBody>
          {tickets
            .slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage)
            .map((ticket) => (
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
                      new Date(ticket.reportingDate).toLocaleDateString() ===
                      new Date().toLocaleDateString()
                        ? "red"
                        : "inherit",
                    color:
                      new Date(ticket.reportingDate).toLocaleDateString() ===
                      new Date().toLocaleDateString()
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
                    background: ticket.businessdetails.notes ? "red" : "white",
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
                <TableCell>
                  <Button
                    style={{ backgroundColor: "red" }}
                    variant="contained"
                    color="primary"
                    onClick={() => {
                      handleRecurringDialogOpen();
                      handleRecurringClick(ticket._id);
                    }}
                  >
                    Recurring
                  </Button>
                  {/* Recurring Dialog */}
                  <Dialog
                    open={openRecurringDialog}
                    onClose={handleRecurringDialogClose}
                  >
                    <DialogTitle>Recurring Details</DialogTitle>
                    {/* <DialogContent>
                      <TextField
                        label="Price"
                        value={price}
                        onChange={handlePriceChange}
                        fullWidth
                      />
                      <TextField
                        label="Advance Price"
                        value={advancePrice}
                        onChange={handleAdvancePriceChange}
                        fullWidth
                      />
                      <TextField
                        label="Remaining Price"
                        value={remainingPrice}
                        onChange={handleRemainingPriceChange}
                        fullWidth
                      />
                    </DialogContent> */}
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
