import { Route, Routes } from "react-router-dom";
import Login from "./components/Login";
import SignIn from "./pages/SignIn";
import SignUp from "./pages/SIgnUp";
function App() {
  return (
    <div className="App">
      <Routes>
        <Route path="/" Component={Login} />
        <Route path="/signin" Component={SignIn} />
        <Route path="/signup" Component={SignUp} />
      </Routes>
    </div>
  );
}

export default App;
