import { GeminiService } from '@kanal/ai';
import { NextRequest, NextResponse } from 'next/server';

export async function POST(req: NextRequest) {
  try {
    const formData = await req.formData();
    const file = formData.get('thumbnail') as File | null;

    if (!file) {
      return NextResponse.json({ error: 'No thumbnail file provided' }, { status: 400 });
    }

    const arrayBuffer = await file.arrayBuffer();
    const buffer = Buffer.from(arrayBuffer);

    // Call Gemini 2.0 Flash Vision
    const result = await GeminiService.evaluateThumbnail(buffer, file.type || 'image/jpeg');

    return NextResponse.json(result);
  } catch (error: any) {
    console.error('Thumbnail Evaluation Error:', error);
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
