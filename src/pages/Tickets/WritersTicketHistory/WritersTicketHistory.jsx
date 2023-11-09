import React from "react";
import Header from "../../Header";
import TicketsTable from "../TicketsTable";
import TicketCards from "../../../Layout/Home/TicketCard";
import WritersFilteredCards from "./WritersFilteredCards";

const WritersTicketHistory = () => {
  return (
    <div>
      <Header />
      <TicketCards />
      <WritersFilteredCards />
      <TicketsTable />
    </div>
  );
};

export default WritersTicketHistory;
