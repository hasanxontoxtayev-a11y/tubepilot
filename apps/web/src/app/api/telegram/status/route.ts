import { prisma } from '@kanal/db';
import { NextRequest, NextResponse } from 'next/server';

export async function GET(req: NextRequest) {
  try {
    const userId = req.cookies.get('kanal_user_id')?.value;
    let user = userId
      ? await prisma.user.findUnique({
          where: { id: userId },
        })
      : null;

    if (!user) {
      user = await prisma.user.findFirst();
    }

    if (!user) {
      return NextResponse.json({ paired: false });
    }

    const isPaired = !!user.telegramChatId || !!user.telegramUserId;
    return NextResponse.json({
      paired: isPaired,
      telegramUsername: user.telegramUsername || null,
      language: user.preferredLanguage || 'en',
    });
  } catch (error: any) {
    return NextResponse.json({ paired: false, error: error.message }, { status: 500 });
  }
}
