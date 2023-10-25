import React, { useState } from "react";
import Dialog from "@mui/material/Dialog";
import DialogContent from "@mui/material/DialogContent";
import TextField from "@mui/material/TextField";
import Button from "@mui/material/Button";
import { ListItem, ListItemText } from "@mui/material";
export default function AddClient() {
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [clientName, setClientName] = useState("");
  const [businessEmail, setBusinessEmail] = useState("");

  const openDialog = () => {
    setIsDialogOpen(true);
  };

  const closeDialog = () => {
    setIsDialogOpen(false);
  };

  const handleClientNameChange = (event) => {
    setClientName(event.target.value);
  };

  const handleBusinessEmailChange = (event) => {
    setBusinessEmail(event.target.value);
  };

  const handleAddClient = () => {
    // Here, you can perform the necessary action, such as sending the data to your backend or handling it as needed.
    // After adding the client, you can close the dialog.
    closeDialog();
  };

  return (
    <div>
      <div className="client-history-dropdown">
        {/* Add Client */}
        <ListItem button onClick={openDialog}>
          <ListItemText primary="Add Client" />
        </ListItem>
        {/* ... Other menu items */}
      </div>

      <Dialog open={isDialogOpen} onClose={closeDialog}>
        <DialogContent>
          <TextField
            label="Client/Business Name"
            value={clientName}
            onChange={handleClientNameChange}
            fullWidth
          />
          <TextField
            label="Business Email"
            value={businessEmail}
            onChange={handleBusinessEmailChange}
            fullWidth
          />
        </DialogContent>
        <div>
          <Button onClick={handleAddClient} color="primary">
            Add Client
          </Button>
        </div>
      </Dialog>
    </div>
  );
}
