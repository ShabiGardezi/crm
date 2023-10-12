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
import CreateTicketCard from "./components/createTicket";
// import CreateTicketForm from "./pages/createTicketForm";
import TicketList from "./pages/TicketList";
import NotFound from "./pages/404Error";
import UserToDo from "./components/UserToDo";
import CustomDevelopment from "./pages/Departments/CustomDevelopment";
// import TicketDetails from "./pages/FormSections/TicketDetails";
import CustomPaginationActionsTable from "./pages/Tickets/TicketHistory";
import TicketShortInfo from "./pages/Tickets/TicketShortInfo";
import FormDataDisplay from "./pages/FormSections/FormDataDisplay";

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
          element={
            user?.role === "admin" ? <SignUp /> : <Navigate to="/notfound" />
          }
        />
        <Route path="/home" element={<Home />} />
        <Route path="/notfound" element={<NotFound />} />
        <Route path="/webseoform" element={<WebSeoForm />} />
        <Route path="/localseoform" element={<LocalSeoForm />} />
        <Route path="/socialmediaform" element={<SocialMediaForm />} />
        <Route path="/customdevelopment" element={<CustomDevelopment />} />
        <Route path="/wordpressform" element={<WordPress />} />
        <Route path="/reviewsform" element={<Reviews />} />
        <Route path="/paidmarketingform" element={<PaidMarketing />} />
        <Route path="/ticketlist" element={<TicketList />} />
        <Route path="/todo" element={<UserToDo showHeader={true} />} />
        <Route path="/info" element={<FormDataDisplay />} />
        <Route path="/history" element={<CustomPaginationActionsTable />} />
      </Routes>
    </div>
  );
}

export default App;
