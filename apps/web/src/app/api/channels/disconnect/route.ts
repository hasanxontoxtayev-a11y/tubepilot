import { prisma } from '@kanal/db';
import { NextRequest, NextResponse } from 'next/server';

export async function POST(req: NextRequest) {
  try {
    let userId = req.cookies.get('kanal_user_id')?.value;
    let user = userId ? await prisma.user.findUnique({ where: { id: userId } }) : null;

    if (!user) {
      user = await prisma.user.findFirst();
      if (user) userId = user.id;
    }

    if (userId) {
      // 1. Disconnect only this user's channel
      await prisma.youTubeChannel.deleteMany({
        where: { userId },
      });

      // 2. Unlink Telegram pairing and reset user state in database
      const userChatId = user?.telegramChatId ? user.telegramChatId.toString() : null;

      await prisma.user.updateMany({
        where: { id: userId },
        data: {
          name: null,
          avatarUrl: null,
          telegramChatId: null,
          telegramUserId: null,
          telegramUsername: null,
          telegramPairToken: null,
          telegramPairTokenExp: null,
        },
      });

      // 3. If Telegram bot was paired, notify and reset session in Telegram
      if (userChatId) {
        try {
          const botToken = process.env.TELEGRAM_BOT_TOKEN || '9077748091:AAEFiPyxWo1aUm3oq04bqA4RKj8SKugbdrM';
          const msg =
            `ℹ️ **YouTube Ishchi Maydoni va Telegram Bog'lanishi Uzildi**\n\n` +
            `Kanalingiz saytdan uzildi. Yangi YouTube kanalini ulash va botni qayta faollashtirish uchun boshqaruv paneliga kiring:\n` +
            `👉 [tubepilotpro.com](https://www.tubepilotpro.com/uz/dashboard)`;

          await fetch(`https://api.telegram.org/bot${botToken}/sendMessage`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({
              chat_id: userChatId,
              text: msg,
              parse_mode: 'Markdown',
            }),
          });
        } catch {}
      }
    }

    const response = NextResponse.json({ success: true, message: 'YouTube channel disconnected successfully' });
    response.cookies.delete('kanal_user_id');
    response.cookies.delete('tubepilot_google_connected');
    response.cookies.delete('tubepilot_connected_channel');
    response.cookies.delete('tubepilot_tg_pair_token');
    response.cookies.delete('tubepilot_tg_paired');
    return response;
  } catch (error: any) {
    console.error('Failed to disconnect channel:', error);
    return NextResponse.json({ success: false, error: error.message }, { status: 500 });
  }
}
