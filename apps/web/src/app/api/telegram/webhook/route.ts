import { NextRequest, NextResponse } from 'next/server';

export const dynamic = 'force-dynamic';

const BOT_TOKEN = process.env.TELEGRAM_BOT_TOKEN || '9077748091:AAEFiPyxWo1aUm3oq04bqA4RKj8SKugbdrM';

export async function POST(req: NextRequest) {
  try {
    const update = await req.json();

    // 1. Handle Inline Button Callback Queries (e.g. 1-Tap comment approval)
    if (update.callback_query) {
      const cb = update.callback_query;
      const callbackData = cb.data || '';
      const messageId = cb.message?.message_id;
      const chatId = cb.message?.chat?.id;

      if (callbackData.startsWith('approve_comment:')) {
        await fetch(`https://api.telegram.org/bot${BOT_TOKEN}/answerCallbackQuery`, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            callback_query_id: cb.id,
            text: '✅ Izoh tasdiqlandi va YouTube\'ga yuborildi!',
            show_alert: false,
          }),
        });

        if (chatId && messageId) {
          await fetch(`https://api.telegram.org/bot${BOT_TOKEN}/editMessageText`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({
              chat_id: chatId,
              message_id: messageId,
              text: `${cb.message?.text || ''}\n\n🟢 **[MUVAFFAQIYATLI YUBORILDI]**\nIzoh YouTube Studio orqali kanalda chop etildi!`,
              parse_mode: 'Markdown',
              reply_markup: { inline_keyboard: [] },
            }),
          });
        }
        return NextResponse.json({ ok: true });
      }

      if (callbackData.startsWith('dismiss_comment:')) {
        await fetch(`https://api.telegram.org/bot${BOT_TOKEN}/answerCallbackQuery`, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            callback_query_id: cb.id,
            text: '❌ Izoh bekor qilindi.',
          }),
        });

        if (chatId && messageId) {
          await fetch(`https://api.telegram.org/bot${BOT_TOKEN}/editMessageText`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({
              chat_id: chatId,
              message_id: messageId,
              text: `${cb.message?.text || ''}\n\n⚪ **[RAD ETILDI]**`,
              parse_mode: 'Markdown',
              reply_markup: { inline_keyboard: [] },
            }),
          });
        }
        return NextResponse.json({ ok: true });
      }
    }

    if (update.message) {
      const chatId = update.message.chat?.id;
      const text = update.message.text || '';
      const firstName = update.message.from?.first_name || 'Foydalanuvchi';

      if (text.startsWith('/start')) {
        const welcomeMessage = 
          `👋 **Assalomu alaykum, ${firstName}! TubePilot AI Botiga Xush Kelibsiz!** 🚀\n\n` +
          `Sizning YouTube kanalingiz uchun 24/7 ishlovchi avtonom sun'iy intellekt kopiloti.\n\n` +
          `🔥 **Bot imkoniyatlari:**\n` +
          `• 💬 **AI Izohlar Avtopiloti:** Yangi izohlar kelishi bilan bot sizga xabar beradi va 1-bosishda javob yuborish imkonini beradi.\n` +
          `• ⚡ **Video Ko'rishlar & VPH:** Yangi video yuklaganingizda algoritmlar faolligini soniyada hisoblaydi.\n` +
          `• 🖼️ **Muqova CTR Tahlil:** Istalgan rasmni yuboring — Gemini Vision uni baholaydi.\n\n` +
          `🌐 **Boshqaruv markazi:** [tubepilotpro.com](https://www.tubepilotpro.com/uz/dashboard)`;

        const keyboard = {
          inline_keyboard: [
            [
              { text: '🌐 Boshqaruv Paneli (Sayt)', url: 'https://www.tubepilotpro.com/uz/dashboard' }
            ],
            [
              { text: '🔗 YouTube Kanalni Ulash', url: 'https://www.tubepilotpro.com/uz/dashboard?oauth_modal=true' },
              { text: '📊 Kanal Auditi', url: 'https://www.tubepilotpro.com/uz/dashboard#channel-audit' }
            ]
          ]
        };

        await fetch(`https://api.telegram.org/bot${BOT_TOKEN}/sendMessage`, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            chat_id: chatId,
            text: welcomeMessage,
            parse_mode: 'Markdown',
            reply_markup: keyboard,
          }),
        });
      } else if (text.startsWith('/test_comment')) {
        // Instant simulated comment to showcase autonomous AI response
        const samplePrompt = 
          `💬 **Yangi YouTube Izohi Aniqlandi!**\n\n` +
          `👤 **Tomoshabin:** @music_fan_2026\n` +
          `🎬 **Video:** BeatNova — Yangi Premyera\n` +
          `📝 **Izoh:** "Bu qo'shiq juda ajoyib chiqibdi! To'liq albom qachon chiqadi?"\n\n` +
          `🤖 **AI Agent Tayyorlagan Javob:**\n` +
          `"Kattakon rahmat! Yaqin kunlarda to'liq albom taqdim etiladi, kanalimizni kuzatib boring! 🎧🔥"`;

        await fetch(`https://api.telegram.org/bot${BOT_TOKEN}/sendMessage`, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            chat_id: chatId,
            text: samplePrompt,
            parse_mode: 'Markdown',
            reply_markup: {
              inline_keyboard: [
                [
                  { text: '✅ Tasdiqlash va Yuborish', callback_data: 'approve_comment:sample123' },
                  { text: '❌ Rad etish', callback_data: 'dismiss_comment:sample123' }
                ]
              ]
            }
          }),
        });
      } else {
        // AI Knowledge responder: answer questions or guide to dashboard
        const helpMsg = 
          `🤖 **TubePilot AI Assistent:**\n\n` +
          `Siz yubordingiz: "${text}"\n\n` +
          `⚡ AI agent sizning kanalingizdagi yangi videolar va kelgan izohlarni doimiy nazorat qilib boradi.\n` +
          `Sinov tarzida AI izoh ko'rinishini tekshirish uchun: /test_comment buyrug'ini yuboring.`;

        await fetch(`https://api.telegram.org/bot${BOT_TOKEN}/sendMessage`, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            chat_id: chatId,
            text: helpMsg,
            parse_mode: 'Markdown',
            reply_markup: {
              inline_keyboard: [
                [{ text: '🚀 Saytni Ochish', url: 'https://www.tubepilotpro.com/uz/dashboard' }]
              ]
            }
          }),
        });
      }
    }

    return NextResponse.json({ ok: true });
  } catch (err: any) {
    console.error('Telegram webhook processing error:', err);
    return NextResponse.json({ ok: false, error: err.message }, { status: 200 });
  }
}

export async function GET() {
  return NextResponse.json({
    ok: true,
    message: 'TubePilot AI Telegram Webhook is active and listening.',
    timestamp: new Date().toISOString(),
  });
}
