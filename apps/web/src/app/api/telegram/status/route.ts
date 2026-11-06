import { NextRequest, NextResponse } from 'next/server';

export const dynamic = 'force-dynamic';

export async function GET(req: NextRequest) {
  try {
    const pairToken = req.cookies.get('tubepilot_tg_pair_token')?.value;
    const isPaired = req.cookies.get('tubepilot_tg_paired')?.value === 'true';

    return NextResponse.json({
      paired: isPaired,
      telegramUsername: isPaired ? 'tubepilotai_bot' : null,
      language: 'uz',
    });
  } catch (error: any) {
    return NextResponse.json({ paired: false });
  }
}
