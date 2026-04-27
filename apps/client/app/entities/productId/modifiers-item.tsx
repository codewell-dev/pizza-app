"use client";

import { Box, IconButton, Typography } from "@mui/material";
import { yellow } from "@mui/material/colors";
import RemoveIcon from "@mui/icons-material/Remove";
import { Modifier } from "@/types/product";
import { useShopStore } from "@/app/providers/store-provider";
import { useTranslations } from "next-intl";

interface Props {
  modifier: Modifier;
}

export default function ModifiersItem({ modifier }: Props) {
  const removeModifier = useShopStore((state) => state.removeModifier);
  const t = useTranslations("product");

  return (
    <Box
      sx={{
        display: "flex",
        alignItems: "center",
        gap: 1,
        border: "1px solid #e0e0e0",
        borderRadius: 6,
        px: 2,
        py: 1,
        width: "fit-content",
        cursor: "pointer",
        "&:hover": { borderColor: yellow[500] },
      }}
    >
      <Typography variant="subtitle2">
        {modifier.title} ×{modifier.count}
      </Typography>
      <IconButton
        aria-label={`${t("removeAria")} ${modifier.title}`}
        size="small"
        sx={{
          backgroundColor: yellow[500],
          color: "white",
          width: 17,
          height: 17,
          "&:hover": { backgroundColor: yellow[700] },
        }}
        onClick={() => removeModifier(modifier._id)}
      >
        <RemoveIcon fontSize="inherit" />
      </IconButton>
    </Box>
  );
}
