import React from "react";
import Header from "../pages/Header";
import GreetingCard from "../Layout/Home/GreetingCard";
import { useNavigate } from "react-router-dom";
import TicketCards from "../Layout/Home/TicketCard";
import UserToDo from "./UserToDo";
const Home = () => {
  const navigate = useNavigate();

  return (
    <div>
      <Header />
      <GreetingCard />
      <div className="homeCards" style={{ marginTop: "5%" }}>
        <TicketCards />
      </div>
      <div className="homeTodo" style={{ marginTop: "5%" }}>
        <UserToDo wrapInCard={true} showHeader={false} />
      </div>
    </div>
  );
};

export default Home;
