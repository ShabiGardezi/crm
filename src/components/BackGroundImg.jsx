import React from "react";
import BackGroundPic from "../assests/Navbarlogo.png"; // Make sure to import your stylesheet
import "../styles/BackGroundImg.css";
const BackGroundImg = () => {
  return (
    <div className="outer-div">
      <div className="background-img">
        <img className="logo" src={BackGroundPic} alt="Your Logo" />
      </div>
    </div>
  );
};

export default BackGroundImg;
