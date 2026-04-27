"use client";

import * as React from "react";
import { Button, Menu, MenuItem } from "@mui/material";
import KeyboardArrowDownIcon from "@mui/icons-material/KeyboardArrowDown";
import { useRouter } from "next/navigation";
import { locales, localeLabels, type Locale } from "@/i18n/config";

interface Props {
  currentLocale: Locale;
}

export default function LanguageSwitcher({ currentLocale }: Props) {
  const [anchorEl, setAnchorEl] = React.useState<null | HTMLElement>(null);
  const open = Boolean(anchorEl);
  const router = useRouter();

  const handleSelect = (locale: Locale) => {
    // Store chosen locale in a cookie — server reads it on next request
    document.cookie = `locale=${locale}; path=/; max-age=31536000; SameSite=Lax`;
    setAnchorEl(null);
    router.refresh(); // re-run Server Components with new locale
  };

  return (
    <>
      <Button
        id="lang-btn"
        aria-controls={open ? "lang-menu" : undefined}
        aria-haspopup="true"
        aria-expanded={open ? "true" : undefined}
        onClick={(e) => setAnchorEl(e.currentTarget)}
        endIcon={<KeyboardArrowDownIcon />}
        color="inherit"
        sx={{ fontWeight: 500, minWidth: 70 }}
      >
        {localeLabels[currentLocale]}
      </Button>
      <Menu
        id="lang-menu"
        anchorEl={anchorEl}
        open={open}
        onClose={() => setAnchorEl(null)}
        MenuListProps={{ "aria-labelledby": "lang-btn" }}
      >
        {locales.map((locale) => (
          <MenuItem
            key={locale}
            selected={locale === currentLocale}
            onClick={() => handleSelect(locale)}
            sx={{ fontWeight: locale === currentLocale ? 700 : 400 }}
          >
            {localeLabels[locale]}
          </MenuItem>
        ))}
      </Menu>
    </>
  );
}
