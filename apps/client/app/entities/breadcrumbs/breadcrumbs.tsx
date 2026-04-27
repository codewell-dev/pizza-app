"use client";

import { Breadcrumbs as MuiBreadcrumbs, Typography, Box } from "@mui/material";
import Link from "next/link";
import NavigateNextIcon from "@mui/icons-material/NavigateNext";

export interface Crumb {
  label: string;
  href?: string;
}

interface Props {
  crumbs: Crumb[];
}

export default function Breadcrumbs({ crumbs }: Props) {
  return (
    <Box sx={{ py: 1.5, px: { xs: 2, md: 0 } }}>
      <MuiBreadcrumbs
        separator={<NavigateNextIcon sx={{ fontSize: 16, color: "text.disabled" }} />}
        aria-label="breadcrumb"
        sx={{ "& .MuiBreadcrumbs-ol": { flexWrap: "nowrap" } }}
      >
        {crumbs.map((crumb, i) => {
          const isLast = i === crumbs.length - 1;

          if (isLast || !crumb.href) {
            return (
              <Typography
                key={i}
                sx={{
                  fontSize: 13,
                  color: isLast ? "text.primary" : "text.secondary",
                  fontWeight: isLast ? 500 : 400,
                  whiteSpace: "nowrap",
                  overflow: "hidden",
                  textOverflow: "ellipsis",
                  maxWidth: { xs: 150, md: "none" },
                }}
              >
                {crumb.label}
              </Typography>
            );
          }

          return (
            <Link key={i} href={crumb.href} style={{ textDecoration: "none" }}>
              <Typography
                sx={{
                  fontSize: 13,
                  color: "text.secondary",
                  "&:hover": { color: "text.primary", textDecoration: "underline" },
                  whiteSpace: "nowrap",
                }}
              >
                {crumb.label}
              </Typography>
            </Link>
          );
        })}
      </MuiBreadcrumbs>
    </Box>
  );
}
