import React from "react";
import Header from "../Header";
import TicketCards from "../../Layout/Home/TicketCard";
import TableTicket from "./TicketsTable";

export default function CustomPaginationActionsTable() {
  return (
    <div>
      <Header />
      <TicketCards />
      <TableTicket />
    </div>
  );
}
