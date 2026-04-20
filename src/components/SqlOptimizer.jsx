import { useState } from "react";
import {
  Box,
  Button,
  Card,
  CardContent,
  Container,
  Typography,
  CircularProgress,
  Alert,
  Fade,
  Divider,
  TextField,
} from "@mui/material";
import UploadFileIcon from "@mui/icons-material/UploadFile";
import RocketLaunchIcon from "@mui/icons-material/RocketLaunch";

export default function Optimizer() {
  const [query, setQuery] = useState("");
  const [file, setFile] = useState(null);
  const [result, setResult] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const optimizeQuery = async () => {
    if (!query.trim()) {
      setError("Please enter a SQL query.");
      return;
    }

    setLoading(true);
    setError("");
    setResult(null);

    try {
      const response = await fetch("https://emzagcw523.us-east-1.awsapprunner.com/api/sql/optimize", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ query }),
      });

      if (!response.ok) {
        throw new Error("Backend returned an error.");
      }

      const data = await response.json();
      setResult(data);
    } catch (err) {
      setError(err.message || "Failed to connect to backend.");
    } finally {
      setLoading(false);
    }
  };

  const optimizeFile = async () => {
    if (!file) {
      setError("Please select a .txt or .pdf file.");
      return;
    }

    setLoading(true);
    setError("");
    setResult(null);

    try {
      const formData = new FormData();
      formData.append("file", file);

      const response = await fetch("https://emzagcw523.us-east-1.awsapprunner.com/api/sql/optimize-file", {
        method: "POST",
        body: formData,
      });

      if (!response.ok) {
        throw new Error("File optimization failed.");
      }

      const data = await response.json();
      setResult(data);
    } catch (err) {
      setError(err.message || "Failed to upload file.");
    } finally {
      setLoading(false);
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
      <Container maxWidth="md">
        <Fade in timeout={800}>
          <Card
            elevation={12}
            sx={{
              p: 4,
              borderRadius: 4,
              backgroundColor: "rgba(30, 41, 59, 0.92)",
              color: "#fff",
            }}
          >
            <CardContent>
              <Typography variant="h4" align="center" fontWeight="bold" gutterBottom>
                SQL Query Optimizer
              </Typography>

              <Typography variant="body1" align="center" sx={{ color: "#cbd5e1", mb: 3 }}>
                Paste SQL directly or upload a .txt / .pdf file.
              </Typography>

              <TextField
                multiline
                rows={8}
                fullWidth
                variant="outlined"
                placeholder="Paste your SQL query here..."
                value={query}
                onChange={(e) => setQuery(e.target.value)}
                sx={{
                  mb: 2,
                  "& .MuiOutlinedInput-root": {
                    color: "#fff",
                    backgroundColor: "rgba(15, 23, 42, 0.8)",
                  },
                  "& .MuiInputBase-input::placeholder": {
                    color: "#94a3b8",
                    opacity: 1,
                  },
                }}
              />

              <Button
                fullWidth
                variant="contained"
                startIcon={<RocketLaunchIcon />}
                onClick={optimizeQuery}
                disabled={loading}
                sx={{ mb: 3, py: 1.4, fontWeight: "bold" }}
              >
                Optimize Text Query
              </Button>

              <Divider sx={{ my: 2, borderColor: "rgba(148,163,184,0.2)" }} />

              <Button
                fullWidth
                variant="outlined"
                component="label"
                startIcon={<UploadFileIcon />}
                sx={{ mb: 2, color: "#fff", borderColor: "#94a3b8" }}
              >
                {file ? file.name : "Choose .txt or .pdf file"}
                <input
                  hidden
                  type="file"
                  accept=".txt,.pdf"
                  onChange={(e) => setFile(e.target.files?.[0] || null)}
                />
              </Button>

              <Button
                fullWidth
                variant="contained"
                color="secondary"
                onClick={optimizeFile}
                disabled={loading}
                sx={{ py: 1.4, fontWeight: "bold" }}
              >
                Optimize Uploaded File
              </Button>

              {loading && (
                <Box display="flex" justifyContent="center" mt={3}>
                  <CircularProgress color="secondary" />
                </Box>
              )}

              {error && (
                <Alert severity="error" sx={{ mt: 3 }}>
                  {error}
                </Alert>
              )}

              {result && (
                <Fade in timeout={500}>
                  <Box
                    mt={4}
                    p={3}
                    sx={{
                      backgroundColor: "#0f172a",
                      borderRadius: 3,
                      border: "1px solid rgba(148, 163, 184, 0.2)",
                    }}
                  >
                    <Typography variant="h6" fontWeight="bold" gutterBottom>
                      Original Query
                    </Typography>
                    <Box sx={{ backgroundColor: "#020617", p: 2, borderRadius: 2, mb: 3 }}>
                      <Typography sx={{ whiteSpace: "pre-wrap", color: "#facc15", fontFamily: "monospace" }}>
                        {result.originalQuery}
                      </Typography>
                    </Box>

                    <Typography variant="h6" fontWeight="bold" gutterBottom>
                      Optimized Query
                    </Typography>
                    <Box sx={{ backgroundColor: "#020617", p: 2, borderRadius: 2, mb: 3 }}>
                      <Typography sx={{ whiteSpace: "pre-wrap", color: "#4ade80", fontFamily: "monospace" }}>
                        {result.optimizedQuery}
                      </Typography>
                    </Box>

                    <Typography variant="h6" fontWeight="bold" gutterBottom>
                      Explanation
                    </Typography>
                    <Typography sx={{ color: "#e2e8f0", lineHeight: 1.8 }}>
                      {result.explanation}
                    </Typography>
                  </Box>
                </Fade>
              )}
            </CardContent>
          </Card>
        </Fade>
      </Container>
    </Box>
  );
}