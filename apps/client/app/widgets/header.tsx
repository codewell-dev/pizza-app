"use client";

import * as React from "react";
import {
  AppBar,
  Box,
  Toolbar,
  Button,
  Container,
  IconButton,
  Drawer,
  Typography,
  Divider,
  useScrollTrigger,
} from "@mui/material";
import LocalOfferIcon from "@mui/icons-material/LocalOffer";
import MenuIcon from "@mui/icons-material/Menu";
import CloseIcon from "@mui/icons-material/Close";
import InstagramIcon from "@mui/icons-material/Instagram";
import FacebookIcon from "@mui/icons-material/Facebook";
import TelegramIcon from "@mui/icons-material/Telegram";
import PhoneIcon from "@mui/icons-material/PhoneOutlined";
import Image from "next/image";
import Link from "next/link";
import { useTranslations } from "next-intl";
import Basket from "./basket";
import ModalPopup from "./modal-popup";
import LanguageSwitcher from "../entities/header/language-switcher";
import { Category } from "@/types/product";
import type { Locale } from "@/i18n/config";

interface HeaderProps {
  categories?: Category[];
  currentLocale: Locale;
}

/**
 * Premium Header — redesigned for conversion and mobile-first UX.
 *
 * Architecture:
 * - Top bar: logo | promotions | [lang | phone | auth | cart]
 * - Category strip: sticky below header, scrollable pill row
 * - Mobile drawer: full-screen with category list + social links
 *
 * Design decisions:
 * - White header (not yellow) — more premium, less fast-food
 * - Yellow reserved as accent on interactive elements
 * - Border-bottom scroll shadow for depth cue
 * - Manrope font throughout
 */
export default function Header({ categories = [], currentLocale }: HeaderProps) {
  const [drawerOpen, setDrawerOpen] = React.useState(false);
  const [activeCatId, setActiveCatId] = React.useState<string | number | null>(null);

  // MUI scroll trigger for header shadow
  const scrolled = useScrollTrigger({
    disableHysteresis: true,
    threshold: 8,
  });

  // Intersection observer for active category highlight
  React.useEffect(() => {
    if (categories.length === 0) return;
    // Could be wired to section IDs if sections are on the page
    // For now, activeCatId tracks click
  }, [categories]);

  const HEADER_HEIGHT = { xs: 56, md: 64 };
  const CATEGORY_HEIGHT = 54;

  return (
    <>
      {/* ── Main AppBar ─────────────────────────────────────── */}
      <AppBar
        position="fixed"
        elevation={0}
        sx={{
          bgcolor: "#FFFFFF",
          color: "#1A1A18",
          borderBottom: scrolled
            ? "1px solid rgba(26,26,24,0.10)"
            : "1px solid rgba(26,26,24,0.06)",
          boxShadow: scrolled
            ? "0 4px 24px rgba(26,26,24,0.08)"
            : "none",
          transition: "box-shadow 0.25s ease, border-color 0.25s ease",
          zIndex: 1200,
        }}
      >
        <Container maxWidth="xl" disableGutters sx={{ px: { xs: 2, md: 3 } }}>
          <Toolbar
            disableGutters
            sx={{
              display: "flex",
              justifyContent: "space-between",
              alignItems: "center",
              minHeight: HEADER_HEIGHT,
              gap: 1,
            }}
          >
            {/* Left: Logo + Promotions */}
            <Box sx={{ display: "flex", alignItems: "center", gap: { xs: 1.5, md: 2.5 } }}>
              <Link href="/" aria-label="На головну" style={{ display: "flex", alignItems: "center" }}>
                <Image
                  src="https://pizzahouse.ua/_next/static/media/logo.0053162d.svg"
                  width={44}
                  height={44}
                  alt="Pizza House"
                  style={{ height: "auto", width: "44px" }}
                  priority
                />
              </Link>

              {/* Desktop: Promotions button */}
              <Box sx={{ display: { xs: "none", md: "block" } }}>
                <Button
                  component={Link}
                  href="/"
                  size="small"
                  startIcon={<LocalOfferIcon sx={{ fontSize: 14 }} />}
                  sx={{
                    borderRadius: "100px",
                    fontWeight: 700,
                    fontSize: "0.8rem",
                    px: 2,
                    py: 0.75,
                    textTransform: "none",
                    bgcolor: "rgba(250,233,0,0.15)",
                    color: "#1A1A18",
                    border: "1px solid rgba(250,233,0,0.6)",
                    "&:hover": {
                      bgcolor: "#FAE900",
                      border: "1px solid #FAE900",
                      boxShadow: "0 2px 12px rgba(250,233,0,0.4)",
                    },
                    transition: "all 0.18s ease",
                  }}
                >
                  Акції
                </Button>
              </Box>
            </Box>

            {/* Desktop: Right side controls */}
            <Box
              sx={{
                display: { xs: "none", md: "flex" },
                alignItems: "center",
                gap: 1,
              }}
            >
              <LanguageSwitcher currentLocale={currentLocale} />

              {/* Phone pill */}
              <Button
                size="small"
                startIcon={<PhoneIcon sx={{ fontSize: 14 }} />}
                sx={{
                  borderRadius: "100px",
                  fontWeight: 600,
                  fontSize: "0.8rem",
                  px: 1.75,
                  py: 0.75,
                  textTransform: "none",
                  color: "#1A1A18",
                  bgcolor: "rgba(26,26,24,0.05)",
                  "&:hover": { bgcolor: "rgba(26,26,24,0.09)" },
                }}
              >
                0 800 000-000
              </Button>

              <ModalPopup />
              <Basket />
            </Box>

            {/* Mobile: Cart + Hamburger */}
            <Box
              sx={{
                display: { xs: "flex", md: "none" },
                alignItems: "center",
                gap: 1,
              }}
            >
              <Basket />
              <IconButton
                onClick={() => setDrawerOpen(true)}
                aria-label="Відкрити меню"
                sx={{
                  bgcolor: "rgba(26,26,24,0.05)",
                  borderRadius: "10px",
                  width: 40,
                  height: 40,
                  "&:hover": { bgcolor: "rgba(26,26,24,0.09)" },
                }}
              >
                <MenuIcon sx={{ fontSize: 22, color: "#1A1A18" }} />
              </IconButton>
            </Box>
          </Toolbar>
        </Container>
      </AppBar>

      {/* Spacer */}
      <Box sx={{ height: HEADER_HEIGHT }} aria-hidden="true" />

      {/* ── Category strip (desktop + mobile) ───────────────── */}
      {categories.length > 0 && (
        <Box
          sx={{
            bgcolor: "#FFFFFF",
            borderBottom: "1px solid rgba(26,26,24,0.06)",
            position: "sticky",
            top: HEADER_HEIGHT,
            zIndex: 1100,
          }}
        >
          <Container maxWidth="xl" disableGutters sx={{ px: { xs: 1, md: 2 } }}>
            <Box
              sx={{
                display: "flex",
                overflowX: "auto",
                scrollbarWidth: "none",
                "&::-webkit-scrollbar": { display: "none" },
                py: "6px",
                gap: "2px",
              }}
            >
              {categories.map((cat) => {
                const isActive = activeCatId === cat._id;
                return (
                  <Link
                    key={cat._id}
                    href={`/category/${cat._id}`}
                    onClick={() => setActiveCatId(cat._id)}
                    style={{ textDecoration: "none", flexShrink: 0 }}
                  >
                    <Box
                      className={`category-pill${isActive ? " active" : ""}`}
                      sx={{
                        bgcolor: isActive ? "#FAE900" : "transparent",
                        "&:hover": {
                          bgcolor: isActive
                            ? "#FAE900"
                            : "rgba(26,26,24,0.05)",
                        },
                      }}
                    >
                      <Box
                        sx={{
                          width: 34,
                          height: 34,
                          position: "relative",
                          transition: "transform 0.2s ease",
                          ".category-pill:hover &": { transform: "scale(1.1)" },
                        }}
                      >
                        <Image
                          src={
                            cat.image.startsWith("http")
                              ? cat.image
                              : `https://pizzahouse.ua${cat.image}`
                          }
                          alt={cat.title}
                          fill
                          sizes="34px"
                          style={{ objectFit: "contain" }}
                        />
                      </Box>
                      <Typography
                        sx={{
                          fontSize: "11px",
                          lineHeight: 1.25,
                          mt: "4px",
                          textAlign: "center",
                          color: "#1A1A18",
                          fontWeight: isActive ? 700 : 500,
                          display: "-webkit-box",
                          WebkitLineClamp: 2,
                          WebkitBoxOrient: "vertical",
                          overflow: "hidden",
                          letterSpacing: "-0.01em",
                        }}
                      >
                        {cat.title}
                      </Typography>
                    </Box>
                  </Link>
                );
              })}
            </Box>
          </Container>
        </Box>
      )}

      {/* ── Mobile Drawer ────────────────────────────────────── */}
      <Drawer
        anchor="right"
        open={drawerOpen}
        onClose={() => setDrawerOpen(false)}
        PaperProps={{
          sx: {
            width: "100%",
            maxWidth: 380,
            bgcolor: "#FAFAF7",
            display: "flex",
            flexDirection: "column",
          },
        }}
      >
        {/* Drawer header */}
        <Box
          sx={{
            display: "flex",
            justifyContent: "space-between",
            alignItems: "center",
            px: 2.5,
            py: 1.5,
            bgcolor: "#FFFFFF",
            borderBottom: "1px solid rgba(26,26,24,0.08)",
          }}
        >
          <Link href="/" onClick={() => setDrawerOpen(false)}>
            <Image
              src="https://pizzahouse.ua/_next/static/media/logo.0053162d.svg"
              width={40}
              height={40}
              alt="Pizza House"
              style={{ height: "auto" }}
            />
          </Link>
          <Box display="flex" alignItems="center" gap={1}>
            <LanguageSwitcher currentLocale={currentLocale} />
            <IconButton
              onClick={() => setDrawerOpen(false)}
              aria-label="Закрити"
              sx={{
                bgcolor: "rgba(26,26,24,0.06)",
                borderRadius: "10px",
                width: 38,
                height: 38,
              }}
            >
              <CloseIcon sx={{ fontSize: 20 }} />
            </IconButton>
          </Box>
        </Box>

        {/* Category list */}
        <Box sx={{ flex: 1, overflowY: "auto", px: 2, py: 1.5 }}>
          <Typography
            className="section-eyebrow"
            sx={{ px: 1, mb: 1, display: "block" }}
          >
            Меню
          </Typography>

          {categories.map((cat) => (
            <React.Fragment key={cat._id}>
              <Link
                href={`/category/${cat._id}`}
                style={{ textDecoration: "none" }}
                onClick={() => setDrawerOpen(false)}
              >
                <Box
                  sx={{
                    display: "flex",
                    alignItems: "center",
                    gap: 2,
                    py: 1.25,
                    px: 1.5,
                    borderRadius: "12px",
                    cursor: "pointer",
                    transition: "all 0.15s ease",
                    "&:hover": {
                      bgcolor: "rgba(26,26,24,0.05)",
                      transform: "translateX(3px)",
                    },
                  }}
                >
                  <Box
                    sx={{
                      width: 40,
                      height: 40,
                      position: "relative",
                      flexShrink: 0,
                      bgcolor: "#fff",
                      borderRadius: "10px",
                      border: "1px solid rgba(26,26,24,0.06)",
                      p: "4px",
                    }}
                  >
                    <Image
                      src={
                        cat.image.startsWith("http")
                          ? cat.image
                          : `https://pizzahouse.ua${cat.image}`
                      }
                      alt={cat.title}
                      fill
                      sizes="40px"
                      style={{ objectFit: "contain", padding: "4px" }}
                    />
                  </Box>
                  <Typography
                    sx={{
                      fontSize: "0.95rem",
                      fontWeight: 600,
                      color: "#1A1A18",
                      letterSpacing: "-0.01em",
                    }}
                  >
                    {cat.title}
                  </Typography>
                </Box>
              </Link>
              <Divider sx={{ opacity: 0.12, mx: 1 }} />
            </React.Fragment>
          ))}
        </Box>

        {/* Drawer footer */}
        <Box
          sx={{
            px: 2.5,
            py: 2.5,
            bgcolor: "#FFFFFF",
            borderTop: "1px solid rgba(26,26,24,0.08)",
          }}
        >
          <ModalPopup />

          <Box
            sx={{
              display: "flex",
              alignItems: "center",
              gap: 0.5,
              mt: 1.5,
              color: "#8A8A85",
            }}
          >
            <PhoneIcon sx={{ fontSize: 16 }} />
            <Typography sx={{ fontSize: "0.88rem", fontWeight: 500 }}>
              0 800 000-000
            </Typography>
          </Box>

          <Box display="flex" gap={0.5} mt={1.5}>
            {[
              { icon: <InstagramIcon />, label: "Instagram" },
              { icon: <FacebookIcon />, label: "Facebook" },
              { icon: <TelegramIcon />, label: "Telegram" },
            ].map(({ icon, label }) => (
              <IconButton
                key={label}
                aria-label={label}
                size="small"
                sx={{
                  bgcolor: "rgba(26,26,24,0.06)",
                  borderRadius: "10px",
                  width: 40,
                  height: 40,
                  transition: "all 0.18s ease",
                  "&:hover": {
                    bgcolor: "#FAE900",
                    transform: "translateY(-2px)",
                    boxShadow: "0 4px 12px rgba(250,233,0,0.4)",
                  },
                }}
              >
                {icon}
              </IconButton>
            ))}
          </Box>
        </Box>
      </Drawer>
    </>
  );
}
