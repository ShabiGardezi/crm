import React from "react";
import { Route, Routes, Navigate } from "react-router-dom";
import Login from "./components/Login";
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
import TicketList from "./pages/TicketList";
import UserToDo from "./components/UserToDo";
import CustomDevelopment from "./pages/Departments/CustomDevelopment";
import CustomPaginationActionsTable from "./pages/Tickets/TicketHistory";
import FormDataDisplay from "./pages/FormSections/FormDataDisplay";
import TicketCreatedTable from "./pages/Tickets/TicketCreated";
import ShowOpenTickets from "./pages/Tickets/ShowOpenTickets";
import ShowCloseTickets from "./pages/Tickets/ShowCloseTickets";
import ActiveClients from "./pages/Client-Sheets/ActiveClients";
import NotActiveClients from "./pages/Client-Sheets/NotActiveClients";
import WebSeoClients from "./pages/ClientHistory/WebSeoClients";
import LocalSeoSheet from "./pages/Client-Sheets/LocalSeoClients/LocalSeoClient";
import AddClient from "./pages/AddClient/AddClient";
import TableCustomized from "./pages/Client-Sheets/SingleWebSeoClient";
import MonthlySeoClients from "./pages/Client-Sheets/MonthlySeoClient";
import SocialMediaClientSheet from "./pages/Client-Sheets/SocialMediaClientSheet/SocialMediaClientSheet";
import GmbReviewSheet from "./pages/Client-Sheets/SocialMediaClientSheet/GmbReviewSheet";
import FbReviewSheet from "./pages/Client-Sheets/SocialMediaClientSheet/FacebookReviews";
import LikesFollowersSocialMedia from "./pages/Client-Sheets/SocialMediaClientSheet/LikesFollowersSocialMedia";
import PaidMarketingClientSheet from "./pages/Client-Sheets/PaidMarketingClientSheet/PaidMarketingClientSheet";
import WordpressClientSheet from "./pages/ClientHistory/WordpressClientSheet/WordpressClientSheet";
import ActiveWebsiteClients from "./pages/ClientHistory/WordpressClientSheet/ActiveWesbiteClients";
import InActiveWebsiteClients from "./pages/ClientHistory/WordpressClientSheet/NotActiveWebsiteClients";
import WritersForm from "./pages/Departments/Writers";
import WritersTicketHistory from "./pages/Tickets/WritersTicketHistory/WritersTicketHistory";
import LocalSeoWritersTickets from "./pages/Tickets/WritersTicketHistory/LocalSeoTickets";

function App() {
  const user = JSON.parse(localStorage.getItem("user"));
  return (
    <div className="App">
      <Toaster />
      <Routes>
        <Route path="/" element={<Login />} />
        <Route path="/signin" element={<SignIn />} />
        <Route
          path="/signup"
          element={user?.role === "admin" ? <SignUp /> : <Navigate to="/" />}
        />
        <Route path="/home" element={<Home />} />
        <Route path="/department/webseoform" element={<WebSeoForm />} />
        <Route path="/department/localseoform" element={<LocalSeoForm />} />
        <Route
          path="/department/socialmediaform"
          element={<SocialMediaForm />}
        />
        <Route
          path="/department/customdevelopment"
          element={<CustomDevelopment />}
        />
        <Route path="/department/wordpressform" element={<WordPress />} />
        <Route path="/department/writersform" element={<WritersForm />} />
        <Route path="/department/reviewsform" element={<Reviews />} />
        <Route
          path="/department/paidmarketingform"
          element={<PaidMarketing />}
        />
        <Route path="/ticketlist" element={<TicketList />} />
        <Route path="/todo" element={<UserToDo showHeader={true} />} />
        {user.department._id === "654bc9d114e9ed66948b4a01" ? (
          <Route path="/history" element={<WritersTicketHistory />} />
        ) : (
          <Route path="/history" element={<CustomPaginationActionsTable />} />
        )}
        <Route path="/tickets_created" element={<TicketCreatedTable />} />
        <Route path="/open_tickets" element={<ShowOpenTickets />} />
        <Route path="/close_tickets" element={<ShowCloseTickets />} />
        <Route path="/local_seo_tickets" element={<LocalSeoWritersTickets />} />
        <Route path="/active_clients" element={<ActiveClients />} />
        <Route path="/notactive_clients" element={<NotActiveClients />} />
        <Route path="/webseo_clients" element={<WebSeoClients />} />
        <Route path="/localseo_clients" element={<LocalSeoSheet />} />
        <Route path="/add_clients" element={<AddClient />} />
        <Route path="/one_time_service_clients" element={<TableCustomized />} />
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
      </Routes>
    </div>
  );
}

export default App;
