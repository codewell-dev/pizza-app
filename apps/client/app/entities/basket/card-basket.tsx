"use client";

import React from "react";
import { Box, Typography, IconButton, Chip } from "@mui/material";
import CloseIcon from "@mui/icons-material/Close";
import AddIcon from "@mui/icons-material/Add";
import RemoveIcon from "@mui/icons-material/Remove";
import Image from "next/image";
import { useShopStore } from "@/app/providers/store-provider";
import { ProductWithCartId } from "@/app/stores/cartSlice";

interface Props {
  product: ProductWithCartId;
}

/**
 * CardBasket — line item in the cart drawer.
 *
 * Premium UX:
 * - 88px image (generous, appetizing)
 * - Modifier chips styled with brand yellow
 * - Quantity stepper: -/+ with accessible labels
 * - Line total updates live
 * - Remove item by pressing minus until 0 (already handled by store)
 */
export default function CardBasket({ product }: Props) {
  const addProductToCart = useShopStore((state) => state.addProductToCart);
  const removeProductFromCart = useShopStore((state) => state.removeProductFromCart);
  const removeModifierFromCartItem = useShopStore((state) => state.removeModifierFromCartItem);

  const count = product.count ?? 1;
  const lineTotal = product.price * count;
  const hasRemoveModifier = typeof removeModifierFromCartItem === "function";

  return (
    <Box
      sx={{
        display: "flex",
        gap: 1.5,
        alignItems: "flex-start",
        py: 1.75,
      }}
    >
      {/* Image */}
      <Box
        sx={{
          width: 88,
          height: 88,
          flexShrink: 0,
          bgcolor: "#FAFAF7",
          borderRadius: "12px",
          border: "1px solid rgba(26,26,24,0.06)",
          overflow: "hidden",
          position: "relative",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
        }}
      >
        {product.image?.large ? (
          <Image
            src={`https://pizzahouse.ua${product.image.large}`}
            alt={product.title}
            fill
            sizes="88px"
            style={{ objectFit: "contain", padding: "6px" }}
          />
        ) : (
          <Typography sx={{ fontSize: "2.4rem", lineHeight: 1, userSelect: "none" }}>
            {(product as ProductWithCartId & { emoji?: string }).emoji ?? "🍕"}
          </Typography>
        )}
      </Box>

      {/* Content */}
      <Box sx={{ flex: 1, minWidth: 0 }}>
        {/* Title + weight */}
        <Typography
          sx={{
            fontWeight: 700,
            fontSize: "0.88rem",
            lineHeight: 1.3,
            color: "#1A1A18",
            letterSpacing: "-0.01em",
            display: "-webkit-box",
            WebkitLineClamp: 2,
            WebkitBoxOrient: "vertical",
            overflow: "hidden",
          }}
        >
          {product.title}
          {product.weight && (
            <Typography
              component="span"
              sx={{
                color: "#B0AFA9",
                fontWeight: 400,
                fontSize: "0.78rem",
                ml: 0.5,
              }}
            >
              {product.weight}&thinsp;г
            </Typography>
          )}
        </Typography>

        {/* Modifier chips */}
        {product.modifiers?.length > 0 && (
          <Box sx={{ display: "flex", flexWrap: "wrap", gap: 0.5, mt: 0.75 }}>
            {product.modifiers.map((mod) => (
              <Chip
                key={mod._id}
                label={`${mod.title}${mod.count && mod.count > 1 ? ` ×${mod.count}` : ""}`}
                size="small"
                onDelete={
                  hasRemoveModifier
                    ? () => removeModifierFromCartItem(product.cartItemId, mod._id)
                    : undefined
                }
                deleteIcon={
                  <CloseIcon sx={{ fontSize: "12px !important", color: "#999 !important" }} />
                }
                sx={{
                  height: 22,
                  fontSize: "0.7rem",
                  fontWeight: 600,
                  bgcolor: "rgba(250,233,0,0.15)",
                  border: "1px solid rgba(250,233,0,0.5)",
                  color: "#5A5A00",
                  borderRadius: "6px",
                  letterSpacing: "-0.01em",
                  "& .MuiChip-deleteIcon": {
                    color: "#B0AFA9",
                    margin: "0 4px 0 -2px",
                    "&:hover": { color: "#555" },
                  },
                }}
              />
            ))}
          </Box>
        )}

        {/* Price row + quantity stepper */}
        <Box
          sx={{
            display: "flex",
            alignItems: "center",
            justifyContent: "space-between",
            mt: 1,
          }}
        >
          <Typography
            sx={{
              fontWeight: 800,
              fontSize: "1rem",
              color: "#1A1A18",
              letterSpacing: "-0.02em",
              lineHeight: 1,
            }}
          >
            {lineTotal}&thinsp;₴
          </Typography>

          {/* Stepper */}
          <Box
            sx={{
              display: "flex",
              alignItems: "center",
              bgcolor: "rgba(26,26,24,0.05)",
              borderRadius: "10px",
              overflow: "hidden",
              border: "1px solid rgba(26,26,24,0.08)",
            }}
          >
            <IconButton
              size="small"
              onClick={() => removeProductFromCart(product.cartItemId)}
              aria-label="Зменшити кількість"
              sx={{
                width: 32,
                height: 32,
                borderRadius: 0,
                color: count <= 1 ? "#E8321A" : "#1A1A18",
                transition: "all 0.15s ease",
                "&:hover": {
                  bgcolor: count <= 1 ? "rgba(232,50,26,0.1)" : "rgba(26,26,24,0.08)",
                },
                "&:active": { transform: "scale(0.88)" },
              }}
            >
              <RemoveIcon sx={{ fontSize: 14 }} />
            </IconButton>

            <Typography
              sx={{
                fontWeight: 700,
                fontSize: "0.88rem",
                color: "#1A1A18",
                minWidth: 24,
                textAlign: "center",
                lineHeight: 1,
              }}
            >
              {count}
            </Typography>

            <IconButton
              size="small"
              onClick={() => addProductToCart(product)}
              aria-label="Збільшити кількість"
              sx={{
                width: 32,
                height: 32,
                borderRadius: 0,
                color: "#1A1A18",
                transition: "all 0.15s ease",
                "&:hover": { bgcolor: "rgba(26,26,24,0.08)" },
                "&:active": { transform: "scale(0.88)" },
              }}
            >
              <AddIcon sx={{ fontSize: 14 }} />
            </IconButton>
          </Box>
        </Box>
      </Box>
    </Box>
  );
}
