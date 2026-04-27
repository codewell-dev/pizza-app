"use client";

import * as React from "react";
import Button from "@mui/material/Button";
import Menu from "@mui/material/Menu";
import MenuItem from "@mui/material/MenuItem";
import Link from "next/link";
import MenuIcon from "@mui/icons-material/Menu";
import InstagramIcon from "@mui/icons-material/Instagram";
import FacebookIcon from "@mui/icons-material/Facebook";
import TelegramIcon from "@mui/icons-material/Telegram";
import { Box } from "@mui/material";

const NAV_ITEMS = [
  { id: 1, title: "Головна", link: "/" },
  { id: 2, title: "Ресторани", link: "/" },
  { id: 3, title: "Відгуки", link: "/" },
  { id: 4, title: "Акції", link: "/" },
  { id: 5, title: "Новини", link: "/" },
  { id: 6, title: "Бонусна програма", link: "/" },
  { id: 7, title: "Умови доставки", link: "/" },
  { id: 8, title: "Бенкети", link: "/" },
  { id: 9, title: "Про компанію Pizza House", link: "/" },
  { id: 10, title: "Вакансії", link: "/" },
  { id: 11, title: "Зв'язок з Керівництвом", link: "/" },
  { id: 12, title: "Оферта", link: "/" },
  { id: 13, title: "Умови компанії", link: "/" },
];

export default function HeaderMenu() {
  const [anchorEl, setAnchorEl] = React.useState<null | HTMLElement>(null);
  const open = Boolean(anchorEl);

  const handleClick = (e: React.MouseEvent<HTMLButtonElement>) => setAnchorEl(e.currentTarget);
  const handleClose = () => setAnchorEl(null);

  return (
    <div>
      <Button
        id="header-menu-btn"
        aria-controls={open ? "header-menu" : undefined}
        aria-haspopup="true"
        aria-expanded={open ? "true" : undefined}
        onClick={handleClick}
        sx={{ mx: 2, color: "black", borderRadius: 15, width: 25, height: 45 }}
      >
        <MenuIcon />
      </Button>
      <Menu
        id="header-menu"
        anchorEl={anchorEl}
        open={open}
        onClose={handleClose}
        MenuListProps={{ "aria-labelledby": "header-menu-btn" }}
      >
        <div className="m-5">
          {NAV_ITEMS.map((item) => (
            <Link key={item.id} href={item.link}>
              <MenuItem onClick={handleClose}>{item.title}</MenuItem>
            </Link>
          ))}
          <MenuItem sx={{ mt: 2, fontWeight: "medium" }} onClick={handleClose}>
            Увійти
          </MenuItem>
          <Box sx={{ mt: 1.5 }}>
            <InstagramIcon sx={{ width: 30, height: 30, ml: 1.5, cursor: "pointer" }} />
            <FacebookIcon sx={{ width: 30, height: 30, ml: 1.5, cursor: "pointer" }} />
            <TelegramIcon sx={{ width: 30, height: 30, ml: 1.5, cursor: "pointer" }} />
          </Box>
        </div>
      </Menu>
    </div>
  );
}
