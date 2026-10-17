import { google } from 'googleapis';
import { prisma } from '@kanal/db';
import { encryptToken } from '@kanal/youtube';
import { NextRequest, NextResponse } from 'next/server';

export async function GET(req: NextRequest) {
  const { searchParams } = new URL(req.url);
  const code = searchParams.get('code');

  if (!code) {
    return NextResponse.json({ error: 'Missing authorization code' }, { status: 400 });
  }

  try {
    const oauth2Client = new google.auth.OAuth2(
      process.env.GOOGLE_CLIENT_ID,
      process.env.GOOGLE_CLIENT_SECRET,
      process.env.GOOGLE_REDIRECT_URI
    );

    const { tokens } = await oauth2Client.getToken(code);
    oauth2Client.setCredentials(tokens);

    // Fetch user profile
    const oauth2 = google.oauth2({ version: 'v2', auth: oauth2Client });
    const userInfo = await oauth2.userinfo.get();

    // Fetch channel metadata
    const youtube = google.youtube({ version: 'v3', auth: oauth2Client });
    const channelRes = await youtube.channels.list({
      part: ['snippet', 'statistics'],
      mine: true,
    });

    const channelItem = channelRes.data.items?.[0];
    if (!channelItem || !channelItem.id) {
      return NextResponse.json({ error: 'No YouTube channel found for this account' }, { status: 404 });
    }

    // Upsert User
    const email = userInfo.data.email || `${channelItem.id}@youtube.placeholder`;
    const user = await prisma.user.upsert({
      where: { email },
      create: {
        email,
        name: userInfo.data.name || channelItem.snippet?.title || 'Creator',
        avatarUrl: userInfo.data.picture || channelItem.snippet?.thumbnails?.default?.url,
      },
      update: {
        name: userInfo.data.name || channelItem.snippet?.title,
        avatarUrl: userInfo.data.picture || channelItem.snippet?.thumbnails?.default?.url,
      },
    });

    // Upsert YouTubeChannel with encrypted tokens
    await prisma.youTubeChannel.upsert({
      where: { id: channelItem.id },
      create: {
        id: channelItem.id,
        userId: user.id,
        title: channelItem.snippet?.title || 'My Channel',
        description: channelItem.snippet?.description,
        customUrl: channelItem.snippet?.customUrl || null,
        thumbnailUrl: channelItem.snippet?.thumbnails?.high?.url || channelItem.snippet?.thumbnails?.default?.url,
        subscriberCount: BigInt(channelItem.statistics?.subscriberCount || 0),
        videoCount: Number(channelItem.statistics?.videoCount || 0),
        viewCount: BigInt(channelItem.statistics?.viewCount || 0),
        encryptedAccessToken: encryptToken(tokens.access_token || ''),
        encryptedRefreshToken: encryptToken(tokens.refresh_token || ''),
        tokenExpiresAt: new Date(tokens.expiry_date || Date.now() + 3600 * 1000),
        tokenScope: tokens.scope || '',
      },
      update: {
        title: channelItem.snippet?.title || undefined,
        customUrl: channelItem.snippet?.customUrl || undefined,
        thumbnailUrl: channelItem.snippet?.thumbnails?.high?.url || channelItem.snippet?.thumbnails?.default?.url || undefined,
        subscriberCount: BigInt(channelItem.statistics?.subscriberCount || 0),
        videoCount: Number(channelItem.statistics?.videoCount || 0),
        viewCount: BigInt(channelItem.statistics?.viewCount || 0),
        encryptedAccessToken: encryptToken(tokens.access_token || ''),
        ...(tokens.refresh_token && { encryptedRefreshToken: encryptToken(tokens.refresh_token) }),
        tokenExpiresAt: new Date(tokens.expiry_date || Date.now() + 3600 * 1000),
      },
    });

    // Redirect to dashboard with paired session
    const response = NextResponse.redirect(
      new URL('/uz/dashboard?connected=true&google_oauth=success', req.url)
    );
    response.cookies.set('kanal_user_id', user.id, {
      path: '/',
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      maxAge: 60 * 60 * 24 * 30,
    });
    response.cookies.set('tubepilot_google_connected', 'true', {
      path: '/',
      maxAge: 60 * 60 * 24 * 30,
    });
    return response;
  } catch (error: any) {
    console.error('OAuth Callback Error:', error);
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
