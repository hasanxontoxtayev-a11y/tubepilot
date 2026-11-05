import { NextRequest, NextResponse } from 'next/server';

export async function GET(req: NextRequest) {
  const { searchParams } = new URL(req.url);
  const key = searchParams.get('key');
  const locale = searchParams.get('locale') || 'uz';

  // Secret master key for the site owner / creator
  const OWNER_SECRET = 'tubepilot_creator_owner_2026';

  if (key !== OWNER_SECRET) {
    return NextResponse.json({ error: 'Ruxsat berilmadi: noto\'g\'ri kalit' }, { status: 403 });
  }

  // Redirect cleanly to dashboard with Lifetime Owner PRO activated
  const targetUrl = new URL(`/${locale}/dashboard?vip=owner_activated`, req.url);
  const response = NextResponse.redirect(targetUrl);

  // Set 10-year lifetime VIP cookies for the owner
  const TEN_YEARS = 60 * 60 * 24 * 365 * 10;
  response.cookies.set('tubepilot_subscription_tier', 'PRO', {
    path: '/',
    maxAge: TEN_YEARS,
  });
  response.cookies.set('tubepilot_owner_pass', 'true', {
    path: '/',
    maxAge: TEN_YEARS,
  });

  return response;
}
