import React, { useState } from "react";
import { Route, Routes, Navigate } from "react-router-dom";
import SignIn from "./pages/SignIn";
import SignUp from "./pages/SIgnUp";
import Home from "./components/Home";
import WebSeoForm from "./pages/Departments/WebSEO";
import LocalSeoForm from "./pages/Departments/LocalSEO";
import SocialMediaForm from "./pages/Departments/SocialMedia";
import WordPress from "./pages/Departments/Wordpress";
import Reviews from "./pages/Departments/Review";
import PaidMarketing from "./pages/Departments/PaidMarketing";
import { Toaster } from "react-hot-toast";
import UserToDo from "./components/UserToDo";
import CustomDevelopment from "./pages/Departments/CustomDevelopment";
import TicketCreatedTable from "./pages/Tickets/TicketCreated";
import ShowOpenTickets from "./pages/Tickets/ShowOpenTickets";
import ShowCloseTickets from "./pages/Tickets/ShowCloseTickets";
import ActiveClients from "./pages/Client-Sheets/ActiveClients";
import NotActiveClients from "./pages/Client-Sheets/NotActiveClients";
import WebSeoClients from "./pages/ClientHistory/WebSeoClients";
import LocalSeoSheet from "./pages/Client-Sheets/LocalSeoClients/LocalSeoClient";
import TableCustomized from "./pages/Client-Sheets/SingleWebSeoClient";
import MonthlySeoClients from "./pages/Client-Sheets/MonthlySeoClient";
import SocialMediaClientSheet from "./pages/Client-Sheets/SocialMediaClientSheet/SocialMediaClientSheet";
import GmbReviewSheet from "./pages/Client-Sheets/SocialMediaClientSheet/GmbReviewSheet";
import FbReviewSheet from "./pages/Client-Sheets/SocialMediaClientSheet/FacebookReviews";
import LikesFollowersSocialMedia from "./pages/Client-Sheets/SocialMediaClientSheet/LikesFollowersSocialMedia";
import PaidMarketingClientSheet from "./pages/Client-Sheets/PaidMarketingClientSheet/PaidMarketingClientSheet";
import WordpressClientSheet from "./pages/ClientHistory/WordpressClientSheet/WordpressClientSheet";
import ActiveWebsiteClients from "./pages/ActiveClients/ActiveWesbiteClients";
import InActiveWebsiteClients from "./pages/ClientHistory/WordpressClientSheet/NotActiveWebsiteClients";
import WritersForm from "./pages/Departments/Writers";
import LocalSeoWritersTickets from "./pages/Tickets/WritersTicketHistory/LocalSeoTickets";
import WebSeoWritersTickets from "./pages/Tickets/WritersTicketHistory/WebSeoWritersTickets";
import WordpressWritersTickets from "./pages/Tickets/WritersTicketHistory/WordpressWritersTickets";
import ReviewsWriteresTickets from "./pages/Tickets/WritersTicketHistory/ReviewsWriteresTickets";
import DesignersForm from "./pages/Departments/Designers";
import ReviewsDesignersTickets from "./pages/Tickets/DesignersTicketHistory/ReviewsDesignersTickets";
import WebseoDesignerTickets from "./pages/Tickets/DesignersTicketHistory/webseo_designer_tickets";
import WordpressDesignersTickets from "./pages/Tickets/DesignersTicketHistory/wordpress_designer_tickets";
import LocalSeoActiveClients from "./pages/SalesClientsSheet/LocalSeoSalesSheet/ActiveLocalSeoSalesClients";
import InActiveLocalSeoClients from "./pages/SalesClientsSheet/LocalSeoSalesSheet/InActiveLocalSeoClients";
import ActiveWebSeoSalesClients from "./pages/SalesClientsSheet/WebSeoSalesSheet/ActiveWebSeoSalesClients";
import InActiveWebSeoClients from "./pages/SalesClientsSheet/WebSeoSalesSheet/InActiveWebSeoClients";
import InActiveWordpressClients from "./pages/SalesClientsSheet/WordpressSalesSheet/InActiveWordpressSalesClients";
import ActiveWordpressSalesClients from "./pages/SalesClientsSheet/WordpressSalesSheet/ActiveWordpressSalesClients";
import ActiveMarketingSalesClients from "./pages/SalesClientsSheet/PaidMarketingSalesSheet.jsx/ActiveMarketingSalesClients";
import InActiveMarketingClients from "./pages/SalesClientsSheet/PaidMarketingSalesSheet.jsx/InActiveMarketingClients";
import ActiveSocialMediaSalesClients from "./pages/SalesClientsSheet/SocialMediaSalesSheet/ActiveSocialMediaSalesClients";
import InActiveSocialMediaSalesClients from "./pages/SalesClientsSheet/SocialMediaSalesSheet/InActiveSocialMediaSalesClients";
import Inbox from "./pages/InboxPage";
import AllAddUpPayments from "./pages/PaymentHistory/AllAddUpPayments";
import SingleEntriesPayments from "./pages/PaymentHistory/SingleEntriesPayments";

function App() {
  const user = JSON.parse(localStorage.getItem("user"));
  const nCount = localStorage.getItem("notificationCount");
  const [notificationCount, setNotificationCount] = useState(
    nCount ? nCount : 0
  );
  return (
    <div className="App">
      <Toaster />
      <Routes>
        <Route path="/" element={<SignIn />} />
        <Route path="/signin" element={<SignIn />} />
        <Route
          path="/signup"
          element={user?.role === "admin" ? <SignUp /> : <Navigate to="/" />}
        />
        {user && (
          <>
            <Route
              path="/home"
              element={<Home notificationCount={notificationCount} />}
            />
            <Route
              path="/inbox"
              element={<Inbox notificationCount={notificationCount} />}
            />
            <Route
              path="/department/webseoform"
              element={<WebSeoForm notificationCount={notificationCount} />}
            />
            <Route
              path="/department/localseoform"
              element={<LocalSeoForm notificationCount={notificationCount} />}
            />
            <Route
              path="/department/designersform"
              element={<DesignersForm notificationCount={notificationCount} />}
            />
            <Route
              path="/department/socialmediaform"
              element={
                <SocialMediaForm notificationCount={notificationCount} />
              }
            />
            <Route
              path="/department/customdevelopment"
              element={
                <CustomDevelopment notificationCount={notificationCount} />
              }
            />
            <Route
              path="/department/wordpressform"
              element={<WordPress notificationCount={notificationCount} />}
            />
            <Route
              path="/department/writersform"
              element={<WritersForm notificationCount={notificationCount} />}
            />
            <Route
              path="/department/reviewsform"
              element={<Reviews notificationCount={notificationCount} />}
            />
            <Route
              path="/department/paidmarketingform"
              element={<PaidMarketing />}
            />
            <Route path="/todo" element={<UserToDo showHeader={true} />} />
            <Route
              path="/history"
              element={
                <ShowOpenTickets notificationCount={notificationCount} />
              }
            />
            <Route
              path="/reviews_designer_tickets"
              element={
                <ReviewsDesignersTickets
                  notificationCount={notificationCount}
                />
              }
            />
            <Route
              path="/webseo_designer_tickets"
              element={
                <WebseoDesignerTickets notificationCount={notificationCount} />
              }
            />
            <Route
              path="/wordpress_designer_tickets"
              element={
                <WordpressDesignersTickets
                  notificationCount={notificationCount}
                />
              }
            />
            <Route
              path="/tickets_created"
              element={
                <TicketCreatedTable notificationCount={notificationCount} />
              }
            />
            <Route path="/close_tickets" element={<ShowCloseTickets />} />
            <Route
              path="/local_seo_tickets"
              element={<LocalSeoWritersTickets />}
            />
            <Route
              path="/reviews_writer_tickets"
              element={<ReviewsWriteresTickets />}
            />
            <Route path="/web_seo_tickets" element={<WebSeoWritersTickets />} />
            <Route
              path="/wordpress_writer_tickets"
              element={<WordpressWritersTickets />}
            />
            <Route path="/active_clients" element={<ActiveClients />} />
            <Route path="/notactive_clients" element={<NotActiveClients />} />
            <Route path="/webseo_clients" element={<WebSeoClients />} />
            <Route path="/localseo_clients" element={<LocalSeoSheet />} />
            <Route
              path="/one_time_service_clients"
              element={<TableCustomized />}
            />
            <Route path="/gmb_reviews_sheet" element={<GmbReviewSheet />} />
            <Route path="/fb_reviews_sheet" element={<FbReviewSheet />} />
            <Route path="/website_sheet" element={<WordpressClientSheet />} />
            <Route
              path="/active_website_clients"
              element={<ActiveWebsiteClients />}
            />
            <Route
              path="/inactive_website_clients"
              element={<InActiveWebsiteClients />}
            />
            <Route
              path="/paid_marketing_sheet"
              element={<PaidMarketingClientSheet />}
            />
            <Route
              path="/social_meida_likes_followers"
              element={<LikesFollowersSocialMedia />}
            />
            <Route
              path="/monthly_service_clients"
              element={<MonthlySeoClients />}
            />
            <Route
              path="/social_media_client"
              element={<SocialMediaClientSheet />}
            />
            <Route
              path="/localseoactiveclients"
              element={<LocalSeoActiveClients />}
            />
            <Route
              path="/localseoInactiveclients"
              element={<InActiveLocalSeoClients />}
            />
            <Route
              path="/webseoactiveclients"
              element={<ActiveWebSeoSalesClients />}
            />
            <Route
              path="/webseoInactiveclients"
              element={<InActiveWebSeoClients />}
            />
            <Route
              path="/wordpressactiveclients"
              element={<ActiveWordpressSalesClients />}
            />
            <Route
              path="/wordpressInactiveclients"
              element={<InActiveWordpressClients />}
            />
            <Route
              path="/marketingactiveclients"
              element={<ActiveMarketingSalesClients />}
            />
            <Route
              path="/marketingInactiveclients"
              element={<InActiveMarketingClients />}
            />
            <Route
              path="/socialmedia_activeclients"
              element={<ActiveSocialMediaSalesClients />}
            />
            <Route
              path="/socialmedia_Inactiveclients"
              element={<InActiveSocialMediaSalesClients />}
            />
            <Route path="/all_payment_history" element={<AllAddUpPayments />} />{" "}
            <Route path="/single_payment_history" element={<SingleEntriesPayments />} />
          </>
        )}
      </Routes>
    </div>
  );
}

export default App;
