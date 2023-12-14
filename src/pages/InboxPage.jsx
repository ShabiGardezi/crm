import { Box, Typography } from "@mui/material";
import Header from "./Header";
import { useEffect, useState } from "react";
import axios from "axios";
import NotificationGrid from "./NotificationGrid";
import NotificationsNoneIcon from "@mui/icons-material/NotificationsNone";

export default function Inbox() {
  const apiUrl = process.env.REACT_APP_API_URL;
  const [resp, setResp] = useState([]);
  useEffect(() => {
    const { _id } = JSON.parse(localStorage.getItem("user"));
    axios
      .get(`${apiUrl}/api/notification/all?userId=${_id}&shouldMark=true`, {})
      .then((res) => {
        console.log(res);
        setResp(res.data.payload);
      })
      .catch((err) => console.error(err.message));
  }, []);
  return (
    <Box>
      <Header />
      <Box p={4}>
        <Box
          sx={{
            display: "flex",
            mt: 4,
            mb: 6,
            justifyContent: "center",
            gap: 2,
          }}
        >
          <Typography variant="h4" color="primary" sx={{ mt: 0.3 }}>
            Notifications
          </Typography>
          <NotificationsNoneIcon fontSize="large" color="primary" />
        </Box>
        <NotificationGrid rows={resp} />
      </Box>
    </Box>
  );
}
