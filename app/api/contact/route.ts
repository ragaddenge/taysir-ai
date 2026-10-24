import { NextResponse } from 'next/server';
import { Resend } from 'resend';

const MAX = { name: 100, email: 200, subject: 50, message: 3000 };

const SUBJECT_LABELS: Record<string, string> = {
  استفسار: 'استفسار عام',
  حساب: 'طلب إنشاء حساب',
  دعم: 'دعم فني',
  اقتراح: 'اقتراح تحسين',
};

// منع حقن HTML في الإيميل
const esc = (s: string) =>
  s
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;');

// حماية بسيطة من الإرسال المتكرر (في الذاكرة، كفاية للعرض)
const hits = new Map<string, number[]>();
function tooMany(ip: string) {
  const now = Date.now();
  const recent = (hits.get(ip) ?? []).filter((t) => now - t < 10 * 60 * 1000);
  recent.push(now);
  hits.set(ip, recent);
  return recent.length > 5; // 5 رسايل كل 10 دقايق
}

export async function POST(req: Request) {
  const apiKey = process.env.RESEND_API_KEY;
  const to = process.env.CONTACT_TO_EMAIL;
  if (!apiKey || !to) {
    console.error('[contact] RESEND_API_KEY أو CONTACT_TO_EMAIL مش متضافين');
    return NextResponse.json({ error: 'خدمة الإرسال غير مفعّلة حالياً' }, { status: 500 });
  }

  const ip = req.headers.get('x-forwarded-for')?.split(',')[0]?.trim() ?? 'unknown';
  if (tooMany(ip)) {
    return NextResponse.json({ error: 'محاولات كثيرة، حاول بعد قليل' }, { status: 429 });
  }

  let body: Record<string, unknown>;
  try {
    body = await req.json();
  } catch {
    return NextResponse.json({ error: 'بيانات غير صالحة' }, { status: 400 });
  }

  const name = String(body.name ?? '').trim();
  const email = String(body.email ?? '').trim();
  const subject = String(body.subject ?? '').trim();
  const message = String(body.message ?? '').trim();

  if (!name || !email || !subject || !message) {
    return NextResponse.json({ error: 'يرجى ملء جميع الحقول' }, { status: 400 });
  }
  if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
    return NextResponse.json({ error: 'البريد الإلكتروني غير صالح' }, { status: 400 });
  }
  if (
    name.length > MAX.name ||
    email.length > MAX.email ||
    subject.length > MAX.subject ||
    message.length > MAX.message
  ) {
    return NextResponse.json({ error: 'النص أطول من المسموح' }, { status: 400 });
  }

  const label = SUBJECT_LABELS[subject] ?? 'أخرى';

  try {
    const resend = new Resend(apiKey);
    const { error } = await resend.emails.send({
      // بدون دومين موثّق، Resend بيسمح بالمرسل ده للتجربة فقط
      from: 'تيسير AI <onboarding@resend.dev>',
      to,
      replyTo: email, // لما تضغط Reply يرد على المرسل مباشرة
      subject: `[تيسير AI] ${label} - ${name}`,
      html: `
        <div dir="rtl" style="font-family:Arial,sans-serif;line-height:1.8">
          <h2>رسالة جديدة من نموذج التواصل</h2>
          <p><strong>الاسم:</strong> ${esc(name)}</p>
          <p><strong>البريد:</strong> ${esc(email)}</p>
          <p><strong>الموضوع:</strong> ${esc(label)}</p>
          <hr />
          <p style="white-space:pre-wrap">${esc(message)}</p>
        </div>
      `,
    });

    if (error) {
      console.error('[contact] Resend error:', error);
      return NextResponse.json({ error: 'تعذّر إرسال الرسالة، حاول لاحقاً' }, { status: 502 });
    }
  } catch (err) {
    console.error('[contact] unexpected:', err);
    return NextResponse.json({ error: 'حدث خطأ غير متوقع' }, { status: 500 });
  }

  return NextResponse.json({ ok: true });
}