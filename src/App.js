import { Route, Routes, useNavigate } from "react-router-dom";
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
import CreateTicketForm from "./pages/createTicketForm";
import TicketList from "./pages/TicketList";
import NotFound from "./pages/404Error";

function App() {
  const navigate = useNavigate();
  const user = JSON.parse(localStorage.getItem("user"));
  const canAccessSignup = () => {
    // Check if the user is an admin and belongs to the sales department
    if (user?.role === "admin") {
      return true; // User can access /signup
    }
    return false; // User cannot access /signup
  };
  return (
    <div className="App">
      <Toaster />
      <Routes>
        <Route path="/" Component={Login} />
        <Route path="/signin" Component={SignIn} />
        {/* Use Navigate to redirect if user cannot access /signup */}
        <Route path="/signup" Component={canAccessSignup() ? <SignUp /> : ""} />
        <Route path="/home" Component={Home} />
        {<Route path="/notfound" Component={NotFound} />}
        <Route path="/webseoform" Component={WebSeoForm} />
        <Route path="/localseoform" Component={LocalSeoForm} />
        <Route path="/socialmediaform" Component={SocialMediaForm} />
        <Route path="/wordpressform" Component={WordPress} />
        <Route path="/reviewsform" Component={Reviews} />
        <Route path="/paidmarketingform" Component={PaidMarketing} />
        <Route path="/createticket" Component={CreateTicketCard} />
        <Route path="/createticketform" Component={CreateTicketForm} />
        <Route path="/ticketlist" Component={TicketList} />
      </Routes>
    </div>
  );
}

export default App;
