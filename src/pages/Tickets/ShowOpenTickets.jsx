import React, { useState, useEffect } from "react";
import PropTypes from "prop-types";
import {
  FormControl,
  Select,
  MenuItem,
  Box,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableFooter,
  TablePagination,
  TableRow,
  TableHead,
  Paper,
  IconButton,
  InputBase,
} from "@mui/material";
import { useTheme } from "@mui/material/styles";
import FirstPageIcon from "@mui/icons-material/FirstPage";
import KeyboardArrowLeft from "@mui/icons-material/KeyboardArrowLeft";
import KeyboardArrowRight from "@mui/icons-material/KeyboardArrowRight";
import LastPageIcon from "@mui/icons-material/LastPage";
import Header from "../Header";
import TicketCards from "../../Layout/Home/TicketCard";
import VisibilityIcon from "@mui/icons-material/Visibility";
import DisplayTicketDetails from "./DisplayTicketDetails";
import SearchIcon from "@mui/icons-material/Search";
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

export default function ShowOpenTickets() {
  const user = JSON.parse(localStorage.getItem("user"));
  const [page, setPage] = React.useState(0);
  const [rowsPerPage, setRowsPerPage] = React.useState(5);
  const [tickets, setTickets] = useState([]); // State to store fetched data
  const [selectedStatus, setSelectedStatus] = useState({});
  const [isTicketDetailsOpen, setIsTicketDetailsOpen] = useState(false);
  const [selectedTicketDetails, setSelectedTicketDetails] = useState(null);
  const [searchQuery, setSearchQuery] = useState("");

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

  // Function to close the ticket details modal
  const closeTicketDetailsModal = () => {
    setIsTicketDetailsOpen(false);
  };

  // Fetch data from the API when the component mounts
  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await fetch(
          `http://localhost:5000/api/tickets/notStarted?departmentId=${user?.department?._id}`
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
  return (
    <div>
      <Header />
      <TicketCards />
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
                    <IconButton onClick={() => fetchTicketDetails(ticket._id)}>
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
                <TableCell colSpan={7} />
              </TableRow>
            )}
          </TableBody>
          <TableFooter>
            <TableRow>
              <TablePagination
                rowsPerPageOptions={[5, 10, 25, { label: "All", value: -1 }]}
                colSpan={7}
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
    </div>
  );
}
