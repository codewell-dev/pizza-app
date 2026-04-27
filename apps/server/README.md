
# 🍕 Pizza House Backend

Backend для повнофункціонального онлайн-сервісу замовлення піци **Pizza House**, побудований на сучасному стеку Node.js з використанням **NestJS** та бази даних **MongoDB**.  
Проєкт створений для реального застосування: управління товарами, категоріями, модифікаторами, замовленнями та користувачами.

---

## 🚀 Функціонал

- 🔐 **JWT авторизація та аутентифікація**
- 👤 Система користувачів (реєстрація, вхід, доступ до захищених маршрутів)
- 🍕 Управління товарами (CRUD)
- 🏷 Управління категоріями та модифікаторами
- 🧾 Робота з замовленнями (створення, зберігання, статус)
- 🧩 Валідація запитів `class-validator`
- 🗄 Зберігання даних у **MongoDB (Mongoose)**

---

## 🧱 Технології

| Технологія | Використання |
|-----------|--------------|
| NestJS | Backend framework |
| MongoDB + Mongoose | База даних |
| JWT + Passport | Аутентифікація |
| Bcrypt | Хешування паролів |
| TypeScript | Статична типізація |
| Jest | Тестування |

---

## 📁 Архітектура проєкту

```

src/
┣ auth/
┃ ┣ auth.controller.ts
┃ ┣ auth.service.ts
┃ ┣ auth.module.ts
┃ ┣ auth.guard.ts
┃ ┗ constants.ts
┣ app.controller.ts
┣ app.service.ts
┣ app.module.ts
┗ main.ts

````

---

## 🔐 Аутентифікація

Проєкт використовує **JWT Strategy** через `passport-jwt`.

Механіка:

1. Користувач реєструється або входить.
2. Сервер генерує токен на основі `USER_ID`.
3. Для захищених ендпоінтів використовується `@UseGuards(AuthGuard)`.

```ts
Authorization: Bearer <token>
````

---

## 🗄️ База даних (MongoDB)

* Users
* Products
* Categories
* GroupModifiers
* Orders

Кожен документ має унікальну структуру з використанням схем `Mongoose`.

---

## 📦 Запуск проєкту

### 1️⃣ Встановлення залежностей

```sh
npm install
```

### 2️⃣ Налаштування змінних середовища

Створити `.env`:

```env
MONGO_URI=mongodb://localhost:27017/pizza-house
JWT_SECRET=your-secret-key
PORT=5000
```

### 3️⃣ Запуск у режимі розробки

```sh
npm run start:dev
```

### 4️⃣ Продукційний запуск

```sh
npm run build
npm run start:prod
```

---

## 🧪 Тестування

```sh
npm run test
```

---

## 📍 API (коли немає Swagger)

| Method | Route            | Description                     |
| ------ | ---------------- | ------------------------------- |
| `POST` | `/auth/register` | Реєстрація                      |
| `POST` | `/auth/login`    | Авторизація                     |
| `GET`  | `/products`      | Список продуктів                |
| `POST` | `/products`      | Створення продукту (protected)  |
| `GET`  | `/orders`        | Отримання замовлень (protected) |

---

## 🧩 TODO / Roadmap

* [ ] Swagger Documentation
* [ ] RBAC (Roles & Permissions)
* [ ] Payments integration (Stripe/LiqPay)
* [ ] WebSockets (Live order tracking)

---

## 👨‍💻 Автор

```
Vladyslav — Full-Stack JS Developer  
React | Next.js | NestJS | MongoDB | TypeScript
```

🔗 GitHub: [https://github.com/codewell-dev](https://github.com/codewell-dev)
🧩 Open Source Contributor


