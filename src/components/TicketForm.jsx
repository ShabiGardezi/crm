import React, { useState } from "react";
import { Tabs, Tab } from "@material-ui/core";
import Services from "../pages/FormSections/Services";
import TicketDetails from "../pages/FormSections/TicketDetails";
import BusinessDetailsComponent from "../pages/FormSections/BussinesDetails";
import QuotationComponent from "../pages/FormSections/Quotation";
import "../styles/Forms/customforms.css";
import Header from "../pages/Header";
const CRMProjectForm = () => {
  const [section, setSection] = useState("Quotation"); // Set the initial section to Quotation

  const handleTabChange = (event, newSection) => {
    setSection(newSection);
  };

  return (
    <div>
      <Header />
      <Tabs
        onChange={handleTabChange}
        value={section}
        aria-label="CRM project form tabs"
      >
        <Tab label="Quotation" value="Quotation" />
        <Tab label="Ticket Details" value="Ticket Details" />
        <Tab label="Services" value="Services" />
        <Tab label="Business Details" value="Business Details" />
      </Tabs>
      {section === "Quotation" && <QuotationComponent />}
      {section === "Ticket Details" && <TicketDetails />}
      {section === "Services" && <Services />}
      {section === "Business Details" && <BusinessDetailsComponent />}
    </div>
  );
};

export default CRMProjectForm;
