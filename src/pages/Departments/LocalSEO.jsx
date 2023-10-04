import React from "react";
import "../../styles/Forms/formsCommon.css";
import CRMProjectForm from "../../components/TicketForm";
const LocalSeoForm = () => {
  const user = JSON.parse(localStorage.getItem("user"));
  
  return (
    <>
      <CRMProjectForm />
    </>
  );
};

export default LocalSeoForm;
