import { NextRequest, NextResponse } from 'next/server';
import fs from 'fs';
import path from 'path';

export async function GET() {
  const clientId = process.env.GOOGLE_CLIENT_ID?.trim();
  const clientSecret = process.env.GOOGLE_CLIENT_SECRET?.trim();
  const isConfigured = Boolean(
    clientId &&
    clientId.length > 10 &&
    !clientId.includes('your-google-client-id') &&
    clientSecret &&
    !clientSecret.includes('your-google-client-secret')
  );

  return NextResponse.json({
    success: true,
    isConfigured,
    redirectUri: process.env.GOOGLE_REDIRECT_URI || 'http://localhost:3001/api/auth/callback/google',
  });
}

export async function POST(req: NextRequest) {
  try {
    const { clientId, clientSecret } = await req.json();

    if (!clientId || !clientSecret) {
      return NextResponse.json(
        { success: false, error: 'GOOGLE_CLIENT_ID va GOOGLE_CLIENT_SECRET kiritilishi shart.' },
        { status: 400 }
      );
    }

    // Set process.env in memory immediately
    process.env.GOOGLE_CLIENT_ID = clientId.trim();
    process.env.GOOGLE_CLIENT_SECRET = clientSecret.trim();

    // Persist to .env.local in project root
    const rootPath = path.resolve(process.cwd(), '../../.env.local');
    const webPath = path.resolve(process.cwd(), '.env.local');

    const envContent = [
      `# TubePilot Google OAuth Credentials`,
      `GOOGLE_CLIENT_ID="${clientId.trim()}"`,
      `GOOGLE_CLIENT_SECRET="${clientSecret.trim()}"`,
      `GOOGLE_REDIRECT_URI="http://localhost:3001/api/auth/callback/google"`,
      '',
    ].join('\n');

    try {
      fs.writeFileSync(rootPath, envContent, { flag: 'a' });
    } catch {}
    try {
      fs.writeFileSync(webPath, envContent, { flag: 'a' });
    } catch {}

    return NextResponse.json({
      success: true,
      message: 'Google Cloud API kalitlari muvaffaqiyatli saqlandi!',
      authUrl: '/api/auth/youtube',
    });
  } catch (err: any) {
    return NextResponse.json({ success: false, error: err.message }, { status: 500 });
  }
}
