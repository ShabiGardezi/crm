// import React, { useState } from "react";
// import { Tabs, Tab } from "@mui/material";
// import { useParams } from "react-router-dom";
// import QuotationComponent from "../pages/FormSections/Quotation";
// import Header from "../pages/Header";
// import TicketDetails from "../pages/FormSections/TicketDetails";
// import Services from "../pages/FormSections/Services";
// // Import Business Details components for each department
// import ReviewsBusinessDetails from "../pages/BusinessDetails/ReviewsBusinessDetails";
// import WordPressBusinessDetails from "../pages/BusinessDetails/WordPressBusinessDetails";
// import WebsiteSEOBusinessDetails from "../pages/BusinessDetails/WebsiteSEOBusinessDetails";
// import CustomDevBusinessDetails from "../pages/BusinessDetails/CustomDevBusinessDetails";
// import PaidMarketingBusinessDetails from "../pages/BusinessDetails/PaidMarketingBusinessDetails";
// import SocialMediaBusinessDetails from "../pages/BusinessDetails/SocialMediaBusinessDetails";
// import LocalSEOBusinessDetails from "../pages/BusinessDetails/LocalSEOBusinessDetails";

// const CRMProjectForm = () => {
//   const { department } = useParams(); // Get the department from the URL
//   const initialSection = department ? "Business Details" : "Quotation";
//   const [section, setSection] = useState(initialSection);

//   const handleTabChange = (event, newSection) => {
//     setSection(newSection);
//   };

//   return (
//     <div>
//       {/* Render the Header component */}
//       <Header />
//       <Tabs
//         onChange={handleTabChange}
//         value={section}
//         aria-label="CRM project form tabs"
//       >
//         <Tab label="Quotation" value="Quotation" />
//         <Tab label="Ticket Details" value="Ticket Details" />
//         <Tab label="Services" value="Services" />
//         <Tab label="Business Details" value="Business Details" />
//       </Tabs>

//       {/* Render the selected Business Details component */}
//       {section === "Quotation" && <QuotationComponent />}
//       {section === "Ticket Details" && <TicketDetails />}
//       {section === "Services" && <Services />}
//       {section === "Business Details" && department && (
//         <>
//           {/* Render the Business Details component based on the selected department */}
//           {department === "Customer Reviews Management" && (
//             <ReviewsBusinessDetails />
//           )}
//           {department === "Wordpress Development" && (
//             <WordPressBusinessDetails />
//           )}
//           {department === "Website SEO" && <WebsiteSEOBusinessDetails />}
//           {department === "Custom Development" && <CustomDevBusinessDetails />}
//           {department === "Paid Marketing" && <PaidMarketingBusinessDetails />}
//           {department === "Social Media / Customer Reviews Management" && (
//             <SocialMediaBusinessDetails />
//           )}
//           {department === "Local SEO / GMB Optimization" && (
//             <LocalSEOBusinessDetails />
//           )}
//         </>
//       )}
//     </div>
//   );
// };

// export default CRMProjectForm;
