import { Box, Container, Typography, Button } from "@mui/material";
import SearchOffIcon from "@mui/icons-material/SearchOff";
import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Сторінку не знайдено",
};

export default function NotFound() {
  return (
    <Container maxWidth="sm">
      <Box
        sx={{
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          justifyContent: "center",
          minHeight: "65vh",
          textAlign: "center",
          gap: 3,
        }}
      >
        <Typography
          sx={{
            fontSize: { xs: "6rem", md: "9rem" },
            fontWeight: 900,
            lineHeight: 1,
            color: "primary.main",
            letterSpacing: "-0.05em",
          }}
        >
          404
        </Typography>

        <SearchOffIcon sx={{ fontSize: 56, color: "text.disabled", mt: -2 }} />

        <Box>
          <Typography variant="h5" fontWeight={700} gutterBottom>
            Сторінку не знайдено
          </Typography>
          <Typography color="text.secondary">
            Можливо, вона була переміщена або посилання неправильне.
          </Typography>
        </Box>

        <Button variant="contained" href="/" size="large" sx={{ mt: 1 }}>
          🍕 Повернутися до меню
        </Button>
      </Box>
    </Container>
  );
}
