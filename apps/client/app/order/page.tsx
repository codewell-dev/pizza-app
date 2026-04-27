"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import {
  Box, Container, Grid, Typography, TextField, Button, Divider,
  ToggleButton, ToggleButtonGroup, RadioGroup, FormControlLabel, Radio,
  Paper, Collapse, Alert, CircularProgress,
} from "@mui/material";
import CheckCircleOutlineIcon from "@mui/icons-material/CheckCircleOutline";
import LocalShippingIcon from "@mui/icons-material/LocalShipping";
import StorefrontIcon from "@mui/icons-material/Storefront";
import LockOutlinedIcon from "@mui/icons-material/LockOutlined";
import Image from "next/image";
import Link from "next/link";
import { useTranslations } from "next-intl";
import { useShopStore } from "@/app/providers/store-provider";
import Breadcrumbs from "@/app/entities/breadcrumbs/breadcrumbs";
import { ProductWithCartId } from "@/app/stores/cartSlice";
import { createOrder, cartToOrderItems } from "@/lib/orders";

type DeliveryType = "delivery" | "pickup";
type PaymentType = "cash" | "card" | "online";

interface OrderForm {
  name: string;
  phone: string;
  street: string;
  house: string;
  apartment: string;
  comment: string;
}

const PHONE_RE = /^(\+?38)?0\d{9}$/;

export default function OrderPage() {
  const t = useTranslations("order");
  const tb = useTranslations("breadcrumbs");
  const router = useRouter();

  const cart = useShopStore((s) => s.cart);
  const totalPrice = useShopStore((s) => s.totalPrice);
  const totalCount = useShopStore((s) => s.totalCount);
  const clearCart = useShopStore((s) => s.clearCart);
  const token = useShopStore((s) => s.token);
  const isAuthenticated = useShopStore((s) => s.isAuthenticated);

  const [delivery, setDelivery] = useState<DeliveryType>("delivery");
  const [payment, setPayment] = useState<PaymentType>("cash");
  const [form, setForm] = useState<OrderForm>({
    name: "", phone: "", street: "", house: "", apartment: "", comment: "",
  });
  const [errors, setErrors] = useState<Partial<OrderForm>>({});
  const [serverError, setServerError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(false);

  const set = (field: keyof OrderForm) => (e: React.ChangeEvent<HTMLInputElement>) => {
    setForm((f) => ({ ...f, [field]: e.target.value }));
    setErrors((e2) => ({ ...e2, [field]: undefined }));
  };

  const validate = () => {
    const e: Partial<OrderForm> = {};
    if (!form.name.trim()) e.name = t("nameRequired");
    if (!form.phone.trim()) e.phone = t("phoneRequired");
    else if (!PHONE_RE.test(form.phone)) e.phone = t("phoneError");
    if (delivery === "delivery" && !form.street.trim()) e.street = t("addressRequired");
    if (delivery === "delivery" && !form.house.trim()) e.house = t("addressRequired");
    setErrors(e);
    return Object.keys(e).length === 0;
  };

  const handleSubmit = async () => {
    if (!validate()) return;
    setServerError(null);
    setLoading(true);

    try {
      const body = {
        items: cartToOrderItems(cart),
        totalPrice,
        deliveryType: delivery,
        paymentMethod: payment,
        customerName: form.name,
        customerPhone: form.phone,
        address: delivery === "delivery"
          ? { street: form.street, house: form.house, apartment: form.apartment || undefined }
          : undefined,
        comment: form.comment || undefined,
      };

      if (isAuthenticated && token) {
        // Authenticated — save order to backend
        await createOrder(token, body);
      }
      // Guest — just clear cart (order not saved, can add guest flow later)

      clearCart();
      setSuccess(true);
    } catch (err) {
      setServerError(err instanceof Error ? err.message : "Помилка оформлення");
    } finally {
      setLoading(false);
    }
  };

  if (success) {
    return (
      <Container maxWidth="sm" sx={{ py: 10, textAlign: "center" }}>
        <CheckCircleOutlineIcon sx={{ fontSize: 80, color: "#4caf50", mb: 2 }} />
        <Typography variant="h4" fontWeight={700} gutterBottom>{t("successTitle")}</Typography>
        <Typography color="text.secondary" mb={4}>{t("successText")}</Typography>
        <Box display="flex" gap={2} justifyContent="center" flexWrap="wrap">
          {isAuthenticated && (
            <Button variant="outlined" size="large" component={Link} href="/my-orders" sx={{ borderRadius: 3 }}>
              Мої замовлення
            </Button>
          )}
          <Button variant="contained" size="large" component={Link} href="/" sx={{ borderRadius: 3, bgcolor: "#FAE900", color: "#111" }}>
            {t("backHome")}
          </Button>
        </Box>
      </Container>
    );
  }

  return (
    <Container maxWidth="xl" sx={{ py: { xs: 2, md: 4 }, px: { xs: 2, md: 4 } }}>
      <Breadcrumbs crumbs={[{ label: tb("home"), href: "/" }, { label: t("title") }]} />

      <Typography variant="h4" fontWeight={700} sx={{ mt: 1, mb: 3, fontSize: { xs: "1.5rem", md: "2rem" } }}>
        {t("title")}
      </Typography>

      {/* Not logged in notice */}
      {!isAuthenticated && (
        <Alert severity="info" icon={<LockOutlinedIcon />} sx={{ mb: 3, borderRadius: 2 }}>
          Увійдіть щоб зберегти замовлення в історію.{" "}
          <Link href="/" style={{ color: "inherit", fontWeight: 600 }}>Увійти</Link>
        </Alert>
      )}

      {serverError && <Alert severity="error" sx={{ mb: 2 }}>{serverError}</Alert>}

      <Grid container spacing={3} alignItems="flex-start">
        {/* ── LEFT: form ──────────────────────────────────────────────── */}
        <Grid size={{ xs: 12, md: 7 }}>

          <Paper elevation={0} sx={{ border: "1px solid", borderColor: "divider", borderRadius: 3, p: 3, mb: 3 }}>
            <ToggleButtonGroup value={delivery} exclusive onChange={(_, v) => v && setDelivery(v)} fullWidth>
              {(["delivery", "pickup"] as const).map((type) => (
                <ToggleButton
                  key={type}
                  value={type}
                  sx={{
                    borderRadius: "12px !important",
                    py: 1.5, gap: 1, fontWeight: 600, fontSize: 14,
                    border: "1.5px solid",
                    borderColor: delivery === type ? "#FAE900" : "divider",
                    bgcolor: delivery === type ? "#FAE900" : "transparent",
                    color: "#111",
                    "&.Mui-selected": { bgcolor: "#FAE900", color: "#111", borderColor: "#FAE900" },
                    "&.Mui-selected:hover": { bgcolor: "#f5df00" },
                  }}
                >
                  {type === "delivery" ? <LocalShippingIcon sx={{ fontSize: 20 }} /> : <StorefrontIcon sx={{ fontSize: 20 }} />}
                  {t(type)}
                </ToggleButton>
              ))}
            </ToggleButtonGroup>
          </Paper>

          <Paper elevation={0} sx={{ border: "1px solid", borderColor: "divider", borderRadius: 3, p: 3, mb: 3 }}>
            <Grid container spacing={2}>
              <Grid size={{ xs: 12, sm: 6 }}>
                <TextField label={t("name")} fullWidth size="small" value={form.name} onChange={set("name")} error={!!errors.name} helperText={errors.name} />
              </Grid>
              <Grid size={{ xs: 12, sm: 6 }}>
                <TextField label={t("phone")} fullWidth size="small" value={form.phone} onChange={set("phone")} error={!!errors.phone} helperText={errors.phone} placeholder="+380XXXXXXXXX" />
              </Grid>
            </Grid>
          </Paper>

          <Collapse in={delivery === "delivery"}>
            <Paper elevation={0} sx={{ border: "1px solid", borderColor: "divider", borderRadius: 3, p: 3, mb: 3 }}>
              <Typography variant="subtitle1" fontWeight={600} mb={2}>{t("address")}</Typography>
              <Grid container spacing={2}>
                <Grid size={{ xs: 12 }}>
                  <TextField label={t("street")} fullWidth size="small" value={form.street} onChange={set("street")} error={!!errors.street} helperText={errors.street} />
                </Grid>
                <Grid size={{ xs: 6 }}>
                  <TextField label={t("house")} fullWidth size="small" value={form.house} onChange={set("house")} error={!!errors.house} helperText={errors.house} />
                </Grid>
                <Grid size={{ xs: 6 }}>
                  <TextField label={t("apartment")} fullWidth size="small" value={form.apartment} onChange={set("apartment")} />
                </Grid>
              </Grid>
            </Paper>
          </Collapse>

          <Paper elevation={0} sx={{ border: "1px solid", borderColor: "divider", borderRadius: 3, p: 3, mb: 3 }}>
            <Typography variant="subtitle1" fontWeight={600} mb={1}>{t("payment")}</Typography>
            <RadioGroup value={payment} onChange={(_, v) => setPayment(v as PaymentType)}>
              <FormControlLabel value="cash" control={<Radio />} label={t("cash")} />
              <FormControlLabel value="card" control={<Radio />} label={t("card")} />
              <FormControlLabel value="online" control={<Radio />} label={t("online")} />
            </RadioGroup>
          </Paper>

          <Paper elevation={0} sx={{ border: "1px solid", borderColor: "divider", borderRadius: 3, p: 3, mb: 3 }}>
            <TextField label={t("comment")} fullWidth multiline rows={3} size="small" value={form.comment} onChange={set("comment")} />
          </Paper>
        </Grid>

        {/* ── RIGHT: summary ──────────────────────────────────────────── */}
        <Grid size={{ xs: 12, md: 5 }}>
          <Paper elevation={0} sx={{ border: "1px solid", borderColor: "divider", borderRadius: 3, p: 3, position: { md: "sticky" }, top: { md: "140px" } }}>
            <Typography variant="h6" fontWeight={700} mb={2}>{t("yourOrder")}</Typography>

            {cart.length === 0 ? (
              <Typography color="text.secondary">{t("emptyCart")}</Typography>
            ) : (
              <>
                <Box sx={{ display: "flex", flexDirection: "column", gap: 2, mb: 2 }}>
                  {cart.map((item: ProductWithCartId) => <OrderItem key={item.cartItemId} item={item} />)}
                </Box>

                <Divider sx={{ my: 2 }} />

                <Box display="flex" justifyContent="space-between" mb={1}>
                  <Typography color="text.secondary">{t("items")}</Typography>
                  <Typography fontWeight={500}>{totalCount} шт · {totalPrice} ₴</Typography>
                </Box>
                <Box display="flex" justifyContent="space-between" mb={2}>
                  <Typography color="text.secondary">{t("deliveryFee")}</Typography>
                  <Typography fontWeight={500} color="success.main">{t("free")}</Typography>
                </Box>

                <Divider sx={{ my: 2 }} />

                <Box display="flex" justifyContent="space-between" mb={3}>
                  <Typography variant="h6" fontWeight={700}>{t("total")}</Typography>
                  <Typography variant="h6" fontWeight={700}>{totalPrice} ₴</Typography>
                </Box>

                <Button
                  variant="contained"
                  size="large"
                  fullWidth
                  onClick={handleSubmit}
                  disabled={loading || cart.length === 0}
                  sx={{ borderRadius: 3, py: 1.5, fontWeight: 700, fontSize: 16, bgcolor: "#FAE900", color: "#111", "&:hover": { bgcolor: "#f5df00" } }}
                >
                  {loading ? <CircularProgress size={22} color="inherit" /> : t("submit")}
                </Button>
              </>
            )}
          </Paper>
        </Grid>
      </Grid>
    </Container>
  );
}

function OrderItem({ item }: { item: ProductWithCartId }) {
  return (
    <Box display="flex" gap={2} alignItems="flex-start">
      <Box sx={{ width: 60, height: 60, position: "relative", flexShrink: 0 }}>
        <Image src={`https://pizzahouse.ua${item.image.large}`} alt={item.title} fill sizes="60px" style={{ objectFit: "contain" }} />
      </Box>
      <Box flex={1} minWidth={0}>
        <Typography fontWeight={600} sx={{ fontSize: 14, lineHeight: 1.3 }}>{item.title}</Typography>
        {item.modifiers?.filter((m) => m.price > 0).map((m) => (
          <Typography key={m._id} variant="body2" color="text.secondary" sx={{ fontSize: 12 }}>+ {m.title}</Typography>
        ))}
        <Typography variant="body2" color="text.secondary" sx={{ fontSize: 13, mt: 0.5 }}>{item.count} шт</Typography>
      </Box>
      <Typography fontWeight={600} sx={{ whiteSpace: "nowrap", fontSize: 15 }}>{item.price * (item.count ?? 1)} ₴</Typography>
    </Box>
  );
}
