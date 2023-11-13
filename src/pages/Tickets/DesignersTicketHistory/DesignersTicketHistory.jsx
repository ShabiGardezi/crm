import React from "react";
import Header from "../../Header";
import TicketsTable from "../TicketsTable";
import TicketCards from "../../../Layout/Home/TicketCard";
import DesignersFilteredCard from "./DesignersFilteredCard";

const DesignersTicketHistory = () => {
  return (
    <div>
      <Header />
      <TicketCards />
      <DesignersFilteredCard />
      <TicketsTable />
    </div>
  );
};

export default DesignersTicketHistory;
