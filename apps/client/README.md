# Pizza House — Client

Next.js 16 storefront. Server-first архітектура, i18n (uk/en/ru), JWT авторизація, ISR кешування.

---

## Tech Stack

| | |
|---|---|
| Framework | Next.js 16 (App Router) |
| UI | MUI v7 + Tailwind CSS |
| State | Zustand 5 + Immer (cart + auth) |
| i18n | next-intl (uk / en / ru) — cookie-based |
| Forms | Formik + Yup |
| Шрифт | Nunito (Google Fonts)
| Карусель | react-slick |
| Language | TypeScript (strict) |

---

## Старт

```bash
git clone <repo>
cd pizza-house-client

cp .env.example .env.local
# заповни API_URL

pnpm install
pnpm dev
```

Відкрий `http://localhost:3000`

---

## Environment Variables

| Змінна | Де використовується | Опис |
|---|---|---|
| `API_URL` | Server Components, `lib/auth.ts`, `lib/orders.ts` | URL бекенду. `/api` prefix додається автоматично |
| `NEXT_PUBLIC_API_URL` | Client Components | Публічний URL бекенду якщо відрізняється |

> `lib/api.ts` (`server-only`) автоматично додає `/api` до кожного запиту.

---

## Project Structure

```
├── app/
│   ├── layout.tsx                 # Root layout: шрифти, ThemeProvider, i18n, Header, Footer
│   ├── page.tsx                   # Головна: каталог піц (Server Component)
│   ├── [pizzaId]/page.tsx         # Сторінка продукту з breadcrumbs + модифікаторами
│   ├── category/[id]/page.tsx     # Сторінка категорії
│   ├── order/page.tsx             # Оформлення замовлення (Client Component)
│   ├── my-orders/page.tsx         # Мої замовлення з polling статусу (Client Component)
│   │
│   ├── entities/                  # Feature-scoped компоненти
│   │   ├── basket/card-basket.tsx
│   │   ├── breadcrumbs/breadcrumbs.tsx
│   │   ├── components/            # Shared: Multiple counter, CardProduct
│   │   ├── header/                # LanguageSwitcher, HeaderMenu, HeaderSelect
│   │   ├── modal/login-form.tsx   # Login + Register таби, реальний API call
│   │   ├── pizza/                 # PizzaCard, ProductVariants, PizzaCardSkeleton
│   │   └── productId/             # ModifiersCheckboxList, ModifiersMultiple, PriceBox...
│   │
│   ├── providers/
│   │   ├── store-provider.tsx     # Zustand store context (SSR-safe: useRef pattern)
│   │   └── theme-provider.tsx     # MUI ThemeProvider (окремий "use client" компонент)
│   │
│   ├── stores/
│   │   ├── cartSlice.ts           # Кошик: add/remove/clear, modifiers, totals
│   │   ├── authSlice.ts           # Auth: user, token, isAuthenticated
│   │   └── shop-store.ts          # Об'єднаний store: cart + auth, persist у localStorage
│   │
│   ├── widgets/                   # Повноширинні секції
│   │   ├── header.tsx             # Fixed AppBar + sticky category strip
│   │   ├── basket.tsx             # Cart dropdown/drawer → посилання на /order
│   │   ├── footer.tsx
│   │   ├── carousel.tsx
│   │   ├── categories.tsx
│   │   └── modal-popup.tsx        # Login/Profile modal з "Мої замовлення"
│   │
│   ├── config.ts                  # API_URL з env
│   ├── globals.css                # Tailwind base + бежевий фон #f5f0e8
│   └── theme.ts                   # MUI theme: Nunito, beige background, rounded cards
│
├── i18n/
│   ├── config.ts                  # Locales: ['uk', 'en', 'ru'], defaultLocale: 'uk'
│   └── request.ts                 # Server-side: читає cookie 'locale'
│
├── lib/
│   ├── api.ts                     # server-only: apiFetch з ISR revalidate
│   ├── auth.ts                    # Client: loginRequest, registerRequest, getProfileRequest
│   └── orders.ts                  # Client: createOrder, getMyOrders, cartToOrderItems
│
├── messages/
│   ├── uk.json                    # Українська (default)
│   ├── en.json                    # English
│   └── ru.json                    # Русский
│
└── types/
    └── product.ts                 # Product, Pizza, Category, Modifier, GroupModifier...
```

---

## Pages

| URL | Тип | Auth | Опис |
|---|---|---|---|
| `/` | Server | Public | Каталог піц із карусель |
| `/[pizzaId]` | Server | Public | Сторінка продукту + модифікатори |
| `/category/[id]` | Server | Public | Продукти категорії |
| `/order` | Client | Optional | Оформлення замовлення |
| `/my-orders` | Client | Required | Мої замовлення з polling |

---

## Architecture Decisions

### Data fetching — Server Components by default

Всі дані завантажуються в Server Components через `lib/api.ts` (`server-only`). Немає зайвих проміжних API routes — прямий fetch з кешуванням ISR.

| Ресурс | `revalidate` | Пояснення |
|---|---|---|
| Список піц | 60 сек | Змінюється відносно рідко |
| Категорії | 3600 сек | Майже не змінюються |
| Продукт по ID | 300 сек | Стабільний, але може оновлюватись |

### Категорії в `layout.tsx` — один fetch на всі сторінки

`getCategories()` викликається в `RootLayout` і передається в `<Header categories={...}>`. Так категорії завантажуються один раз на рівні layout, а не окремо на кожній сторінці.

### ISR + `generateStaticParams`

Сторінки продуктів (`/[pizzaId]`) pre-render під час build через `generateStaticParams`. Кожна сторінка піци — статичний HTML, що завантажується миттєво.

### Zustand Store — SSR-safe патерн

Store створюється через `useRef` в `ShopStoreProvider` — новий інстанс на кожен server request, один і той самий на клієнті. Запобігає cross-request state leakage.

```ts
const storeRef = useRef<ShopStoreApi | null>(null);
if (storeRef.current === null) {
  storeRef.current = createShopStore();
}
```

### Cart + Auth persist у localStorage

`zustand/persist` зберігає cart і auth token між сесіями. `partialize` визначає що саме зберігати — тільки необхідне, без UI стану.

### Order — Snapshot підхід

`cartToOrderItems()` в `lib/orders.ts` конвертує cart items у snapshot перед відправкою. Бекенд зберігає назву, ціну, модифікатори на момент замовлення — не ref. Якщо ціна зміниться завтра, стара histórica залишається коректною.

### i18n — cookie-based без URL prefix

Локаль зберігається в cookie `locale`. `i18n/request.ts` читає її server-side. Перемикання мови: `LanguageSwitcher` пише cookie → `router.refresh()` → Server Components перерендеряться з новою локаллю. Без `/uk/`, `/en/` в URL.

### Polling замість WebSocket

`/my-orders` оновлює статуси замовлень кожні 30 секунд через `setInterval`. Простіше WebSocket, достатньо для відстеження статусу піци. Cleanup через `clearInterval` в `useEffect` return.

### `ThemeProvider` — окремий `"use client"` компонент

MUI `ThemeProvider` використовує React Context — тільки client-side. Виноситься в `providers/theme-provider.tsx` щоб `layout.tsx` залишався Server Component і уникнути hydration mismatch.

---

## i18n

Підтримувані мови: **Ukrainian** (default), **English**, **Russian**.

Файли перекладів: `messages/{uk,en,ru}.json`

Структура ключів:
```
header.*       — хедер, кнопки навігації
basket.*       — кошик
login.*        — форма входу / реєстрації
product.*      — картка продукту, кнопки
order.*        — сторінка оформлення
myOrders.*     — сторінка "Мої замовлення"
orderStatuses.*— статуси замовлень
category.*     — сторінка категорії
footer.nav.*   — посилання в футері
breadcrumbs.*  — хлібні крихти
carousel.*     — alt тексти слайдів
```

Щоб додати нову мову:
1. Додай `"pl"` в `i18n/config.ts` → `locales`
2. Створи `messages/pl.json` (скопіюй `en.json` і переклади)
3. Додай `"pl": "POL"` в `localeLabels`

---

## Key Conventions

- **Ніяких `any`** — всі типи в `types/product.ts`
- **Тільки `next/image`** — ніяких bare `<img>`; завжди з `sizes` атрибутом
- **Стабільні `key` props** — `cartItemId`, `_id`, ніколи array index
- **MUI overrides через `sx`** — ніяких `.css-xxxx-MuiPaper...` в globals.css
- **Scroll listener** — через `requestAnimationFrame`, не raw event
- **`"use client"` тільки коли потрібно** — browser API або interactivity

---

## Scripts

```bash
pnpm dev          # Turbopack dev server
pnpm build        # Production build
pnpm start        # Serve production build
pnpm lint         # ESLint
pnpm type-check   # TypeScript без emit
```

---

## Contributing

```bash
pnpm lint
pnpm type-check
```

1. Branch off `main`
2. Server Component за замовчуванням — `"use client"` тільки якщо є реальна причина
3. Нові тексти — тільки через `useTranslations` / `getTranslations`, ніяких хардкодованих рядків
4. Нові сторінки — додай breadcrumbs і metadata
