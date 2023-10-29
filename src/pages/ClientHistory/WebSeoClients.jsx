import React, { useEffect, useState } from "react";
import WebSeoSheet from "../Client-Sheets/WebSEOSheet";
import axios from "axios";

const WebSeoClients = () => {
  const [department, setDepartment] = useState();
  const [show, setshow] = useState(false);
  useEffect(() => {
    const fetchDepartments = async () => {
      try {
        setshow(false);
        const response = await axios.get(
          `http://localhost:5000/api/departments`
        );
        const web_seo_department = response.data.payload.find(
          (d) => d.name === "Website SEO"
        );
        setDepartment(web_seo_department);
        setshow(true);
      } catch (error) {
        console.log(error);
      }
    };
    fetchDepartments();
  }, []);
  return <div>{show && <WebSeoSheet department={department} />}</div>;
};

export default WebSeoClients;
