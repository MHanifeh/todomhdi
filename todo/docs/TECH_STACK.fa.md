

# سند Tech Stack — پروژه Todo Smart (وب، Docker-based)

## 1. هدف این سند
این سند مشخص می‌کند برای پیاده‌سازی سریع، قابل‌دپلوی و قابل‌گسترش Todo Smart چه تکنولوژی‌هایی استفاده می‌شود و چرا.  
تمرکز اصلی:
- **سرعت لانچ (MVP سریع)**
- **سادگی دپلوی با Docker**
- **قابل نگهداری بودن (Maintainability)**
- **جداسازی کامل سرویس‌ها (DB / Backend / Frontend)**

---

## 2. معماری کلان (High-Level Architecture)
پروژه از سه سرویس مستقل تشکیل می‌شود:
1) **Database Server**: ذخیره‌سازی داده‌ها (PostgreSQL)
2) **Backend API Server**: واسط امن بین فرانت و دیتابیس + احراز هویت
3) **Frontend Web Server**: رابط کاربری وب

ارتباط‌ها:
- Frontend ↔ Backend: فقط HTTP API
- Backend ↔ Database: فقط از طریق ORM و اتصال داخلی Docker network

---

## 3. Database Server
### 3.1 تکنولوژی
- **PostgreSQL (در Docker)**

### 3.2 دلیل انتخاب
- پایدار و استاندارد برای پروژه‌های چندکاربره
- پشتیبانی عالی از ارتباط‌ها (Relations) و گزارش‌گیری
- ابزارهای زیاد برای بکاپ/ریستور و مانیتورینگ

### 3.3 اصول پیاده‌سازی
- اجرای DB با `docker compose`
- استفاده از **Volume** برای نگهداری داده‌ها
- **Healthcheck** برای اطمینان از بالا آمدن DB
- تنظیمات اتصال فقط از طریق `.env`

---

## 4. Backend API Server
### 4.1 تکنولوژی
- **Node.js (LTS) + TypeScript**
- **Fastify** (وب‌فریم‌ورک)
- **Prisma** (ORM + Migrations)
- **Zod** (Validation)

### 4.2 دلیل انتخاب
- Fastify سبک و سریع است و برای API مناسب
- Prisma ساخت دیتابیس و migration را سریع و Type-safe می‌کند
- TypeScript خطاهای runtime را کاهش می‌دهد و توسعه را امن‌تر می‌کند

### 4.3 احراز هویت (Auth)
مدل احراز هویت پیشنهادی برای MVP:
- **JWT Access Token** کوتاه‌مدت
- **Refresh Token** بلندمدت
- ذخیره توکن‌ها در **HttpOnly Cookie** (امن‌تر از LocalStorage)

Endpointهای اصلی Auth:
- `POST /auth/register`
- `POST /auth/login`
- `POST /auth/logout`
- `POST /auth/refresh`

### 4.4 اصول امنیتی
- Password hashing با **bcrypt**
- Rate limiting (در فاز بعدی اگر لازم شد)
- CORS فقط برای دامنه/آدرس Frontend
- عدم Hardcode شدن Secretها

### 4.5 Logging و Observability
- لاگ ساخت‌یافته (JSON-friendly)
- لاگ درخواست‌ها و خطاها
- در هر فاز: خروجی لاگ تست باید ارائه شود

### 4.6 تست Backend
- **Vitest** برای unit/integration
- **Supertest** برای تست API
- تست smoke برای:
  - ثبت‌نام
  - ورود
  - ایجاد تسک
  - دریافت لیست تسک‌ها

---

## 5. Frontend Web Server
### 5.1 تکنولوژی
- **Next.js (TypeScript)**
- **React**
- **CSS Tokens / Theme** (توکن‌محور)

### 5.2 دلیل انتخاب
- توسعه سریع صفحات و routing
- امکان SSR/SEO در آینده (در صورت نیاز)
- ساخت و دپلوی ساده با Docker

### 5.3 پیاده‌سازی UI مطابق Figma
- UI باید بر اساس **اسکرین‌شات‌های Figma** عیناً پیاده‌سازی شود
- تا حد امکان کامپوننت‌ها reusable ساخته شوند
- رنگ‌ها، فاصله‌ها، radius و فونت‌ها **توکن‌محور** باشند
- تمام متن‌ها فعلاً فارسی و راست‌چین

### 5.4 State و Data Fetching
برای MVP پیشنهاد:
- **TanStack Query (React Query)** برای مدیریت درخواست‌ها و cache

(در صورت سادگی زیاد می‌توان فقط fetch ساده استفاده کرد، ولی React Query برای سرعت توسعه بهتر است.)

### 5.5 تست Frontend
در MVP حداقل:
- `npm run build` باید بدون خطا باشد
- تست smoke دستی: Login → مشاهده لیست → ساخت Task

در فاز بعدی:
- **Playwright** برای E2E

---

## 6. Docker و محیط اجرا
### 6.1 ابزار
- **Docker**
- **docker compose**

### 6.2 اصول
- هر سرویس Dockerfile مستقل دارد
- شبکه داخلی compose برای ارتباط امن سرویس‌ها
- Port mapping فقط برای Frontend و Backend
- DB فقط داخلی (در حالت لوکال می‌توان پورت داد، ولی پیش‌فرض داخلی)

### 6.3 فایل‌های env
- `.env` برای لوکال (در git نباشد)
- `.env.example` برای نمونه

کلیدهای مهم env:
- `DATABASE_URL`
- `BACKEND_PORT`
- `FRONTEND_PORT`
- `JWT_ACCESS_SECRET`
- `JWT_REFRESH_SECRET`
- `CORS_ORIGIN`

---

## 7. استانداردهای کدنویسی و ساختار
- TypeScript strict روشن
- فولدر‌بندی ماژولار در Backend (auth/tasks/analytics)
- جداسازی config از logic
- عدم Hardcode شدن:
  - URLها
  - Secretها
  - رنگ/فونت/spacing

---

## 8. تصمیمات آینده (پس از MVP)
- Reverse proxy با **Nginx** (اختیاری)
- CI/CD (GitHub Actions)
- نوتیفیکیشن‌ها (وب: ایمیل/Push/cron)
- تحلیل پیشرفته + نمودار

---

**وضعیت سند:** نسخه اولیه  
**مرحله بعدی:** تعریف Cursor Rules و سپس Flow/Phases