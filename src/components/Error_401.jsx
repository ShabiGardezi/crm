import React from "react";
import { Container, Typography, Button } from "@material-ui/core";
import { Link } from "react-router-dom";
const UnauthorizedError = () => {
  return (
    <Container>
      <Typography variant="h3" gutterBottom>
        401 Unauthorized
      </Typography>
      <Typography variant="body1" paragraph>
        Oops! You are not authorized to access this resource.
      </Typography>
      <Link to="/home">
        <Button variant="contained" color="primary">
          Go Back Home
        </Button>
      </Link>
    </Container>
  );
};

export default UnauthorizedError;
