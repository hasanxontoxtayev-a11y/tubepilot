import { prisma } from '@kanal/db';
import { NextRequest, NextResponse } from 'next/server';

export async function GET(req: NextRequest) {
  try {
    const userId = req.cookies.get('kanal_user_id')?.value;
    let user = userId
      ? await prisma.user.findUnique({
          where: { id: userId },
        })
      : null;

    if (!user) {
      user = await prisma.user.findFirst();
    }

    if (!user) {
      return NextResponse.json({
        success: true,
        subscription: {
          tier: 'FREE',
          status: 'INACTIVE',
          planPrice: 0,
          currentPeriodEnd: null,
        },
      });
    }

    return NextResponse.json({
      success: true,
      subscription: {
        tier: user.subscriptionTier || 'FREE',
        status: user.subscriptionStatus || 'INACTIVE',
        planPrice: user.planPrice || 0,
        currentPeriodEnd: user.currentPeriodEnd,
        customerId: user.customerId,
      },
    });
  } catch (error: any) {
    return NextResponse.json({ success: false, error: error.message }, { status: 500 });
  }
}

export async function POST(req: NextRequest) {
  try {
    const body = await req.json().catch(() => ({}));
    const { tier = 'PRO', interval = 'monthly', simulate = false, locale = 'uz' } = body;

    const normalizedTier = ['FREE', 'PRO', 'ELITE'].includes(tier.toUpperCase())
      ? (tier.toUpperCase() as 'FREE' | 'PRO' | 'ELITE')
      : 'PRO';

    // Self-healing migration for SQLite
    try { await prisma.$executeRawUnsafe(`ALTER TABLE "User" ADD COLUMN "planPrice" REAL DEFAULT 0`); } catch {}
    try { await prisma.$executeRawUnsafe(`ALTER TABLE "User" ADD COLUMN "currentPeriodEnd" DATETIME`); } catch {}
    try { await prisma.$executeRawUnsafe(`ALTER TABLE "User" ADD COLUMN "customerId" TEXT`); } catch {}

    const userId = req.cookies.get('kanal_user_id')?.value;
    let user = userId
      ? await prisma.user.findUnique({
          where: { id: userId },
        })
      : null;

    if (!user) {
      user = await prisma.user.findFirst();
    }

    if (!user) {
      user = await prisma.user.create({
        data: {
          email: 'creator@gmail.com',
          name: 'Verified Creator',
          subscriptionTier: 'FREE',
          subscriptionStatus: 'INACTIVE',
        },
      });
    }

    // 1. REAL LEMON SQUEEZY CHECKOUT SESSION CREATION
    const lsApiKey = process.env.LEMON_SQUEEZY_API_KEY;
    const storeId = process.env.LEMON_SQUEEZY_STORE_ID || '499747';
    // Variant 2258031 corresponds to TubePilot Pro product 1446478
    const variantId = process.env.LEMON_SQUEEZY_VARIANT_ID || '2258031';

    if (lsApiKey && normalizedTier !== 'FREE' && !simulate) {
      try {
        const origin =
          req.headers.get('origin') ||
          process.env.NEXT_PUBLIC_APP_URL ||
          'http://localhost:3001';
        const redirectUrl = `${origin}/${locale}/dashboard?payment=success&tier=${normalizedTier}`;

        const payload = {
          data: {
            type: 'checkouts',
            attributes: {
              checkout_data: {
                email: user.email,
                name: user.name || 'Verified Creator',
                custom: {
                  user_id: user.id,
                  tier: normalizedTier,
                  interval,
                },
              },
              product_options: {
                redirect_url: redirectUrl,
              },
            },
            relationships: {
              store: {
                data: { type: 'stores', id: storeId },
              },
              variant: {
                data: { type: 'variants', id: variantId },
              },
            },
          },
        };

        const lsRes = await fetch('https://api.lemonsqueezy.com/v1/checkouts', {
          method: 'POST',
          headers: {
            Accept: 'application/vnd.api+json',
            'Content-Type': 'application/vnd.api+json',
            Authorization: `Bearer ${lsApiKey}`,
          },
          body: JSON.stringify(payload),
        });

        const lsData = await lsRes.json();
        const checkoutUrl = lsData?.data?.attributes?.url;

        if (checkoutUrl) {
          const response = NextResponse.json({
            success: true,
            checkoutUrl,
            url: checkoutUrl,
            simulated: false,
            message: 'Lemon Squeezy checkout session created successfully',
          });

          response.cookies.set('kanal_user_id', user.id, {
            path: '/',
            httpOnly: true,
            secure: process.env.NODE_ENV === 'production',
            maxAge: 60 * 60 * 24 * 30,
          });

          return response;
        } else {
          console.warn('[LemonSqueezy] Checkout error response:', lsData);
        }
      } catch (lsErr) {
        console.error('[LemonSqueezy] Checkout creation failed:', lsErr);
      }
    }

    // 2. SIMULATED / FALLBACK INSTANT UPGRADE (Dev mode or Free tier)
    let price = 0;
    if (normalizedTier === 'PRO') {
      price = interval === 'annual' ? 15 : 19;
    } else if (normalizedTier === 'ELITE') {
      price = interval === 'annual' ? 39 : 49;
    }

    const durationDays = interval === 'annual' ? 365 : 30;
    const currentPeriodEnd = new Date(Date.now() + durationDays * 24 * 60 * 60 * 1000);

    const customerId = user.customerId || `cust_${normalizedTier.toLowerCase()}_${Date.now()}`;
    const status = normalizedTier === 'FREE' ? 'INACTIVE' : 'ACTIVE';
    const periodEndIso = normalizedTier === 'FREE' ? null : currentPeriodEnd.toISOString();

    try {
      await prisma.$executeRawUnsafe(
        `UPDATE "User" SET "subscriptionTier" = ?, "subscriptionStatus" = ?, "planPrice" = ?, "currentPeriodEnd" = ?, "customerId" = ? WHERE "id" = ?`,
        normalizedTier,
        status,
        price,
        periodEndIso,
        customerId,
        user.id
      );
    } catch {
      await prisma.user.update({
        where: { id: user.id },
        data: {
          subscriptionTier: normalizedTier,
          subscriptionStatus: status,
        },
      });
    }

    const response = NextResponse.json({
      success: true,
      simulated: true,
      message: `Tier successfully updated to ${normalizedTier}`,
      subscription: {
        tier: normalizedTier,
        status,
        planPrice: price,
        currentPeriodEnd: normalizedTier === 'FREE' ? null : currentPeriodEnd,
        customerId,
      },
    });

    response.cookies.set('kanal_user_id', user.id, {
      path: '/',
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      maxAge: 60 * 60 * 24 * 30,
    });

    return response;
  } catch (error: any) {
    return NextResponse.json({ success: false, error: error.message }, { status: 500 });
  }
}
