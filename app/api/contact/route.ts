import { NextRequest, NextResponse } from 'next/server';

export const runtime = 'nodejs';

function escapeHtml(s: string) {
  return s
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;');
}

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const name = String(body?.name ?? '').trim();
    const email = String(body?.email ?? '').trim();
    const message = String(body?.message ?? '').trim();

    if (!name || !email || !message) {
      return NextResponse.json(
        { error: 'من فضلك املأ الاسم والبريد والرسالة' },
        { status: 400 }
      );
    }
    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
      return NextResponse.json(
        { error: 'البريد الإلكتروني غير صحيح' },
        { status: 400 }
      );
    }
    if (name.length > 100 || email.length > 200 || message.length > 5000) {
      return NextResponse.json({ error: 'الرسالة طويلة جداً' }, { status: 400 });
    }

    const apiKey = process.env.RESEND_API_KEY;
    const to = process.env.CONTACT_TO_EMAIL;
    if (!apiKey || !to) {
      console.error('Contact: RESEND_API_KEY or CONTACT_TO_EMAIL is missing');
      return NextResponse.json({ error: 'الخدمة غير مضبوطة حالياً' }, { status: 500 });
    }

    const response = await fetch('https://api.resend.com/emails', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${apiKey}`,
      },
      body: JSON.stringify({
        from: 'Taysir AI <onboarding@resend.dev>',
        to: [to],
        reply_to: email,
        subject: `رسالة جديدة من ${name} عبر تيسير AI`,
        html: `
          <div dir="rtl" style="font-family:Arial,sans-serif;line-height:1.8">
            <p><strong>الاسم:</strong> ${escapeHtml(name)}</p>
            <p><strong>البريد:</strong> ${escapeHtml(email)}</p>
            <p><strong>الرسالة:</strong></p>
            <p>${escapeHtml(message).replace(/\n/g, '<br>')}</p>
          </div>`,
      }),
    });

    if (!response.ok) {
      const errText = await response.text();
      console.error('Resend:', response.status, errText);
      return NextResponse.json({ error: 'تعذّر إرسال الرسالة' }, { status: 502 });
    }

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error('Contact error:', error);
    return NextResponse.json({ error: 'تعذّر إرسال الرسالة' }, { status: 500 });
  }
}