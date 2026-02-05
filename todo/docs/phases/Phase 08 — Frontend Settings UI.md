

# Phase 08 — Frontend Settings UI (رابط کاربری تنظیمات)

## 0) هدف فاز
هدف این فاز پیاده‌سازی **رابط کاربری تنظیمات کاربر** در فرانت‌اند وب است، به‌طوری که کاربر لاگین‌شده بتواند تنظیمات شخصی خود را مشاهده و ویرایش کند و این تغییرات به API تنظیمات بک‌اند (Phase 05) متصل باشند.

در پایان این فاز باید:
- صفحه Settings در UI وب ساخته شده باشد
- تنظیمات از بک‌اند خوانده شوند
- تغییرات در بک‌اند ذخیره شوند
- UI مطابق `UI_DESIGN_RULES_WEB.fa.md` باشد
- build و smoke test PASS شوند

---

## 1) Scope فاز
- پیاده‌سازی صفحه Settings در فرانت‌اند
- اتصال به APIهای Settings:
  - `GET /settings`
  - `PUT /settings`
- نمایش و ویرایش تنظیمات حداقلی:
  - locale
  - timezone
  - weekStartsOn
- استفاده از کامپوننت‌های reusable و Token-based
- مدیریت state و loading/error

---

## 2) Out of Scope
- تنظیمات پیشرفته (Notification, Reminder)
- Feature Flags
- Analytics Settings
- Theme switching (Light/Dark)

---

## 3) قوانین UI و UX (الزامی)
- قبل از شروع، سند `docs/UI_DESIGN_RULES_WEB.fa.md` مطالعه و رعایت شود.
- طراحی Web-first و Responsive.
- صفحه Settings باید **مینیمال، تمیز و بدون شلوغی** باشد.
- تمام رنگ‌ها، فونت‌ها، spacing و radius فقط از Design Tokens استفاده کنند.
- متن‌ها فعلاً فارسی و راست‌چین باشند.

---

## 4) مسیر و صفحه (Route)
- مسیر پیشنهادی:
  - `/settings`
- این صفحه باید:
  - تحت Guard لاگین (Phase 06) باشد
  - از Sidebar قابل دسترسی باشد

---

## 5) ساختار پیشنهادی کامپوننت‌ها
Cursor باید این کامپوننت‌ها را بسازد یا تکمیل کند:

- `SettingsForm`
- `Select`
- `RadioGroup` یا `SegmentedControl`
- `SaveButton` (Primary CTA)
- `SectionCard` (برای بخش‌بندی تنظیمات)

همه کامپوننت‌ها باید reusable و Token-based باشند.

---

## 6) رفتار UI (Screen Behavior)

### 6.1 Load اولیه
- هنگام load صفحه:
  - call `GET /settings`
  - نمایش loading state
  - پس از دریافت داده → پر شدن فرم

### 6.2 ویرایش تنظیمات
- کاربر بتواند مقادیر را تغییر دهد:
  - locale (Select)
  - timezone (Select یا Input ساده)
  - weekStartsOn (Radio یا Select)
- CTA: «ذخیره تنظیمات»

### 6.3 ذخیره
- submit → call `PUT /settings`
- هنگام submit:
  - disable دکمه
  - نمایش loading
- در صورت موفقیت:
  - نمایش feedback ملایم (مثلاً پیام موفقیت)
- در صورت خطا:
  - نمایش پیام خطای دوستانه

---

## 7) API و مدیریت خطا
- تمام درخواست‌ها با `credentials: 'include'`
- اگر پاسخ 401 بود:
  - redirect به login
- اگر 400 یا 500:
  - نمایش پیام خطا در UI

---

## 8) Smoke Tests / Gate این فاز
Cursor باید بعد از پیاده‌سازی این مراحل را اجرا و لاگ ارائه کند:

### 8.1 Build
```bash
docker compose up -d --build frontend
```

### 8.2 سناریوهای Smoke (حداقل)
1) Login
2) رفتن به /settings
3) Load تنظیمات از API
4) تغییر یک مقدار (مثلاً weekStartsOn)
5) Save → موفق
6) Refresh صفحه → مقدار جدید باقی مانده باشد

### 8.3 لاگ‌ها
```bash
docker compose logs --tail=200 frontend
```

(در صورت نیاز)
```bash
docker compose logs --tail=200 backend
```

---

## 9) معیار Done شدن فاز
این فاز Done است اگر:
- صفحه Settings ساخته شده باشد
- اتصال به API کامل باشد
- تغییرات ذخیره و بازیابی شوند
- UI مطابق Design Rules باشد
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
**مرحله بعد (پس از تأیید):** Phase 09 — Frontend Analytics UI