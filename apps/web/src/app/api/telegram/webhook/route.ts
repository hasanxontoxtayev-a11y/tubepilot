import { NextRequest, NextResponse } from 'next/server';

export const dynamic = 'force-dynamic';

const BOT_TOKEN = process.env.TELEGRAM_BOT_TOKEN || '9077748091:AAEFiPyxWo1aUm3oq04bqA4RKj8SKugbdrM';

export async function POST(req: NextRequest) {
  try {
    const update = await req.json();

    if (update.message) {
      const chatId = update.message.chat?.id;
      const text = update.message.text || '';
      const firstName = update.message.from?.first_name || 'Foydalanuvchi';

      if (text.startsWith('/start')) {
        const welcomeMessage = 
          `👋 **Assalomu alaykum, ${firstName}! TubePilot AI Botiga Xush Kelibsiz!** 🚀\n\n` +
          `Sizning YouTube kanalingiz uchun 24/7 ishlovchi avtonom sun'iy intellekt kopiloti.\n\n` +
          `🔥 **Bot imkoniyatlari:**\n` +
          `• 💬 **Izohlar Avtopiloti:** Kanalingizdagi izohlarga professional AI javoblar tayyorlaydi.\n` +
          `• 🖼️ **CTR Vision Tahlil:** Istalgan video muqovasini (rasmini) yuboring — AI uning bosilish ehtimolini tahlil qiladi.\n` +
          `• ⚡ **Real vaqt signallari:** Yangi video ko'rishlari va faollik tahlillari.\n\n` +
          `🌐 **Saytga o'tish:** [tubepilotpro.com](https://www.tubepilotpro.com/uz/dashboard)`;

        const keyboard = {
          inline_keyboard: [
            [
              { text: '🌐 Boshqaruv Paneli (Sayt)', url: 'https://www.tubepilotpro.com/uz/dashboard' }
            ],
            [
              { text: '🔗 Kanalni Ulanish', url: 'https://www.tubepilotpro.com/uz/dashboard?oauth_modal=true' },
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
      } else {
        // Echo or help response for any other message
        const helpMsg = 
          `🤖 **TubePilot AI Savollarga Javob Beradi:**\n\n` +
          `Siz yubordingiz: "${text}"\n\n` +
          `YouTube bo'yicha to'liq tahlil va videolaringiz boshqaruvi uchun quyidagi tugma orqali saytimizga kiring:`;

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
