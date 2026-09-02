# نشر Print Hub على Dokploy

المشروع مجهز كخدمة **Docker Compose** تتكون من:

- `app`: تطبيق Node.js على المنفذ الداخلي `3000`.
- `database`: PostgreSQL 16 مع Volume دائم باسم `postgres-data`.

قاعدة البيانات لا تُفتح للإنترنت، ولا توجد أسرار محفوظة في GitHub.

## 1. ربط GitHub

1. من Dokploy افتح **Git** ثم **GitHub**.
2. اختر **Create GitHub App** ثم ثبّت التطبيق على المستودع `Sayrawan190/Rocks_Printer`.
3. أنشئ Project جديدًا، ثم Service من نوع **Docker Compose**.
4. اختر GitHub كمصدر وحدد:
   - Repository: `Sayrawan190/Rocks_Printer`
   - Branch: `main`
   - Compose Path: `./docker-compose.yml`
5. فعّل **Auto Deploy** ليتجدد النشر مع كل Push إلى `main`.

## 2. متغيرات البيئة

من تبويب **Environment** الصق القيم التالية بعد استبدال كل قيمة تبدأ بـ `CHANGE_ME`:

```dotenv
POSTGRES_DB=print_hub
POSTGRES_USER=print_hub
POSTGRES_PASSWORD=CHANGE_ME_RANDOM_DATABASE_PASSWORD
SESSION_SECRET=CHANGE_ME_RANDOM_STRING_AT_LEAST_32_CHARACTERS
APP_PASSWORD_ABDULLAH=CHANGE_ME_STRONG_PASSWORD
APP_PASSWORD_BASEL=CHANGE_ME_STRONG_PASSWORD
APP_PASSWORD_SALEH=CHANGE_ME_STRONG_PASSWORD
APP_PASSWORD_ROCKS=CHANGE_ME_STRONG_PASSWORD
```

يمكن توليد قيمة عشوائية قوية لكل سر بالأمر:

```bash
openssl rand -hex 32
```

كلمات مرور المستخدمين الأربع تُطبّق فقط عند إنشاء Volume قاعدة البيانات لأول مرة. تغييرها لاحقًا من Environment لا يغير كلمات المرور داخل التطبيق؛ استخدم صفحة إعدادات الحساب لذلك.

## 3. أول نشر

1. اضغط **Deploy**.
2. انتظر حتى تصبح خدمتا `database` و`app` بحالة Healthy.
3. إذا أردت معاينة سريعة قبل ربط الدومين، أنشئ نطاق `traefik.me` مؤقتًا من تبويب Domains واختر خدمة `app` والمنفذ `3000`.

> الدخول عبر جلسة Production يتطلب HTTPS. استخدم الدومين النهائي مع HTTPS لاختبار تسجيل الدخول.

## 4. ربط الدومين

1. لدى مزود DNS أنشئ سجل `A`:
   - Name/Host: اسم النطاق الفرعي، مثل `printer`.
   - Value: عنوان IPv4 العام لخادم Dokploy.
2. انتظر انتشار DNS وتأكد أن النطاق يشير إلى الخادم.
3. في خدمة Compose افتح **Domains** ثم **Create Domain** وأدخل:
   - Host: مثل `printer.example.com` بدون `https://`.
   - Path: `/`
   - Service: `app`
   - Container Port: `3000`
   - HTTPS: `ON`
   - Certificate: `Let's Encrypt`
4. احفظ ثم أعد نشر Compose؛ تغييرات Domains في Compose تحتاج Redeploy.

إذا كان DNS على Cloudflare، استخدم وضع SSL/TLS **Full (strict)**. يفضل جعل السحابة DNS-only حتى يصدر Let's Encrypt الشهادة، ثم يمكن تفعيل Proxy بعد نجاح HTTPS.

## 5. البيانات والنسخ الاحتياطية

- البيانات محفوظة في Docker Volume، لذلك تبقى عند إعادة النشر.
- حذف خدمة Compose مع الـ Volumes أو حذف `postgres-data` يمسح البيانات نهائيًا.
- فعّل نسخة احتياطية دورية للـ Volume من تبويب **Backups** في Dokploy.
- قاعدة البيانات الجديدة تبدأ بالبيانات الموجودة في `database/seed.sql`. يمكن استيراد نسخة JSON أحدث من داخل لوحة الإدارة بعد أول دخول.

## فحص سريع بعد النشر

- `https://YOUR_DOMAIN/healthz` يعيد `{"status":"ok"}`.
- تسجيل الدخول يعمل بإحدى كلمات المرور التي وضعتها في Environment.
- سجلات `app` لا تحتوي أخطاء اتصال PostgreSQL.
- خدمتا `app` و`database` تظهران Healthy.
