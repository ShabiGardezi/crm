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
import VisibilityIcon from "@mui/icons-material/Visibility";
import MenuItem from "@mui/material/MenuItem";
import FormControl from "@mui/material/FormControl";
import Select from "@mui/material/Select";
import SearchIcon from "@mui/icons-material/Search";
import InputBase from "@mui/material/InputBase";
import DisplayTicketDetails from "./DisplayTicketDetails";
import TablePaginationActions from "./TicketsTablePagination/TicketsPagination";

export default function TicketsTable() {
  const apiUrl = process.env.REACT_APP_API_URL;
  const user = JSON.parse(localStorage.getItem("user"));
  const [page, setPage] = React.useState(0);
  const [rowsPerPage, setRowsPerPage] = React.useState(5);
  const [tickets, setTickets] = useState([]);
  const [selectedStatus, setSelectedStatus] = useState({});
  const [searchQuery, setSearchQuery] = useState("");
  const [isTicketDetailsOpen, setIsTicketDetailsOpen] = useState(false);
  const [selectedTicketDetails, setSelectedTicketDetails] = useState(null); // Step 1

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

  // Function to close the ticket details modal
  const closeTicketDetailsModal = () => {
    setIsTicketDetailsOpen(false);
  };

  // Fetch data from the API when the component mounts
  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await fetch(
          `${apiUrl}/api/tickets/notStarted?departmentId=${user?.department?._id}`
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

  return (
    <>
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
              <TableCell>Created At</TableCell>
              <TableCell>Deadline</TableCell>
              {(user?.department._id === "651ada78819ff0aec6af1381" ||
                user?.department._id === "651ada98819ff0aec6af1382") && (
                <>
                  <TableCell>No. Of FB Reviews</TableCell>
                  <TableCell>No. Of GMB Reviews</TableCell>
                  <TableCell>Likes/Followers</TableCell>
                </>
              )}
              <TableCell>Details</TableCell>
              <TableCell>Status</TableCell>
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
                  {ticket.assignorDepartment && (
                    <TableCell style={{ width: 160 }} align="left">
                      {ticket.assignorDepartment.name}
                    </TableCell>
                  )}
                  {ticket.majorAssignee && (
                    <TableCell style={{ width: 160 }} align="left">
                      {ticket.majorAssignee.name}
                    </TableCell>
                  )}
                  <TableCell style={{ width: 160 }} align="left">
                    {new Date(ticket.createdAt).toISOString().substr(0, 10)}
                  </TableCell>
                  <TableCell style={{ width: 160 }} align="left">
                    {ticket.dueDate}
                  </TableCell>
                  {(user?.department._id === "651ada78819ff0aec6af1381" ||
                    user?.department._id === "651ada98819ff0aec6af1382") && (
                    <>
                      <TableCell style={{ width: 160 }} align="left">
                        {ticket.businessdetails.noOfFbreviews}
                      </TableCell>
                      <TableCell style={{ width: 160 }} align="left">
                        {ticket.businessdetails.noOfreviewsGMB}
                      </TableCell>
                      <TableCell style={{ width: 160 }} align="left">
                        {ticket.businessdetails.LikesFollowers}
                      </TableCell>
                    </>
                  )}

                  <TableCell style={{ width: 160 }} align="left">
                    <IconButton
                      onClick={() => fetchTicketDetails(ticket._id)} // Fetch ticket details on click
                    >
                      <VisibilityIcon />
                    </IconButton>
                  </TableCell>
                  <TableCell style={{ width: 160 }} align="left">
                    <FormControl>
                      <Select
                        value={selectedStatus[ticket._id] || "Not Started Yet"}
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
                rowsPerPageOptions={[5, 10, 25, { label: "All", value: -1 }]}
                colSpan={6}
                count={tickets.length}
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
    </>
  );
}
