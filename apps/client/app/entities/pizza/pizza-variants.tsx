import React from "react";
import { Box, ButtonBase, Typography } from "@mui/material";
import { Product } from "@/types/product";

interface Props {
  products: Product[];
  activeIndex: number;
  onChange: (index: number) => void;
}

/**
 * ProductVariants — size selector pills.
 *
 * Design: compact, clear active state with gold fill.
 * Shows weight in grams. Smooth active transition.
 */
export default function ProductVariants({ products, activeIndex, onChange }: Props) {
  return (
    <Box
      sx={{
        display: "flex",
        gap: "6px",
        mt: 1.25,
        mb: 0.75,
        flexWrap: "wrap",
      }}
      role="radiogroup"
      aria-label="Розмір"
    >
      {products.map((product, index) => {
        const isActive = activeIndex === index;
        return (
          <ButtonBase
            key={product._id ?? product.id ?? index}
            onClick={() => onChange(index)}
            role="radio"
            aria-checked={isActive}
            aria-label={`${product.weight} грамів`}
            sx={{
              px: 1.5,
              py: 0.6,
              borderRadius: "8px",
              bgcolor: isActive ? "#FAE900" : "rgba(26,26,24,0.06)",
              border: isActive
                ? "1.5px solid #E8D800"
                : "1.5px solid transparent",
              transition: "all 0.16s cubic-bezier(0.4, 0, 0.2, 1)",
              "&:hover": {
                bgcolor: isActive ? "#FAE900" : "rgba(26,26,24,0.10)",
                transform: "translateY(-1px)",
              },
              "&:active": { transform: "scale(0.95)" },
              boxShadow: isActive
                ? "0 2px 8px rgba(232,216,0,0.3)"
                : "none",
            }}
          >
            <Typography
              sx={{
                fontSize: "0.8rem",
                fontWeight: isActive ? 800 : 500,
                color: "#1A1A18",
                letterSpacing: "-0.01em",
                whiteSpace: "nowrap",
                lineHeight: 1,
              }}
            >
              {product.weight}&thinsp;г
            </Typography>
          </ButtonBase>
        );
      })}
    </Box>
  );
}
