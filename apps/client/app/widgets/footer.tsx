"use client";

import React from "react";
import {
  Box,
  Container,
  Typography,
  Stack,
  IconButton,
  Divider,
  Grid,
} from "@mui/material";
import InstagramIcon from "@mui/icons-material/Instagram";
import FacebookIcon from "@mui/icons-material/Facebook";
import TelegramIcon from "@mui/icons-material/Telegram";
import PhoneIcon from "@mui/icons-material/PhoneOutlined";
import AccessTimeIcon from "@mui/icons-material/AccessTimeOutlined";
import Link from "next/link";
import Image from "next/image";
import { useTranslations } from "next-intl";

/**
 * Premium Footer — clean, spacious, on-brand.
 *
 * Layout:
 * - Row 1: Logo + tagline | Nav links (2 cols) | App downloads + social
 * - Row 2: Divider
 * - Row 3: Copyright + developer credit
 *
 * Design decisions:
 * - Warm off-white background (#F5F5F2) for subtle separation from page
 * - Charcoal text hierarchy: primary links darker, secondary lighter
 * - Social icons with gold hover — brand consistency
 */
export default function Footer() {
  const t = useTranslations("footer");

  const NAV_COL_1: { key: string; href: string }[] = [
    { key: "home", href: "/" },
    { key: "promotions", href: "/" },
    { key: "news", href: "/" },
    { key: "bonus", href: "/" },
    { key: "delivery", href: "/" },
    { key: "about", href: "/" },
  ];

  const NAV_COL_2: { key: string; href: string }[] = [
    { key: "restaurants", href: "/" },
    { key: "banquets", href: "/" },
    { key: "careers", href: "/" },
    { key: "contacts", href: "/" },
    { key: "offer", href: "/" },
    { key: "terms", href: "/" },
  ];

  const SOCIAL = [
    {
      icon: <InstagramIcon sx={{ fontSize: 20 }} />,
      label: "Instagram",
      href: "/",
    },
    {
      icon: <FacebookIcon sx={{ fontSize: 20 }} />,
      label: "Facebook",
      href: "/",
    },
    {
      icon: <TelegramIcon sx={{ fontSize: 20 }} />,
      label: "Telegram",
      href: "/",
    },
  ];

  const NavLink = ({ label, href }: { label: string; href: string }) => (
    <Typography
      component={Link}
      href={href}
      sx={{
        color: "#5A5A56",
        textDecoration: "none",
        fontSize: "0.88rem",
        fontWeight: 500,
        lineHeight: 1.4,
        letterSpacing: "-0.005em",
        transition: "color 0.15s ease",
        "&:hover": { color: "#1A1A18" },
        display: "block",
      }}
    >
      {label}
    </Typography>
  );

  return (
    <Box
      component="footer"
      sx={{
        bgcolor: "#F5F5F2",
        borderTop: "1px solid rgba(26,26,24,0.07)",
        pt: { xs: 5, md: 7 },
        pb: { xs: 4, md: 5 },
        mt: 6,
      }}
    >
      <Container maxWidth="xl">
        <Grid container spacing={{ xs: 4, md: 6 }}>
          {/* Brand column */}
          <Grid size={{ xs: 12, md: 3 }}>
            <Link href="/">
              <Image
                src="https://pizzahouse.ua/_next/static/media/logo.0053162d.svg"
                alt="Pizza House"
                width={48}
                height={48}
                style={{ height: "auto", marginBottom: "12px" }}
              />
            </Link>
            <Typography
              sx={{
                fontSize: "0.88rem",
                color: "#8A8A85",
                lineHeight: 1.6,
                maxWidth: 220,
                mb: 2,
              }}
            >
              Смачна піца та суші з доставкою у ваше місто. Швидко, свіжо,
              смачно.
            </Typography>

            {/* Contact info */}
            <Stack spacing={1}>
              <Box sx={{ display: "flex", alignItems: "center", gap: 1 }}>
                <PhoneIcon
                  sx={{ fontSize: 15, color: "#8A8A85", flexShrink: 0 }}
                />
                <Typography
                  sx={{
                    fontSize: "0.85rem",
                    fontWeight: 600,
                    color: "#1A1A18",
                  }}
                >
                  0 800 000-000
                </Typography>
              </Box>
              <Box sx={{ display: "flex", alignItems: "center", gap: 1 }}>
                <AccessTimeIcon
                  sx={{ fontSize: 15, color: "#8A8A85", flexShrink: 0 }}
                />
                <Typography sx={{ fontSize: "0.82rem", color: "#5A5A56" }}>
                  Щодня 10:00 – 23:00
                </Typography>
              </Box>
            </Stack>
          </Grid>

          {/* Nav col 1 */}
          <Grid size={{ xs: 6, sm: 4, md: 2 }}>
            <Typography
              className="section-eyebrow"
              sx={{ mb: 1.5, display: "block" }}
            >
              Компанія
            </Typography>
            <Stack spacing={1.25}>
              {NAV_COL_1.map(({ key, href }) => (
                <NavLink key={key} label={t(`nav.${key}`)} href={href} />
              ))}
            </Stack>
          </Grid>

          {/* Nav col 2 */}
          <Grid size={{ xs: 6, sm: 4, md: 2 }}>
            <Typography
              className="section-eyebrow"
              sx={{ mb: 1.5, display: "block" }}
            >
              Інфо
            </Typography>
            <Stack spacing={1.25}>
              {NAV_COL_2.map(({ key, href }) => (
                <NavLink key={key} label={t(`nav.${key}`)} href={href} />
              ))}
            </Stack>
          </Grid>

          {/* App downloads + social */}
          <Grid size={{ xs: 12, sm: 4, md: 3 }} sx={{ ml: { md: "auto" } }}>
            <Typography
              className="section-eyebrow"
              sx={{ mb: 1.5, display: "block" }}
            >
              Мобільний додаток
            </Typography>

            <Stack spacing={1.25} sx={{ mb: 2.5 }}>
              <Box
                component="a"
                href="/"
                sx={{
                  display: "inline-block",
                  opacity: 0.85,
                  "&:hover": { opacity: 1 },
                }}
              >
                <Image
                  src="https://pizzahouse.ua/_next/static/media/google_play.6ba3105b.svg"
                  alt="Google Play"
                  width={132}
                  height={40}
                  style={{ display: "block" }}
                />
              </Box>
              <Box
                component="a"
                href="/"
                sx={{
                  display: "inline-block",
                  opacity: 0.85,
                  "&:hover": { opacity: 1 },
                }}
              >
                <Image
                  src="https://pizzahouse.ua/_next/static/media/app_store.79c3e27c.svg"
                  alt="App Store"
                  width={132}
                  height={40}
                  style={{ display: "block" }}
                  data-scroll-behavior="smooth"
                />
              </Box>
            </Stack>

            {/* Social */}
            <Typography
              className="section-eyebrow"
              sx={{ mb: 1.25, display: "block" }}
            >
              Соцмережі
            </Typography>
            <Box sx={{ display: "flex", gap: 0.75 }}>
              {SOCIAL.map(({ icon, label, href }) => (
                <IconButton
                  key={label}
                  component="a"
                  href={href}
                  aria-label={label}
                  size="small"
                  sx={{
                    bgcolor: "rgba(26,26,24,0.08)",
                    borderRadius: "10px",
                    width: 40,
                    height: 40,
                    color: "#5A5A56",
                    transition: "all 0.18s ease",
                    "&:hover": {
                      bgcolor: "#FAE900",
                      color: "#1A1A18",
                      transform: "translateY(-2px)",
                      boxShadow: "0 4px 12px rgba(250,233,0,0.35)",
                    },
                    "&:active": { transform: "scale(0.93)" },
                  }}
                >
                  {icon}
                </IconButton>
              ))}
            </Box>
          </Grid>
        </Grid>

        <Divider
          sx={{ my: { xs: 3, md: 4 }, borderColor: "rgba(26,26,24,0.08)" }}
        />

        {/* Bottom bar */}
        <Box
          sx={{
            display: "flex",
            justifyContent: "space-between",
            alignItems: "center",
            flexWrap: "wrap",
            gap: 1,
          }}
        >
          <Typography sx={{ fontSize: "0.78rem", color: "#B0AFA9" }}>
            {t("copyright")}
          </Typography>
          <Typography sx={{ fontSize: "0.78rem", color: "#B0AFA9" }}>
            Розроблено{" "}
            <Box
              component="a"
              href="https://github.com/codewell-dev"
              target="_blank"
              rel="noopener noreferrer"
              sx={{
                color: "#8A8A85",
                fontWeight: 700,
                textDecoration: "none",
                "&:hover": { color: "#1A1A18" },
                transition: "color 0.15s",
              }}
            >
              codewell-dev
            </Box>
          </Typography>
        </Box>
      </Container>
    </Box>
  );
}
