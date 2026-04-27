"use client";

import { useEffect, useState, useCallback } from "react";
import {
  Container, Box, Typography, Button, Chip, Divider,
  Accordion, AccordionSummary, AccordionDetails,
  CircularProgress, Alert, Paper,
} from "@mui/material";
import ExpandMoreIcon from "@mui/icons-material/ExpandMore";
import ShoppingBagOutlinedIcon from "@mui/icons-material/ShoppingBagOutlined";
import Image from "next/image";
import Link from "next/link";
import { useTranslations } from "next-intl";
import { useShopStore } from "@/app/providers/store-provider";
import Breadcrumbs from "@/app/entities/breadcrumbs/breadcrumbs";
import { getMyOrders, Order, OrderStatus } from "@/lib/orders";

// ── Status chip config ────────────────────────────────────────────────────────

const STATUS_COLOR: Record<OrderStatus, "warning" | "info" | "primary" | "secondary" | "success" | "error"> = {
  pending: "warning",
  confirmed: "info",
  preparing: "primary",
  delivering: "secondary",
  done: "success",
  cancelled: "error",
};

// ── Main page ─────────────────────────────────────────────────────────────────

export default function MyOrdersPage() {
  const t = useTranslations("myOrders");
  const tb = useTranslations("breadcrumbs");
  const ts = useTranslations("orderStatuses");

  const token = useShopStore((s) => s.token);
  const isAuthenticated = useShopStore((s) => s.isAuthenticated);

  const [orders, setOrders] = useState<Order[]>([]);
  const [page, setPage] = useState(1);
  const [pages, setPages] = useState(1);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const fetchOrders = useCallback(
    async (p: number, append = false) => {
      if (!token) return;
      setLoading(true);
      setError(null);
      try {
        const res = await getMyOrders(token, p, 10);
        setOrders((prev) => append ? [...prev, ...res.orders] : res.orders);
        setPages(res.pages);
      } catch (err) {
        setError(err instanceof Error ? err.message : "Error");
      } finally {
        setLoading(false);
      }
    },
    [token]
  );

  // Initial load
  useEffect(() => {
    if (isAuthenticated) fetchOrders(1);
  }, [isAuthenticated, fetchOrders]);

  // Poll for status updates every 30s when page is visible
  useEffect(() => {
    if (!isAuthenticated) return;
    const interval = setInterval(() => fetchOrders(1), 30_000);
    return () => clearInterval(interval);
  }, [isAuthenticated, fetchOrders]);

  const loadMore = () => {
    const next = page + 1;
    setPage(next);
    fetchOrders(next, true);
  };

  if (!isAuthenticated) {
    return (
      <Container maxWidth="sm" sx={{ py: 10, textAlign: "center" }}>
        <ShoppingBagOutlinedIcon sx={{ fontSize: 72, color: "text.disabled", mb: 2 }} />
        <Typography variant="h5" fontWeight={700} mb={2}>{t("loginRequired")}</Typography>
        <Button variant="contained" component={Link} href="/" sx={{ borderRadius: 3 }}>
          На головну
        </Button>
      </Container>
    );
  }

  return (
    <Container maxWidth="md" sx={{ py: { xs: 2, md: 4 }, px: { xs: 2, md: 4 } }}>
      <Breadcrumbs
        crumbs={[
          { label: tb("home"), href: "/" },
          { label: t("title") },
        ]}
      />

      <Typography variant="h4" fontWeight={700} sx={{ mt: 1, mb: 3 }}>
        {t("title")}
      </Typography>

      {error && <Alert severity="error" sx={{ mb: 2 }}>{error}</Alert>}

      {loading && orders.length === 0 ? (
        <Box display="flex" justifyContent="center" py={8}>
          <CircularProgress />
        </Box>
      ) : orders.length === 0 ? (
        <Box textAlign="center" py={8}>
          <ShoppingBagOutlinedIcon sx={{ fontSize: 72, color: "text.disabled", mb: 2 }} />
          <Typography color="text.secondary">{t("empty")}</Typography>
        </Box>
      ) : (
        <Box display="flex" flexDirection="column" gap={2}>
          {orders.map((order) => (
            <OrderCard key={order._id} order={order} t={t} ts={ts} />
          ))}

          {page < pages && (
            <Button
              variant="outlined"
              fullWidth
              onClick={loadMore}
              disabled={loading}
              sx={{ mt: 1, borderRadius: 3 }}
            >
              {loading ? <CircularProgress size={20} /> : t("loadMore")}
            </Button>
          )}
        </Box>
      )}
    </Container>
  );
}

// ── Order card ────────────────────────────────────────────────────────────────

function OrderCard({
  order,
  t,
  ts,
}: {
  order: Order;
  t: ReturnType<typeof useTranslations>;
  ts: ReturnType<typeof useTranslations>;
}) {
  const date = new Date(order.createdAt).toLocaleDateString("uk-UA", {
    day: "2-digit", month: "2-digit", year: "numeric",
    hour: "2-digit", minute: "2-digit",
  });

  return (
    <Paper
      elevation={0}
      sx={{ border: "1px solid", borderColor: "divider", borderRadius: 3, overflow: "hidden" }}
    >
      {/* Header */}
      <Box
        sx={{
          display: "flex",
          alignItems: "center",
          justifyContent: "space-between",
          flexWrap: "wrap",
          gap: 1,
          px: 3,
          py: 2,
          bgcolor: "#fafafa",
          borderBottom: "1px solid",
          borderColor: "divider",
        }}
      >
        <Box>
          <Typography variant="body2" color="text.secondary" sx={{ fontSize: 12 }}>
            {t("orderNum")} #{order._id.slice(-6).toUpperCase()}
          </Typography>
          <Typography variant="body2" color="text.secondary" sx={{ fontSize: 12 }}>{date}</Typography>
        </Box>

        <Chip
          label={ts(order.status)}
          color={STATUS_COLOR[order.status]}
          size="small"
          sx={{ fontWeight: 700 }}
        />

        <Typography fontWeight={800} sx={{ fontFamily: '"Nunito", sans-serif', fontSize: "1.1rem" }}>
          {order.totalPrice} ₴
        </Typography>
      </Box>

      {/* Items accordion */}
      <Accordion
        elevation={0}
        disableGutters
        sx={{ "&:before": { display: "none" } }}
      >
        <AccordionSummary
          expandIcon={<ExpandMoreIcon />}
          sx={{ px: 3, py: 1 }}
        >
          <Typography variant="body2" color="text.secondary">
            {order.items.length} {t("items")} ·{" "}
            {order.deliveryType === "delivery" ? t("delivery") : t("pickup")}
          </Typography>
        </AccordionSummary>

        <AccordionDetails sx={{ px: 3, pt: 0, pb: 2 }}>
          <Box display="flex" flexDirection="column" gap={2}>
            {order.items.map((item, i) => (
              <Box key={i} display="flex" gap={2} alignItems="flex-start">
                {item.imageLarge && (
                  <Box sx={{ width: 56, height: 56, position: "relative", flexShrink: 0 }}>
                    <Image
                      src={`https://pizzahouse.ua${item.imageLarge}`}
                      alt={item.title}
                      fill
                      sizes="56px"
                      style={{ objectFit: "contain" }}
                    />
                  </Box>
                )}
                <Box flex={1}>
                  <Typography fontWeight={600} sx={{ fontSize: 14, lineHeight: 1.3 }}>
                    {item.title}
                  </Typography>
                  {item.modifiers?.filter((m) => m.price > 0).map((m) => (
                    <Typography key={m._id} variant="body2" color="text.secondary" sx={{ fontSize: 12 }}>
                      + {m.title}
                    </Typography>
                  ))}
                  <Typography variant="body2" color="text.secondary" sx={{ fontSize: 12, mt: 0.3 }}>
                    {item.count} шт
                  </Typography>
                </Box>
                <Typography fontWeight={600} sx={{ fontSize: 14, whiteSpace: "nowrap" }}>
                  {item.price * item.count} ₴
                </Typography>
              </Box>
            ))}
          </Box>

          {(order.address?.street || order.comment) && (
            <>
              <Divider sx={{ my: 2 }} />
              {order.address?.street && (
                <Typography variant="body2" color="text.secondary" sx={{ fontSize: 13 }}>
                  📍 {order.address.street}, {order.address.house}
                  {order.address.apartment ? `, кв. ${order.address.apartment}` : ""}
                </Typography>
              )}
              {order.comment && (
                <Typography variant="body2" color="text.secondary" sx={{ fontSize: 13, mt: 0.5 }}>
                  💬 {order.comment}
                </Typography>
              )}
            </>
          )}
        </AccordionDetails>
      </Accordion>
    </Paper>
  );
}
