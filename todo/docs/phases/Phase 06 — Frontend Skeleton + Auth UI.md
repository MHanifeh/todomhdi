

# Phase 06 — Frontend Skeleton + Auth UI (اسکلت فرانت‌اند + ورود/ثبت‌نام)

## 0) هدف فاز
هدف این فاز راه‌اندازی فرانت‌اند وب به‌صورت Dockerized و پیاده‌سازی **اسکلت UI وب** + جریان **ورود و ثبت‌نام** مطابق سند `docs/UI_DESIGN_RULES_WEB.fa.md` است.

در پایان این فاز باید:
- Frontend بالا بیاید و در مرورگر لود شود
- Layout وب (Top Bar + Sidebar + Main Content) آماده باشد
- صفحات Login/Register ساخته شوند
- اتصال به APIهای Auth بک‌اند انجام شود
- کاربر بتواند ثبت‌نام/ورود کند و سشن با Cookie کار کند
- تست‌ها/اسموک PASS و لاگ ارائه شود

---

## 1) Scope فاز
- راه‌اندازی Next.js + TypeScript (Web-first)
- پیاده‌سازی Design Tokens (رنگ/فونت/spacing/radius) به‌صورت مرکزی
- پیاده‌سازی Layout پایه:
  - Top Bar
  - Sidebar (Home/Tasks/Analytics/Settings)
  - Main Content
- پیاده‌سازی صفحات:
  - Landing (اختیاری ولی پیشنهادی)
  - Login
  - Register
- اتصال به Backend Auth endpoints:
  - `POST /auth/register`
  - `POST /auth/login`
  - `POST /auth/logout` (حداقلی: دکمه خروج)
  - `GET /auth/me` (برای تشخیص لاگین بودن)
- مدیریت session با Cookie (credentials)
- Route protection حداقلی:
  - صفحات داخلی فقط برای کاربران لاگین
  - اگر لاگین نبود → redirect به login

---

## 2) Out of Scope
- UI و منطق Task List/Add/Edit/Detail (Phase 07)
- UI و منطق Settings (Phase 08)
- Analytics UI (Phase 09)
- نوتیفیکیشن و Reminder

---

## 3) قوانین UI (الزامی)
- Cursor باید قبل از شروع، سند `docs/UI_DESIGN_RULES_WEB.fa.md` را بخواند.
- Layout دقیقاً Web-first باشد.
- استفاده از Tokens اجباری است (بدون Hardcode).

---

## 4) ساختار پیشنهادی Frontend (الزامی)
Cursor باید در `services/frontend` ساختار زیر را ایجاد کند:

```text
services/frontend/
  Dockerfile
  package.json
  next.config.*
  src/
    app/ (یا pages/ بسته به Next version)
    components/
      layout/
        AppShell.tsx
        TopBar.tsx
        Sidebar.tsx
      ui/
        Button.tsx
        Card.tsx
        Input.tsx
        Badge.tsx
    design/
      tokens.ts
      theme.ts
    lib/
      api.ts
      auth.ts
    styles/
      globals.css
```

نکته:
- اگر پروژه از App Router استفاده می‌کند، مسیرها مطابق آن ساخته شوند.
- تمام importها باید قابل resolve باشند.

---

## 5) Design Tokens (اجباری)
Cursor باید یک سیستم توکن ایجاد کند که شامل:
- رنگ‌ها (پاستلی مطابق UI rules)
- spacing بر اساس 8pt
- radius گرد
- typography

و تمام کامپوننت‌ها فقط از این توکن‌ها استفاده کنند.

---

## 6) API Client و تنظیمات ارتباط با Backend
### 6.1 تنظیمات env
- `NEXT_PUBLIC_BACKEND_URL`

### 6.2 API Client
- یک wrapper `fetch` یا axios در `src/lib/api.ts` ایجاد شود که:
  - baseURL را از env بگیرد
  - `credentials: 'include'` را فعال کند
  - error handling استاندارد داشته باشد

---

## 7) صفحات و رفتارها

### 7.1 Landing (اختیاری ولی پیشنهادی)
- Hero با gradient پاستلی
- CTA: Login / Register

### 7.2 Register
- فرم: email, password, displayName(optional)
- validation client-side حداقلی
- submit → call `POST /auth/register`
- success → redirect به صفحه داخلی (فعلاً Home placeholder)

### 7.3 Login
- فرم: email, password
- submit → call `POST /auth/login`
- success → redirect

### 7.4 Logout
- دکمه خروج در Top Bar
- call `POST /auth/logout`
- redirect به login

### 7.5 Route Protection
- یک guard ساده:
  - هنگام load صفحات داخلی، `GET /auth/me`
  - اگر 401 → redirect به /login

---

## 8) Smoke Tests / Gate این فاز
Cursor باید بعد از پیاده‌سازی، این مراحل را اجرا و لاگ ارائه کند:

### 8.1 Build و Run
```bash
docker compose up -d --build frontend
```

### 8.2 بررسی لود شدن صفحه
- باز شدن URL فرانت
- نمایش Layout پایه

### 8.3 سناریوهای Smoke (حداقل)
1) Register → موفق
2) Login → موفق
3) Me → تشخیص لاگین بودن
4) Logout → موفق
5) Guard → در حالت logout صفحات داخلی را block کند

### 8.4 لاگ‌ها
```bash
docker compose logs --tail=200 frontend
```

---

## 9) معیار Done شدن فاز
این فاز Done است اگر:
- فرانت بالا بیاید
- Layout پایه پیاده‌سازی شده باشد
- Login/Register کار کنند
- Session cookie کار کند
- Guard عمل کند
- build PASS باشد
- لاگ‌ها ارائه شود
- انسان تأیید کند («اوکی»)

---

## 10) خروجی الزامی Cursor
- لیست فایل‌های ساخته/ویرایش‌شده
- دستورهای اجراشده
- نتیجه smoke/build (PASS/FAIL)
- لاگ کامل
- توقف و انتظار برای تأیید

---

**وضعیت فاز:** آماده اجرا  
**مرحله بعد (پس از تأیید):** Phase 07 — Frontend Task UI