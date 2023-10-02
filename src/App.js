import { Route, Routes } from "react-router-dom";
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

function App() {
  return (
    <div className="App">
      <Toaster />
      <Routes>
        <Route path="/" Component={Login} />
        <Route path="/signin" Component={SignIn} />
        <Route path="/signup" Component={SignUp} />
        <Route path="/home" Component={Home} />
        <Route path="/webseoform" Component={WebSeoForm} />
        <Route path="/localseoform" Component={LocalSeoForm} />
        <Route path="/socialmediaform" Component={SocialMediaForm} />
        <Route path="/wordpressform" Component={WordPress} />
        <Route path="/reviewsform" Component={Reviews} />
        <Route path="/paidmarketingform" Component={PaidMarketing} />
      </Routes>
    </div>
  );
}

export default App;
