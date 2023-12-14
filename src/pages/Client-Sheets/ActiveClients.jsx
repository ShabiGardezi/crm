import React from "react";
import TableContainer from "@mui/material/TableContainer";
import Paper from "@mui/material/Paper";
import Header from "../Header";
import ActiveNotActiveCard from "./ActiveNotActiveCard";
import OneTimeServiceClientsCard from "./OneTimeClientCard";
import "../../styles/Home/TicketCard.css";
import CardsSocialMediaTrack from "./SocialMediaClientSheet/CardsSocialMedia/CardsSocialMediaTrack";
import TablePaginationActions from "../Tickets/TicketsTablePagination/TicketsPagination";
import LocalSeoActiveClients from "../ActiveClients/LocalSeoActiveClients";
import SocialMedia_ReviewsActiveClients from "../ActiveClients/SocialMedia_ReviewsActiveClients";
import PaidMarketingActiveClient from "../ActiveClients/PaidMarketingActiveClient";
import ActiveWebsiteClients from "../ActiveClients/ActiveWesbiteClients";
export default function ActiveClients() {
  const user = JSON.parse(localStorage.getItem("user"));
  <TablePaginationActions />;

  return (
    <>
      <Header />
      <div className="cards">
        <ActiveNotActiveCard />
        {user?.department._id === "65195c8f504d80e8f11b0d15" && (
          <OneTimeServiceClientsCard />
        )}
      </div>
      {/* Social Media / Customer Reviews Management and Reviews */}
      {(user?.department._id === "651ada78819ff0aec6af1381" ||
        user?.department._id === "651ada98819ff0aec6af1382") && (
        <CardsSocialMediaTrack />
      )}
      <TableContainer component={Paper}>
        {/* Social Media / Customer Reviews Management and Reviews */}
        {user?.department._id === "651ada78819ff0aec6af1381" ||
          user?.department._id === "651ada98819ff0aec6af1382" ||
          (user?.department._id === "651b3409819ff0aec6af1387" && (
            <SocialMedia_ReviewsActiveClients />
          ))}
        {/* Paid Marketing */}
        {user?.department._id === "651ada3c819ff0aec6af1380" && (
          <PaidMarketingActiveClient />
        )}
        {/* Local Seo & Web Seo */}
        {(user?.department._id === "65195c4b504d80e8f11b0d13" ||
          user?.department._id === "65195c8f504d80e8f11b0d15") && (
          <LocalSeoActiveClients />
        )}
        {/* Wordpress */}
        {user?.department._id === "65195c81504d80e8f11b0d14" && (
          <ActiveWebsiteClients />
        )}
      </TableContainer>
    </>
  );
}
