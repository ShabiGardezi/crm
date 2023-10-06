import * as React from "react";
import PropTypes from "prop-types";
import { useTheme } from "@mui/material/styles";
import Box from "@mui/material/Box";
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
import FirstPageIcon from "@mui/icons-material/FirstPage";
import KeyboardArrowLeft from "@mui/icons-material/KeyboardArrowLeft";
import KeyboardArrowRight from "@mui/icons-material/KeyboardArrowRight";
import LastPageIcon from "@mui/icons-material/LastPage";
import Header from "../Header";
import TicketCards from "../../Layout/Home/TicketCard";

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

function createData(
  clientName,
  assignor,
  assignee,
  completedOn,
  deadline,
  status
) {
  return { clientName, assignor, assignee, completedOn, deadline, status };
}

const rows = [
  createData(
    "Client 1",
    "Assignor 1",
    "Assignee 1",
    "2023-10-05",
    "2023-12-31",
    "Completed"
  ),
  createData(
    "Client 2",
    "Assignor 2",
    "Assignee 2",
    "2023-10-02",
    "2023-11-15",
    "In Progress"
  ),
  createData(
    "Client 2",
    "Assignor 2",
    "Assignee 2",
    "2023-10-02",
    "2023-11-15",
    "In Progress"
  ),
  createData(
    "Client 2",
    "Assignor 2",
    "Assignee 2",
    "2023-10-02",
    "2023-11-15",
    "In Progress"
  ),
  createData(
    "Client 2",
    "Assignor 2",
    "Assignee 2",
    "2023-10-02",
    "2023-11-15",
    "In Progress"
  ),
  createData(
    "Client 2",
    "Assignor 2",
    "Assignee 2",
    "2023-10-02",
    "2023-11-15",
    "In Progress"
  ),
  createData(
    "Client 2",
    "Assignor 2",
    "Assignee 2",
    "2023-10-02",
    "2023-11-15",
    "In Progress"
  ),
  createData(
    "Client 2",
    "Assignor 2",
    "Assignee 2",
    "2023-10-02",
    "2023-11-15",
    "In Progress"
  ),
  createData(
    "Client 2",
    "Assignor 2",
    "Assignee 2",
    "2023-10-02",
    "2023-11-15",
    "In Progress"
  ),
  createData(
    "Client 2",
    "Assignor 2",
    "Assignee 2",
    "2023-10-02",
    "2023-11-15",
    "In Progress"
  ),
  createData(
    "Client 2",
    "Assignor 2",
    "Assignee 2",
    "2023-10-02",
    "2023-11-15",
    "In Progress"
  ),
  createData(
    "Client 2",
    "Assignor 2",
    "Assignee 2",
    "2023-10-02",
    "2023-11-15",
    "In Progress"
  ),
  createData(
    "Client 2",
    "Assignor 2",
    "Assignee 2",
    "2023-10-02",
    "2023-11-15",
    "In Progress"
  ),
  createData(
    "Client 2",
    "Assignor 2",
    "Assignee 2",
    "2023-10-02",
    "2023-11-15",
    "In Progress"
  ),
  createData(
    "Client 2",
    "Assignor 2",
    "Assignee 2",
    "2023-10-02",
    "2023-11-15",
    "In Progress"
  ),
  // Add more rows as needed
].sort((a, b) => (a.clientName < b.clientName ? -1 : 1));

export default function CustomPaginationActionsTable() {
  const [page, setPage] = React.useState(0);
  const [rowsPerPage, setRowsPerPage] = React.useState(5);

  // Avoid a layout jump when reaching the last page with empty rows.
  const emptyRows =
    page > 0 ? Math.max(0, (1 + page) * rowsPerPage - rows.length) : 0;

  const handleChangePage = (event, newPage) => {
    setPage(newPage);
  };

  const handleChangeRowsPerPage = (event) => {
    setRowsPerPage(parseInt(event.target.value, 10));
    setPage(0);
  };

  return (
    <div>
      <Header />
      <TicketCards />
      <TableContainer component={Paper}>
        <Table sx={{ minWidth: 800 }} aria-label="custom pagination table">
          <TableHead>
            <TableRow>
              <TableCell>Client Name</TableCell>
              <TableCell>Assignor</TableCell>
              <TableCell>Assignee</TableCell>
              <TableCell>Completed On</TableCell>
              <TableCell>Deadline</TableCell>
              <TableCell>Status</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {(rowsPerPage > 0
              ? rows.slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage)
              : rows
            ).map((row) => (
              <TableRow key={row.clientName}>
                <TableCell component="th" scope="row">
                  {row.clientName}
                </TableCell>
                <TableCell style={{ width: 160 }} align="left">
                  {row.assignor}
                </TableCell>
                <TableCell style={{ width: 160 }} align="left">
                  {row.assignee}
                </TableCell>
                <TableCell style={{ width: 160 }} align="left">
                  {row.completedOn}
                </TableCell>
                <TableCell style={{ width: 160 }} align="left">
                  {row.deadline}
                </TableCell>
                <TableCell style={{ width: 160 }} align="left">
                  {row.status}
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
    </div>
  );
}
