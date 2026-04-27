"use client";

import React from "react";
import { Box, IconButton, Typography } from "@mui/material";
import AddIcon from "@mui/icons-material/Add";
import RemoveIcon from "@mui/icons-material/Remove";
import { yellow } from "@mui/material/colors";

interface Props {
  reverse?: boolean;
  countProduct: number;
  plusCount: () => void;
  minusCount: () => void;
  disablePlus?: boolean;
}

const btnStyle = {
  backgroundColor: yellow[500],
  color: "white",
  "&:hover": { backgroundColor: yellow[700] },
};

const btnDisabledStyle = {
  backgroundColor: "rgba(0,0,0,0.12)",
  color: "rgba(0,0,0,0.26)",
};

export default function Multiple({
  reverse,
  countProduct,
  plusCount,
  minusCount,
  disablePlus,
}: Props) {
  return (
    <Box
      sx={{ display: "flex", alignItems: "center", gap: 1 }}
      flexDirection={reverse ? "column-reverse" : "row"}
    >
      <IconButton
        aria-label="Зменшити кількість"
        size="small"
        sx={btnStyle}
        onClick={minusCount}
      >
        <RemoveIcon fontSize="inherit" />
      </IconButton>
      <Typography component="span">{countProduct}</Typography>
      <IconButton
        aria-label="Збільшити кількість"
        size="small"
        disabled={disablePlus}
        sx={disablePlus ? btnDisabledStyle : btnStyle}
        onClick={plusCount}
      >
        <AddIcon fontSize="inherit" />
      </IconButton>
    </Box>
  );
}
