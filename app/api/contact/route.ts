import { NextRequest, NextResponse } from 'next/server';

export const runtime = 'nodejs';

export async function POST(req: NextRequest) {
  try {
    const { imageBase64, fileName } = await req.json();
    if (!imageBase64) return NextResponse.json({ error: 'Ù„Ø§ ØªÙˆØ¬Ø¯ ØµÙˆØ±Ø©' }, { status: 400 });

    const apiKey = process.env.GEMINI_API_KEY;
    if (!apiKey) return NextResponse.json({ error: 'Ù…ÙØªØ§Ø­ API ØºÙŠØ± Ù…Ø¶Ø¨ÙˆØ·' }, { status: 500 });

    const base64Data = imageBase64.includes(',') ? imageBase64.split(',')[1] : imageBase64;
    const mimeType = imageBase64.match(/data:(image\/\w+);base64/)?.[1] || 'image/jpeg';

    const prompt = `Ø£Ù†Øª Ø®Ø¨ÙŠØ± ÙÙŠ ØªØ´Ø®ÙŠØµ Ø¹Ø³Ø± Ø§Ù„ÙƒØªØ§Ø¨Ø© (Ø§Ù„Ø¯Ø³Ù„ÙƒØ³ÙŠØ§) Ù„Ø¯Ù‰ Ø§Ù„Ø£Ø·ÙØ§Ù„. Ø­Ù„Ù„ ØµÙˆØ±Ø© ÙˆØ±Ù‚Ø© Ø§Ù„ÙƒØªØ§Ø¨Ø© Ø§Ù„Ø¹Ø±Ø¨ÙŠØ© ÙˆØ£Ø¹Ø·Ù ØªÙ‚Ø±ÙŠØ±Ø§Ù‹ Ø¨ØµÙŠØºØ© JSON ÙÙ‚Ø· Ø¨Ø¯ÙˆÙ† Ø£ÙŠ Ù†Øµ Ø¢Ø®Ø±:
{"overallScore":0,"diagnosis":"Ù†Øµ","strengths":["Ù†Øµ"],"weaknesses":["Ù†Øµ"],"spellingErrors":[{"word":"Ù†Øµ","correction":"Ù†Øµ","type":"Ù†Øµ"}],"recommendations":["Ù†Øµ"],"exercises":[{"title":"Ù†Øµ","description":"Ù†Øµ","level":"Ø³Ù‡Ù„","duration":"10 Ø¯Ù‚Ø§Ø¦Ù‚"}]}`;

    const response = await fetch(
      'https://generativelanguage.googleapis.com/v1beta/models/gemini-1.5-flash:generateContent',
      {
        method: 'POST',
        headers: { 'Content-Type': 'application/json', 'x-goog-api-key': apiKey },
        body: JSON.stringify({
          contents: [{ parts: [{ text: prompt }, { inline_data: { mime_type: mimeType, data: base64Data } }] }],
        }),
      }
    );

    if (!response.ok) {
      const errText = await response.text();
      console.error('âŒ Gemini:', response.status, errText);
      throw new Error(`Gemini (${response.status})`);
    }

    const data = await response.json();
    const text = data.candidates?.[0]?.content?.parts?.[0]?.text || '';
    const jsonMatch = text.match(/\{[\s\S]*\}/);
    if (!jsonMatch) throw new Error('Ù„Ù… ÙŠØªÙ… Ø§Ø³ØªØ®Ø±Ø§Ø¬ JSON');

    return NextResponse.json({ success: true, fileName, analysis: JSON.parse(jsonMatch[0]) });

  } catch (error: any) {
    console.error('âŒ Ø®Ø·Ø£:', error);
    return NextResponse.json({ error: 'ØªØ¹Ø°Ù‘Ø± Ø§Ù„ØªØ­Ù„ÙŠÙ„', details: error.message }, { status: 500 });
  }
}
