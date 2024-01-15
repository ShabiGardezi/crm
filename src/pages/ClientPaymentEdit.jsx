import React, { useState } from "react";
import {
  Dialog,
  DialogTitle,
  DialogContent,
  TextField,
  Button,
} from "@mui/material";

const ClientPaymentEdit = ({ isOpen, onClose, onSave }) => {
  const [newPayment, setNewPayment] = useState("");

  const handleSave = () => {
    onSave(newPayment);
    setNewPayment(""); // Clear the input field after saving
    onClose();
  };

  return (
    <Dialog open={isOpen} onClose={onClose}>
      <DialogTitle>Edit Payment</DialogTitle>
      <DialogContent>
        <TextField
          label="Enter New Payment"
          value={newPayment}
          onChange={(e) => setNewPayment(e.target.value)}
          fullWidth
        />
        <Button onClick={handleSave}>Save</Button>
      </DialogContent>
    </Dialog>
  );
};

export default ClientPaymentEdit;
