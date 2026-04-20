import { useState } from "react";
import { GoogleLogin } from "@react-oauth/google";
import { jwtDecode } from "jwt-decode";
import PropTypes from "prop-types";

import {
  Box,
  Card,
  CardContent,
  Typography,
  Container,
  Alert,
  Fade,
} from "@mui/material";

function Login({ setUser }) {
  const [error, setError] = useState("");

  const handleSuccess = (credentialResponse) => {
    try {
      const decoded = jwtDecode(credentialResponse.credential);
      setUser(decoded);
    } catch (err) {
      setError("Failed to decode login response.");
    }
  };

  const handleError = () => {
    setError("Google Login Failed. Please try again.");
  };

  return (
    <Box
      sx={{
        minHeight: "100vh",
        background: "linear-gradient(135deg, #0f172a, #1e1b4b)",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        p: 3,
      }}
    >
      <Container maxWidth="sm">
        <Fade in timeout={800}>
          <Card
            elevation={12}
            sx={{
              p: 4,
              borderRadius: 4,
              backdropFilter: "blur(15px)",
              backgroundColor: "rgba(30, 41, 59, 0.85)",
              textAlign: "center",
              transition: "0.4s",
              "&:hover": {
                transform: "scale(1.02)",
              },
            }}
          >
            <CardContent>
              <Typography
                variant="h4"
                fontWeight="bold"
                gutterBottom
              >
                Welcome to Snowflake Optimizer ❄
              </Typography>

              <Typography
                variant="body1"
                sx={{ mb: 3, color: "gray" }}
              >
                Sign in with Google to continue
              </Typography>

              <Box display="flex" justifyContent="center">
                <GoogleLogin
                  onSuccess={handleSuccess}
                  onError={handleError}
                  theme="filled_blue"
                  size="large"
                  shape="pill"
                />
              </Box>

              {error && (
                <Alert severity="error" sx={{ mt: 3 }}>
                  {error}
                </Alert>
              )}
            </CardContent>
          </Card>
        </Fade>
      </Container>
    </Box>
  );
}

Login.propTypes = {
  setUser: PropTypes.func.isRequired,
};

export default Login;