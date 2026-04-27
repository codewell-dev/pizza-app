"use client";

import * as React from "react";
import {
  Button, Dialog, DialogContent, DialogTitle,
  IconButton, Typography, useMediaQuery, useTheme,
  Box, Avatar, Divider, List, ListItemButton, ListItemIcon, ListItemText,
} from "@mui/material";
import CloseIcon from "@mui/icons-material/Close";
import PersonIcon from "@mui/icons-material/Person";
import LogoutIcon from "@mui/icons-material/Logout";
import ShoppingBagOutlinedIcon from "@mui/icons-material/ShoppingBagOutlined";
import Link from "next/link";
import LoginForm from "../entities/modal/login-form";
import { useTranslations } from "next-intl";
import { useShopStore } from "../providers/store-provider";

export default function ModalPopup() {
  const [open, setOpen] = React.useState(false);
  const theme = useTheme();
  const fullScreen = useMediaQuery(theme.breakpoints.down("sm"));
  const t = useTranslations("login");

  const isAuthenticated = useShopStore((s) => s.isAuthenticated);
  const user = useShopStore((s) => s.user);
  const clearAuth = useShopStore((s) => s.clearAuth);

  if (isAuthenticated && user) {
    return (
      <>
        <Button
          color="inherit"
          sx={{ fontWeight: 400, textTransform: "none", fontSize: 14, gap: 0.5 }}
          onClick={() => setOpen(true)}
          startIcon={<PersonIcon sx={{ fontSize: 18 }} />}
        >
          {user.email.split("@")[0]}
        </Button>

        <Dialog
          open={open}
          onClose={() => setOpen(false)}
          PaperProps={{ sx: { borderRadius: 3, p: 1, width: "100%", maxWidth: 360 } }}
        >
          <DialogTitle sx={{ display: "flex", alignItems: "center", justifyContent: "space-between", pb: 0 }}>
            <Typography variant="h6" fontWeight={600}>{t("profile")}</Typography>
            <IconButton onClick={() => setOpen(false)} aria-label={t("close")}><CloseIcon /></IconButton>
          </DialogTitle>

          <DialogContent>
            <Box display="flex" alignItems="center" gap={2} py={2}>
              <Avatar sx={{ bgcolor: "#FAE900", color: "#111", width: 48, height: 48, fontWeight: 800, fontFamily: '"Nunito", sans-serif' }}>
                {user.email[0].toUpperCase()}
              </Avatar>
              <Box>
                <Typography fontWeight={600}>{user.email}</Typography>
                <Typography variant="body2" color="text.secondary">{t("loggedInAs")}</Typography>
              </Box>
            </Box>

            <Divider />

            <List disablePadding sx={{ mt: 1 }}>
              <ListItemButton
                component={Link}
                href="/my-orders"
                onClick={() => setOpen(false)}
                sx={{ borderRadius: 2 }}
              >
                <ListItemIcon sx={{ minWidth: 36 }}>
                  <ShoppingBagOutlinedIcon fontSize="small" />
                </ListItemIcon>
                <ListItemText primary={t("orders")} />
              </ListItemButton>
            </List>

            <Divider sx={{ my: 1 }} />

            <Button
              fullWidth
              variant="outlined"
              color="error"
              startIcon={<LogoutIcon />}
              sx={{ mt: 1, borderRadius: 2 }}
              onClick={() => { clearAuth(); setOpen(false); }}
            >
              {t("logout")}
            </Button>
          </DialogContent>
        </Dialog>
      </>
    );
  }

  return (
    <>
      <Button
        color="inherit"
        sx={{ fontWeight: 400, textTransform: "none", fontSize: 14 }}
        onClick={() => setOpen(true)}
      >
        {t("openBtn")}
      </Button>

      <Dialog
        open={open}
        onClose={() => setOpen(false)}
        fullScreen={fullScreen}
        PaperProps={{ sx: { borderRadius: fullScreen ? 0 : 3, p: 1, width: "100%", maxWidth: 500 } }}
      >
        <DialogTitle sx={{ display: "flex", alignItems: "center", justifyContent: "space-between", pb: 0 }}>
          <Typography variant="h6" fontWeight={600}>Pizza House</Typography>
          <IconButton onClick={() => setOpen(false)} aria-label={t("close")}><CloseIcon /></IconButton>
        </DialogTitle>

        <DialogContent>
          <LoginForm onSuccess={() => setOpen(false)} />
        </DialogContent>
      </Dialog>
    </>
  );
}
