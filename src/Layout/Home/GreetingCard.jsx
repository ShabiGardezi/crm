import React, { useEffect, useState } from "react";
import { Card, CardHeader, CardContent } from "@material-ui/core";
import "../../styles/Home/GreetingCard.css";

const GreetingCard = ({ username }) => {
  const [greeting, setGreeting] = useState("");
  const user = JSON.parse(localStorage.getItem("user"));
  const currentTime = new Date().getHours();

  useEffect(() => {
    if (currentTime < 12) {
      setGreeting("Good Morning, ");
    } else {
      setGreeting("Good Evening, ");
    }
  }, [currentTime]);

  return (
    <div className="greetingcard">
      <Card>
        <CardContent>
          <CardHeader title={greeting} />
          <div className="username">{user?.username}</div>
        </CardContent>
      </Card>
    </div>
  );
};

export default GreetingCard;
