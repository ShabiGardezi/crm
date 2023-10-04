import React, { useState, useEffect } from "react";
import { Tabs, Tab } from "@material-ui/core";
import Services from "../pages/FormSections/Services";
import TicketDetails from "../pages/FormSections/TicketDetails";
import QuotationComponent from "../pages/FormSections/Quotation";
import Header from "../pages/Header";
// Import the Business Details components for each department
import ReviewsBusinessDetails from "../pages/BusinessDetails/ReviewsBusinessDetails";
import WordPressBusinessDetails from "../pages/BusinessDetails/WordPressBusinessDetails";
import WebsiteSEOBusinessDetails from "../pages/BusinessDetails/WebsiteSEOBusinessDetails";
import CustomDevBusinessDetails from "../pages/BusinessDetails/CustomDevBusinessDetails";
import PaidMarketingBusinessDetails from "../pages/BusinessDetails/PaidMarketingBusinessDetails";
import SocialMediaBusinessDetails from "../pages/BusinessDetails/SocialMediaBusinessDetails";
import LocalSEOBusinessDetails from "../pages/BusinessDetails/LocalSEOBusinessDetails";

const CRMProjectForm = () => {
  const [section, setSection] = useState("Quotation");
  const [selectedDepartment, setSelectedDepartment] = useState("");
  const [department, setDepartment] = useState(null); // Initialize with null

  // Function to handle department selection from Header Component
  const handleDepartmentSelection = (selectedDept) => {
    setSelectedDepartment(selectedDept);
    setDepartment(selectedDept); // Set the department state when a department is selected
    console.log("Selected Department:", selectedDept); // Log the selected department
  };

  const handleTabChange = (event, newSection) => {
    setSection(newSection);
    console.log("New Section:", newSection); // Add this line to log the new section
  };

  // Function to load the selected Business Details component
  const loadBusinessDetailsComponent = () => {
    // Check if a department is selected
    if (!department) {
      return null; // Return null when no department is selected
    }

    // Load the Business Details component for the selected department
    switch (department) {
      case "Customer Reviews Management":
        console.log(department, "selectedDepartment");
        return <ReviewsBusinessDetails />;
      case "Wordpress Development":
        return <WordPressBusinessDetails />;
      case "Website SEO":
        return <WebsiteSEOBusinessDetails />;
      case "Custom Development":
        return <CustomDevBusinessDetails />;
      case "Paid Marketing":
        return <PaidMarketingBusinessDetails />;
      case "Social Media Management":
        return <SocialMediaBusinessDetails />;
      case "Local SEO / GMB Optimization":
        return <LocalSEOBusinessDetails />;
      default:
        console.log(department, "no component");
        return null;
    }
  };

  useEffect(() => {
    // Call the loadBusinessDetailsComponent function when the department state variable changes
    loadBusinessDetailsComponent();
  }, [department]); // Only listen to changes in the department state

  return (
    <div>
      {/* Render the Header component and pass the department selection handler */}
      <Header onDepartmentSelect={handleDepartmentSelection} />

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

      {/* Render the selected Business Details component */}

      {section === "Quotation" && <QuotationComponent />}
      {section === "Ticket Details" && <TicketDetails />}
      {section === "Services" && <Services />}
      {section === "Business Details" && loadBusinessDetailsComponent()}
    </div>
  );
};

export default CRMProjectForm;
