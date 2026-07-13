# خارطة طريق مشروع Chem Lab Calc

آخر تحديث: يوليو 2026

## 🎯 الهدف
تطبيق ويب لإدارة مختبرات الكيمياء الجامعية، بديل كامل عن Replit، مبني بدون تكاليف شهرية.

## 🛠️ البنية التقنية (خلصت)
- ✅ GitHub — الكود
- ✅ Supabase — قاعدة البيانات
- ✅ Vercel — الاستضافة
- ✅ الاتصال الكامل بين React و Supabase شغال

## ✅ الجداول المبنية بقاعدة البيانات
- ✅ courses (المساقات)
- ✅ terms (الفصول)
- ✅ sections (الشعب)
- ✅ experiments (التجارب)
- ✅ chemicals (المواد الكيميائية)

## ✅ ما تم إنجازه
- ✅ عرض قائمة المساقات (Courses) من قاعدة البيانات فعلياً
- ✅ Policy قراءة عامة على جدول courses

---

## 📋 الميزات المطلوبة (لم تُبنَ بعد)

### أولوية عالية — أساس النظام
- [ ] نموذج إضافة/تعديل مساق من الواجهة مباشرة (مش من Supabase)
- [ ] نموذج إضافة فصل (Term) وشعبة (Section)
- [ ] نموذج إضافة تجربة (Experiment) ومادة كيميائية (Chemical)
- [ ] Policies للكتابة (INSERT/UPDATE/DELETE) على باقي الجداول

### حاسبة المواد الكيميائية
- [ ] 3 حالات فيزيائية: Pure Solid / Pure Liquid / Solution
- [ ] 5 أنواع تركيز: mol/L, %w/w, %v/v, %w/v, ppm
- [ ] مصدر المحلول: Solid dissolved (مع Molar Mass) أو Liquid stock (مع Stock %)
- [ ] **Concentrated Solution (as-is)** — استخدام المحلول المركز مباشرة بدون تخفيف
- [ ] **Buffer / Mixed Solutions** — محلول من مكونين أو أكثر (مثل Ammonia Buffer)
- [ ] **Mixed Solvent** — مذيبان بنسب مختلفة مع حساب كمية كل مذيب
- [ ] **Unknown Samples** — سلاسل (A, B, 1-10...) بنسبة % أو كمية ثابتة
- [ ] Individual / Pairs execution mode لكل تجربة
- [ ] Subscript تلقائي للصيغ الكيميائية (H₂O، AgNO₃)
- [ ] حقول ملاحظات منفصلة: General Notes + Preparation Notes

### التقارير والحسابات
- [ ] **الحاسبة الذكية (Quick Calculator)** — حسبة سريعة لعدد طلاب مع Waste %
- [ ] Detailed Annual Report (كل مادة بكل تجربة مع مصدرها)
- [ ] **جدول المواد الخام (Raw Material Order)** — مجمّع بالاسم بغض النظر عن المصدر
- [ ] طريقة تحضير تلقائية مرقّمة لكل مادة
- [ ] Custom volume لطريقة التحضير

### الجدول الزمني
- [ ] **الجدول البصري (Lab Schedule)** — عرضان: By Subject / By Time
- [ ] فلتر الفصل (Summer/Fall/Spring)
- [ ] تتبع التقدّم: Completed / Pending / Missed Session
- [ ] ألوان حسب الحالة: On Track / Upcoming / Missed / Not Yet Due
- [ ] Term Start Date لمنع احتساب جلسات فائتة

### الواجهة العامة
- [ ] Dashboard مع Alerts
- [ ] تبويبات: Dashboard / Courses / Sections & Schedule / Quick Calculator / Annual Report
- [ ] بنية بطاقات قابلة للطي (Card-based)
- [ ] Print / Export PDF لكل الصفحات
- [ ] ثنائي اللغة عربي/إنجليزي

### مراحل مستقبلية (بعد الأساسيات)
- [ ] Autocomplete لأسماء المواد من بيانات سابقة
- [ ] إضافة الأجهزة والأدوات لكل تجربة
- [ ] Pre-lab Instructions
- [ ] قسم إدارة المختبرات (أرقام، حالة، خزائن)
- [ ] Inventory Management (مخزون فعلي + تنبيهات إعادة طلب)
- [ ] Post-lab Checklist
- [ ] PWA (وضع عرض بدون إنترنت)
- [ ] AI-powered Preparation Method (Claude API)

---

## 📝 ملاحظات
- كل جدول جديد بقاعدة البيانات يحتاج Policy للقراءة والكتابة وإلا يظهر فاضي
- عند فتح محادثة جديدة: افتح هذا الملف أولاً لمعرفة آخر نقطة توقف
