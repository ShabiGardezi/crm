import React from "react";
import Header from "../Header";
import TicketCards from "../../Layout/Home/TicketCard";
import TicketsCreatedChildComponent from "./TicketsCreatedChild";

export default function TicketCreatedTable() {
  return (
    <div>
      <Header />
      <TicketCards />
      <TicketsCreatedChildComponent />
    </div>
  );
}
