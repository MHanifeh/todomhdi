

# Phase 02 — Database Schema (طراحی و راه‌اندازی اسکیمای دیتابیس)

## 0) هدف فاز
هدف این فاز راه‌اندازی دیتابیس PostgreSQL در Docker (اگر در فاز ۱ آماده شده) و تعریف **اسکیمای اولیه** برای MVP است، به‌گونه‌ای که Backend در فازهای بعد بتواند روی آن CRUD انجام دهد.

در پایان این فاز باید:
- اسکیمای دیتابیس با ابزار ORM تعریف شده باشد
- migration اولیه ساخته و اجرا شده باشد
- یک تست smoke برای اطمینان از سلامت DB + اجرای migration PASS شود

---

## 1) Scope فاز
- تعریف مدل‌های دیتابیس برای MVP:
  - User
  - Task
  - UserSettings (حداقلی)
- تعریف Enumها برای وضعیت و اهمیت Task
- ساخت migration اولیه
- اجرای migration داخل محیط Docker
- اضافه کردن/تکمیل اسکریپت‌های راه‌اندازی (در صورت نیاز)

---

## 2) Out of Scope
- پیاده‌سازی APIها
- احراز هویت
- UI
- Analytics پیشرفته
- Reminder (فازهای بعد)

---

## 3) تصمیمات اصلی دیتابیس (Design Decisions)
### 3.1 چندکاربره بودن
- تمام Taskها باید با `userId` به User متصل باشند.
- هیچ Task بدون User مجاز نیست.

### 3.2 Settings
- Settings فقط برای هر User و به صورت 1:1 ذخیره می‌شود.
- Settings در MVP حداقلی است و بعداً قابل توسعه است.

---

## 4) تکنولوژی و ابزارها
- PostgreSQL (Docker)
- Prisma ORM + Migrations

> اگر در پروژه از ORM دیگری استفاده شده، Cursor باید مطابق سند TECH_STACK آن را اصلاح کند. پیش‌فرض: Prisma.

---

## 5) اسکیمای پیشنهادی (Minimum Viable Schema)

### 5.1 Enumها
#### TaskStatus
- DONE
- NOT_DONE
- DELAYED

#### TaskImportance
- LOW
- MEDIUM
- HIGH
- CRITICAL

---

### 5.2 جدول User
فیلدهای پیشنهادی:
- `id` (UUID)
- `email` (unique)
- `passwordHash`
- `displayName` (اختیاری)
- `createdAt`
- `updatedAt`

---

### 5.3 جدول Task
فیلدهای پیشنهادی:
- `id` (UUID)
- `userId` (FK → User)
- `title`
- `description` (اختیاری)
- `deadlineAt` (timestamp)
- `status` (enum)
- `importance` (enum)
- `createdAt`
- `updatedAt`

قوانین:
- index روی `userId`
- index روی `deadlineAt`

---

### 5.4 جدول UserSettings (حداقلی)
فیلدهای پیشنهادی:
- `id` (UUID)
- `userId` (FK → User, unique)
- `locale` (پیش‌فرض: fa-IR)
- `timezone` (پیش‌فرض: Asia/Tehran یا قابل تنظیم)
- `weekStartsOn` (0 یا 1)
- `createdAt`
- `updatedAt`

---

## 6) الزامات ساخت فایل‌ها (Cursor باید بسازد)
Cursor باید حداقل این موارد را ایجاد کند:
- `services/backend/prisma/schema.prisma`
- `services/backend/prisma/migrations/*` (بعد از migrate)
- اسکریپت‌های npm لازم در backend:
  - `prisma:generate`
  - `prisma:migrate:dev` یا `prisma:migrate:deploy`

نکته:
- اتصال DB فقط از طریق `DATABASE_URL` در env
- هیچ credential داخل کد نباشد

---

## 7) اجرای Migration داخل Docker
Cursor باید migration را طوری تنظیم کند که با docker compose قابل اجرا باشد.

پیشنهاد جریان:
- یک command در backend container یا یک service کوتاه‌عمر برای migration
- یا اجرای `prisma migrate deploy` در startup backend (فقط در dev)

Cursor باید یکی را انتخاب کند و دقیقاً توضیح دهد چرا.

---

## 8) تست‌های الزامی این فاز (Gate)
Cursor باید پس از پیاده‌سازی، این موارد را اجرا و لاگ کامل ارائه کند:

1) بالا آوردن DB:
```bash
docker compose up -d database
```

2) اجرای migration:
```bash
docker compose run --rm backend npm run prisma:migrate
```

3) بررسی وضعیت سرویس‌ها:
```bash
docker compose ps
```

4) تست اتصال (Smoke):
- یک اسکریپت ساده در backend که به DB وصل شود و یک query سبک انجام دهد (مثلاً count از جدول‌ها)
- اجرای اسکریپت و ارائه خروجی

5) لاگ‌ها:
```bash
docker compose logs --tail=200 database
```

---

## 9) معیار Done شدن فاز
این فاز Done است اگر و فقط اگر:
- schema.prisma تعریف شده باشد
- migration ساخته و اجرا شده باشد
- DB healthy باشد
- تست smoke PASS باشد
- لاگ‌ها ارائه شود
- انسان تأیید کند («اوکی»)

---

## 10) خروجی الزامی Cursor در پایان فاز
- لیست فایل‌های ساخته/ویرایش‌شده
- دستورهای اجراشده
- نتیجه تست‌ها (PASS/FAIL)
- لاگ کامل
- توقف و انتظار برای تأیید

---

**وضعیت فاز:** آماده اجرا  
**مرحله بعد (پس از تأیید):** Phase 03 — Backend Core & Auth