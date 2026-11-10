import { NextRequest, NextResponse } from 'next/server';
import crypto from 'crypto';
import { prisma } from '@kanal/db';

export const dynamic = 'force-dynamic';

export async function POST(req: NextRequest) {
  try {
    let body: any = {};
    try {
      body = await req.json();
    } catch {}

    const pairToken = crypto.randomBytes(12).toString('hex');
    const rawUsername =
      process.env.NEXT_PUBLIC_TELEGRAM_BOT_USERNAME ||
      process.env.TELEGRAM_BOT_USERNAME ||
      'tubepilotai_bot';
    const botUsername = rawUsername.replace(/^@/, '');

    const channelHandle = (body?.channelHandle || '').replace(/^@/, '').trim();
    const channelTitle = (body?.channelTitle || '').trim();

    // Determine or create User session in Neon PostgreSQL
    let userId = req.cookies.get('kanal_user_id')?.value;
    let user = null;

    if (userId) {
      user = await prisma.user.findUnique({
        where: { id: userId },
        include: { channel: true },
      });
    }

    if (!user && channelHandle) {
      // Find user by channel's customUrl
      const existingCh = await prisma.youTubeChannel.findFirst({
        where: { customUrl: { contains: channelHandle.toLowerCase() } },
        include: { user: true },
      });
      if (existingCh?.user) {
        user = existingCh.user;
        userId = user.id;
      }
    }

    // If still no user, create a dedicated User workspace record for this creator
    if (!user) {
      const email = channelHandle
        ? `${channelHandle.toLowerCase().replace(/[^a-z0-9]/g, '')}_${pairToken.slice(0, 4)}@creator.tubepilot.ai`
        : `creator_${pairToken.slice(0, 8)}@tubepilot.ai`;

      user = await prisma.user.create({
        data: {
          email,
          name: channelTitle || channelHandle || 'YouTube Creator',
          subscriptionTier: 'PRO',
          subscriptionStatus: 'ACTIVE',
          telegramPairToken: pairToken,
          telegramPairTokenExp: new Date(Date.now() + 60 * 60 * 1000), // 1 hour validity
        },
        include: { channel: true },
      });
      userId = user.id;
    } else {
      // Update existing user's pair token
      await prisma.user.update({
        where: { id: user.id },
        data: {
          telegramPairToken: pairToken,
          telegramPairTokenExp: new Date(Date.now() + 60 * 60 * 1000),
        },
      });
    }

    // Ensure YouTubeChannel record is linked to this user in DB
    if (channelHandle) {
      const cleanCustomUrl = `@${channelHandle}`;
      const channelId = `UC_${channelHandle.replace(/[^a-zA-Z0-9_-]/g, '')}`;
      await prisma.youTubeChannel.upsert({
        where: { id: channelId },
        create: {
          id: channelId,
          userId: user.id,
          title: channelTitle || channelHandle,
          customUrl: cleanCustomUrl,
          encryptedAccessToken: 'oauth_flow_token',
          encryptedRefreshToken: 'oauth_flow_refresh',
          tokenExpiresAt: new Date(Date.now() + 365 * 24 * 3600 * 1000),
          tokenScope: 'https://www.googleapis.com/auth/youtube.readonly',
        },
        update: {
          userId: user.id,
          title: channelTitle || undefined,
          customUrl: cleanCustomUrl,
        },
      });
    }

    // Telegram Deep Link payload: carries the secure pairToken
    const deepLink = `https://t.me/${botUsername}?start=link_${pairToken}`;

    const res = NextResponse.json({
      success: true,
      token: pairToken,
      botUsername,
      deepLink,
      channel: channelHandle || null,
      userId: user.id,
    });

    res.cookies.set('tubepilot_tg_pair_token', pairToken, {
      path: '/',
      maxAge: 60 * 60, // 1 hour
      httpOnly: false,
    });

    if (user.id) {
      res.cookies.set('kanal_user_id', user.id, {
        path: '/',
        maxAge: 60 * 60 * 24 * 365,
        httpOnly: false,
      });
    }

    return res;
  } catch (err: any) {
    console.error('[telegram/pair] Error:', err);
    const rawUsername =
      process.env.NEXT_PUBLIC_TELEGRAM_BOT_USERNAME ||
      process.env.TELEGRAM_BOT_USERNAME ||
      'tubepilotai_bot';
    const botUsername = rawUsername.replace(/^@/, '');
    return NextResponse.json({
      success: false,
      error: err.message,
      deepLink: `https://t.me/${botUsername}?start=webapp`,
    }, { status: 500 });
  }
}
