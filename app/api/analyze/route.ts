import { NextRequest, NextResponse } from 'next/server';

export const runtime = 'nodejs';
export const maxDuration = 60;

const SYSTEM_PROMPT = 'أنت مساعد طبي متخصص باللغة العربية. يجب أن ترد باللغة العربية الفصحى فقط في جميع الردود. ممنوع استخدام أي لغة أخرى (لا صينية ولا إنجليزية). كل القيم في الـ JSON يجب أن تكون بالعربية الفصحى.';

const USER_PROMPT = 'أنت خبير في تشخيص عسر الكتابة (الدسلكسيا) لدى الأطفال. حلل صورة ورقة الكتابة العربية وأعط تقريرا بصيغة JSON فقط باللغة العربية الفصحى بدون أي نص آخر وبدون markdown: {"overallScore":0,"diagnosis":"تشخيص بالعربية","strengths":["نقطة قوة بالعربية"],"weaknesses":["نقطة ضعف بالعربية"],"spellingErrors":[{"word":"كلمة خاطئة بالعربية","correction":"الصحيح بالعربية","type":"نوع الخطأ بالعربية"}],"recommendations":["توصية بالعربية"],"exercises":[{"title":"اسم التمرين بالعربية","description":"الوصف بالعربية","level":"سهل أو متوسط أو متقدم","duration":"10 دقائق"}]}';

export async function POST(req: NextRequest) {
  try {
    const { imageBase64, fileName } = await req.json();
    if (!imageBase64) return NextResponse.json({ error: 'لا توجد صورة' }, { status: 400 });

    const apiKey = process.env.GROQ_API_KEY;
    if (!apiKey) return NextResponse.json({ error: 'مفتاح Groq غير مضبوط' }, { status: 500 });

    console.log('✅ بدء التحليل عبر qwen/qwen3.8-27b...');

    const base64Data = imageBase64.includes(',') ? imageBase64.split(',')[1] : imageBase64;
    const mimeType = imageBase64.match(/data:(image\/\w+);base64/)?.[1] || 'image/jpeg';

    const response = await fetch('https://api.groq.com/openai/v1/chat/completions', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': 'Bearer ' + apiKey,
      },
      body: JSON.stringify({
        model: 'qwen/qwen3.8-27b',
        messages: [
          { role: 'system', content: SYSTEM_PROMPT },
          {
            role: 'user',
            content: [
              { type: 'text', text: USER_PROMPT },
              { type: 'image_url', image_url: { url: 'data:' + mimeType + ';base64,' + base64Data } },
            ],
          },
        ],
        temperature: 0.5,
        max_completion_tokens: 1024,
        response_format: { type: 'json_object' },
      }),
    });

    if (!response.ok) {
      const errText = await response.text();
      console.error('❌ Groq error:', response.status, errText);
      throw new Error('Groq (' + response.status + '): ' + errText.substring(0, 300));
    }

    const data = await response.json();
    const text = data.choices?.[0]?.message?.content || '';

    const jsonMatch = text.match(/\{[\s\S]*\}/);
    if (!jsonMatch) throw new Error('لم يتم استخراج JSON: ' + text.substring(0, 200));

    const analysis = JSON.parse(jsonMatch[0]);
    console.log('✅ تم التحليل بنجاح');

    return NextResponse.json({ success: true, fileName, provider: 'Groq', analysis });

  } catch (error: any) {
    console.error('❌ خطأ:', error);
    return NextResponse.json({ error: 'تعذر التحليل', details: error.message }, { status: 500 });
  }
}
