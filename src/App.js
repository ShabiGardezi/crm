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
import WebSeoSheet from "./pages/Client-Sheets/WebSEOSheet";
import ActiveClients from "./pages/Client-Sheets/ActiveClients";
import NotActiveClients from "./pages/Client-Sheets/NotActiveClients";
import WebSeoClients from "./pages/ClientHistory/WebSeoClients";
import LocalSeoSheet from "./pages/Client-Sheets/LocalSeoClients/LocalSeoClient";

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
        <Route path="/department/reviewsform" element={<Reviews />} />
        <Route
          path="/department/paidmarketingform"
          element={<PaidMarketing />}
        />
        <Route path="/ticketlist" element={<TicketList />} />
        <Route path="/todo" element={<UserToDo showHeader={true} />} />
        <Route path="/info" element={<FormDataDisplay />} />
        <Route path="/history" element={<CustomPaginationActionsTable />} />
        <Route path="/tickets_created" element={<TicketCreatedTable />} />
        <Route path="/open_tickets" element={<ShowOpenTickets />} />
        <Route path="/close_tickets" element={<ShowCloseTickets />} />
        {/* <Route path="/webseo_sheet" element={<WebSeoSheet />} /> */}
        <Route path="/active_clients" element={<ActiveClients />} />
        <Route path="/notactive_clients" element={<NotActiveClients />} />
        <Route path="/webseo_clients" element={<WebSeoClients />} />
        <Route path="/localseo_clients" element={<LocalSeoSheet />} />
      </Routes>
    </div>
  );
}

export default App;
