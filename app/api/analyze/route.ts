import { NextRequest, NextResponse } from 'next/server';

export const runtime = 'nodejs';
export const maxDuration = 60;

const SYSTEM_PROMPT =
  'أنت مساعد تعليمي متخصص في ملاحظة الكتابة اليدوية العربية لدى الأطفال. ترد باللغة العربية الفصحى فقط، وكل القيم في الـ JSON يجب أن تكون بالعربية الفصحى. أنت لا تشخّص أي حالة طبية أو تعليمية، ولا تذكر أن الطفل مصاب بالدسلكسيا أو بأي اضطراب، ولا تقترح علاجاً. مهمتك وصف ما يظهر في الكتابة فقط وتقديم ملاحظات وتمارين تدريبية بسيطة.';

const USER_PROMPT =
  'حلل صورة ورقة الكتابة العربية وأعط تقريراً بصيغة JSON فقط، بالعربية الفصحى، بدون أي نص آخر وبدون markdown. ' +
  'القواعد: (1) overallScore رقم من 0 إلى 100 يعبّر عن وضوح الكتابة وسلامتها الإملائية في هذه الورقة فقط، وليس تقييماً للطفل. ' +
  '(2) حقل diagnosis يجب أن يكون ملخصاً عاماً للملاحظات على الكتابة، بدون أي تشخيص وبدون ذكر الدسلكسيا أو أي اضطراب. ' +
  '(3) استخدم عبارات مثل "تظهر مؤشرات محتملة" أو "لوحظ"، وليس عبارات جازمة. ' +
  '(4) اجعل آخر توصية في recommendations تنصح بمراجعة مختص إذا استمر القلق. ' +
  '(5) إذا كانت الصورة غير مقروءة أو ليست كتابة عربية، اجعل overallScore يساوي 0، واشرح السبب في diagnosis، واترك باقي القوائم فارغة. ' +
  '(6) في spellingErrors يجب أن يكون حقل type واحدة فقط من هذه القيم الحرفية: "إبدال حرف" أو "حذف حرف" أو "إضافة حرف" أو "تبديل ترتيب الحروف" أو "همزة" أو "تاء مربوطة أو هاء" أو "ألف مقصورة أو ياء" أو "ال التعريف" أو "الفصل والوصل بين الكلمات" أو "نقاط الحروف" أو "أخرى". ' +
  '(7) اذكر في spellingErrors الأخطاء التي تراها بوضوح في الصورة فقط، ولا تخترع كلمات غير موجودة. إذا لم تجد أخطاء فاترك القائمة فارغة. ' +
  'الشكل المطلوب: {"overallScore":0,"diagnosis":"ملخص الملاحظات بالعربية","strengths":["نقطة قوة بالعربية"],"weaknesses":["ملاحظة على الكتابة بالعربية"],"spellingErrors":[{"word":"كلمة خاطئة بالعربية","correction":"الصحيح بالعربية","type":"إحدى القيم المحددة في القاعدة 6"}],"recommendations":["توصية بالعربية"],"exercises":[{"title":"اسم التمرين بالعربية","description":"الوصف بالعربية","level":"سهل أو متوسط أو متقدم","duration":"10 دقائق"}]}';

// 🟢 المحرك الأساسي: Gemini (اسم الموديل من المتغير GEMINI_MODEL، والافتراضي أدناه)
async function analyzeWithGemini(base64Data: string, mimeType: string) {
  const apiKey = process.env.GEMINI_API_KEY;
  if (!apiKey) throw new Error('مفتاح Gemini غير مضبوط');

  const model = process.env.GEMINI_MODEL || 'gemini-2.5-flash';

  const controller = new AbortController();
  const timeoutId = setTimeout(() => controller.abort(), 28000);

  try {
    const response = await fetch(
      'https://generativelanguage.googleapis.com/v1beta/models/' + model + ':generateContent',
      {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'x-goog-api-key': apiKey,
        },
        body: JSON.stringify({
          contents: [
            {
              parts: [
                { text: SYSTEM_PROMPT + '\n\n' + USER_PROMPT },
                { inlineData: { mimeType: mimeType, data: base64Data } },
              ],
            },
          ],
          generationConfig: {
            temperature: 0.3,
            maxOutputTokens: 4096,
            responseMimeType: 'application/json',
            // اختياري: لتسريع الموديلات التي تفكّر قبل الرد، ضع GEMINI_THINKING_LEVEL (مثل low) في Vercel
            ...(process.env.GEMINI_THINKING_LEVEL
              ? { thinkingConfig: { thinkingLevel: process.env.GEMINI_THINKING_LEVEL } }
              : {}),
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
    const finishReason = data.candidates?.[0]?.finishReason;
    if (finishReason && finishReason !== 'STOP') {
      console.warn('⚠️ Gemini finishReason:', finishReason);
    }
    const parts = data.candidates?.[0]?.content?.parts || [];
    return parts.map((p: any) => p.text || '').join('');
  } catch (error: any) {
    clearTimeout(timeoutId);
    if (error.name === 'AbortError') throw new Error('Gemini timeout');
    throw error;
  }
}

// 🟡 المحرك الاحتياطي: Groq
async function analyzeWithGroq(base64Data: string, mimeType: string) {
  const apiKey = process.env.GROQ_API_KEY;
  if (!apiKey) throw new Error('مفتاح Groq غير مضبوط');

  const controller = new AbortController();
  const timeoutId = setTimeout(() => controller.abort(), 20000);

  try {
    const response = await fetch('https://api.groq.com/openai/v1/chat/completions', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        Authorization: 'Bearer ' + apiKey,
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
        temperature: 0.3,
        max_completion_tokens: 2000,
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
    if (error.name === 'AbortError') throw new Error('Groq timeout');
    throw error;
  }
}

function parseAnalysis(text: string) {
  const jsonMatch = text.match(/\{[\s\S]*\}/);
  if (!jsonMatch) throw new Error('لم يتم استخراج JSON: ' + text.substring(0, 200));
  return JSON.parse(jsonMatch[0]);
}

export async function POST(req: NextRequest) {
  try {
    const { imageBase64, fileName } = await req.json();
    if (!imageBase64) return NextResponse.json({ error: 'لا توجد صورة' }, { status: 400 });

    const base64Data = imageBase64.includes(',') ? imageBase64.split(',')[1] : imageBase64;
    const mimeType = imageBase64.match(/data:(image\/\w+);base64/)?.[1] || 'image/jpeg';

    let analysis: any;
    let provider = '';

    // 🟢 المحاولة الأولى: Gemini (الأساسي). أي فشل (شبكة أو رد غير صالح) يحوّل تلقائياً إلى Groq
    try {
      console.log('✅ بدء التحليل عبر Gemini...');
      analysis = parseAnalysis(await analyzeWithGemini(base64Data, mimeType));
      provider = 'Gemini';
      console.log('✅ التحليل نجح عبر Gemini');
    } catch (geminiError: any) {
      console.warn('⚠️ فشل Gemini، تحويل تلقائي إلى Groq:', geminiError.message);
      analysis = parseAnalysis(await analyzeWithGroq(base64Data, mimeType));
      provider = 'Groq';
      console.log('✅ التحليل نجح عبر Groq (Failover)');
    }

    return NextResponse.json({ success: true, fileName, provider, analysis });
  } catch (error: any) {
    console.error('❌ خطأ:', error);
    return NextResponse.json({ error: 'تعذر التحليل', details: error.message }, { status: 500 });
  }
}