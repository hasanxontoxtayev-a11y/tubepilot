import { prisma } from '@kanal/db';
import { NextRequest, NextResponse } from 'next/server';
import crypto from 'crypto';

export async function POST(req: NextRequest) {
  try {
    const rawBody = await req.text();
    const signature = req.headers.get('x-signature');
    const webhookSecret = process.env.LEMON_SQUEEZY_WEBHOOK_SECRET;

    // 1. Signature Verification (if secret is configured)
    if (webhookSecret && signature) {
      const hmac = crypto.createHmac('sha256', webhookSecret);
      const digest = hmac.update(rawBody).digest('hex');
      if (digest !== signature) {
        console.warn('[LemonSqueezy Webhook] Invalid signature match');
        return NextResponse.json({ error: 'Invalid webhook signature' }, { status: 401 });
      }
    }

    let event: any;
    try {
      event = JSON.parse(rawBody);
    } catch {
      return NextResponse.json({ error: 'Invalid JSON payload' }, { status: 400 });
    }

    const eventName =
      req.headers.get('x-event-name') ||
      event.meta?.event_name ||
      event.type ||
      'unknown';

    console.log(`[Billing Webhook] Received event: ${eventName}`);

    // Self-healing migration for SQLite
    try { await prisma.$executeRawUnsafe(`ALTER TABLE "User" ADD COLUMN "planPrice" REAL DEFAULT 0`); } catch {}
    try { await prisma.$executeRawUnsafe(`ALTER TABLE "User" ADD COLUMN "currentPeriodEnd" DATETIME`); } catch {}
    try { await prisma.$executeRawUnsafe(`ALTER TABLE "User" ADD COLUMN "customerId" TEXT`); } catch {}

    const customData = event.meta?.custom_data || {};
    const attrs = event.data?.attributes || {};

    const customUserId = customData.user_id;
    const customerEmail =
      attrs.user_email ||
      attrs.customer_email ||
      event.data?.object?.customer_details?.email ||
      event.data?.object?.customer_email;
    const customerId = (attrs.customer_id || event.data?.object?.customer)?.toString();

    // 2. LEMON SQUEEZY: order_created (Successful payment for Pro)
    if (
      eventName === 'order_created' ||
      eventName === 'subscription_created' ||
      eventName === 'subscription_updated' ||
      eventName === 'subscription_resumed' ||
      eventName === 'checkout.session.completed'
    ) {
      const status = attrs.status === 'paid' || attrs.status === 'active' ? 'ACTIVE' : 'ACTIVE';
      const variantName = (attrs.variant_name || '').toUpperCase();
      const customTier = (customData.tier || '').toUpperCase();

      const tier = customTier === 'ELITE' || variantName.includes('ELITE') ? 'ELITE' : 'PRO';
      const price = tier === 'ELITE' ? 49 : 19;
      const renewsAt = attrs.renews_at
        ? new Date(attrs.renews_at).toISOString()
        : new Date(Date.now() + 30 * 24 * 60 * 60 * 1000).toISOString();

      let targetUser: any = null;

      if (customUserId) {
        targetUser = await prisma.user.findUnique({ where: { id: customUserId } }).catch(() => null);
      }
      if (!targetUser && customerEmail) {
        targetUser = await prisma.user.findFirst({ where: { email: customerEmail } }).catch(() => null);
      }
      if (!targetUser && customerId) {
        const rawUsers = (await prisma.$queryRawUnsafe(`SELECT * FROM "User" WHERE "customerId" = ? LIMIT 1`, customerId).catch(() => [])) as any[];
        if (rawUsers && rawUsers.length > 0) {
          targetUser = rawUsers[0];
        }
      }
      if (!targetUser) {
        targetUser = await prisma.user.findFirst().catch(() => null);
      }

      if (targetUser) {
        try {
          await prisma.$executeRawUnsafe(
            `UPDATE "User" SET "subscriptionTier" = ?, "subscriptionStatus" = ?, "customerId" = ?, "planPrice" = ?, "currentPeriodEnd" = ? WHERE "id" = ?`,
            tier,
            status,
            customerId || targetUser.customerId || `cust_${tier.toLowerCase()}_${Date.now()}`,
            price,
            renewsAt,
            targetUser.id
          );
        } catch {
          await prisma.user.update({
            where: { id: targetUser.id },
            data: {
              subscriptionTier: tier,
              subscriptionStatus: status,
            },
          });
        }

        console.log(`[Billing Webhook] Activated ${tier} for user ${targetUser.email} (${targetUser.id})`);

        return NextResponse.json({
          success: true,
          activated: true,
          event: eventName,
          tier,
          userId: targetUser.id,
        });
      }
    }

    // 3. LEMON SQUEEZY: subscription_cancelled / subscription_expired
    if (
      eventName === 'subscription_cancelled' ||
      eventName === 'subscription_expired' ||
      eventName === 'customer.subscription.deleted'
    ) {
      if (customerId || customerEmail) {
        try {
          if (customerId) {
            await prisma.$executeRawUnsafe(
              `UPDATE "User" SET "subscriptionTier" = 'FREE', "subscriptionStatus" = 'CANCELED', "planPrice" = 0 WHERE "customerId" = ?`,
              customerId
            );
          } else if (customerEmail) {
            await prisma.$executeRawUnsafe(
              `UPDATE "User" SET "subscriptionTier" = 'FREE', "subscriptionStatus" = 'CANCELED', "planPrice" = 0 WHERE "email" = ?`,
              customerEmail
            );
          }
        } catch {}
      }

      console.log(`[Billing Webhook] Cancelled subscription for customer ${customerId || customerEmail}`);

      return NextResponse.json({
        success: true,
        canceled: true,
        event: eventName,
      });
    }

    return NextResponse.json({ received: true, event: eventName });
  } catch (error: any) {
    console.error('[Billing Webhook Error]:', error);
    return NextResponse.json({ success: false, error: error.message }, { status: 500 });
  }
}
