"use client";

import * as React from "react";
import {
  Box,
  Stack,
  Typography,
  Button,
  Divider,
  IconButton,
  Drawer,
  Badge,
  Collapse,
} from "@mui/material";
import CloseIcon from "@mui/icons-material/Close";
import ShoppingCartOutlinedIcon from "@mui/icons-material/ShoppingCartOutlined";
import ArrowForwardIcon from "@mui/icons-material/ArrowForward";
import LocalFireDepartmentIcon from "@mui/icons-material/LocalFireDepartment";
import Link from "next/link";
import CardBasket from "../entities/basket/card-basket";
import { useShopStore } from "../providers/store-provider";
import { ProductWithCartId } from "../stores/cartSlice";
import { useTranslations } from "next-intl";

/**
 * Premium Basket (Cart Drawer)
 *
 * Design decisions:
 * - White trigger button with charcoal icon (not yellow) until items > 0
 * - When items exist: bold yellow pill showing count + price
 * - Drawer: 440px wide on desktop, full-width on mobile
 * - Subtle dividers between items
 * - Upsell section for drinks/sauces (static for now, can be dynamic)
 * - Sticky checkout footer with total breakdown
 * - Empty state with CTA to continue shopping
 */
export default function Basket() {
  const [open, setOpen] = React.useState(false);
  const t = useTranslations("basket");

  const cartProducts = useShopStore((state) => state.cart);
  const totalPrice = useShopStore((state) => state.totalPrice);
  const totalCount = useShopStore((state) => state.totalCount);

  const DRAWER_WIDTH = { xs: "100vw", sm: 440 };

  const BasketContent = (
    <Box
      sx={{
        width: DRAWER_WIDTH,
        maxWidth: "100vw",
        height: "100%",
        display: "flex",
        flexDirection: "column",
        bgcolor: "#FAFAF7",
      }}
      role="dialog"
      aria-label="Кошик"
    >
      {/* ── Drawer header ───────────────────────────────────── */}
      <Box
        sx={{
          display: "flex",
          alignItems: "center",
          justifyContent: "space-between",
          px: 3,
          py: 2,
          bgcolor: "#FFFFFF",
          borderBottom: "1px solid rgba(26,26,24,0.07)",
          flexShrink: 0,
        }}
      >
        <Box>
          <Typography
            sx={{
              fontWeight: 800,
              fontSize: "1.25rem",
              color: "#1A1A18",
              letterSpacing: "-0.025em",
              lineHeight: 1,
            }}
          >
            {t("title")}
          </Typography>
          {totalCount > 0 && (
            <Typography
              sx={{
                fontSize: "0.78rem",
                color: "#8A8A85",
                fontWeight: 500,
                mt: 0.25,
              }}
            >
              {totalCount} {totalCount === 1 ? "позиція" : totalCount < 5 ? "позиції" : "позицій"}
            </Typography>
          )}
        </Box>

        <IconButton
          onClick={() => setOpen(false)}
          aria-label="Закрити кошик"
          sx={{
            bgcolor: "rgba(26,26,24,0.06)",
            borderRadius: "10px",
            width: 38,
            height: 38,
            transition: "all 0.18s ease",
            "&:hover": { bgcolor: "rgba(26,26,24,0.12)" },
          }}
        >
          <CloseIcon sx={{ fontSize: 18 }} />
        </IconButton>
      </Box>

      {/* ── Items list ──────────────────────────────────────── */}
      <Box
        sx={{
          flex: 1,
          overflowY: "auto",
          "&::-webkit-scrollbar": { width: 4 },
          "&::-webkit-scrollbar-thumb": {
            bgcolor: "rgba(26,26,24,0.15)",
            borderRadius: 2,
          },
        }}
      >
        {cartProducts.length > 0 ? (
          <>
            <Box sx={{ px: 2.5, py: 1 }}>
              <Stack spacing={0}>
                {cartProducts.map((item: ProductWithCartId, index) => (
                  <React.Fragment key={item.cartItemId}>
                    <CardBasket product={item} />
                    {index < cartProducts.length - 1 && (
                      <Divider sx={{ opacity: 0.08 }} />
                    )}
                  </React.Fragment>
                ))}
              </Stack>
            </Box>

            {/* Upsell section */}
            <UpsellSection />
          </>
        ) : (
          <EmptyCart onClose={() => setOpen(false)} />
        )}
      </Box>

      {/* ── Checkout footer ─────────────────────────────────── */}
      <Collapse in={cartProducts.length > 0}>
        <Box
          sx={{
            flexShrink: 0,
            px: 2.5,
            pt: 2,
            pb: 2.5,
            bgcolor: "#FFFFFF",
            borderTop: "1px solid rgba(26,26,24,0.07)",
            boxShadow: "0 -4px 20px rgba(26,26,24,0.06)",
          }}
        >
          {/* Totals */}
          <Box sx={{ mb: 1.5 }}>
            <Box
              sx={{
                display: "flex",
                justifyContent: "space-between",
                alignItems: "center",
                mb: 0.5,
              }}
            >
              <Typography sx={{ fontSize: "0.85rem", color: "#8A8A85" }}>
                Сума замовлення
              </Typography>
              <Typography sx={{ fontSize: "0.85rem", fontWeight: 600 }}>
                {totalPrice} ₴
              </Typography>
            </Box>
            <Box
              sx={{
                display: "flex",
                justifyContent: "space-between",
                alignItems: "center",
              }}
            >
              <Typography sx={{ fontSize: "0.85rem", color: "#8A8A85" }}>
                Доставка
              </Typography>
              <Typography
                sx={{ fontSize: "0.85rem", fontWeight: 600, color: "#1A7A3C" }}
              >
                Безкоштовно
              </Typography>
            </Box>
          </Box>

          <Divider sx={{ mb: 1.5, opacity: 0.1 }} />

          {/* Total */}
          <Box
            sx={{
              display: "flex",
              justifyContent: "space-between",
              alignItems: "baseline",
              mb: 1.75,
            }}
          >
            <Typography
              sx={{ fontWeight: 700, fontSize: "1rem", color: "#1A1A18" }}
            >
              {t("total")}
            </Typography>
            <Typography
              sx={{
                fontWeight: 800,
                fontSize: "1.4rem",
                color: "#1A1A18",
                letterSpacing: "-0.025em",
                lineHeight: 1,
              }}
            >
              {totalPrice} ₴
            </Typography>
          </Box>

          {/* CTA */}
          <Button
            variant="contained"
            fullWidth
            size="large"
            component={Link}
            href="/order"
            onClick={() => setOpen(false)}
            endIcon={<ArrowForwardIcon />}
            sx={{
              borderRadius: "14px",
              bgcolor: "#1A1A18",
              color: "#fff",
              fontWeight: 700,
              fontSize: "1rem",
              py: 1.75,
              boxShadow: "none",
              letterSpacing: "-0.01em",
              transition: "all 0.2s ease",
              "&:hover": {
                bgcolor: "#2D2D2B",
                boxShadow: "0 6px 24px rgba(26,26,24,0.25)",
                transform: "translateY(-1px)",
              },
              "&:active": { transform: "scale(0.98)" },
            }}
          >
            {t("checkout")}
          </Button>

          <Typography
            sx={{
              fontSize: "0.72rem",
              color: "#B0AFA9",
              textAlign: "center",
              mt: 1,
            }}
          >
            Безпечна оплата · Доставка 30-45 хв
          </Typography>
        </Box>
      </Collapse>
    </Box>
  );

  return (
    <>
      {/* ── Trigger button ───────────────────────────────────── */}
      <Button
        onClick={() => setOpen(true)}
        data-cart-trigger
        variant="contained"
        aria-label={`Кошик${totalCount > 0 ? `, ${totalCount} позицій, ${totalPrice} ₴` : ""}`}
        sx={{
          borderRadius: "100px",
          py: { xs: 0.8, sm: 0.9 },
          px: { xs: 1.5, sm: 2 },
          display: "flex",
          alignItems: "center",
          gap: 1,
          bgcolor: totalCount > 0 ? "#FAE900" : "rgba(26,26,24,0.06)",
          color: totalCount > 0 ? "#111" : "#1A1A18",
          fontWeight: 700,
          fontSize: { xs: "0.82rem", sm: "0.88rem" },
          boxShadow: "none",
          border: "none",
          transition: "all 0.2s ease",
          "&:hover": {
            bgcolor: totalCount > 0 ? "#E8D800" : "rgba(26,26,24,0.10)",
            boxShadow: totalCount > 0
              ? "0 4px 16px rgba(250,233,0,0.4)"
              : "none",
          },
          "&:active": { transform: "scale(0.96)" },
        }}
      >
        <Badge
          badgeContent={totalCount}
          sx={{
            "& .MuiBadge-badge": {
              bgcolor: totalCount > 0 ? "#1A1A18" : "#8A8A85",
              color: totalCount > 0 ? "#FAE900" : "#fff",
              fontWeight: 800,
              fontSize: "0.65rem",
              minWidth: 17,
              height: 17,
              padding: "0 4px",
              letterSpacing: 0,
            },
          }}
        >
          <ShoppingCartOutlinedIcon sx={{ fontSize: 20 }} />
        </Badge>

        {totalCount > 0 && (
          <Box
            component="span"
            sx={{
              display: { xs: "none", sm: "flex" },
              alignItems: "center",
              gap: 0.75,
              fontSize: "inherit",
              fontWeight: 700,
            }}
          >
            <Box
              component="span"
              sx={{
                width: "1px",
                height: "14px",
                bgcolor: "rgba(26,26,24,0.25)",
                borderRadius: 1,
              }}
            />
            {totalPrice} ₴
          </Box>
        )}
      </Button>

      <Drawer
        anchor="right"
        open={open}
        onClose={() => setOpen(false)}
        PaperProps={{
          sx: {
            width: DRAWER_WIDTH,
            maxWidth: "100vw",
            boxShadow: "-8px 0 40px rgba(26,26,24,0.12)",
          },
        }}
      >
        {BasketContent}
      </Drawer>
    </>
  );
}

/* ── Empty cart state ─────────────────────────────────────────── */
function EmptyCart({ onClose }: { onClose: () => void }) {
  return (
    <Box
      sx={{
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        justifyContent: "center",
        height: "100%",
        gap: 2,
        py: 8,
        px: 3,
      }}
    >
      {/* Illustration */}
      <Box
        sx={{
          width: 88,
          height: 88,
          bgcolor: "rgba(26,26,24,0.05)",
          borderRadius: "50%",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          mb: 1,
        }}
      >
        <ShoppingCartOutlinedIcon sx={{ fontSize: 40, color: "#C8C7C1" }} />
      </Box>

      <Typography
        sx={{
          fontWeight: 700,
          fontSize: "1.1rem",
          color: "#1A1A18",
          letterSpacing: "-0.02em",
        }}
      >
        Кошик порожній
      </Typography>
      <Typography
        sx={{
          color: "#8A8A85",
          fontSize: "0.88rem",
          textAlign: "center",
          lineHeight: 1.55,
        }}
      >
        Додайте смачні піци та суші, і вони з'являться тут
      </Typography>

      <Button
        variant="contained"
        onClick={onClose}
        sx={{
          mt: 1,
          borderRadius: "100px",
          bgcolor: "#FAE900",
          color: "#111",
          fontWeight: 700,
          px: 3,
          py: 1.25,
          boxShadow: "none",
          "&:hover": {
            bgcolor: "#E8D800",
            boxShadow: "0 4px 16px rgba(250,233,0,0.4)",
          },
        }}
      >
        До меню
      </Button>
    </Box>
  );
}

/* ── Upsell section ───────────────────────────────────────────── */
const UPSELL_ITEMS = [
  { id: "upsell-juice",    emoji: "🧃", label: "Сік апельсиновий", price: 45 },
  { id: "upsell-cola",     emoji: "🥤", label: "Coca-Cola 0.5л",   price: 55 },
  { id: "upsell-ketchup",  emoji: "🫙", label: "Кетчуп",           price: 25 },
  { id: "upsell-garlic",   emoji: "🧄", label: "Соус часниковий",  price: 25 },
] as const;

function UpsellSection() {
  const addProductToCart = useShopStore((state) => state.addProductToCart);
  const [addedIds, setAddedIds] = React.useState<Set<string>>(new Set());

  const handleAdd = (item: (typeof UPSELL_ITEMS)[number]) => {
    // Build a minimal Product-compatible object — no real API image
    addProductToCart({
      _id: item.id,
      title: item.label,
      price: item.price,
      weight: "",
      description: "",
      unit: "",
      // image.large is empty → CardBasket falls back to emoji rendering
      image: { large: "", medium: "", small: "" },
      category_id: "upsell" as never,
      group_modifiers: [],
      well_together_products: [],
      group: [],
      is_active: 1,
      // Extra field for CardBasket emoji fallback
      emoji: item.emoji,
    } as never);

    // Visual feedback: show "✓" for 1.5s
    setAddedIds((prev) => new Set(prev).add(item.id));
    setTimeout(() => {
      setAddedIds((prev) => {
        const next = new Set(prev);
        next.delete(item.id);
        return next;
      });
    }, 1500);
  };

  return (
    <Box
      sx={{
        mx: 2.5,
        mb: 2,
        mt: 1.5,
        p: 2,
        bgcolor: "#FFFFFF",
        borderRadius: "14px",
        border: "1px solid rgba(26,26,24,0.07)",
      }}
    >
      <Box sx={{ display: "flex", alignItems: "center", gap: 0.75, mb: 1.5 }}>
        <LocalFireDepartmentIcon sx={{ fontSize: 16, color: "#E8321A" }} />
        <Typography
          sx={{
            fontWeight: 700,
            fontSize: "0.82rem",
            color: "#1A1A18",
            letterSpacing: "-0.01em",
          }}
        >
          Додати до замовлення
        </Typography>
      </Box>

      <Stack spacing={0.75}>
        {UPSELL_ITEMS.map((item) => {
          const isAdded = addedIds.has(item.id);
          return (
            <Box
              key={item.id}
              sx={{
                display: "flex",
                alignItems: "center",
                justifyContent: "space-between",
                py: 0.75,
                px: 1,
                borderRadius: "10px",
                transition: "background 0.15s",
                "&:hover": { bgcolor: "rgba(26,26,24,0.04)" },
              }}
            >
              <Box sx={{ display: "flex", alignItems: "center", gap: 1.25 }}>
                <Box
                  sx={{
                    width: 32,
                    height: 32,
                    bgcolor: "#FAFAF7",
                    borderRadius: "8px",
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                    fontSize: "18px",
                    flexShrink: 0,
                  }}
                >
                  {item.emoji}
                </Box>
                <Typography sx={{ fontSize: "0.82rem", fontWeight: 500, color: "#1A1A18" }}>
                  {item.label}
                </Typography>
              </Box>

              <Button
                size="small"
                variant={isAdded ? "contained" : "outlined"}
                onClick={() => !isAdded && handleAdd(item)}
                aria-label={`Додати ${item.label} до кошика`}
                sx={{
                  minWidth: 70,
                  borderRadius: "8px",
                  px: 1.25,
                  py: 0.4,
                  fontSize: "0.75rem",
                  fontWeight: 700,
                  lineHeight: 1.5,
                  transition: "all 0.2s ease",
                  ...(isAdded
                    ? {
                        bgcolor: "#1A7A3C",
                        color: "#fff",
                        borderColor: "transparent",
                        boxShadow: "none",
                        "&:hover": { bgcolor: "#1A7A3C" },
                      }
                    : {
                        borderColor: "rgba(26,26,24,0.2)",
                        color: "#1A1A18",
                        "&:hover": {
                          borderColor: "#FAE900",
                          bgcolor: "rgba(250,233,0,0.1)",
                        },
                      }),
                }}
              >
                {isAdded ? "✓ Додано" : `+${item.price} ₴`}
              </Button>
            </Box>
          );
        })}
      </Stack>
    </Box>
  );
}
