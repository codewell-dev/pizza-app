import type { Metadata } from "next";
import { NextIntlClientProvider } from "next-intl";
import { getLocale, getMessages } from "next-intl/server";
import "@fontsource/roboto/400.css";
import "@fontsource/roboto/500.css";
import "@fontsource/roboto/700.css";
import "slick-carousel/slick/slick.css";
import "slick-carousel/slick/slick-theme.css";
import "./globals.css";
import AppThemeProvider from "./providers/theme-provider";
import QueryProvider from "./providers/query-provider";
import Header from "./widgets/header";
import Footer from "./widgets/footer";
import { ShopStoreProvider } from "./providers/store-provider";
import { getCategories } from "@/lib/api";
import type { Locale } from "@/i18n/config";
import ThemeRegistry from "./theme-registry";

const BASE_URL = "https://pizza-house-client-ochre.vercel.app";

export const metadata: Metadata = {
  metadataBase: new URL(BASE_URL),
  title: {
    default: "Pizza House — замовити піцу онлайн",
    template: "%s | Pizza House",
  },
  description:
    "Замовляйте смачну піцу та суші онлайн з доставкою. Pizza House — швидко, свіжо, смачно. Піца, роли, закуски з доставкою додому.",
  keywords: [
    "піца",
    "замовити піцу",
    "доставка піці",
    "pizza house",
    "суші",
    "роли",
    "їжа з доставкою",
  ],
  authors: [{ name: "codewell-dev", url: "https://github.com/codewell-dev" }],
  creator: "codewell-dev",
  openGraph: {
    type: "website",
    locale: "uk_UA",
    url: BASE_URL,
    siteName: "Pizza House",
    title: "Pizza House — замовити піцу онлайн",
    description: "Замовляйте смачну піцу та суші онлайн з доставкою.",
    images: [
      {
        url: "https://pizzahouse.ua/_next/static/media/logo.0053162d.svg",
        width: 400,
        height: 400,
        alt: "Pizza House",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: "Pizza House — замовити піцу онлайн",
    description: "Замовляйте смачну піцу та суші онлайн з доставкою.",
  },
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      "max-image-preview": "large",
      "max-snippet": -1,
    },
  },
  alternates: {
    canonical: BASE_URL,
  },
};

export default async function RootLayout({
  children,
}: Readonly<{ children: React.ReactNode }>) {
  const [categories, locale, messages] = await Promise.all([
    getCategories().catch(() => []),
    getLocale(),
    getMessages(),
  ]);

  return (
    <html lang={locale} suppressHydrationWarning>
      <head>
        <link rel="preconnect" href="https://pizzahouse.ua" />
      </head>
      <body suppressHydrationWarning>
        <ThemeRegistry>
          <NextIntlClientProvider locale={locale} messages={messages}>
            <AppThemeProvider>
              <ShopStoreProvider>
                <QueryProvider>
                  <Header
                    categories={categories}
                    currentLocale={locale as Locale}
                  />
                  <main>{children}</main>
                  <Footer />
                </QueryProvider>
              </ShopStoreProvider>
            </AppThemeProvider>
          </NextIntlClientProvider>
        </ThemeRegistry>
      </body>
    </html>
  );
}
