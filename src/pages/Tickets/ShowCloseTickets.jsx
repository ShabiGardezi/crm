import React, { useState, useEffect } from "react";
import { MenuItem, FormControl, Select } from "@mui/material";
import Table from "@mui/material/Table";
import TableBody from "@mui/material/TableBody";
import TableCell from "@mui/material/TableCell";
import TableContainer from "@mui/material/TableContainer";
import TableFooter from "@mui/material/TableFooter";
import TablePagination from "@mui/material/TablePagination";
import TableRow from "@mui/material/TableRow";
import TableHead from "@mui/material/TableHead"; // Added TableHead
import Paper from "@mui/material/Paper";
import IconButton from "@mui/material/IconButton";
import Header from "../Header";
import TicketCards from "../../Layout/Home/TicketCard";
import DisplayTicketDetails from "./DisplayTicketDetails";
import VisibilityIcon from "@mui/icons-material/Visibility";
import SearchIcon from "@mui/icons-material/Search";
import InputBase from "@mui/material/InputBase";
import TablePaginationActions from "./TicketsTablePagination/TicketsPagination";
import WritersFilteredCards from "./WritersTicketHistory/WritersFilteredCards";

<TablePaginationActions />;
const rows = [].sort((a, b) => (a.clientName < b.clientName ? -1 : 1));

export default function ShowCloseTickets() {
  const apiUrl = process.env.REACT_APP_API_URL;
  const user = JSON.parse(localStorage.getItem("user"));
  const [page, setPage] = React.useState(0);
  const [rowsPerPage, setRowsPerPage] = React.useState(10);
  const [tickets, setTickets] = useState([]); // State to store fetched data
  const [isTicketDetailsOpen, setIsTicketDetailsOpen] = useState(false);
  const [selectedTicketDetails, setSelectedTicketDetails] = useState(null); // Step 1
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedStatus, setSelectedStatus] = useState("");

  // Function to close the ticket details modal
  const closeTicketDetailsModal = () => {
    setIsTicketDetailsOpen(false);
  };
  // Fetch data from the API when the component mounts
  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await fetch(
          `${apiUrl}/api/tickets/completed?departmentId=${user?.department?._id}`
        );
        if (response.ok) {
          const data = await response.json();
          setTickets(data.payload); // Assuming 'payload' contains ticket data
        } else {
          console.error("Error fetching data");
        }
      } catch (error) {
        console.error("Error fetching data", error);
      }
    };
    fetchData();
  }, []); // Empty dependency array to fetch data only once

  // Function to fetch ticket details by ID
  const fetchTicketDetails = async (ticketId) => {
    try {
      const response = await fetch(`${apiUrl}/api/tickets/${ticketId}`);
      if (response.ok) {
        const data = await response.json();
        setSelectedTicketDetails(data.payload);
        setIsTicketDetailsOpen(true); // Open the modal when details are fetched
      } else {
        console.error("Error fetching ticket details");
      }
    } catch (error) {
      console.error("Error fetching ticket details", error);
    }
  };
  const emptyRows =
    page > 0 ? Math.max(0, (1 + page) * rowsPerPage - rows.length) : 0;

  const handleChangePage = (event, newPage) => {
    setPage(newPage);
  };

  const handleChangeRowsPerPage = (event) => {
    setRowsPerPage(parseInt(event.target.value, 10));
    setPage(0);
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
  const handleStatusChange = async (event, ticketId) => {
    const newSelectedStatus = { ...selectedStatus };
    const newStatus = event.target.value;
    newSelectedStatus[ticketId] = newStatus;
    setSelectedStatus(newSelectedStatus);

    const updateTicketStatus = async (ticketId, status) => {
      try {
        const response = await fetch(`${apiUrl}/api/tickets/status-update`, {
          method: "PUT",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({ ticketId, status }),
        });

        if (response.ok) {
          // Status updated successfully
        } else {
          console.error("Error updating status");
        }
      } catch (error) {
        console.error("Error updating status", error);
      }
    };

    updateTicketStatus(ticketId, newStatus);
  };
  useEffect(() => {
    // Check if the user's department id is equal to the specified value
    // if (user?.department?._id === "651b3409819ff0aec6af1387") {
    const fetchData = async () => {
      try {
        const response = await fetch(
          `${apiUrl}/api/tickets/completedTickets?departmentId=${user?.department?._id}`
        );
        if (response.ok) {
          const data = await response.json();
          setTickets(data.payload);
        } else {
          console.error("Error fetching data");
        }
      } catch (error) {
        console.error("Error fetching data", error);
      }
    };
    fetchData();
    // }
  }, [user?.department?._id]); // Include user.department._id in the dependency array

  return (
    <div>
      <Header />
      <TicketCards />
      {user?.department?._id === "654bc9d114e9ed66948b4a01" && (
        <WritersFilteredCards />
      )}
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
        <Table sx={{ minWidth: 800 }} aria-label="custom pagination table">
          <TableHead>
            <TableRow>
              <TableCell>Client Name</TableCell>
              <TableCell>Assignor</TableCell>
              <TableCell>Assignor Department</TableCell>
              <TableCell>Assignee Department</TableCell>
              <TableCell>Deadline</TableCell>
              <TableCell>Details</TableCell>
              <TableCell>Status</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {tickets
              .slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage)
              .map((ticket) => (
                <TableRow key={ticket._id}>
                  <TableCell component="th" scope="row">
                    {ticket.businessdetails.clientName}
                  </TableCell>
                  <TableCell style={{ width: 160 }} align="left">
                    {ticket.TicketDetails.assignor}
                  </TableCell>
                  <TableCell style={{ width: 160 }} align="left">
                    {ticket.assignorDepartment.name}
                  </TableCell>
                  <TableCell style={{ width: 160 }} align="left">
                    {ticket.majorAssignee.name}
                  </TableCell>
                  <TableCell style={{ width: 160 }} align="left">
                    {ticket.dueDate}
                  </TableCell>
                  <TableCell style={{ width: 160 }} align="left">
                    <IconButton
                      onClick={() => fetchTicketDetails(ticket._id)} // Fetch ticket details on click
                    >
                      <VisibilityIcon />
                    </IconButton>
                  </TableCell>
                  {user?.department?._id !== "651b3409819ff0aec6af1387" &&
                    user?.department?._id !== "65ae7e27e00c92860edad99c" && (
                      <TableCell style={{ width: 160 }} align="left">
                        <FormControl>
                          <Select
                            value={
                              selectedStatus[ticket._id] || "Not Started Yet"
                            }
                            onChange={(e) => handleStatusChange(e, ticket._id)}
                          >
                            <MenuItem value="Not Started Yet">
                              Not Started Yet
                            </MenuItem>
                            <MenuItem value="In Progress">In Progress</MenuItem>
                            <MenuItem value="Pending">Pending</MenuItem>
                            <MenuItem value="Completed">Completed</MenuItem>
                          </Select>
                        </FormControl>
                      </TableCell>
                    )}
                  {user?.department?._id === "651b3409819ff0aec6af1387" ||
                    (user?.department?._id === "65ae7e27e00c92860edad99c" && (
                      <TableCell style={{ width: 160 }} align="left">
                        {ticket.status}
                      </TableCell>
                    ))}
                </TableRow>
              ))}
            {emptyRows > 0 && (
              <TableRow style={{ height: 53 * emptyRows }}>
                <TableCell colSpan={6} />
              </TableRow>
            )}
          </TableBody>
          <TableFooter>
            <TableRow>
              <TablePagination
                rowsPerPageOptions={[10, 20, 25, { label: "All", value: -1 }]}
                colSpan={6} // Adjusted to match the number of columns
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
      </TableContainer>
      {selectedTicketDetails && (
        <DisplayTicketDetails
          open={isTicketDetailsOpen}
          handleClose={closeTicketDetailsModal}
          ticketDetails={selectedTicketDetails}
        />
      )}
    </div>
  );
}
