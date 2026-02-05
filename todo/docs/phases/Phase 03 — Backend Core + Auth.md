

# Phase 03 — Backend Core + Auth (هسته بک‌اند و احراز هویت)

## 0) هدف فاز
هدف این فاز راه‌اندازی بک‌اند به‌صورت یک سرویس API پایدار، امن و Dockerized است که بتواند:
- به دیتابیس (Phase 02) متصل شود
- احراز هویت چندکاربره را پیاده‌سازی کند
- پایه فنی لازم برای فازهای بعدی (Task Management) را فراهم کند

در پایان این فاز:
- Backend باید بالا بیاید
- Auth به‌طور کامل کار کند
- تست‌ها PASS شوند
- لاگ‌ها ارائه شوند

---

## 1) Scope فاز
- راه‌اندازی Backend با Node.js + TypeScript + Fastify
- اتصال Prisma به PostgreSQL از طریق `DATABASE_URL`
- پیاده‌سازی احراز هویت:
  - Register
  - Login
  - Logout
  - Refresh Token
  - Get Current User (Me)
- استفاده از JWT (Access / Refresh)
- ذخیره توکن‌ها در HttpOnly Cookie
- پیاده‌سازی middleware احراز هویت
- تست‌های smoke و integration برای Auth

---

## 2) Out of Scope
- CRUD وظایف (Phase 04)
- Analytics
- Reminder
- Frontend / UI

---

## 3) تصمیمات کلیدی احراز هویت (Auth Design)

### 3.1 مدل توکن
- Access Token کوتاه‌مدت (مثلاً 15 دقیقه)
- Refresh Token بلندمدت (مثلاً 7 تا 30 روز)

### 3.2 محل نگهداری توکن
- فقط HttpOnly Cookie
- تنظیمات Cookie:
  - `httpOnly: true`
  - `sameSite: lax` (dev)
  - `secure: true` فقط در production

### 3.3 Refresh Token
- Refresh Token باید به صورت **هش‌شده در دیتابیس** ذخیره شود
- هنگام logout یا refresh نامعتبر شود

### 3.4 رمز عبور
- هش کردن با `bcrypt`
- ذخیره فقط `passwordHash`

---

## 4) ساختار پوشه‌بندی Backend (الزامی)

```text
services/backend/src
├── index.ts
├── app.ts
├── config/
│   ├── env.ts
│   └── constants.ts
├── plugins/
│   ├── prisma.ts
│   └── auth.ts
├── modules/
│   ├── auth/
│   │   ├── auth.routes.ts
│   │   ├── auth.service.ts
│   │   └── auth.schemas.ts
│   └── users/
│       ├── users.service.ts
│       └── users.schemas.ts
├── common/
│   ├── errors.ts
│   ├── reply.ts
│   └── logger.ts
```

---

## 5) Environment Variables (الزامی)
در `.env.example` (یا تکمیل آن):

- `DATABASE_URL`
- `BACKEND_PORT`
- `NODE_ENV`
- `JWT_ACCESS_SECRET`
- `JWT_REFRESH_SECRET`
- `JWT_ACCESS_TTL_MIN`
- `JWT_REFRESH_TTL_DAYS`
- `CORS_ORIGIN`
- `COOKIE_SECURE`
- `COOKIE_SAMESITE`

هیچ مقدار Secret نباید hardcode شود.

---

## 6) API Contract

### Health
- `GET /health` → `{ "status": "ok" }`

### Auth Endpoints
- `POST /auth/register`
- `POST /auth/login`
- `POST /auth/logout`
- `POST /auth/refresh`
- `GET /auth/me` (Protected)

### Status Codes
- 200 / 201: موفق
- 400: خطای اعتبارسنجی
- 401: عدم احراز هویت
- 403: عدم دسترسی
- 409: ایمیل تکراری

---

## 7) Validation
- تمام ورودی‌ها با Zod اعتبارسنجی شوند
- پیام خطاها واضح و کوتاه باشند

---

## 8) CORS و Cookie
- CORS فقط برای `CORS_ORIGIN`
- `credentials: true` فعال باشد

---

## 9) تست‌های الزامی (Gate)

### 9.1 اجرا
```bash
docker compose up -d --build database backend
```

### 9.2 اجرای تست‌ها
```bash
docker compose run --rm backend npm test
```

### 9.3 سناریوهای تست Auth
1) Register کاربر جدید → 201
2) Register ایمیل تکراری → 409
3) Login صحیح → 200
4) Login غلط → 401
5) Me بدون cookie → 401
6) Me با cookie → 200
7) Logout → cookie حذف شود

### 9.4 لاگ‌ها
```bash
docker compose logs --tail=200 backend
```

---

## 10) معیار Done شدن فاز
این فاز Done است اگر:
- Backend بدون خطا اجرا شود
- اتصال به DB برقرار باشد
- Auth کامل کار کند
- تست‌ها PASS باشند
- لاگ‌ها ارائه شوند
- تأیید انسان («اوکی») دریافت شود

---

## 11) خروجی الزامی Cursor
- لیست فایل‌های ساخته/ویرایش‌شده
- دستورهای اجراشده
- نتیجه تست‌ها
- لاگ کامل
- توقف و انتظار برای تأیید

---

**وضعیت فاز:** آماده اجرا  
**مرحله بعد (پس از تأیید):** Phase 04 — Backend Task Management