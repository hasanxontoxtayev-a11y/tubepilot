import { NextRequest, NextResponse } from 'next/server';
import { resolveYouTubeChannel, ChannelAuditData } from '@kanal/youtube';

export async function GET(req: NextRequest) {
  try {
    const { searchParams } = new URL(req.url);
    const query = searchParams.get('q')?.trim() || '@MKBHD';

    const auditData: ChannelAuditData = await resolveYouTubeChannel(query);

    return NextResponse.json({
      success: true,
      data: auditData,
    });
  } catch (err: any) {
    console.warn('Channel audit calculation warning:', err);
    return NextResponse.json(
      {
        success: false,
        error: err.message || 'Audit failed',
      },
      { status: 500 }
    );
  }
}
