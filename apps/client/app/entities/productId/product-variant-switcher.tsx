"use client";

import { Box, ButtonBase, Typography, Skeleton } from "@mui/material";
import { useRouter } from "next/navigation";
import { useQuery } from "@tanstack/react-query";
import { Pizza, Product } from "@/types/product";

interface Props {
  currentProductId: string;
  variants: Product[];
}

async function fetchPizzasGrouped(): Promise<Pizza[]> {
  const res = await fetch("/api/pizzas-grouped");
  if (!res.ok) throw new Error("Failed to fetch pizzas");
  return res.json();
}

/**
 * Product detail page size switcher.
 *
 * Uses TanStack Query instead of the previous module-level cached variable —
 * that approach caused stale data across navigations and was an antipattern.
 *
 * Renders large pill buttons matching pizzahouse.ua: "30 см - 500г"
 * The format uses the product's own weight field.
 */
export default function ProductVariantSwitcher({ currentProductId }: Props) {
  const router = useRouter();

  const { data: pizzas, isLoading } = useQuery({
    queryKey: ["pizzas-grouped"],
    queryFn: fetchPizzasGrouped,
    staleTime: 5 * 60 * 1000,
    gcTime: 10 * 60 * 1000,
  });

  const pizzaGroup = pizzas?.find((p) =>
    p.products.some((prod) => prod._id === currentProductId)
  );
  const variants = pizzaGroup?.products ?? [];

  if (isLoading) {
    return (
      <Box sx={{ display: "flex", gap: 1.5, my: 2, flexWrap: "wrap" }}>
        {[1, 2, 3].map((i) => (
          <Skeleton
            key={i}
            variant="rounded"
            width={130}
            height={48}
            sx={{ borderRadius: "12px" }}
          />
        ))}
      </Box>
    );
  }

  if (variants.length <= 1) return null;

  return (
    <Box sx={{ display: "flex", gap: "10px", flexWrap: "wrap", my: 2 }}>
      {variants.map((v) => {
        const isActive = v._id === currentProductId;
        return (
          <ButtonBase
            key={v._id}
            onClick={() => !isActive && router.push(`/${v._id}`)}
            disabled={isActive}
            sx={{
              px: 2.5,
              py: 1.3,
              borderRadius: "12px",
              bgcolor: isActive ? "#FAE900" : "#f5f5f5",
              border: isActive ? "2px solid #d4b800" : "2px solid transparent",
              transition: "all 0.18s ease",
              cursor: isActive ? "default" : "pointer",
              "&:hover:not(:disabled)": {
                bgcolor: "#ebebeb",
                transform: "translateY(-1px)",
              },
              boxShadow: isActive
                ? "0 3px 10px rgba(212,184,0,0.3)"
                : "0 1px 4px rgba(0,0,0,0.06)",
            }}
          >
            <Typography
              sx={{
                fontSize: { xs: "0.88rem", sm: "0.92rem" },
                fontWeight: isActive ? 700 : 500,
                color: "#1a1a1a",
                whiteSpace: "nowrap",
                letterSpacing: "-0.01em",
              }}
            >
              {v.weight} г
            </Typography>
          </ButtonBase>
        );
      })}
    </Box>
  );
}
