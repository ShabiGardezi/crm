import React, { useState, useEffect } from "react";
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

<TablePaginationActions />;
const rows = [].sort((a, b) => (a.clientName < b.clientName ? -1 : 1));

export default function ShowCloseTickets() {
  const user = JSON.parse(localStorage.getItem("user"));
  const [page, setPage] = React.useState(0);
  const [rowsPerPage, setRowsPerPage] = React.useState(5);
  const [tickets, setTickets] = useState([]); // State to store fetched data
  const [isTicketDetailsOpen, setIsTicketDetailsOpen] = useState(false);
  const [selectedTicketDetails, setSelectedTicketDetails] = useState(null); // Step 1
  const [searchQuery, setSearchQuery] = useState("");

  // Function to close the ticket details modal
  const closeTicketDetailsModal = () => {
    setIsTicketDetailsOpen(false);
  };
  // Fetch data from the API when the component mounts
  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await fetch(
          `http://localhost:5000/api/tickets/completed?departmentId=${user?.department?._id}`
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
                    <IconButton
                      onClick={() => fetchTicketDetails(ticket._id)} // Fetch ticket details on click
                    >
                      <VisibilityIcon />
                    </IconButton>
                  </TableCell>
                  <TableCell style={{ width: 160 }} align="left">
                    {ticket.status}
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
                colSpan={6} // Adjusted to match the number of columns
                count={rows.length}
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
