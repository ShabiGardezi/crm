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
import Header from "../../Header";
import DisplayTicketDetails from "../../Tickets/DisplayTicketDetails";
import VisibilityIcon from "@mui/icons-material/Visibility";
import ActiveNotActiveCard from "../ActiveNotActiveCard";
import axios from "axios";
import "../../../styles/Home/TicketCard.css";
import CardsSocialMediaTrack from "./CardsSocialMedia/CardsSocialMediaTrack";
import { useLocation } from "react-router-dom";
import TablePaginationActions from "../../Tickets/TicketsTablePagination/TicketsPagination";
import UnauthorizedError from "../../../components/Error_401";
import SocialMediaSalesCards from "../../SalesClientsSheet/SocialMediaSalesSheet/SocialMediaSalesCards";

export default function SocialMediaClientSheet(props) {
  const apiUrl = process.env.REACT_APP_API_URL;
  const user = JSON.parse(localStorage.getItem("user"));
  const [page, setPage] = React.useState(0);
  const [rowsPerPage, setRowsPerPage] = React.useState(10);
  const [tickets, setTickets] = useState([]);
  const [searchQuery, setSearchQuery] = useState("");
  const [reportingDates, setReportingDates] = useState({});
  const [isTicketDetailsOpen, setIsTicketDetailsOpen] = useState(false);
  const [selectedTicketDetails, setSelectedTicketDetails] = useState(null);

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
  const location = useLocation();
  const params = new URLSearchParams(location.search);
  const param1 = params.get("depId");
  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await fetch(
          `${apiUrl}/api/tickets?departmentId=${param1}&salesDep=true`
        );
        if (response.ok) {
          const data = await response.json();
          setTickets(data.payload);
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

  // Function to handle LikesFollowers edit and update
  const handlelikesfollowersEdit = (ticketId, editLikesFollowers) => {
    // Make an API request to update the notes in the database
    fetch(`${apiUrl}/api/tickets/likesfollowers-update`, {
      method: "PUT",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        ticketId,
        LikesFollowers: editLikesFollowers,
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
                  LikesFollowers: editLikesFollowers,
                },
              };
            }
            return ticket;
          });
          setTickets(updatedTickets);
        } else {
          console.error("Error updating LikesFollowers");
        }
      })
      .catch((error) => {
        console.error("Error updating LikesFollowers", error);
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
  useEffect(() => {
    const fetchData = async () => {
      try {
        // console.log(user.role);
        // console.log(props.department);
        let url = "";
        if (user.role === "admin" || user.department.name === "Sales") {
          url = `${apiUrl}/api/tickets?departmentId=${props.department._id}`;
        } else {
          url = `${apiUrl}/api/tickets?departmentId=${user?.department?._id}&salesDep=true`;
        }
        const response = await fetch(url);
        if (response.ok) {
          const data = await response.json();

          setTickets(data.payload);
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
  if (
    param1 !== user?.department?._id &&
    param1 !== "651b3409819ff0aec6af1387" &&
    user.role !== "admin"
  ) {
    return <UnauthorizedError />;
  }
  return (
    <>
      <Header />
      <div className="cards">
        {user?.department._id !== "651b3409819ff0aec6af1387" && (
          <ActiveNotActiveCard />
        )}
      </div>
      {user?.department._id !== "651b3409819ff0aec6af1387" && (
        <CardsSocialMediaTrack />
      )}

      {user?.department._id === "651b3409819ff0aec6af1387" && (
        <SocialMediaSalesCards />
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
              <TableCell>Business Name</TableCell>
              <TableCell>Sales Person</TableCell>
              <TableCell>Active/Not Active</TableCell>
              <TableCell>Subscription Date</TableCell>
              <TableCell>Reporting Date</TableCell>
              <TableCell>No. Of FB Reviews</TableCell>
              <TableCell>No. Of GMB Reviews</TableCell>
              <TableCell>Likes/Followers</TableCell>
              <TableCell>Details</TableCell>
              <TableCell>Notes</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {(rowsPerPage > 0
              ? tickets.slice(
                  page * rowsPerPage,
                  page * rowsPerPage + rowsPerPage
                )
              : tickets
            ).map((ticket) => (
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
                            ? 
"rgb(25, 118, 210)"
                            : "#dc3545", // set background color for Select
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
                   <TableCell
                    style={{
                      width: 160,
                      cursor: "pointer",
                      color:
                        new Date(ticket.reportingDate).toLocaleDateString() ===
                        new Date().toLocaleDateString()
                          ? "white"
                          : "black",
                      background:
                        new Date(ticket.reportingDate).toLocaleDateString() <=
                        new Date().toLocaleDateString()
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
                {ticket.businessdetails && (
                  <TableCell style={{ width: 160 }} align="left">
                    {ticket.businessdetails.noOfreviewsGMB}
                  </TableCell>
                )}
                {ticket.businessdetails && (
                  <TableCell style={{ width: 160 }} align="left">
                    {ticket.businessdetails.noOfFbreviews}
                  </TableCell>
                )}{" "}
                {ticket.businessdetails && (
                  <TableCell
                    style={{ width: 160 }}
                    align="left"
                    contentEditable={true}
                    onBlur={(e) =>
                      handlelikesfollowersEdit(ticket._id, e.target.innerText)
                    }
                  >
                    {ticket.businessdetails.LikesFollowers}
                  </TableCell>
                )}
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
                        ? "red"
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
                rowsPerPageOptions={[10, 15, 25, { label: "All", value: -1 }]}
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
