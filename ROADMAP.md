# خارطة طريق مشروع Chem Lab Calc

آخر تحديث: يوليو 2026

## 🎯 الهدف
تطبيق ويب لإدارة مختبرات الكيمياء الجامعية، بديل كامل عن Replit، مبني بدون تكاليف شهرية.

## 🛠️ البنية التقنية (خلصت)
- ✅ GitHub — الكود
- ✅ Supabase — قاعدة البيانات
- ✅ Vercel — الاستضافة
- ✅ الاتصال الكامل بين React و Supabase شغال

## 🏗️ بنية الكود (Refactored)
src/
  lib/supabaseClient.js
  features/
    courses/ (courseService.js + CoursesPage.jsx)
    terms/ (termService.js + TermsPage.jsx)
    sections/ (sectionService.js + SectionsPage.jsx)
    experiments/ (experimentService.js + ExperimentsPage.jsx)
    chemicals/ (chemicalService.js + ChemicalsPage.jsx)
  App.jsx (تبويبات فقط، بدون منطق مباشر)

هذا النمط (service منفصل عن page) هو القالب المعتمد لأي جدول جديد يُضاف لاحقاً.

## ✅ الجداول المبنية بقاعدة البيانات
- ✅ courses (المساقات) — RLS كاملة (SELECT/INSERT/UPDATE/DELETE)
- ✅ terms (الفصول) — RLS كاملة، مرتبط بـ courses
- ✅ sections (الشعب) — RLS كاملة، مرتبط بـ terms
- ✅ experiments (التجارب) — RLS كاملة، مرتبط بـ courses
- ✅ chemicals (المواد الكيميائية) — RLS كاملة، مرتبط بـ experiments
  - عمود إضافي جديد: target_concentration_value (numeric) — أُضيف لتخزين قيمة التركيز المطلوب رقمياً (منفصل عن concentration_type الذي يمثل الوحدة فقط)

## ✅ ما تم إنجازه (حتى الآن)

### أساس النظام — CRUD كامل لكل الجداول الخمسة
- ✅ Courses: إضافة / تعديل / حذف من الواجهة مباشرة
- ✅ Terms: نفس الشيء، مع Dropdown لاختيار المساق
- ✅ Sections: نفس الشيء، مع Dropdown للفصل + حقول مدرس/يوم/وقت/عدد طلاب/رقم مختبر
- ✅ Experiments: نفس الشيء، مع Dropdown للمساق + Individual/Pairs execution mode
- ✅ Chemicals: نموذج أساسي كامل (تفصيل أدناه)
- ✅ نظام تبويبات (Tabs) للتنقل بين الصفحات الخمس

### نموذج Chemicals — الحقول الذكية (Conditional Fields)
- ✅ الحالة الفيزيائية: Pure Solid / Pure Liquid / Solution
- ✅ مصدر المحلول (يظهر فقط لو Solution): Solid dissolved / Liquid stock - diluted / Liquid stock - concentrated (as-is)
- ✅ الحقول تتغيّر تلقائياً حسب الاختيارات:
  - Solid dissolved → يظهر: نوع التركيز + قيمة التركيز المطلوب + الوزن الجزيئي
  - Liquid stock - diluted → يظهر: نوع التركيز + قيمة التركيز المطلوب + تركيز المحلول الأصلي (Stock %)
  - Liquid stock - concentrated (as-is) → يظهر فقط: تركيز المحلول الأصلي (Stock %) — بدون تركيز مطلوب لأنه لا يوجد تخفيف
- ✅ وحدات الكمية (unit) بشكل Dropdown ذكي حسب الحالة الفيزيائية:
  - Pure Solid → g, kg, mg فقط
  - Pure Liquid / Solution → mL, L (افتراضي)، مع إتاحة g, kg, mg أيضاً للحالات النادرة (وزن مادة سائلة)
- ✅ Autocomplete لاسم المادة (HTML datalist) من أسماء المواد المضافة سابقاً — لتقليل التكرار والأخطاء الإملائية

## 📋 الميزات المطلوبة (لم تُبنَ بعد)

### حاسبة المواد الكيميائية — الميزات المتقدمة المتبقية
هذه الميزات تحتاج تصميم جدول/علاقة جديدة بقاعدة البيانات (مو مجرد حقول إضافية على chemicals)، لأن كل واحدة منها تمثل "مجموعة مكونات مرتبطة ببعض" وليس مادة واحدة مستقلة:
- [ ] Buffer / Mixed Solutions — محلول من مكونين أو أكثر (مثل Ammonia Buffer) — يحتاج جدول وسيط يربط عدة مواد بنفس "المحلول المركّب"
- [ ] Mixed Solvent — مذيبان بنسب مختلفة مع حساب كمية كل مذيب — نفس فكرة العلاقة One-to-Many
- [ ] Unknown Samples — سلاسل (A, B, 1-10...) بنسبة % أو كمية ثابتة — يحتاج تفكير بآلية توليد السلاسل تلقائياً
- [ ] Subscript تلقائي للصيغ الكيميائية (H₂O، AgNO₃)
- [ ] حقول ملاحظات منفصلة: General Notes + Preparation Notes (حالياً حقل ملاحظات واحد فقط)
- [ ] محرك الحساب الفعلي (C1V1=C2V2 وما شابه) — بناءً على: التركيز المطلوب + تركيز الأصل + عدد الطلاب من Sections + هامش Waste % — هذا يُبنى بعد استقرار تصميم Buffer/Mixed/Unknown أعلاه، لتجنب إعادة الهيكلة

### التقارير والحسابات
- [ ] الحاسبة الذكية (Quick Calculator) — حسبة سريعة لعدد طلاب مع Waste %
- [ ] Detailed Annual Report (كل مادة بكل تجربة مع مصدرها)
- [ ] جدول المواد الخام (Raw Material Order) — مجمّع بالاسم بغض النظر عن المصدر
- [ ] طريقة تحضير تلقائية مرقّمة لكل مادة
- [ ] Custom volume لطريقة التحضير

### الجدول الزمني
- [ ] الجدول البصري (Lab Schedule) — عرضان: By Subject / By Time
- [ ] فلتر الفصل (Summer/Fall/Spring)
- [ ] تتبع التقدّم: Completed / Pending / Missed Session
- [ ] ألوان حسب الحالة: On Track / Upcoming / Missed / Not Yet Due
- [ ] Term Start Date لمنع احتساب جلسات فائتة

### الواجهة العامة
- [ ] Dashboard مع Alerts
- [ ] تحسين تصميم الفورمات لتتوافق بشكل أفضل مع RTL (حالياً وظيفي لكن الترتيب البصري بسيط)
- [ ] بنية بطاقات قابلة للطي (Card-based) بدل القوائم البسيطة الحالية
- [ ] Print / Export PDF لكل الصفحات
- [ ] ثنائي اللغة عربي/إنجليزي

### مراحل مستقبلية (بعد الأساسيات)
- [x] Autocomplete لأسماء المواد من بيانات سابقة (أُنجزت مبكراً ضمن Chemicals)
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
- نقطة التوقف الحالية: أساس النظام (CRUD لكل الجداول الخمسة) مكتمل بالكامل ومنشور على Vercel. نموذج Chemicals مطوّر بحقول ذكية شرطية. الخطوة القادمة هي تصميم قاعدة بيانات Buffer/Mixed Solutions/Unknown Samples قبل بناء محرك الحساب.
