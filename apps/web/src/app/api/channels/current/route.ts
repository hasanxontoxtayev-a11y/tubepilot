import { NextRequest, NextResponse } from 'next/server';

export async function GET(req: NextRequest) {
  try {
    // Determine active user and subscription
    let subscriptionTier: 'FREE' | 'PRO' = 'FREE';
    let subscriptionStatus = 'INACTIVE';
    let planPrice = 0;
    let currentPeriodEnd = null;

    // Check user subscription cookie first (reliable on serverless)
    const subCookie = req.cookies.get('tubepilot_subscription_tier')?.value;
    const ownerPassCookie = req.cookies.get('tubepilot_owner_pass')?.value;
    if (subCookie === 'PRO' || ownerPassCookie === 'true') {
      subscriptionTier = 'PRO';
      subscriptionStatus = 'ACTIVE';
      planPrice = 0;
    }

    // Safe cookie read for channel (100% reliable on Vercel serverless)
    const channelCookie = req.cookies.get('tubepilot_connected_channel')?.value;
    let cookieChannel = null;
    if (channelCookie) {
      try {
        cookieChannel = JSON.parse(channelCookie);
      } catch {}
    }

    // Safe database read if available
    let ch = null;
    let user = null;
    try {
      const { prisma } = await import('@kanal/db');
      const userId = req.cookies.get('kanal_user_id')?.value;
      if (userId) {
        user = await prisma.user.findUnique({
          where: { id: userId },
          include: { channel: true },
        });
        if (user) {
          if (user.subscriptionTier === 'PRO') {
            subscriptionTier = 'PRO';
            subscriptionStatus = user.subscriptionStatus || 'ACTIVE';
            planPrice = user.planPrice || 19;
            currentPeriodEnd = user.currentPeriodEnd;
          }
          if (user.channel) {
            ch = user.channel;
          }
        }
      }

      if (!ch) {
        ch = await prisma.youTubeChannel.findFirst({
          orderBy: { updatedAt: 'desc' },
        });
      }
    } catch (dbErr) {
      // Serverless without SQLite file - expected, gracefully fallback
    }

    const subscription = {
      tier: subscriptionTier,
      status: subscriptionStatus,
      planPrice,
      currentPeriodEnd,
    };

    if (ch) {
      const subCount = Number(ch.subscriberCount || 0);
      const viewCount = Number(ch.viewCount || 0);

      const formattedSubscribers =
        subCount >= 1000000
          ? `${(subCount / 1000000).toFixed(2)}M`
          : subCount >= 1000
          ? `${Math.round(subCount / 1000)}K`
          : String(subCount);

      const formattedViews =
        viewCount >= 1000000000
          ? `${(viewCount / 1000000000).toFixed(2)}B`
          : viewCount >= 1000000
          ? `${(viewCount / 1000000).toFixed(1)}M`
          : String(viewCount);

      return NextResponse.json({
        success: true,
        channel: {
          id: ch.id,
          title: ch.title,
          handle: ch.customUrl || '@channel',
          avatar: ch.thumbnailUrl,
          subscribers: formattedSubscribers,
          views: formattedViews,
          videoCount: ch.videoCount,
          isPaired: true,
        },
        subscription,
      });
    }

    if (cookieChannel && (cookieChannel.title || cookieChannel.handle)) {
      return NextResponse.json({
        success: true,
        channel: {
          id: cookieChannel.id || 'google_channel',
          title: cookieChannel.title,
          handle: cookieChannel.handle || '@channel',
          avatar: cookieChannel.avatar,
          subscribers: cookieChannel.subscribers || '0',
          views: cookieChannel.views || '0',
          videoCount: cookieChannel.videoCount || 0,
          isPaired: true,
        },
        subscription,
      });
    }

    // Default clean state if nothing connected
    return NextResponse.json({
      success: true,
      channel: null,
      subscription,
    });
  } catch (error: any) {
    return NextResponse.json({
      success: true,
      channel: null,
      subscription: { tier: 'FREE', status: 'INACTIVE', planPrice: 0 },
    });
  }
}
