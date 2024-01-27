import React from "react";
import BackGroundPic from "../assests/Navbarlogo.png"; // Make sure to import your stylesheet
import "../styles/BackGroundImg.css";

const BackGroundImg = () => {
  return (
    <div className="background-img-container">
      <img className="logo" src={BackGroundPic} alt="Your Logo" />
    </div>
  );
};

export default BackGroundImg;
