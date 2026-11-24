import { NextRequest, NextResponse } from 'next/server';

export const runtime = 'nodejs';
export const maxDuration = 30; // تقليل الوقت الأقصى إلى 30 ثانية

const SYSTEM_PROMPT = 'أنت مساعد طبي متخصص باللغة العربية. يجب أن ترد باللغة العربية الفصحى فقط في جميع الردود. ممنوع استخدام أي لغة أخرى. كل القيم في الـ JSON يجب أن تكون بالعربية الفصحى.';

const USER_PROMPT = 'أنت خبير في تشخيص عسر الكتابة (الدسلكسيا) لدى الأطفال. حلل صورة ورقة الكتابة العربية وأعط تقريرا بصيغة JSON فقط باللغة العربية الفصحى بدون أي نص آخر وبدون markdown: {"overallScore":0,"diagnosis":"تشخيص بالعربية","strengths":["نقطة قوة بالعربية"],"weaknesses":["نقطة ضعف بالعربية"],"spellingErrors":[{"word":"كلمة خاطئة بالعربية","correction":"الصحيح بالعربية","type":"نوع الخطأ بالعربية"}],"recommendations":["توصية بالعربية"],"exercises":[{"title":"اسم التمرين بالعربية","description":"الوصف بالعربية","level":"سهل أو متوسط أو متقدم","duration":"10 دقائق"}]}';

// 🟢 المحرك الأساسي: Gemini 1.5 Flash (أسرع من 2.0)
async function analyzeWithGemini(base64Data: string, mimeType: string) {
  const apiKey = process.env.GEMINI_API_KEY;
  if (!apiKey) throw new Error('مفتاح Gemini غير مضبوط');

  const controller = new AbortController();
  const timeoutId = setTimeout(() => controller.abort(), 10000); // timeout 10 ثوانٍ

  try {
    const response = await fetch(
      'https://generativelanguage.googleapis.com/v1beta/models/gemini-1.5-flash:generateContent?key=' + apiKey,
      {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          contents: [{
            parts: [
              { text: SYSTEM_PROMPT + '\n\n' + USER_PROMPT },
              { inlineData: { mimeType: mimeType, data: base64Data } },
            ],
          }],
          generationConfig: {
            temperature: 0.3, // تقليل للعشوائية = استجابة أسرع
            maxOutputTokens: 512, // تقليل عدد التوكنات = استجابة أسرع
            responseMimeType: 'application/json',
          },
        }),
        signal: controller.signal,
      }
    );

    clearTimeout(timeoutId);

    if (!response.ok) {
      const errText = await response.text();
      throw new Error('Gemini (' + response.status + '): ' + errText.substring(0, 200));
    }

    const data = await response.json();
    return data.candidates?.[0]?.content?.parts?.[0]?.text || '';
  } catch (error: any) {
    clearTimeout(timeoutId);
    if (error.name === 'AbortError') {
      throw new Error('Gemini timeout - تحويل إلى Groq');
    }
    throw error;
  }
}

// 🟡 المحرك الاحتياطي: Groq مع Llama 3.2 Vision (أسرع من Qwen)
async function analyzeWithGroq(base64Data: string, mimeType: string) {
  const apiKey = process.env.GROQ_API_KEY;
  if (!apiKey) throw new Error('مفتاح Groq غير مضبوط');

  const controller = new AbortController();
  const timeoutId = setTimeout(() => controller.abort(), 8000); // timeout 8 ثوانٍ

  try {
    const response = await fetch('https://api.groq.com/openai/v1/chat/completions', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': 'Bearer ' + apiKey,
      },
      body: JSON.stringify({
        model: 'llama-3.2-90b-vision-preview', // نموذج أسرع وأخف
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
        temperature: 0.3,
        max_completion_tokens: 512,
        response_format: { type: 'json_object' },
      }),
      signal: controller.signal,
    });

    clearTimeout(timeoutId);

    if (!response.ok) {
      const errText = await response.text();
      throw new Error('Groq (' + response.status + '): ' + errText.substring(0, 200));
    }

    const data = await response.json();
    return data.choices?.[0]?.message?.content || '';
  } catch (error: any) {
    clearTimeout(timeoutId);
    if (error.name === 'AbortError') {
      throw new Error('Groq timeout');
    }
    throw error;
  }
}

export async function POST(req: NextRequest) {
  try {
    const { imageBase64, fileName } = await req.json();
    if (!imageBase64) return NextResponse.json({ error: 'لا توجد صورة' }, { status: 400 });

    const base64Data = imageBase64.includes(',') ? imageBase64.split(',')[1] : imageBase64;
    const mimeType = imageBase64.match(/data:(image\/\w+);base64/)?.[1] || 'image/jpeg';

    let text = '';
    let provider = '';

    // 🟢 المحاولة الأولى: Gemini 1.5 Flash (الأسرع)
    try {
      console.log('✅ بدء التحليل عبر Gemini 1.5 Flash...');
      text = await analyzeWithGemini(base64Data, mimeType);
      provider = 'Gemini 1.5 Flash';
      console.log('✅ التحليل نجح عبر Gemini');
    } catch (geminiError: any) {
      // 🟡 الفشل في Gemini → التحويل التلقائي إلى Groq
      console.warn('⚠️ فشل Gemini، تحويل تلقائي إلى Groq:', geminiError.message);
      text = await analyzeWithGroq(base64Data, mimeType);
      provider = 'Groq Llama 3.2';
      console.log('✅ التحليل نجح عبر Groq');
    }

    const jsonMatch = text.match(/\{[\s\S]*\}/);
    if (!jsonMatch) throw new Error('لم يتم استخراج JSON: ' + text.substring(0, 200));

    const analysis = JSON.parse(jsonMatch[0]);

    return NextResponse.json({ success: true, fileName, provider, analysis });

  } catch (error: any) {
    console.error('❌ خطأ:', error);
    return NextResponse.json({ error: 'تعذر التحليل', details: error.message }, { status: 500 });
  }
}