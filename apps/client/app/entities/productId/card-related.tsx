"use client";

import { Box, Card, CardContent, IconButton, Typography } from "@mui/material";
import AddIcon from "@mui/icons-material/Add";
import { yellow } from "@mui/material/colors";
import Link from "next/link";
import Image from "next/image";
import { RelatedProduct } from "@/types/product";
import { useShopStore } from "@/app/providers/store-provider";
import { useTranslations } from "next-intl";

interface Props {
  product: RelatedProduct;
}

export default function CardRelated({ product }: Props) {
  const addProductToCart = useShopStore((state) => state.addProductToCart);
  const t = useTranslations("product");

  if (!product) return null;

  const handleAdd = () => {
    // RelatedProduct має мінімальний набір полів, кастуємо до Product
    addProductToCart({
      _id: product._id ?? product.id,
      id: product.id,
      title: product.title,
      price: product.price,
      image: product.image,
      url: product.url,
      cartItemId: "",
      modifiers: [],
      weight: "",
      analytics_title: product.title,
      unit: "",
      analytics_category_title: "",
      description: "",
      promotion_text: "",
      route: "",
      open_graph: "",
      tags: [],
      options: false,
    });
  };

  return (
    <Card
      sx={{
        display: "flex",
        justifyContent: "center",
        alignItems: "center",
        px: 2,
        borderRadius: 5,
        maxWidth: "300px",
        flex: "1 1 200px",
        transition: "box-shadow 0.2s",
        "&:hover": { boxShadow: "0 4px 20px rgba(0,0,0,0.10)" },
      }}
    >
      <Link href={`/${product.id ?? product._id}`}>
        <Box sx={{ position: "relative", width: 100, height: 100, flexShrink: 0 }}>
          <Image
            src={`https://pizzahouse.ua${product.image.small}`}
            alt={product.title}
            fill
            sizes="100px"
            style={{ objectFit: "contain" }}
          />
        </Box>
      </Link>
      <Box sx={{ display: "flex", flexDirection: "column" }}>
        <CardContent sx={{ my: "auto" }}>
          <Typography component="div" variant="h6" sx={{ fontSize: "1rem", lineHeight: 1.3 }}>
            {product.title}
          </Typography>
          <Box sx={{ display: "flex", justifyContent: "space-between", mt: 2, gap: 2, alignItems: "center" }}>
            <Typography component="div" variant="h6" sx={{ fontWeight: 700 }}>
              {product.price} ₴
            </Typography>
            <IconButton
              aria-label={t("addToCartAria")}
              size="small"
              onClick={handleAdd}
              sx={{
                width: 30, height: 30,
                backgroundColor: yellow[500],
                color: "white",
                "&:hover": { backgroundColor: yellow[700] },
              }}
            >
              <AddIcon fontSize="inherit" />
            </IconButton>
          </Box>
        </CardContent>
      </Box>
    </Card>
  );
}
