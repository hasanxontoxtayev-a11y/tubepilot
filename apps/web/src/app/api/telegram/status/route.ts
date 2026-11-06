import { NextRequest, NextResponse } from 'next/server';

export const dynamic = 'force-dynamic';

export async function GET(req: NextRequest) {
  try {
    const { searchParams } = new URL(req.url);
    const targetHandle = searchParams.get('handle')?.replace('@', '').toLowerCase();

    // Check database if user with this channel actually has a paired telegramChatId
    let isDbPaired = false;
    let tgUsername = null;

    try {
      const { prisma } = await import('@kanal/db');
      const userId = req.cookies.get('kanal_user_id')?.value;
      if (userId) {
        const user = await prisma.user.findUnique({
          where: { id: userId },
          include: { channel: true },
        });
        if (user?.telegramChatId) {
          isDbPaired = true;
          tgUsername = user.telegramUsername || 'tubepilotai_bot';
        }
      } else if (targetHandle) {
        const ch = await prisma.youTubeChannel.findFirst({
          where: { customUrl: { contains: targetHandle } },
          include: { user: true },
        });
        if (ch?.user?.telegramChatId) {
          isDbPaired = true;
          tgUsername = ch.user.telegramUsername || 'tubepilotai_bot';
        }
      }
    } catch {}

    const isPaired = isDbPaired;

    return NextResponse.json({
      paired: isPaired,
      telegramUsername: isPaired ? tgUsername || 'tubepilotai_bot' : null,
      language: 'uz',
    });
  } catch (error: any) {
    return NextResponse.json({ paired: false });
  }
}
