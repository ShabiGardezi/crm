import { Route, Routes } from "react-router-dom";
import Login from "./components/Login";
import SignIn from "./pages/SignIn";
import SignUp from "./pages/SIgnUp";
import Home from "./components/Home";
import Header from "./pages/Header";
function App() {
  return (
    <div className="App">
      <Header />
      <Routes>
        <Route path="/" Component={Login} />
        <Route path="/signin" Component={SignIn} />
        <Route path="/signup" Component={SignUp} />
        <Route path="/home" Component={Home} />
      </Routes>
    </div>
  );
}

export default App;
