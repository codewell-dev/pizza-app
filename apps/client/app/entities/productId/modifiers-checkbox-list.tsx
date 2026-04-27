"use client";

import { useShopStore } from "@/app/providers/store-provider";
import { FormGroup, FormControlLabel, Checkbox, Typography } from "@mui/material";
import { usePathname } from "next/navigation";
import { useEffect } from "react";
import { Modifier } from "@/types/product";

interface Props {
  title: string;
  modifiers: Modifier[];
  groupId: string;
}

export default function ModifiersCheckboxList({ title, modifiers, groupId }: Props) {
  const pathname = usePathname();
  const selectedModifiers = useShopStore((state) => state.modifiers);
  const addModifier = useShopStore((state) => state.addModifier);
  const removeModifier = useShopStore((state) => state.removeModifier);
  const clearModifiers = useShopStore((state) => state.clearModifiers);

  useEffect(() => {
    return () => { clearModifiers(); };
  }, [pathname, clearModifiers]);

  // Which modifier from this group (if any) is currently selected
  const selectedInGroup = selectedModifiers.find((m) =>
    modifiers.some((mod) => mod._id === m._id)
  );

  const isSelected = (modId: string) => selectedInGroup?._id === modId;

  const handleToggle = (mod: Modifier) => {
    if (isSelected(mod._id)) {
      removeModifier(mod._id);
    } else {
      // Radio-like: deselect previous in group before selecting new one
      if (selectedInGroup) removeModifier(selectedInGroup._id);
      addModifier(mod);
    }
  };

  return (
    <FormGroup sx={{ mt: 2 }} role="group" aria-labelledby={`group-${groupId}`}>
      <Typography id={`group-${groupId}`} variant="subtitle1">{title}:</Typography>
      {modifiers.map((mod) => (
        <FormControlLabel
          key={mod._id}
          control={
            <Checkbox
              checked={isSelected(mod._id)}
              onChange={() => handleToggle(mod)}
            />
          }
          label={`${mod.title}${mod.price > 0 ? ` +${mod.price} ₴` : ""}`}
        />
      ))}
    </FormGroup>
  );
}
