# CURSOR_RULES — قوانین اجرای پروژه Todo Smart (وب، Docker-based)

## 0) هدف این فایل
این فایل برای هدایت Cursor نوشته شده تا پروژه را **مرحله‌ای، قابل تست، و بدون دخالت دستی توسعه‌دهنده** تولید کند.  
قانون اصلی: **Cursor باید همه فایل‌ها و زیرساخت‌ها را خودش بسازد؛ انسان فقط تأیید می‌دهد.**

---

## 1) قوانین سخت (Must)
### 1.1 فقط تولید فایل‌ها و اجرای فازها
- Cursor باید **همه فایل‌های لازم** برای هر فاز را ایجاد/ویرایش کند (Dockerfileها، docker-compose، env.example، کدها، تست‌ها، README).
- انسان **هیچ فایل جدیدی** به صورت دستی ایجاد نمی‌کند.

### 1.2 فازبندی اجباری + Gate
Cursor فقط مجاز است **یک فاز** را در هر نوبت اجرا کند و در پایان همان فاز متوقف شود.

در پایان هر فاز Cursor باید:
1) دستورهای اجرا (command) را ارائه کند
2) تست‌های همان فاز را اجرا کند
3) لاگ خروجی را به صورت کامل ارائه کند
4) وضعیت را اعلام کند: PASS/FAIL
5) منتظر تأیید انسان بماند

بدون تأیید انسان (کلمه «اوکی») ورود به فاز بعدی ممنوع است.

### 1.3 عدم Hardcode
- هیچ URL یا Secret یا پورت یا Credential نباید hardcode شود.
- همه چیز باید از `.env` خوانده شود.
- فایل `.env` داخل git نباید commit شود.
- حتماً `.env.example` ساخته شود.

### 1.4 Docker-first
- اجرای پروژه باید با یک دستور ممکن باشد:
  - `docker compose up -d --build`
- هر سرویس باید Dockerfile مستقل داشته باشد.
- Backend و Frontend باید در کانتینر اجرا شوند.

### 1.5 استاندارد خروجی
- خروجی هر فاز باید قابل بازتولید باشد.
- هر فاز باید در README به‌روز شود.

---

## 2) قوانین کیفیت کد (Quality)
### 2.1 TypeScript و ساختار
- Backend و Frontend هر دو TypeScript باشند.
- ساختار ماژولار Backend رعایت شود: `auth`, `tasks`, `analytics`.

### 2.2 Error Handling
- Backend باید error handling مرکزی داشته باشد.
- خطاها باید پیام قابل فهم و status code درست بدهند.

### 2.3 Validation
- ورودی‌های API با Zod (یا معادل) validate شوند.

### 2.4 Logging
- لاگ‌ها باید شامل:
  - شروع سرویس
  - خطاها
  - درخواست‌های مهم
باشد.

---

## 3) قوانین UI (Web-first، مبتنی بر UI Design Rules)

### 3.1 منبع حقیقت UI
- منبع حقیقت طراحی UI سند `docs/UI_DESIGN_RULES_WEB.fa.md` است.
- Cursor موظف است قبل از پیاده‌سازی Frontend این سند را کامل مطالعه کند.
- هیچ تصمیم طراحی خارج از این سند مجاز نیست.

### 3.2 Scope پیاده‌سازی UI در هر فاز
- UI باید **فازبه‌فاز** و فقط در محدوده همان فاز پیاده‌سازی شود.
- پیاده‌سازی UI کامل فقط در فازهای Frontend مجاز است.
- در فازهای Backend یا Database، فقط اسکلت یا placeholder در صورت نیاز مجاز است.

### 3.3 اصول طراحی UI
- طراحی Web-first و Responsive
- Layout مبتنی بر Top Bar، Sidebar و Main Content
- استفاده اجباری از Design Tokens برای:
  - Color
  - Typography
  - Spacing
  - Radius
- عدم Hardcode شدن هرگونه مقدار بصری
- استفاده از کامپوننت‌های قابل استفاده مجدد (Reusable Components)

---

## 4) تست و گزارش‌دهی (Tests & Logs)
### 4.1 فاز DB
- healthcheck DB باید PASS شود.
- اجرای migration اولیه باید PASS شود.

### 4.2 فاز Backend
- تست smoke باید شامل:
  - register
  - login
  - create task
  - list tasks
باشد.
- خروجی تست‌ها + نمونه curl ارائه شود.

### 4.3 فاز Frontend
- `npm run build` باید PASS شود.
- حداقل یک smoke دستی/اسکریپتی برای Login و نمایش Taskها ارائه شود.

---

## 5) ترتیب اجرای فازها (Execution Order)

Cursor باید دقیقاً به این ترتیب جلو برود و هر فاز را از روی فایل مستقل همان فاز اجرا کند:

### Phase 01 — Bootstrap
- فقط زیرساخت، بدون منطق اپلیکیشن
- Docker / docker-compose / env / healthcheck

### Phase 02 — Database Schema
- PostgreSQL
- Prisma schema (User, Task, UserSettings)
- Migration

### Phase 03 — Backend Core & Auth
- Backend پایه
- Auth (Register / Login / Logout / Refresh)

### Phase 04 — Backend Task Management
- CRUD کامل Task
- Status و Reschedule

### Phase 05 — Frontend Auth & Layout
- Layout وب (Top Bar + Sidebar)
- صفحات Login / Register

### Phase 06 — Frontend Task UI
- Home / Task List
- Add / Edit / Detail Task

### Phase 07 — Settings
- Settings کاربر (حداقلی)
- ذخیره در دیتابیس

### Phase 08 — Analytics (Post-MVP)
- Dashboard و گزارش‌ها

---

## 6) تعریف Done برای هر فاز
هر فاز زمانی Done است که:
- فایل‌ها ساخته شده باشند
- docker build موفق باشد
- تست‌ها PASS باشد
- لاگ‌ها ارائه شده باشد
- و انسان «اوکی» کرده باشد

---

## 7) قرارداد خروجی Cursor در پایان هر فاز
Cursor باید در پایان هر فاز این قالب را ارائه کند:

- **فاز انجام‌شده:**
- **لیست فایل‌های ایجاد/ویرایش‌شده:**
- **دستور اجرا:**
- **تست‌های اجراشده:**
- **نتیجه تست:** PASS/FAIL
- **لاگ‌ها:** (کامل)
- **مرحله بعد:** منتظر تأیید

---

**وضعیت سند:** به‌روز شده پس از بازنگری معماری و UI Web  
**مرحله بعدی:** نوشتن `docs/phases/phase-01-bootstrap.fa.md`