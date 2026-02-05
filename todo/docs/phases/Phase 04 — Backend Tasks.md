

# Phase 04 — Backend Task Management (API وظایف)

## 0) هدف فاز
هدف این فاز پیاده‌سازی کامل **مدیریت وظایف** در بک‌اند است، به‌طوری که پس از احراز هویت (Phase 03) هر کاربر بتواند:
- وظیفه بسازد
- لیست وظایف خودش را ببیند
- وظیفه را ویرایش کند
- وظیفه را حذف کند
- وضعیت وظیفه را تغییر دهد (DONE / NOT_DONE / DELAYED)
- زمان انجام (deadline) را تغییر دهد (Reschedule)

در پایان این فاز باید:
- APIهای Task کامل باشند
- قوانین چندکاربره بودن رعایت شود (هر کاربر فقط داده خودش)
- تست‌های Task PASS شوند
- لاگ‌ها ارائه شوند

---

## 1) Scope فاز
- افزودن ماژول Tasks در Backend
- تعریف routes / service / schemas برای Task
- اجرای کامل CRUD
- پیاده‌سازی Status change و Reschedule
- Pagination و Sorting حداقلی
- فیلتر حداقلی (مثلاً status و بازه زمانی)
- تست‌های integration برای endpoints

---

## 2) Out of Scope
- Analytics واقعی (Phase 08)
- Reminder scheduling (بعداً)
- Difficulty tracking (بعداً)
- Media upload (تصویر/ویدیو) (بعداً؛ فقط فیلد placeholder اگر لازم شد)

---

## 3) تصمیمات کلیدی (Multi-tenant & Data Rules)
### 3.1 جداسازی کاربران
- تمام queryها باید با `userId` محدود شوند.
- هیچ endpointی نباید اجازه دهد کاربر task دیگری را بخواند/ویرایش کند.

### 3.2 مدل Task در MVP
Task شامل فیلدهای زیر است (طبق Phase 02):
- `id`
- `userId`
- `title`
- `description?`
- `deadlineAt`
- `status` (enum)
- `importance` (enum)
- `createdAt`
- `updatedAt`

قوانین:
- title اجباری
- deadlineAt اجباری (برای MVP)
- description اختیاری

---

## 4) ساختار ماژول Tasks (الزامی)
Cursor باید در `services/backend/src/modules/tasks` این فایل‌ها را بسازد:

```text
modules/
  tasks/
    tasks.routes.ts
    tasks.service.ts
    tasks.schemas.ts
```

و این ماژول باید در app اصلی register شود.

---

## 5) API Contract (Endpoints)
تمام endpointهای Task باید **Protected** باشند (نیازمند auth).

### 5.1 Create Task
- `POST /tasks`
- Body:
  ```json
  {
    "title": "...",
    "description": "...",
    "deadlineAt": "2026-02-05T10:00:00.000Z",
    "importance": "LOW|MEDIUM|HIGH|CRITICAL",
    "status": "DONE|NOT_DONE|DELAYED" 
  }
  ```
- Notes:
  - status می‌تواند اختیاری باشد و پیش‌فرض `NOT_DONE`
  - importance می‌تواند اختیاری باشد و پیش‌فرض `MEDIUM`

- Response: 201 + task

### 5.2 List Tasks
- `GET /tasks`
- Query params (حداقلی):
  - `status` (اختیاری)
  - `from` و `to` برای بازه deadlineAt (اختیاری)
  - `sort` (مثلاً `deadlineAt:asc|desc`) (اختیاری)
  - `page` و `pageSize` (اختیاری)

- Response: 200
  ```json
  {
    "items": [ ... ],
    "page": 1,
    "pageSize": 20,
    "total": 123
  }
  ```

### 5.3 Get Task By Id
- `GET /tasks/:id`
- Response: 200 + task
- اگر task متعلق به user نبود: 404

### 5.4 Update Task
- `PUT /tasks/:id`
- Body (partial allowed):
  - title
  - description
  - deadlineAt
  - importance
  - status
- Response: 200 + task

### 5.5 Delete Task
- `DELETE /tasks/:id`
- Response: 204

### 5.6 Change Status
- `PATCH /tasks/:id/status`
- Body:
  ```json
  { "status": "DONE|NOT_DONE|DELAYED" }
  ```
- Response: 200 + task

### 5.7 Reschedule
- `PATCH /tasks/:id/reschedule`
- Body:
  ```json
  { "deadlineAt": "2026-02-06T10:00:00.000Z" }
  ```
- Response: 200 + task

---

## 6) Validation Rules (Zod)
- title: حداقل 1 کاراکتر
- deadlineAt: تاریخ معتبر ISO
- importance و status فقط از enum
- page/pageSize عدد معتبر با سقف منطقی (مثلاً pageSize <= 100)

---

## 7) Error Handling و Status Codes
- 400: خطای validation
- 401: بدون احراز هویت
- 404: task پیدا نشد (یا متعلق به user نیست)
- 500: خطای سرور

---

## 8) تست‌های الزامی این فاز (Gate)
Cursor باید بعد از پیاده‌سازی، تست‌های زیر را اجرا کند و لاگ کامل ارائه دهد.

### 8.1 بالا آوردن سرویس‌ها
```bash
docker compose up -d --build database backend
```

### 8.2 اجرای تست‌ها
```bash
docker compose run --rm backend npm test
```

### 8.3 سناریوهای تست (حداقل)
1) بدون Auth → GET /tasks باید 401
2) Register/Login → دریافت cookie
3) Create Task → 201
4) List Tasks → items شامل task ساخته شده
5) Get Task By Id → 200
6) Update Task → 200 و تغییرات اعمال شود
7) Change Status → 200 و status تغییر کند
8) Reschedule → 200 و deadlineAt تغییر کند
9) Delete Task → 204
10) Cross-user access:
   - user2 نباید بتواند task user1 را GET/PUT/DELETE کند (404)

### 8.4 لاگ‌ها
```bash
docker compose logs --tail=200 backend
```

---

## 9) معیار Done شدن فاز
این فاز Done است اگر و فقط اگر:
- endpoints کامل باشند
- multi-tenant rule رعایت شود
- تست‌ها PASS باشند
- لاگ‌ها ارائه شوند
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
**مرحله بعد (پس از تأیید):** Phase 05 — Frontend Auth & Layout