import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@kanal/db';

export const dynamic = 'force-dynamic';

export async function GET(req: NextRequest) {
  try {
    const { searchParams } = new URL(req.url);
    const targetHandle = searchParams.get('handle')?.replace('@', '').toLowerCase();
    const userId = req.cookies.get('kanal_user_id')?.value;
    const pairToken = req.cookies.get('tubepilot_tg_pair_token')?.value;

    let user = null;

    // 1. Find by session userId
    if (userId) {
      user = await prisma.user.findUnique({
        where: { id: userId },
        include: { channel: true },
      });
    }

    // 2. Find by pair token if not found
    if (!user && pairToken) {
      user = await prisma.user.findFirst({
        where: { telegramPairToken: pairToken },
        include: { channel: true },
      });
    }

    // 3. Find by channel handle
    let userChannel = user?.channel || null;
    if (!user && targetHandle) {
      const ch = await prisma.youTubeChannel.findFirst({
        where: { customUrl: { contains: targetHandle } },
        include: { user: true },
      });
      if (ch?.user) {
        user = ch.user;
        userChannel = ch;
      }
    }

    const isPaired = Boolean(user?.telegramChatId);
    const telegramUsername = isPaired ? (user?.telegramUsername || 'Telegram User') : null;

    return NextResponse.json({
      paired: isPaired,
      telegramUsername,
      channel: userChannel?.customUrl || null,
      channelTitle: userChannel?.title || null,
      language: user?.preferredLanguage || 'uz',
    });
  } catch (error: any) {
    console.error('[telegram/status] Error:', error);
    return NextResponse.json({ paired: false, error: error.message });
  }
}
