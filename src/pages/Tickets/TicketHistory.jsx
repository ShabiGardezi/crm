import React from "react";
import Header from "../Header";
import TicketCards from "../../Layout/Home/TicketCard";
import TicketsTable from "./TicketsTable";

export default function CustomPaginationActionsTable() {
  return (
    <div>
      <Header />
      <TicketCards />
      <TicketsTable />
    </div>
  );
}
