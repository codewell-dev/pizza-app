"use client";

import { Box, Button, Typography } from "@mui/material";
import ShoppingCartIcon from "@mui/icons-material/ShoppingCart";
import ArrowForwardIcon from "@mui/icons-material/ArrowForward";
import Link from "next/link";
import { useShopStore } from "../providers/store-provider";

/**
 * MobileOrderBar — sticky bottom CTA on mobile when cart has items.
 * Desktop: hidden (cart is in the header).
 * Mobile: fixed bottom bar with total + checkout button.
 *
 * Replaces the need to scroll up to cart on mobile, significantly
 * reducing checkout abandonment.
 */
export default function MobileOrderBar() {
  const totalCount = useShopStore((state) => state.totalCount);
  const totalPrice = useShopStore((state) => state.totalPrice);

  if (totalCount === 0) return null;

  return (
    <Box
      className={`mobile-order-bar has-items`}
      sx={{
        position: "fixed",
        bottom: 0,
        left: 0,
        right: 0,
        zIndex: 1300,
        px: 2,
        py: 1.5,
        pb: "max(12px, env(safe-area-inset-bottom))",
        bgcolor: "rgba(255,255,255,0.97)",
        backdropFilter: "blur(12px)",
        WebkitBackdropFilter: "blur(12px)",
        borderTop: "1px solid rgba(26,26,24,0.08)",
        boxShadow: "0 -4px 20px rgba(26,26,24,0.10)",
        display: { xs: "flex", md: "none" },
        alignItems: "center",
        gap: 1.5,
        animation: "slideUp 0.3s cubic-bezier(0.4, 0, 0.2, 1) both",
        "@keyframes slideUp": {
          from: { transform: "translateY(100%)", opacity: 0 },
          to: { transform: "translateY(0)", opacity: 1 },
        },
      }}
    >
      {/* Cart summary */}
      <Box
        sx={{
          display: "flex",
          alignItems: "center",
          gap: 1,
          flexShrink: 0,
        }}
      >
        <Box
          sx={{
            width: 38,
            height: 38,
            bgcolor: "#1A1A18",
            borderRadius: "10px",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            position: "relative",
          }}
        >
          <ShoppingCartIcon sx={{ fontSize: 18, color: "#FAE900" }} />
          <Box
            sx={{
              position: "absolute",
              top: -5,
              right: -5,
              width: 18,
              height: 18,
              bgcolor: "#FAE900",
              borderRadius: "50%",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              border: "2px solid #fff",
            }}
          >
            <Typography
              sx={{
                fontSize: "0.6rem",
                fontWeight: 800,
                color: "#1A1A18",
                lineHeight: 1,
              }}
            >
              {totalCount}
            </Typography>
          </Box>
        </Box>

        <Box>
          <Typography sx={{ fontSize: "0.72rem", color: "#8A8A85", lineHeight: 1 }}>
            Ваше замовлення
          </Typography>
          <Typography
            sx={{
              fontSize: "0.95rem",
              fontWeight: 800,
              color: "#1A1A18",
              letterSpacing: "-0.02em",
              lineHeight: 1.2,
            }}
          >
            {totalPrice} ₴
          </Typography>
        </Box>
      </Box>

      {/* CTA */}
      <Button
        variant="contained"
        component={Link}
        href="/order"
        endIcon={<ArrowForwardIcon />}
        fullWidth
        sx={{
          borderRadius: "12px",
          bgcolor: "#FAE900",
          color: "#111",
          fontWeight: 800,
          fontSize: "0.92rem",
          py: 1.4,
          boxShadow: "none",
          letterSpacing: "-0.01em",
          transition: "all 0.18s ease",
          "&:hover": {
            bgcolor: "#E8D800",
            boxShadow: "0 4px 16px rgba(250,233,0,0.45)",
          },
          "&:active": { transform: "scale(0.98)" },
        }}
      >
        Оформити
      </Button>
    </Box>
  );
}
