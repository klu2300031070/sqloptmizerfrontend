import { useEffect, useState } from "react";
import PropTypes from "prop-types";
import {
  Box,
  Card,
  CardContent,
  Typography,
  Container,
  Alert,
  Fade,
  Button,
  CircularProgress,
} from "@mui/material";

const CLIENT_ID = "2nvo1g2bkegtrua3tir9q4bsng";
const REDIRECT_URI = "https://main.d30lc4vxybk6pg.amplifyapp.com/";
const COGNITO_DOMAIN =
  "https://us-east-1wvpsr47h7.auth.us-east-1.amazoncognito.com";

function base64UrlEncode(arrayBuffer) {
  return btoa(String.fromCharCode(...new Uint8Array(arrayBuffer)))
    .replace(/\+/g, "-")
    .replace(/\//g, "_")
    .replace(/=+$/, "");
}

function generateRandomString(length = 64) {
  const charset =
    "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789-._~";
  const randomValues = new Uint8Array(length);
  window.crypto.getRandomValues(randomValues);

  let result = "";
  randomValues.forEach((value) => {
    result += charset[value % charset.length];
  });
  return result;
}

async function generateCodeChallenge(codeVerifier) {
  const encoder = new TextEncoder();
  const data = encoder.encode(codeVerifier);
  const digest = await window.crypto.subtle.digest("SHA-256", data);
  return base64UrlEncode(digest);
}

function Login({ setUser }) {
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    const params = new URLSearchParams(window.location.search);
    const code = params.get("code");
    const returnedState = params.get("state");
    const savedState = sessionStorage.getItem("cognito_auth_state");
    const codeVerifier = sessionStorage.getItem("pkce_code_verifier");

    if (!code) return;

    if (!returnedState || !savedState || returnedState !== savedState) {
      setError("Invalid login state. Please try signing in again.");
      return;
    }

    if (!codeVerifier) {
      setError("Missing PKCE verifier. Please try signing in again.");
      return;
    }

    exchangeCodeForToken(code, codeVerifier);
  }, []);

  const exchangeCodeForToken = async (code, codeVerifier) => {
    setLoading(true);
    setError("");

    try {
      const body = new URLSearchParams({
        grant_type: "authorization_code",
        client_id: CLIENT_ID,
        code,
        redirect_uri: REDIRECT_URI,
        code_verifier: codeVerifier,
      });

      const response = await fetch(`${COGNITO_DOMAIN}/oauth2/token`, {
        method: "POST",
        headers: {
          "Content-Type": "application/x-www-form-urlencoded",
        },
        body: body.toString(),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error_description || data.error || "Token exchange failed.");
      }

      localStorage.setItem("access_token", data.access_token || "");
      localStorage.setItem("id_token", data.id_token || "");
      localStorage.setItem("refresh_token", data.refresh_token || "");

      sessionStorage.removeItem("pkce_code_verifier");
      sessionStorage.removeItem("cognito_auth_state");

      setUser({
        isAuthenticated: true,
        accessToken: data.access_token,
        idToken: data.id_token,
      });

      window.history.replaceState({}, document.title, "/");
    } catch (err) {
      setError(err.message || "Login failed.");
    } finally {
      setLoading(false);
    }
  };

  const loginWithCognito = async () => {
    try {
      setError("");

      const state = generateRandomString(32);
      const codeVerifier = generateRandomString(96);
      const codeChallenge = await generateCodeChallenge(codeVerifier);

      sessionStorage.setItem("cognito_auth_state", state);
      sessionStorage.setItem("pkce_code_verifier", codeVerifier);

      const loginUrl =
        `${COGNITO_DOMAIN}/oauth2/authorize` +
        `?response_type=code` +
        `&client_id=${encodeURIComponent(CLIENT_ID)}` +
        `&redirect_uri=${encodeURIComponent(REDIRECT_URI)}` +
        `&scope=${encodeURIComponent("openid email profile")}` +
        `&state=${encodeURIComponent(state)}` +
        `&code_challenge_method=S256` +
        `&code_challenge=${encodeURIComponent(codeChallenge)}` +
        `&prompt=login`;

      window.location.href = loginUrl;
    } catch {
      setError("Unable to start login. Please try again.");
    }
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
            }}
          >
            <CardContent>
              <Typography variant="h4" fontWeight="bold" gutterBottom color="white">
                Welcome to SQL AI Optimizer ❄
              </Typography>

              <Typography variant="body1" sx={{ mb: 3, color: "#cbd5e1" }}>
                Sign in to continue
              </Typography>

              <Box display="flex" justifyContent="center">
                <Button
                  variant="contained"
                  size="large"
                  onClick={loginWithCognito}
                  disabled={loading}
                  sx={{
                    px: 4,
                    py: 1.5,
                    borderRadius: "999px",
                    fontWeight: "bold",
                    textTransform: "none",
                  }}
                >
                  {loading ? "Signing in..." : "Sign in"}
                </Button>
              </Box>

              {loading && (
                <Box mt={3} display="flex" justifyContent="center">
                  <CircularProgress />
                </Box>
              )}

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