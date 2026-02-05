

# Phase 07 — Frontend Tasks UI (وظایف: لیست، ایجاد/ویرایش، جزئیات)

## 0) هدف فاز
هدف این فاز پیاده‌سازی UI و منطق فرانت‌اند برای **مدیریت وظایف** است، مطابق سند `docs/UI_DESIGN_RULES_WEB.fa.md` و اتصال کامل به APIهای Task (Phase 04).

در پایان این فاز باید:
- کاربر لاگین‌شده بتواند وظیفه بسازد/ببیند/ویرایش کند/حذف کند
- تغییر وضعیت (DONE/NOT_DONE/DELAYED) و Reschedule از UI انجام شود
- Layout وب (TopBar + Sidebar) حفظ شود
- هیچ استایل Hardcode نشود (Token-based)
- build PASS و smoke test انجام شود

---

## 1) Scope فاز
- پیاده‌سازی صفحات و مسیرهای Tasks در Frontend
- ساخت/تکمیل کامپوننت‌های reusable مربوط به Task
- اتصال به APIهای زیر (Protected):
  - `GET /tasks`
  - `POST /tasks`
  - `GET /tasks/:id`
  - `PUT /tasks/:id`
  - `DELETE /tasks/:id`
  - `PATCH /tasks/:id/status`
  - `PATCH /tasks/:id/reschedule`
- مدیریت state و fetch:
  - پیشنهاد: TanStack Query
  - یا wrapper fetch ساده (طبق Phase 06)
- نمایش خطاها و حالت‌های loading/empty

---

## 2) Out of Scope
- Settings UI (Phase 08)
- Analytics UI (Phase 09)
- Reminder scheduling واقعی (بعداً)
- Difficulty tracking (بعداً)
- Media upload واقعی (بعداً)

---

## 3) قوانین UI و UX (الزامی)
- قبل از شروع، سند `docs/UI_DESIGN_RULES_WEB.fa.md` مطالعه و رعایت شود.
- UI باید Web-first و Responsive باشد.
- Sidebar آیتم‌ها را نشان می‌دهد، اما فقط صفحات مربوط به Tasks در این فاز کامل می‌شوند.
- تمام رنگ/spacing/radius/typography باید از Tokens استفاده کنند.

---

## 4) مسیرها و صفحات (Routes)
> بسته به ساختار Next (App Router یا Pages Router) مسیرها معادل‌سازی شوند.

حداقل صفحات:
- `/(app)/tasks` یا `/tasks` → لیست وظایف
- `/(app)/tasks/new` → ایجاد وظیفه
- `/(app)/tasks/[id]` → جزئیات وظیفه
- `/(app)/tasks/[id]/edit` → ویرایش وظیفه

نکته:
- صفحات داخلی باید تحت Guard لاگین (Phase 06) باشند.

---

## 5) کامپوننت‌های پیشنهادی (Reusable)
Cursor باید این‌ها را بسازد/تکمیل کند:
- `TaskCard` (نمایش کارت وظیفه)
- `TaskStatusBadge` (DONE/NOT_DONE/DELAYED)
- `ImportanceBadge` (LOW/MEDIUM/HIGH/CRITICAL)
- `TaskForm` (برای create/edit)
- `DateTimePicker` (می‌تواند ساده باشد)
- `ConfirmDialog` (برای حذف)

همه Token-based.

---

## 6) رفتارهای UI (Screen Behaviors)

### 6.1 Tasks List
- نمایش greeting و date در TopBar (اگر در Phase 06 آماده شده)
- نمایش Progress ساده (اختیاری): تعداد DONE / total
- فیلتر حداقلی:
  - Status filter (اختیاری)
- دکمه CTA: «افزودن وظیفه»
- هر کارت:
  - title
  - deadline
  - importance
  - status
  - کلیک → رفتن به detail

### 6.2 Create Task
- فرم:
  - title (required)
  - description (optional)
  - deadlineAt (required)
  - importance (default MEDIUM)
  - status (default NOT_DONE)
- submit:
  - call `POST /tasks`
  - success → redirect به لیست یا detail

### 6.3 Task Detail
- نمایش:
  - title
  - description
  - deadlineAt
  - status
  - importance
- اکشن‌ها:
  - تغییر status (Done/Not Done/Delayed)
  - Reschedule (باز کردن modal و تغییر deadline)
  - Edit
  - Delete

### 6.4 Edit Task
- reuse از TaskForm
- call `PUT /tasks/:id`

### 6.5 Delete
- ConfirmDialog
- call `DELETE /tasks/:id`
- success → redirect به لیست

### 6.6 Reschedule
- Modal با DateTimePicker
- call `PATCH /tasks/:id/reschedule`
- success → refresh detail

---

## 7) API و مدیریت خطا
- تمام درخواست‌ها باید `credentials: 'include'` داشته باشند.
- اگر 401 از API آمد:
  - redirect به login
- نمایش خطا در UI به شکل دوستانه و کوتاه

---

## 8) Smoke Tests / Gate این فاز
Cursor باید بعد از پیاده‌سازی این موارد را اجرا و لاگ ارائه کند:

### 8.1 Build
```bash
docker compose up -d --build frontend
```

### 8.2 سناریوهای Smoke (حداقل)
1) Login
2) رفتن به /tasks
3) Create task
4) List شامل task جدید
5) باز کردن detail
6) تغییر status
7) reschedule
8) edit
9) delete

### 8.3 لاگ‌ها
```bash
docker compose logs --tail=200 frontend
```

(در صورت نیاز برای بررسی API)
```bash
docker compose logs --tail=200 backend
```

---

## 9) معیار Done شدن فاز
این فاز Done است اگر:
- صفحات Tasks ساخته شده باشند
- اتصال به API کامل باشد
- عملیات CRUD از UI کار کند
- status و reschedule کار کند
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
**مرحله بعد (پس از تأیید):** Phase 08 — Frontend Settings UI