import React from "react";
import Button from "@mui/material/Button";
import Dialog from "@mui/material/Dialog";
import DialogActions from "@mui/material/DialogActions";
import DialogContent from "@mui/material/DialogContent";
import DialogContentText from "@mui/material/DialogContentText";
import DialogTitle from "@mui/material/DialogTitle";
import Typography from "@mui/material/Typography";

export default function DisplayTicketDetails({
  open,
  handleClose,
  ticketDetails,
}) {
  const renderFields = (data) => {
    return Object.entries(data).map(([key, value]) => (
      <div key={key} className="displayFields">
        <Typography variant="subtitle2">{key}:</Typography>
        <div>
          <Typography>{value}</Typography>
        </div>
      </div>
    ));
  };

  return (
    <div>
      <Dialog open={open} onClose={handleClose} scroll="paper" fullWidth>
        <DialogTitle id="scroll-dialog-title" style={{ textAlign: "center" }}>
          Ticket Assigned To {ticketDetails.majorAssignee.name}
        </DialogTitle>
        <DialogContent dividers>
          <div style={{ maxHeight: "400px", overflowY: "auto" }}>
            <DialogContentText id="scroll-dialog-description">
              <Typography variant="h5" style={{ textAlign: "center" }}>
                Ticket Details
              </Typography>

              {renderFields(ticketDetails.TicketDetails)}
              <Typography variant="h5" style={{ textAlign: "center" }}>
                Services
              </Typography>

              {renderFields(ticketDetails.Services)}
              <Typography variant="h5" style={{ textAlign: "center" }}>
                Business Details
              </Typography>

              {renderFields(ticketDetails.businessdetails)}
            </DialogContentText>
          </div>
        </DialogContent>
        <DialogActions>
          <Button onClick={handleClose}>Close</Button>
        </DialogActions>
      </Dialog>
    </div>
  );
}
