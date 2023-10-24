import React, { useEffect, useState } from "react";
import WebSeoSheet from "../Client-Sheets/WebSEOSheet";
import axios from "axios";

const WebSeoClients = () => {
  const [departments, setDepartments] = useState();
  useEffect(() => {
    const fetchDepartments = async () => {
      try {
        const response = await axios.get(
          `http://localhost:5000/api/departments`
        );
        setDepartments(response.data.payload);
      } catch (error) {
        console.log(error);
      }
    };
    fetchDepartments();
  }, []);
  return (
    <div>
      <WebSeoSheet />
    </div>
  );
};

export default WebSeoClients;
