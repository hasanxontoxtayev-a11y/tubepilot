import { prisma } from '@kanal/db';
import { YouTubeService } from '@kanal/youtube';
import { NextRequest, NextResponse } from 'next/server';

export async function POST(req: NextRequest) {
  try {
    const { commentId, replyText } = await req.json();

    if (!commentId || !replyText) {
      return NextResponse.json({ error: 'Missing commentId or replyText' }, { status: 400 });
    }

    const commentThread = await prisma.commentThread.findUnique({
      where: { id: commentId },
      include: { video: true },
    });

    if (commentThread && commentThread.video?.channelId) {
      // Dispatch live reply to YouTube Data API v3
      await YouTubeService.insertCommentReply(
        commentThread.video.channelId,
        commentId,
        replyText
      );

      await prisma.commentThread.update({
        where: { id: commentId },
        data: {
          approvalStatus: 'PUBLISHED',
          approvedVia: 'WEB',
          approvedAt: new Date(),
          postedToYouTubeAt: new Date(),
          finalApprovedReply: replyText,
        },
      });
    }

    return NextResponse.json({ success: true });
  } catch (error: any) {
    console.error('Comment approval error:', error);
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
