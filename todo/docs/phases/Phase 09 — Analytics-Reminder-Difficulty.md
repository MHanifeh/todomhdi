# Phase 09 — Analytics + Reminder + Difficulty (Post‑MVP)

## 0) هدف فاز
هدف این فاز اضافه کردن قابلیت‌های Post‑MVP است:
1) **Analytics**: گزارش‌های روزانه/هفتگی/ماهانه و نمودارها
2) **Reminder**: یادآوری‌های زمان‌بندی‌شده بر اساس انتخاب کاربر
3) **Difficulty**: تخمین سخت/آسان بودن کارها بر اساس تلاش‌ها و زمان صرف‌شده

این فاز بعد از تکمیل MVP اجرا می‌شود و باید به‌صورت ماژولار پیاده‌سازی شود تا در صورت نیاز بتوان هر بخش را جداگانه فعال/غیرفعال کرد.

---

## 1) Scope فاز (داخل فاز)
### 1.1 Analytics (گزارش‌ها)
- تولید خلاصه عملکرد:
  - پایان روز
  - پایان هفته
  - پایان ماه
- نمودارها:
  - Pie: Done / Not Done / Delayed
  - Bar: روند روزانه و هفتگی
- پیام انگیزشی کوتاه بر اساس روند

### 1.2 Reminder (یادآوری)
- کاربر هنگام ساخت/ویرایش Task بتواند Reminder انتخاب کند:
  - 1 hour later
  - 5 hours later
  - 1 day later
  - 2 days later
- Reminder پس از Reschedule باید دوباره زمان‌بندی شود.
- Reminderها فقط برای Taskهای متعلق به همان کاربر فعال شوند.

### 1.3 Difficulty (سختی کار)
- ثبت تلاش‌ها (attempt) برای هر Task
- ثبت زمان صرف‌شده (time spent) برای هر Task
- نمایش دسته‌بندی:
  - Easy / Medium / Hard
- معیار اولیه:
  - تعداد attempt + مجموع زمان spend

---

## 2) Out of Scope (خارج از فاز)
- Push notification واقعی موبایل
- سیستم پرداخت یا پلن
- داشبورد ادمین

---

## 3) نکته مهم معماری (اجباری)
برای Reminder و جمع‌بندی‌های دوره‌ای، سیستم نیاز به **Worker/Scheduler** دارد.

Cursor باید یکی از این دو رویکرد را انتخاب کند (و دلیل بیاورد):
- **Option A (پیشنهادی):** یک سرویس جدا به نام `worker` داخل docker-compose
  - اجرای Cron jobs
  - ارسال ایمیل یا ذخیره notification در DB
- **Option B:** استفاده از job scheduler داخلی backend (کمتر توصیه می‌شود)

پیشنهاد: Option A.

---

## 4) تغییرات دیتابیس (Schema Changes)
Cursor باید migration جدید بسازد.

### 4.1 Reminder
افزودن جدول `Reminder` یا افزودن فیلدهای لازم به Task (پیشنهاد: جدول جدا)

پیشنهاد جدول Reminder:
- `id` UUID
- `taskId` FK
- `userId` FK
- `type` (enum: ONE_HOUR, FIVE_HOURS, ONE_DAY, TWO_DAYS)
- `scheduledAt` timestamp
- `status` (enum: PENDING, SENT, CANCELED)
- `createdAt`, `updatedAt`

Index:
- `(userId, scheduledAt)`
- `(status, scheduledAt)`

### 4.2 Attempts / Time Spent
پیشنهاد جدول `TaskAttempt`:
- `id`
- `taskId`
- `userId`
- `startedAt`
- `endedAt` (nullable)
- `durationSec` (nullable)
- `createdAt`

یا ساده‌تر:
- اضافه کردن فیلدهای aggregate روی Task:
  - `attemptCount` int default 0
  - `timeSpentSec` int default 0

پیشنهاد MVP Post‑MVP: aggregate fields روی Task برای سرعت.

### 4.3 Analytics Aggregates (اختیاری)
برای Performance:
- جدول `DailyStats` / `WeeklyStats` / `MonthlyStats` (اختیاری)
یا محاسبه on-demand در API (برای شروع)

---

## 5) Backend APIs (حداقل)
### 5.1 Analytics
- `GET /analytics/summary?range=daily|weekly|monthly`
- `GET /analytics/chart?range=daily|weekly|monthly`

### 5.2 Reminder
- `POST /tasks/:id/reminders`
- `GET /tasks/:id/reminders`
- `DELETE /reminders/:id`

### 5.3 Difficulty
- `POST /tasks/:id/attempts/start`
- `POST /tasks/:id/attempts/stop`
- `GET /tasks/:id/difficulty` (یا در task detail)

---

## 6) Frontend UI (حداقل)
### 6.1 Analytics Dashboard
- Cards خلاصه
- Pie + Bar chart
- انتخاب بازه (روز/هفته/ماه)

### 6.2 Reminder UI
- در TaskForm: انتخاب Reminder options
- در TaskDetail: لیست reminderها + حذف

### 6.3 Difficulty UI
- در TaskDetail: نمایش سختی
- در Analytics: بخش Easy/Medium/Hard

همه UI مطابق `UI_DESIGN_RULES_WEB.fa.md`.

---

## 7) Worker Service (اگر Option A)
### 7.1 وظایف Worker
- هر X دقیقه Reminderهای PENDING با `scheduledAt <= now` را پیدا کند
- وضعیت را SENT کند
- لاگ دقیق ارائه دهد

### 7.2 خروجی Reminder برای MVP وب
چون Push نداریم:
- یا ذخیره Notification در DB
- یا ارسال Email (اگر SMTP آماده شد)
پیشنهاد: ذخیره Notification در DB + نمایش در UI (آیکون Bell در TopBar در فاز بعدی)

---

## 8) Gate / تست‌های الزامی
Cursor باید پس از پیاده‌سازی، این موارد را اجرا و لاگ ارائه کند:

1) migration جدید:
```bash
docker compose run --rm backend npm run prisma:migrate
```

2) بالا آوردن سرویس‌ها:
```bash
docker compose up -d --build database backend worker frontend
```

3) تست Reminder:
- ساخت task + ساخت reminder
- صبر تا زمان scheduledAt برسد (برای تست، زمان کوتاه تنظیم شود)
- worker باید reminder را SENT کند

4) تست Analytics:
- ساخت چند task با statusهای مختلف
- گرفتن summary و chart

5) تست Difficulty:
- start attempt
- stop attempt
- بررسی افزایش attemptCount/timeSpent

6) لاگ‌ها:
```bash
docker compose logs --tail=200 worker
docker compose logs --tail=200 backend
docker compose logs --tail=200 frontend
```

---

## 9) معیار Done شدن فاز
این فاز Done است اگر:
- migration ها درست اعمال شوند
- APIهای اصلی کار کنند
- UIهای حداقلی کار کنند
- worker زمان‌بندی را انجام دهد
- تست‌های Gate PASS شوند
- لاگ‌ها ارائه شوند
- انسان تأیید کند («اوکی»)

---

## 10) خروجی الزامی Cursor
- لیست فایل‌های ساخته/ویرایش‌شده
- دستورهای اجراشده
- نتیجه تست‌ها (PASS/FAIL)
- لاگ کامل
- توقف و انتظار برای تأیید

---

**وضعیت فاز:** آماده اجرا (Post‑MVP)  
**مرحله بعد (پس از تأیید):** بهینه‌سازی، UX polish و استقرار (Deploy)
