"use client";

import * as React from "react";
import { Box, Typography, Button, IconButton } from "@mui/material";
import FavoriteBorderIcon from "@mui/icons-material/FavoriteBorder";
import FavoriteIcon from "@mui/icons-material/Favorite";
import Link from "next/link";
import Image from "next/image";
import { Product } from "@/types/product";
import { useShopStore } from "@/app/providers/store-provider";
import { useTranslations } from "next-intl";
import { useState } from "react";

interface Props {
  product: Product;
}

/**
 * Category product card — redesigned to match pizzahouse.ua style:
 * - Full square image with slight padding
 * - Favourite heart button (top-right, decorative)
 * - Title + weight row
 * - Description (2 lines max, muted)
 * - Price (bold) + "У кошик" yellow button
 */
export default function CardProduct({ product }: Props) {
  const addProductToCart = useShopStore((state) => state.addProductToCart);
  const t = useTranslations("product");
  const [liked, setLiked] = useState(false);

  if (!product) return null;

  const imageUrl = product.image?.large
    ? `https://pizzahouse.ua${product.image.large.startsWith("/") ? "" : "/"}${product.image.large}`
    : "/placeholder.png";

  return (
    <Box
      sx={{
        width: "100%",
        bgcolor: "#fff",
        borderRadius: "16px",
        border: "1px solid rgba(0,0,0,0.06)",
        display: "flex",
        flexDirection: "column",
        overflow: "hidden",
        transition: "box-shadow 0.2s, transform 0.2s",
        "&:hover": {
          boxShadow: "0 8px 32px rgba(0,0,0,0.10)",
          transform: "translateY(-2px)",
        },
      }}
    >
      {/* Image area */}
      <Box sx={{ position: "relative" }}>
        <Link
          href={`/${product._id ?? product.id}`}
          style={{ display: "block" }}
          prefetch={false}
        >
          <Box
            sx={{
              width: "100%",
              aspectRatio: "1 / 1",
              position: "relative",
              bgcolor: "#fafafa",
              overflow: "hidden",
            }}
          >
            <Image
              src={imageUrl}
              alt={product.title}
              fill
              sizes="(max-width: 600px) 100vw, (max-width: 960px) 50vw, 25vw"
              style={{ objectFit: "cover" }}
            />
          </Box>
        </Link>

        {/* Favourite button */}
        <IconButton
          onClick={() => setLiked((v) => !v)}
          size="small"
          aria-label="add to favourites"
          sx={{
            position: "absolute",
            top: 8,
            right: 8,
            bgcolor: "rgba(255,255,255,0.9)",
            backdropFilter: "blur(4px)",
            boxShadow: "0 2px 8px rgba(0,0,0,0.12)",
            width: 34,
            height: 34,
            "&:hover": { bgcolor: "#fff" },
          }}
        >
          {liked ? (
            <FavoriteIcon sx={{ fontSize: 18, color: "#e53935" }} />
          ) : (
            <FavoriteBorderIcon sx={{ fontSize: 18, color: "#bbb" }} />
          )}
        </IconButton>
      </Box>

      {/* Content */}
      <Box
        sx={{
          p: "12px 14px 14px",
          display: "flex",
          flexDirection: "column",
          flex: 1,
        }}
      >
        {/* Title + weight */}
        <Box sx={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", gap: 1, mb: 0.5 }}>
          <Link href={`/${product._id ?? product.id}`} prefetch={false} style={{ textDecoration: "none", flex: 1 }}>
            <Typography
              sx={{
                fontWeight: 700,
                fontSize: { xs: "0.9rem", sm: "0.95rem" },
                color: "#1a1a1a",
                lineHeight: 1.3,
                display: "-webkit-box",
                WebkitLineClamp: 2,
                WebkitBoxOrient: "vertical",
                overflow: "hidden",
              }}
            >
              {product.title}
            </Typography>
          </Link>
          {product.weight && (
            <Typography
              sx={{
                fontSize: "0.78rem",
                color: "#999",
                fontWeight: 500,
                flexShrink: 0,
                mt: "2px",
              }}
            >
              {product.weight}г
            </Typography>
          )}
        </Box>

        {/* Description */}
        {product.description && (
          <Typography
            variant="body2"
            sx={{
              color: "#888",
              fontSize: "0.75rem",
              lineHeight: 1.45,
              mb: 1.5,
              display: "-webkit-box",
              WebkitLineClamp: 2,
              WebkitBoxOrient: "vertical",
              overflow: "hidden",
            }}
          >
            {product.description}
          </Typography>
        )}

        {/* Price + button */}
        <Box
          sx={{
            display: "flex",
            alignItems: "center",
            justifyContent: "space-between",
            mt: "auto",
          }}
        >
          <Typography
            sx={{
              fontWeight: 800,
              fontSize: "1.15rem",
              color: "#1a1a1a",
            }}
          >
            {product.price} ₴
          </Typography>

          <Button
            variant="contained"
            size="small"
            onClick={(e) => {
              e.preventDefault();
              addProductToCart(product);
            }}
            sx={{
              bgcolor: "#FAE900",
              color: "#111",
              fontWeight: 700,
              fontSize: "0.8rem",
              borderRadius: "10px",
              px: 1.8,
              py: 0.8,
              boxShadow: "none",
              "&:hover": { bgcolor: "#f5df00", boxShadow: "none" },
            }}
          >
            {t("addToCart")}
          </Button>
        </Box>
      </Box>
    </Box>
  );
}
