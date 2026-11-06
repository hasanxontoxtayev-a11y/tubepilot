import { NextRequest, NextResponse } from 'next/server';
import crypto from 'crypto';

export const dynamic = 'force-dynamic';

export async function POST(req: NextRequest) {
  try {
    let body: any = {};
    try {
      body = await req.json();
    } catch {}

    const pairToken = crypto.randomBytes(8).toString('hex');
    const rawUsername =
      process.env.NEXT_PUBLIC_TELEGRAM_BOT_USERNAME ||
      process.env.TELEGRAM_BOT_USERNAME ||
      'tubepilotai_bot';
    const botUsername = rawUsername.replace(/^@/, '');

    // Encode channel handle into deep link payload so Telegram bot strictly binds to this channel only
    const cleanHandle = (body?.channelHandle || '').replace(/^@/, '').trim();
    const deepLinkPayload = cleanHandle ? `pair_${cleanHandle}` : `link_${pairToken}`;
    const deepLink = `https://t.me/${botUsername}?start=${encodeURIComponent(deepLinkPayload)}`;

    const res = NextResponse.json({
      success: true,
      token: pairToken,
      botUsername,
      deepLink,
      channel: cleanHandle || null,
    });

    res.cookies.set('tubepilot_tg_pair_token', pairToken, {
      path: '/',
      maxAge: 60 * 30, // 30 minutes
      httpOnly: false,
    });

    return res;
  } catch (err: any) {
    const rawUsername =
      process.env.NEXT_PUBLIC_TELEGRAM_BOT_USERNAME ||
      process.env.TELEGRAM_BOT_USERNAME ||
      'tubepilotai_bot';
    const botUsername = rawUsername.replace(/^@/, '');
    return NextResponse.json({
      success: true,
      token: 'direct',
      botUsername,
      deepLink: `https://t.me/${botUsername}?start=webapp`,
    });
  }
}
