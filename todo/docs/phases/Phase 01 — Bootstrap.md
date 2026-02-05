

# Phase 01 — Bootstrap (زیرساخت پروژه)

## 0) هدف فاز
هدف این فاز ایجاد **اسکلت کامل پروژه** و آماده‌سازی زیرساخت Docker-based است، بدون پیاده‌سازی منطق اپلیکیشن.  
پس از اتمام این فاز، پروژه باید فقط با یک دستور Docker بالا بیاید و تمام سرویس‌ها در حالت سالم (Healthy) باشند.

❗ در این فاز **هیچ منطق بیزنسی، API واقعی یا UI نهایی** پیاده‌سازی نمی‌شود.

---

## 1) Scope فاز (چه چیزهایی داخل این فاز هستند)
- ساخت ساختار فولدرهای پروژه
- راه‌اندازی Docker و docker-compose
- ساخت Dockerfile برای هر سرویس
- تعریف فایل‌های env نمونه
- بالا آوردن سرویس‌ها به‌صورت اسکلت (Skeleton)
- تست سلامت سرویس‌ها

---

## 2) Out of Scope (چه چیزهایی ممنوع است)
- پیاده‌سازی Auth
- پیاده‌سازی Task
- اتصال واقعی Backend به Database
- پیاده‌سازی UI واقعی
- هرگونه Hardcode شدن مقدارها

---

## 3) ساختار پروژه مورد انتظار
Cursor باید ساختار زیر را ایجاد کند (در صورت نیاز جزئیات بیشتر مجاز است، حذف نه):

```text
.
├── docker-compose.yml
├── .env.example
├── README.md
├── services/
│   ├── database/
│   │   └── (postgres related files)
│   ├── backend/
│   │   ├── Dockerfile
│   │   └── src/
│   │       └── index.ts (server bootstrap only)
│   └── frontend/
│       ├── Dockerfile
│       └── (nextjs base structure)
└── docs/
    └── phases/
        └── Phase 01 — Bootstrap.md
```

---

## 4) Database Service (Skeleton)
### الزامات
- استفاده از PostgreSQL
- اجرا داخل Docker
- استفاده از Volume برای دیتا
- تعریف Healthcheck
- تنظیمات فقط از env

### خروجی مورد انتظار
- کانتینر DB بالا بیاید
- وضعیت Healthy داشته باشد
- هنوز هیچ schema یا migration اجرا نشود

---

## 5) Backend Service (Skeleton)
### الزامات
- Node.js + TypeScript
- Fastify (یا minimal HTTP server)
- فقط یک endpoint تست سلامت (Health Check)

مثال endpoint:
- `GET /health` → `{ status: "ok" }`

### خروجی مورد انتظار
- Backend بالا بیاید
- درخواست health پاسخ دهد
- به دیتابیس متصل نشود (فعلاً)

---

## 6) Frontend Service (Skeleton)
### الزامات
- Next.js (TypeScript)
- فقط صفحه پیش‌فرض
- بدون UI نهایی

### خروجی مورد انتظار
- Frontend build شود
- صفحه پیش‌فرض در مرورگر لود شود

---

## 7) Environment Variables
Cursor باید فایل زیر را ایجاد کند:

### `.env.example`
شامل (حداقل):
- `DATABASE_URL`
- `POSTGRES_USER`
- `POSTGRES_PASSWORD`
- `POSTGRES_DB`
- `BACKEND_PORT`
- `FRONTEND_PORT`
- `NODE_ENV`

❗ هیچ مقدار واقعی نباید commit شود.

---

## 8) Docker Compose
### الزامات
- سه سرویس:
  - database
  - backend
  - frontend
- شبکه داخلی مشترک
- وابستگی‌ها به‌درستی تعریف شوند
- Port mapping فقط برای backend و frontend

---

## 9) تست‌های الزامی این فاز (Gate)
Cursor باید پس از ساخت فایل‌ها، این تست‌ها را اجرا و لاگ کامل ارائه کند:

1) Build ایمیج‌ها:
```bash
docker compose build
```

2) بالا آوردن سرویس‌ها:
```bash
docker compose up -d
```

3) بررسی وضعیت:
```bash
docker compose ps
```

4) لاگ‌ها:
```bash
docker compose logs --tail=200
```

---

## 10) معیار Done شدن فاز
این فاز **Done** است اگر و فقط اگر:
- تمام فایل‌ها ساخته شده باشند
- docker compose بدون خطا اجرا شود
- هر سه سرویس Running باشند
- DB در وضعیت Healthy باشد
- لاگ‌ها ارائه شده باشند
- انسان تأیید کند («اوکی»)

---

## 11) خروجی الزامی Cursor در پایان فاز
Cursor باید دقیقاً این موارد را ارائه دهد:
- لیست فایل‌های ساخته/ویرایش‌شده
- دستورهای اجراشده
- نتیجه تست‌ها (PASS / FAIL)
- لاگ کامل
- اعلام توقف و انتظار برای تأیید

---

**وضعیت فاز:** آماده اجرا  
**مرحله بعد (پس از تأیید):** Phase 02 — Database Schema