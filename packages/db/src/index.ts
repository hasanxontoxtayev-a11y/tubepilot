import path from 'path';
import fs from 'fs';
import { PrismaClient } from '@prisma/client';

export function getDatabaseUrl(): string {
  const envUrl = process.env.DATABASE_URL || process.env.POSTGRES_PRISMA_URL || process.env.POSTGRES_URL;
  if (envUrl && envUrl.includes('postgres')) {
    return envUrl;
  }
  return 'postgresql://neondb_owner:npg_1EI8YTzrOwoq@ep-dry-art-bck2oh7q-pooler.c-16.us-east-1.aws.neon.tech/neondb?sslmode=require';
}

const dbUrl = getDatabaseUrl();
process.env.DATABASE_URL = dbUrl;

const globalForPrisma = globalThis as unknown as { prisma?: PrismaClient };

export const prisma =
  globalForPrisma.prisma ??
  new PrismaClient({
    datasources: {
      db: {
        url: dbUrl,
      },
    },
    log: process.env.NODE_ENV === 'development' ? ['query', 'error', 'warn'] : ['error'],
  });

if (process.env.NODE_ENV !== 'production') {
  globalForPrisma.prisma = prisma;
}

// -----------------------------------------------------------------------------
// ENUM TYPES & VALUES FOR FULL BACKWARDS COMPATIBILITY
// -----------------------------------------------------------------------------

export type SubscriptionTier = 'FREE' | 'PRO' | 'ELITE' | 'ENTERPRISE';
export const SubscriptionTier = {
  FREE: 'FREE',
  PRO: 'PRO',
  ELITE: 'ELITE',
  ENTERPRISE: 'ENTERPRISE',
} as const;

export type SubscriptionStatus =
  | 'INACTIVE'
  | 'TRIALING'
  | 'ACTIVE'
  | 'PAST_DUE'
  | 'CANCELED'
  | 'EXPIRED';
export const SubscriptionStatus = {
  INACTIVE: 'INACTIVE',
  TRIALING: 'TRIALING',
  ACTIVE: 'ACTIVE',
  PAST_DUE: 'PAST_DUE',
  CANCELED: 'CANCELED',
  EXPIRED: 'EXPIRED',
} as const;

export type PaymentProvider = 'STRIPE' | 'PAYPAL' | 'CRYPTO';
export const PaymentProvider = {
  STRIPE: 'STRIPE',
  PAYPAL: 'PAYPAL',
  CRYPTO: 'CRYPTO',
} as const;

export type LanguageCode = 'en' | 'ru' | 'uz';
export const LanguageCode = {
  en: 'en',
  ru: 'ru',
  uz: 'uz',
} as const;

export type CommentApprovalStatus =
  | 'PENDING'
  | 'APPROVED'
  | 'EDITED_AND_APPROVED'
  | 'REJECTED'
  | 'PUBLISHED'
  | 'FAILED';
export const CommentApprovalStatus = {
  PENDING: 'PENDING',
  APPROVED: 'APPROVED',
  EDITED_AND_APPROVED: 'EDITED_AND_APPROVED',
  REJECTED: 'REJECTED',
  PUBLISHED: 'PUBLISHED',
  FAILED: 'FAILED',
} as const;

export type ThumbnailEvaluationSource =
  | 'MANUAL_WEB'
  | 'MANUAL_TELEGRAM'
  | 'AUTO_CHANNEL_PUBLISH';
export const ThumbnailEvaluationSource = {
  MANUAL_WEB: 'MANUAL_WEB',
  MANUAL_TELEGRAM: 'MANUAL_TELEGRAM',
  AUTO_CHANNEL_PUBLISH: 'AUTO_CHANNEL_PUBLISH',
} as const;

export * from '@prisma/client';
