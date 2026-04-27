"use client";

import { useShopStore } from "@/app/providers/store-provider";
import ModifiersItem from "./modifiers-item";
import { Box } from "@mui/material";

export default function ModifiersList() {
  const modifiers = useShopStore((state) => state.modifiers);

  if (modifiers.length === 0) return null;

  return (
    <Box sx={{ display: "flex", flexDirection: "row", flexWrap: "wrap", maxWidth: "700px", gap: { xs: 1, sm: 1.5 }, my: { xs: 1.5, md: 2 } }}>
      {modifiers.map((mod) => (
        <ModifiersItem key={mod._id} modifier={mod} />
      ))}
    </Box>
  );
}
