import { prisma } from '@kanal/db';
import { NextRequest, NextResponse } from 'next/server';

function corsHeaders() {
  return {
    'Access-Control-Allow-Origin': '*',
    'Access-Control-Allow-Methods': 'GET, POST, OPTIONS',
    'Access-Control-Allow-Headers': 'Content-Type, Authorization',
  };
}

export async function OPTIONS() {
  return new NextResponse(null, {
    status: 204,
    headers: corsHeaders(),
  });
}

export async function GET(req: NextRequest) {
  try {
    const userId = req.cookies.get('kanal_user_id')?.value;
    let user = userId
      ? await prisma.user.findUnique({
          where: { id: userId },
          include: { channel: true },
        })
      : null;

    if (!user) {
      user = await prisma.user.findFirst({
        include: { channel: true },
      });
    }

    let channel = user?.channel;
    if (!channel) {
      channel = await prisma.youTubeChannel.findFirst({
        orderBy: { updatedAt: 'desc' },
      });
    }

    if (!channel) {
      return NextResponse.json(
        {
          success: true,
          connected: false,
          channel: null,
          token: null,
          dashboardUrl: 'http://localhost:3001/uz/dashboard',
        },
        { headers: corsHeaders() }
      );
    }

    const subNum = Number(channel.subscriberCount || 0);
    const viewNum = Number(channel.viewCount || 0);

    const formattedSubscribers =
      subNum >= 1000000
        ? `${(subNum / 1000000).toFixed(2)}M`
        : subNum >= 1000
        ? `${Math.round(subNum / 1000)}K`
        : String(subNum);

    const formattedViews =
      viewNum >= 1000000000
        ? `${(viewNum / 1000000000).toFixed(2)}B`
        : viewNum >= 1000000
        ? `${(viewNum / 1000000).toFixed(1)}M`
        : String(viewNum);

    return NextResponse.json(
      {
        success: true,
        connected: true,
        channel: {
          id: channel.id,
          title: channel.title,
          handle: channel.customUrl || '@channel',
          avatar: channel.thumbnailUrl,
          subscribers: formattedSubscribers,
          rawSubscribers: subNum,
          views: formattedViews,
          rawViews: viewNum,
          videoCount: channel.videoCount,
          isPaired: !!user?.telegramChatId,
        },
        token: 'tp_extension_bridge_v1',
        dashboardUrl: 'http://localhost:3001/uz/dashboard',
      },
      { headers: corsHeaders() }
    );
  } catch (error: any) {
    return NextResponse.json(
      { success: false, error: error.message },
      { status: 500, headers: corsHeaders() }
    );
  }
}
