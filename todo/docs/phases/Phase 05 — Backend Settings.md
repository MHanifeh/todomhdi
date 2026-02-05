

# Phase 05 — Backend Settings (تنظیمات کاربر)

## 0) هدف فاز
هدف این فاز پیاده‌سازی **تنظیمات کاربر (User Settings)** در بک‌اند است، به‌گونه‌ای که هر کاربر بتواند تنظیمات شخصی خود را ذخیره و بازیابی کند و این تنظیمات در تمام سشن‌ها پایدار باشد.

در پایان این فاز:
- API تنظیمات کاربر آماده است
- داده‌ها به‌صورت 1:1 به User متصل هستند
- تست‌های Settings PASS می‌شوند
- هیچ منطق UI پیاده‌سازی نمی‌شود

---

## 1) Scope فاز
- پیاده‌سازی ماژول Settings در Backend
- خواندن و ویرایش تنظیمات کاربر لاگین‌شده
- استفاده از جدول `UserSettings` (تعریف‌شده در Phase 02)
- اعمال Default Values در صورت نبود تنظیمات
- تست‌های Integration برای Settings API

---

## 2) Out of Scope
- UI تنظیمات (Phase 07 Frontend)
- Notification / Reminder واقعی
- Analytics
- Feature flags پیشرفته

---

## 3) تصمیمات کلیدی (Design Decisions)

### 3.1 مالکیت داده
- هر User دقیقاً **یک Settings** دارد.
- Settings بدون User معتبر نیست.

### 3.2 رفتار در اولین ورود
- اگر کاربر Settings نداشته باشد:
  - Backend باید به‌صورت خودکار یک Settings با مقدار پیش‌فرض بسازد
  - یا هنگام اولین `GET /settings` آن را ایجاد کند

### 3.3 حداقلی بودن
Settings در MVP فقط شامل موارد زیر است:
- locale
- timezone
- weekStartsOn

---

## 4) ساختار ماژول Settings (الزامی)
Cursor باید در مسیر زیر ماژول Settings را ایجاد کند:

```text
services/backend/src/modules/settings
├── settings.routes.ts
├── settings.service.ts
└── settings.schemas.ts
```

و این ماژول باید در app اصلی register شود.

---

## 5) API Contract

تمام endpointها **Protected** هستند (نیازمند Auth).

### 5.1 Get Settings
- `GET /settings`
- Behavior:
  - اگر Settings وجود داشت → بازگرداندن
  - اگر وجود نداشت → ایجاد با default و بازگرداندن
- Response: 200
```json
{
  "locale": "fa-IR",
  "timezone": "Asia/Tehran",
  "weekStartsOn": 6
}
```

---

### 5.2 Update Settings
- `PUT /settings`
- Body (partial allowed):
```json
{
  "locale": "fa-IR",
  "timezone": "Asia/Tehran",
  "weekStartsOn": 0
}
```

- Response: 200 + settings جدید

---

## 6) Validation Rules (Zod)
- locale: string معتبر (مثلاً `fa-IR`)
- timezone: string معتبر
- weekStartsOn: فقط 0 تا 6
- Body می‌تواند partial باشد

---

## 7) Error Handling
- 400: خطای validation
- 401: بدون احراز هویت
- 500: خطای سرور

---

## 8) تست‌های الزامی این فاز (Gate)

### 8.1 بالا آوردن سرویس‌ها
```bash
docker compose up -d --build database backend
```

### 8.2 اجرای تست‌ها
```bash
docker compose run --rm backend npm test
```

### 8.3 سناریوهای تست (حداقل)
1) بدون Auth → GET /settings → 401
2) با Auth، بدون Settings موجود → GET /settings → 200 + default ساخته شود
3) Update Settings → 200 و تغییرات ذخیره شود
4) Get Settings بعد از Update → مقادیر جدید برگردد
5) Cross-user:
   - user2 نباید settings user1 را ببیند یا تغییر دهد

### 8.4 لاگ‌ها
```bash
docker compose logs --tail=200 backend
```

---

## 9) معیار Done شدن فاز
این فاز Done است اگر:
- Settings API پیاده‌سازی شده باشد
- تنظیمات به‌درستی به User متصل باشد
- Default behavior درست کار کند
- تست‌ها PASS باشند
- لاگ‌ها ارائه شوند
- تأیید انسان («اوکی») دریافت شود

---

## 10) خروجی الزامی Cursor در پایان فاز
- لیست فایل‌های ساخته/ویرایش‌شده
- دستورهای اجراشده
- نتیجه تست‌ها (PASS/FAIL)
- لاگ کامل
- توقف و انتظار برای تأیید

---

**وضعیت فاز:** آماده اجرا  
**مرحله بعد (پس از تأیید):** Phase 06 — Frontend Auth & Layout