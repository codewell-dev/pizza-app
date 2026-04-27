"use client";

import { useEffect } from "react";
import { Box, Container, Typography, Button } from "@mui/material";
import ErrorOutlineIcon from "@mui/icons-material/ErrorOutline";

interface ErrorProps {
  error: Error & { digest?: string };
  reset: () => void;
}

export default function GlobalError({ error, reset }: ErrorProps) {
  useEffect(() => {
    // Log to your error tracking service (Sentry etc.) here
    console.error("[GlobalError]", error);
  }, [error]);

  return (
    <Container maxWidth="sm">
      <Box
        sx={{
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          justifyContent: "center",
          minHeight: "60vh",
          textAlign: "center",
          gap: 3,
        }}
      >
        <ErrorOutlineIcon sx={{ fontSize: 72, color: "error.main", opacity: 0.8 }} />

        <Box>
          <Typography variant="h4" fontWeight={700} gutterBottom>
            Щось пішло не так 😔
          </Typography>
          <Typography color="text.secondary" sx={{ mb: 1 }}>
            Не вдалося завантажити сторінку. Спробуйте ще раз.
          </Typography>
          {process.env.NODE_ENV === "development" && (
            <Typography
              variant="caption"
              color="error"
              sx={{ display: "block", mt: 1, fontFamily: "monospace" }}
            >
              {error.message}
            </Typography>
          )}
        </Box>

        <Box sx={{ display: "flex", gap: 2 }}>
          <Button variant="contained" onClick={reset} size="large">
            Спробувати знову
          </Button>
          <Button variant="outlined" href="/" size="large">
            На головну
          </Button>
        </Box>
      </Box>
    </Container>
  );
}
