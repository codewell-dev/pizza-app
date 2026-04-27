"use client";

import React, { useState } from "react";
import { Form, Formik, FormikHelpers } from "formik";
import { Box, Button, TextField, Stack, Alert, Tab, Tabs } from "@mui/material";
import * as Yup from "yup";
import { useTranslations } from "next-intl";
import { loginRequest, registerRequest, getProfileRequest } from "@/lib/auth";
import { useShopStore } from "@/app/providers/store-provider";

interface FormValues {
  email: string;
  password: string;
}

interface Props {
  onSuccess?: () => void;
}

export default function LoginForm({ onSuccess }: Props) {
  const t = useTranslations("login");
  const [tab, setTab] = useState<"login" | "register">("login");
  const [serverError, setServerError] = useState<string | null>(null);

  const setAuth = useShopStore((s) => s.setAuth);

  const isRegister = tab === "register";

  const validationSchema = Yup.object({
    email: Yup.string()
      .email(t("emailError"))
      .required(t("emailRequired")),
    password: Yup.string()
      .min(6, t("passwordMin"))
      .required(t("passwordRequired")),
  });

  const handleSubmit = async (
    values: FormValues,
    { setSubmitting }: FormikHelpers<FormValues>
  ) => {
    setServerError(null);
    try {
      if (isRegister) {
        // Register then auto-login
        await registerRequest(values.email, values.password);
      }

      const { access_token } = await loginRequest(values.email, values.password);
      const user = await getProfileRequest(access_token);

      setAuth(user, access_token);
      onSuccess?.();
    } catch (err: unknown) {
      const msg = err instanceof Error ? err.message : String(err);
      setServerError(isRegister ? t("registerError") : msg);
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <Box>
      <Tabs
        value={tab}
        onChange={(_, v) => { setTab(v); setServerError(null); }}
        sx={{ mb: 2 }}
      >
        <Tab label={t("title")} value="login" />
        <Tab label={t("titleRegister")} value="register" />
      </Tabs>

      {serverError && (
        <Alert severity="error" sx={{ mb: 2 }}>
          {serverError}
        </Alert>
      )}

      <Formik
        initialValues={{ email: "", password: "" }}
        validationSchema={validationSchema}
        onSubmit={handleSubmit}
      >
        {({ handleSubmit, touched, errors, handleChange, handleBlur, isSubmitting }) => (
          <Form onSubmit={handleSubmit}>
            <Stack spacing={2}>
              <TextField
                label={t("email")}
                variant="outlined"
                name="email"
                type="email"
                fullWidth
                required
                onChange={handleChange}
                onBlur={handleBlur}
                error={Boolean(touched.email && errors.email)}
                helperText={touched.email && errors.email}
              />
              <TextField
                label={t("password")}
                variant="outlined"
                name="password"
                type="password"
                fullWidth
                required
                onChange={handleChange}
                onBlur={handleBlur}
                error={Boolean(touched.password && errors.password)}
                helperText={touched.password && errors.password}
              />

              <Button
                type="submit"
                variant="contained"
                fullWidth
                size="large"
                disabled={isSubmitting}
              >
                {isSubmitting
                  ? "..."
                  : isRegister
                  ? t("submitRegister")
                  : t("submit")}
              </Button>

              {!isRegister && (
                <Button variant="text" color="inherit" size="small">
                  {t("forgot")}
                </Button>
              )}
            </Stack>
          </Form>
        )}
      </Formik>
    </Box>
  );
}
