import CardRelated from "@/app/entities/productId/card-related";
import { Box, Typography } from "@mui/material";
import { RelatedProduct } from "@/types/product";
import { getTranslations } from "next-intl/server";

interface Props {
  products: RelatedProduct[];
}

export default async function RelatedProducts({ products }: Props) {
  if (!products?.length) return null;
  const t = await getTranslations("product");

  // Показуємо тільки 3 продукти
  const visible = products.slice(0, 3);

  return (
    <Box>
      <Typography variant="h5" fontWeight={700} mb={2}>
        {t("relatedTitle")}
      </Typography>
      <Box
        sx={{
          display: "flex",
          gap: 2,
          flexWrap: { xs: "wrap", sm: "nowrap" },
        }}
      >
        {visible.map((product) => (
          <CardRelated key={product.id ?? product._id} product={product} />
        ))}
      </Box>
    </Box>
  );
}
