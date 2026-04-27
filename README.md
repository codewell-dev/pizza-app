# 🍕 Pizza House — Monorepo

Fullstack monorepo: **Next.js 16** (client) + **NestJS 11** (server) + **MongoDB Atlas**

Організований як **pnpm workspace** — один корінь, два застосунки.

```
pizza-house/
├── apps/
│   ├── client/     ← Next.js frontend
│   └── server/     ← NestJS REST API
├── package.json    ← root scripts
├── pnpm-workspace.yaml
├── docker-compose.yml
└── .env.example
```

---

## 🚀 Швидкий старт (локально)

### 1. Встановити pnpm (якщо немає)
```bash
npm install -g pnpm
```

### 2. Клонувати і встановити залежності
```bash
git clone <repo>
cd pizza-house
pnpm install
```

### 3. Налаштувати змінні середовища

**Server:**
```bash
cp .env.example apps/server/.env
# відредагуй apps/server/.env — вкажи MONGODB_URI та JWT_SECRET
```

**Client:**
```bash
# apps/client/.env.local вже є з localhost URLs
# змінюй тільки якщо потрібно інший порт
```

### 4. Запустити обидва сервери
```bash
pnpm dev
```

- Frontend: http://localhost:3000
- Backend API: http://localhost:5000/api
- Swagger: http://localhost:5000/docs

---

## 📦 Production Build

```bash
# Зібрати обидва застосунки
pnpm build

# Запустити production локально
pnpm start
```

---

## 🐳 Docker (рекомендовано для деплою)

### Підготовка
```bash
cp .env.example .env
# відредагуй .env — вкажи реальні MONGODB_URI, JWT_SECRET, ALLOWED_ORIGINS
```

### Запуск
```bash
docker-compose up -d --build
```

### Зупинка
```bash
docker-compose down
```

---

## 🌍 Деплой на production сервер

### Змінні середовища при деплої

| Змінна | Server | Client |
|--------|--------|--------|
| `MONGODB_URI` | ✅ | ❌ |
| `JWT_SECRET` | ✅ | ❌ |
| `PORT` | ✅ | ❌ |
| `ALLOWED_ORIGINS` | ✅ | ❌ |
| `API_URL` (server-side) | ❌ | ✅ |
| `NEXT_PUBLIC_API_URL` | ❌ | ✅ |

> **Важливо:** `NEXT_PUBLIC_API_URL` вшивається у JS bundle під час `build`.
> Тому при зміні домену — потрібно **перезбирати** client.

### Vercel (client) + Railway/Render (server) — популярна схема
1. Деплой `apps/server` → отримуєш URL типу `https://pizza-api.railway.app`
2. Деплой `apps/client` на Vercel → вказуєш env:
   ```
   NEXT_PUBLIC_API_URL=https://pizza-api.railway.app
   API_URL=https://pizza-api.railway.app
   ```
3. У server `.env` оновлюєш:
   ```
   ALLOWED_ORIGINS=https://your-app.vercel.app
   ```

---

## 🛠 Корисні команди

```bash
# Запустити тільки server
pnpm --filter server start:dev

# Запустити тільки client
pnpm --filter client dev

# Зібрати тільки server
pnpm --filter server build

# Зібрати тільки client
pnpm --filter client build

# Перевірити типи в обох
pnpm type-check

# Lint в обох
pnpm lint

# Додати залежність в конкретний app
pnpm --filter client add axios
pnpm --filter server add @nestjs/schedule
```

---

## 📋 API Endpoints

| Method | URL | Auth | Опис |
|--------|-----|------|------|
| POST | `/api/users` | — | Реєстрація |
| POST | `/api/auth/login` | — | Вхід, повертає JWT |
| GET | `/api/products` | — | Список продуктів |
| GET | `/api/categories` | — | Категорії |
| POST | `/api/orders` | JWT | Створити замовлення |
| GET | `/api/orders/my` | JWT | Мої замовлення |

Повна документація: http://localhost:5000/docs
