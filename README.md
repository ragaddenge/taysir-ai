# تيسير AI | Taysir AI

نموذج أولي لمنصة عربية تستخدم الذكاء الاصطناعي لرصد **مؤشرات أولية** محتملة لأخطاء الكتابة العربية (المرتبطة بعسر القراءة والكتابة) من صورة خط اليد، وتقدّم تمارين وألعابًا تعليمية للتدريب.

**الموقع المنشور:** https://taysir-ai-phi.vercel.app

> **تنبيه مهم:** نتائج المنصة مؤشرات أولية وليست تشخيصًا طبيًا. لا تُغني عن تقييم مختص.

## المميزات

- **الماسح الذكي:** تحليل صورة خط اليد واستخراج مؤشرات أولية بالذكاء الاصطناعي التوليدي (Gemini).
- **التمارين:** تمارين تدريبية على القراءة والكتابة.
- **الألعاب التعليمية:** ألعاب تفاعلية بسيطة.
- **تقارير عربية:** ملاحظات ورسوم عن الأخطاء ونقاط القوة في عينة الكتابة.
- **ملفات الأطفال:** ملفات تجريبية داخل النسخة، محفوظة على جهاز المستخدم.

## حدود هذه النسخة

هذه نسخة تجريبية للعرض، وليست نظامًا جاهزًا للاستخدام الفعلي:

- **تسجيل الدخول تجريبي.** صفحة ملفات الأطفال لا تفتح إلا بعد تسجيل الدخول، وهي حماية للعرض فقط. في النسخة الفعلية سيُربط كل ولي أمر بحسابه على خادم مع قاعدة بيانات.
- **لا توجد نسبة دقة معتمدة.** لم تُقَس دقة النموذج على عينات سريرية، ولا يُدّعى له أداء تشخيصي.
- **المخرجات استرشادية.** تعتمد على نموذج لغوي، وقد تخطئ، وتتأثر بجودة الصورة.

## التقنيات

Next.js (App Router) · React · TypeScript · Tailwind CSS · Gemini API · Vercel

## التشغيل محليًا

```bash
git clone https://github.com/ragaddenge/taysir-ai.git
cd taysir-ai
npm install
cp .env.example .env.local   # ثم عبّئ القيم
npm run dev
```

افتح http://localhost:3000.

### متغيرات البيئة

أسماء المتغيرات المطلوبة موجودة في ملف `.env.example`. لا ترفع `.env.local` ولا أي مفتاح إلى GitHub. للنشر على Vercel أضف المتغيرات من Project ← Settings ← Environment Variables.

لإظهار صندوق الحساب التجريبي في صفحة الدخول:

```
NEXT_PUBLIC_DEMO_MODE=true
```

هذا المتغير يُدمج وقت البناء، فبعد تغييره أعد النشر (Redeploy) دون استخدام الـ build cache.

## الخصوصية

ملفات الأطفال في هذه النسخة محفوظة على جهاز المستخدم فقط، ولا تُرسل إلى قاعدة بيانات.

## التواصل

صفحة التواصل داخل الموقع: https://taysir-ai-phi.vercel.app/contact

---

# Taysir AI (English)

A prototype Arabic platform that uses generative AI to flag **preliminary indicators** of Arabic handwriting errors associated with dyslexia, and offers practice exercises and educational games.

**Live demo:** https://taysir-ai-phi.vercel.app

> **Not a diagnostic tool.** Results are preliminary indicators only and do not replace evaluation by a specialist.

**Demo limitations:** login is for demonstration only (the children's profiles page is protected for the demo; a production version would tie each parent to a server-side account and database). No accuracy figure is claimed. Outputs come from a language model and may be wrong.

**Stack:** Next.js, React, TypeScript, Tailwind CSS, Gemini API, Vercel.

**Run locally:** `npm install`, copy `.env.example` to `.env.local` and fill in the values, then `npm run dev`. Set `NEXT_PUBLIC_DEMO_MODE=true` to show the demo account box on the login page (build-time variable: redeploy without build cache after changing it).
