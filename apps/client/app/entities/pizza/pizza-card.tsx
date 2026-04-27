"use client";

import { Box, Typography, Button, Skeleton, IconButton, Chip } from "@mui/material";
import FavoriteBorderIcon from "@mui/icons-material/FavoriteBorder";
import FavoriteIcon from "@mui/icons-material/Favorite";
import AddShoppingCartIcon from "@mui/icons-material/AddShoppingCart";
import Link from "next/link";
import Image from "next/image";
import { useShopStore } from "../../providers/store-provider";
import { Product } from "@/types/product";
import { useCallback, useState, useRef } from "react";
import ProductVariants from "./pizza-variants";
import { useTranslations } from "next-intl";
import { useFavorites } from "@/lib/use-favorites";

interface PizzaCardProps {
  title: string;
  products: Product[];
}

/**
 * Premium PizzaCard — conversion-optimised, visually rich.
 *
 * Features:
 * - Large food-forward image with smooth zoom on hover
 * - Contextual badges (🔥 Hot, New, Sale) derived from product tags / promotion_text
 * - Favourite toggle with animated heart
 * - Size variant pills with weight labels
 * - Add-to-cart with micro-animation confirmation state
 * - Description truncated to 2 lines, full detail on product page
 * - Mobile tap targets ≥ 44px
 */
export default function PizzaCard({ title, products }: PizzaCardProps) {
  const [activeIndex, setActiveIndex] = useState(0);
  const [justAdded, setJustAdded] = useState(false);
  const addProductToCart = useShopStore((state) => state.addProductToCart);
  const t = useTranslations("product");
  const cartIconRef = useRef<HTMLButtonElement | null>(null);

  const currentProduct = products?.[activeIndex];
  const { liked, toggle: toggleLiked } = useFavorites(currentProduct?._id ?? "");
  const handleVariantChange = useCallback(
    (index: number) => setActiveIndex(index),
    []
  );

  const handleAddToCart = useCallback(() => {
    if (!currentProduct) return;
    addProductToCart(currentProduct);
    setJustAdded(true);
    // Trigger cart button bounce via class
    const cartBtn = document.querySelector("[data-cart-trigger]");
    cartBtn?.classList.remove("cart-bounce");
    void (cartBtn as HTMLElement)?.offsetWidth; // reflow
    cartBtn?.classList.add("cart-bounce");
    setTimeout(() => setJustAdded(false), 1200);
  }, [currentProduct, addProductToCart]);

  // Derive badge from product data
  const getBadge = () => {
    if (!currentProduct) return null;
    const promo = currentProduct.promotion_text?.toLowerCase() ?? "";
    const tags = currentProduct.tags ?? [];
    if (promo.includes("акція") || promo.includes("знижка") || promo.includes("sale") || tags.includes("sale")) {
      return <span className="badge-sale">Sale</span>;
    }
    if (tags.includes("new") || tags.includes("новинка")) {
      return <span className="badge-new">New</span>;
    }
    if (tags.includes("hit") || tags.includes("хіт") || promo.length > 0) {
      return <span className="badge-hot">🔥 Хіт</span>;
    }
    return null;
  };

  if (!currentProduct) {
    return <PizzaCardSkeleton />;
  }

  const badge = getBadge();

  return (
    <Box
      className="pizza-card"
      sx={{ height: "100%" }}
      role="article"
      aria-label={title}
    >
      {/* ── Image area ─────────────────────────────────────────── */}
      <Box sx={{ position: "relative" }}>
        <Link
          href={`/${currentProduct._id}`}
          prefetch={false}
          style={{ display: "block" }}
          aria-label={`Переглянути ${title}`}
        >
          <Box className="pizza-card__image-wrap">
            <Image
              src={`https://pizzahouse.ua${currentProduct.image.large}`}
              alt={title}
              fill
              sizes="(max-width: 600px) 100vw, (max-width: 960px) 50vw, 25vw"
              className="pizza-card__image"
              style={{ objectFit: "contain" }}
            />
          </Box>
        </Link>

        {/* Badge (top-left) */}
        {badge && (
          <Box
            sx={{
              position: "absolute",
              top: 10,
              left: 10,
              zIndex: 2,
              lineHeight: 1,
            }}
          >
            {badge}
          </Box>
        )}

        {/* Favourite (top-right) */}
        <IconButton
          onClick={() => toggleLiked()}
          size="small"
          aria-label={liked ? "Прибрати з улюблених" : "Додати до улюблених"}
          sx={{
            position: "absolute",
            top: 8,
            right: 8,
            bgcolor: "rgba(255,255,255,0.92)",
            backdropFilter: "blur(4px)",
            boxShadow: "0 2px 8px rgba(0,0,0,0.10)",
            width: 36,
            height: 36,
            zIndex: 2,
            transition: "all 0.18s ease",
            "&:hover": {
              bgcolor: "#fff",
              transform: "scale(1.1)",
            },
            "&:active": {
              transform: "scale(0.9)",
            },
          }}
        >
          {liked ? (
            <FavoriteIcon
              sx={{
                fontSize: 18,
                color: "#E8321A",
                animation: "popIn 0.3s cubic-bezier(0.34, 1.56, 0.64, 1) both",
              }}
            />
          ) : (
            <FavoriteBorderIcon sx={{ fontSize: 18, color: "#ccc" }} />
          )}
        </IconButton>
      </Box>

      {/* ── Content ────────────────────────────────────────────── */}
      <Box
        sx={{
          p: "12px 14px 14px",
          display: "flex",
          flexDirection: "column",
          flex: 1,
        }}
      >
        {/* Title */}
        <Link
          href={`/${currentProduct._id}`}
          prefetch={false}
          style={{ textDecoration: "none" }}
        >
          <Typography
            variant="h6"
            sx={{
              fontWeight: 700,
              fontSize: { xs: "0.93rem", sm: "0.97rem" },
              color: "#1A1A18",
              mb: 0.4,
              lineHeight: 1.3,
              letterSpacing: "-0.015em",
              display: "-webkit-box",
              WebkitLineClamp: 2,
              WebkitBoxOrient: "vertical",
              overflow: "hidden",
              "&:hover": { color: "#1A1A18", opacity: 0.75 },
              transition: "opacity 0.15s",
            }}
          >
            {title}
          </Typography>
        </Link>

        {/* Description */}
        {products[0]?.description && (
          <Typography
            variant="body2"
            sx={{
              color: "#8A8A85",
              fontSize: "0.76rem",
              lineHeight: 1.45,
              mb: 0.5,
              display: "-webkit-box",
              WebkitLineClamp: 2,
              WebkitBoxOrient: "vertical",
              overflow: "hidden",
            }}
          >
            {products[0].description}
          </Typography>
        )}

        {/* Weight / size info */}
        {currentProduct.weight && products.length === 1 && (
          <Typography
            variant="caption"
            sx={{
              color: "#B0AFA9",
              fontSize: "0.73rem",
              fontWeight: 500,
              mb: 0.5,
            }}
          >
            {currentProduct.weight} г
          </Typography>
        )}

        {/* Size variant pills */}
        {products.length > 1 && (
          <ProductVariants
            products={products}
            activeIndex={activeIndex}
            onChange={handleVariantChange}
          />
        )}

        {/* Spacer */}
        <Box sx={{ flex: 1 }} />

        {/* Price + Add to cart */}
        <Box
          sx={{
            display: "flex",
            alignItems: "center",
            justifyContent: "space-between",
            mt: 1.5,
            gap: 1,
          }}
        >
          <Box>
            <Typography
              component="span"
              sx={{
                fontWeight: 800,
                fontSize: "1.2rem",
                color: "#1A1A18",
                letterSpacing: "-0.02em",
                lineHeight: 1,
              }}
            >
              {currentProduct.price}
            </Typography>
            <Typography
              component="span"
              sx={{
                fontWeight: 600,
                fontSize: "0.85rem",
                color: "#8A8A85",
                ml: 0.4,
              }}
            >
              ₴
            </Typography>
          </Box>

          <Button
            variant="contained"
            size="small"
            onClick={handleAddToCart}
            className="pizza-card__add-btn"
            startIcon={
              justAdded ? null : (
                <AddShoppingCartIcon sx={{ fontSize: "15px !important" }} />
              )
            }
            aria-label={`${t("addToCart")} ${title}`}
            sx={{
              bgcolor: justAdded ? "#1A7A3C" : "#FAE900",
              color: justAdded ? "#fff" : "#111",
              fontWeight: 700,
              fontSize: "0.8rem",
              borderRadius: "10px",
              px: justAdded ? 1.5 : 1.8,
              py: 0.9,
              minWidth: 44,
              boxShadow: "none",
              transition: "all 0.22s cubic-bezier(0.4, 0, 0.2, 1)",
              "&:hover": {
                bgcolor: justAdded ? "#1A7A3C" : "#E8D800",
                boxShadow: justAdded
                  ? "0 4px 16px rgba(26,122,60,0.35)"
                  : "0 4px 16px rgba(250,233,0,0.45)",
              },
            }}
          >
            {justAdded ? "✓ Додано" : t("addToCart")}
          </Button>
        </Box>
      </Box>
    </Box>
  );
}

/* ── Skeleton ──────────────────────────────────────────────────── */
function PizzaCardSkeleton() {
  return (
    <Box
      sx={{
        width: "100%",
        height: "100%",
        bgcolor: "#fff",
        borderRadius: "16px",
        border: "1px solid rgba(26,26,24,0.07)",
        overflow: "hidden",
      }}
    >
      <Skeleton
        variant="rectangular"
        sx={{ width: "100%", aspectRatio: "1/1" }}
        animation="wave"
      />
      <Box sx={{ p: "12px 14px 14px" }}>
        <Skeleton width="75%" height={22} sx={{ mb: 0.75, borderRadius: 1 }} />
        <Skeleton width="95%" height={14} sx={{ mb: 0.5, borderRadius: 1 }} />
        <Skeleton width="70%" height={14} sx={{ mb: 1.5, borderRadius: 1 }} />
        <Box sx={{ display: "flex", gap: 1, mb: 1.5 }}>
          <Skeleton width={60} height={32} sx={{ borderRadius: 2 }} />
          <Skeleton width={60} height={32} sx={{ borderRadius: 2 }} />
        </Box>
        <Box sx={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
          <Skeleton width={60} height={28} sx={{ borderRadius: 1 }} />
          <Skeleton width={90} height={36} sx={{ borderRadius: "10px" }} />
        </Box>
      </Box>
    </Box>
  );
}
