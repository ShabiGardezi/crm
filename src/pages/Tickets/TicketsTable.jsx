import React, { useState, useEffect } from "react";
import { useTheme } from "@mui/material/styles";
import PropTypes from "prop-types";
import Box from "@mui/material/Box";
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
import FirstPageIcon from "@mui/icons-material/FirstPage";
import KeyboardArrowLeft from "@mui/icons-material/KeyboardArrowLeft";
import KeyboardArrowRight from "@mui/icons-material/KeyboardArrowRight";
import LastPageIcon from "@mui/icons-material/LastPage";
import VisibilityIcon from "@mui/icons-material/Visibility";
import MenuItem from "@mui/material/MenuItem";
import FormControl from "@mui/material/FormControl";
import Select from "@mui/material/Select";
import SearchIcon from "@mui/icons-material/Search";
import InputBase from "@mui/material/InputBase";
import DisplayTicketDetails from "./DisplayTicketDetails";

export default function TableTicket() {
  const user = JSON.parse(localStorage.getItem("user"));
  const [page, setPage] = React.useState(0);
  const [rowsPerPage, setRowsPerPage] = React.useState(5);
  const [tickets, setTickets] = useState([]);
  const [selectedStatus, setSelectedStatus] = useState({});
  const [searchQuery, setSearchQuery] = useState("");
  const [isTicketDetailsOpen, setIsTicketDetailsOpen] = useState(false);
  const [selectedTicketDetails, setSelectedTicketDetails] = useState(null); // Step 1

  function TablePaginationActions(props) {
    const theme = useTheme();
    const { count, page, rowsPerPage, onPageChange } = props;

    const handleFirstPageButtonClick = (event) => {
      onPageChange(event, 0);
    };

    const handleBackButtonClick = (event) => {
      onPageChange(event, page - 1);
    };

    const handleNextButtonClick = (event) => {
      onPageChange(event, page + 1);
    };

    const handleLastPageButtonClick = (event) => {
      onPageChange(event, Math.max(0, Math.ceil(count / rowsPerPage) - 1));
    };

    return (
      <Box sx={{ flexShrink: 0, ml: 2.5 }}>
        <IconButton
          onClick={handleFirstPageButtonClick}
          disabled={page === 0}
          aria-label="first page"
        >
          {theme.direction === "rtl" ? <LastPageIcon /> : <FirstPageIcon />}
        </IconButton>
        <IconButton
          onClick={handleBackButtonClick}
          disabled={page === 0}
          aria-label="previous page"
        >
          {theme.direction === "rtl" ? (
            <KeyboardArrowRight />
          ) : (
            <KeyboardArrowLeft />
          )}
        </IconButton>
        <IconButton
          onClick={handleNextButtonClick}
          disabled={page >= Math.ceil(count / rowsPerPage) - 1}
          aria-label="next page"
        >
          {theme.direction === "rtl" ? (
            <KeyboardArrowLeft />
          ) : (
            <KeyboardArrowRight />
          )}
        </IconButton>
        <IconButton
          onClick={handleLastPageButtonClick}
          disabled={page >= Math.ceil(count / rowsPerPage) - 1}
          aria-label="last page"
        >
          {theme.direction === "rtl" ? <FirstPageIcon /> : <LastPageIcon />}
        </IconButton>
      </Box>
    );
  }

  TablePaginationActions.propTypes = {
    count: PropTypes.number.isRequired,
    onPageChange: PropTypes.func.isRequired,
    page: PropTypes.number.isRequired,
    rowsPerPage: PropTypes.number.isRequired,
  };
  const handleSearch = async (e) => {
    if (e.key === "Enter" && searchQuery) {
      try {
        const response = await fetch(
          `http://localhost:5000/api/tickets/client-search?searchString=${searchQuery}`
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
        const response = await fetch(
          "http://localhost:5000/api/tickets/status-update",
          {
            method: "PUT",
            headers: {
              "Content-Type": "application/json",
            },
            body: JSON.stringify({ ticketId, status }),
          }
        );

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
      const response = await fetch(
        `http://localhost:5000/api/tickets/${ticketId}`
      );
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

  // Function to clear selected ticket details
  const clearSelectedTicketDetails = () => {
    setSelectedTicketDetails(null);
  };

  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await fetch(
          `http://localhost:5000/api/tickets?departmentId=${user?.department?._id}`
        );
        if (response.ok) {
          const data = await response.json();
          const initialStatus = data.payload.reduce((status, ticket) => {
            status[ticket._id] = ticket.status || "Not Started Yet";
            return status;
          }, {});
          setTickets(data.payload);
          setSelectedStatus(initialStatus);
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
