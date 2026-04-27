"use client";

import {
  Accordion,
  AccordionDetails,
  AccordionSummary,
  Typography,
} from "@mui/material";
import React, { useEffect } from "react";
import Multiple from "../components/multiple";
import ExpandMoreIcon from "@mui/icons-material/ExpandMore";
import { useShopStore } from "@/app/providers/store-provider";
import { usePathname } from "next/navigation";
import { GroupModifier, Modifier } from "@/types/product";

interface Props {
  group: GroupModifier;
}

export default function ModifiersMultiple({ group }: Props) {
  const pathname = usePathname();
  const selectedModifiers = useShopStore((state) => state.modifiers);
  const addModifier = useShopStore((state) => state.addModifier);
  const removeModifier = useShopStore((state) => state.removeModifier);
  const clearModifiers = useShopStore((state) => state.clearModifiers);

  useEffect(() => {
    return () => {
      clearModifiers();
    };
  }, [pathname, clearModifiers]);

  // Total count of all modifiers selected across this group
  const activeModifiers = group.modifiers.filter((m) => m.is_active !== false);
  const groupSelectedCount = activeModifiers.reduce((sum, mod) => {
    const inStore = selectedModifiers.find((m) => m._id === mod._id);
    return sum + (inStore?.count ?? 0);
  }, 0);
  const maxQty = group.max_quantity ?? Infinity;

  return (
    <Accordion
      sx={{
        boxShadow: "none",
        border: 0,
        backgroundColor: "transparent",
        "&::before": { display: "none" },
        "&.Mui-expanded": { margin: "6px 0" },
      }}
    >
      <AccordionSummary
        expandIcon={<ExpandMoreIcon />}
        sx={{
          borderBottom: 1,
          borderColor: "silver",
          "&.Mui-expanded": { margin: "8px 0" },
        }}
      >
        <Typography component="div">{group.title}</Typography>
      </AccordionSummary>
      <AccordionDetails
        sx={{
          border: 1,
          borderColor: "rgba(0,0,0,0.12)",
          borderRadius: 3,
          display: "flex",
          flexDirection: "column",
          gap: 1,
          p: 2,
        }}
      >
        {activeModifiers.map((mod: Modifier) => {
          const inStore = selectedModifiers.find((m) => m._id === mod._id);
          const count = inStore?.count ?? 0;
          const canAdd = groupSelectedCount < maxQty;

          return (
            <div key={mod._id}>
              <div className="flex justify-between items-center">
                <Typography component="span">{mod.title}</Typography>
                <div className="flex gap-3">
                  <Typography component="span">
                    {mod.weight}
                    {mod.price > 0 ? ` / ${mod.price} ₴` : ""}
                  </Typography>
                  <Multiple
                    plusCount={() => canAdd && addModifier(mod)}
                    minusCount={() => removeModifier(mod._id)}
                    countProduct={count}
                    disablePlus={!canAdd}
                  />
                </div>
              </div>
            </div>
          );
        })}
        {isFinite(maxQty) && (
          <Typography variant="caption" color="text.secondary">
            Обрано: {groupSelectedCount} / {maxQty}
          </Typography>
        )}
      </AccordionDetails>
    </Accordion>
  );
}
