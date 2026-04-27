"use client";

import * as React from "react";
import { Button, Menu, MenuItem } from "@mui/material";
import KeyboardArrowDownIcon from "@mui/icons-material/KeyboardArrowDown";

interface Props {
  links: string[];
  title: string;
}

export default function HeaderSelect({ links, title }: Props) {
  const [anchorEl, setAnchorEl] = React.useState<null | HTMLElement>(null);
  const open = Boolean(anchorEl);

  const handleClick = (e: React.MouseEvent<HTMLButtonElement>) => setAnchorEl(e.currentTarget);
  const handleClose = () => setAnchorEl(null);

  return (
    <div>
      <Button
        id="header-select-btn"
        aria-controls={open ? "header-select-menu" : undefined}
        aria-haspopup="true"
        aria-expanded={open ? "true" : undefined}
        onClick={handleClick}
        endIcon={<KeyboardArrowDownIcon />}
        color="inherit"
        sx={{ fontWeight: 400 }}
      >
        {title}
      </Button>
      <Menu
        id="header-select-menu"
        anchorEl={anchorEl}
        open={open}
        onClose={handleClose}
        MenuListProps={{ "aria-labelledby": "header-select-btn" }}
      >
        {links.map((link) => (
          <MenuItem key={link} onClick={handleClose}>{link}</MenuItem>
        ))}
      </Menu>
    </div>
  );
}
