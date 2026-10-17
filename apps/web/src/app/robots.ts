import type { MetadataRoute } from 'next';

export default function robots(): MetadataRoute.Robots {
  const baseUrl = process.env.NEXT_PUBLIC_APP_URL || 'https://tubepilot.ai';

  return {
    rules: [
      {
        userAgent: '*',
        allow: [
          '/',
          '/en',
          '/uz',
          '/ru',
          '/en/pricing',
          '/uz/pricing',
          '/ru/pricing',
        ],
        disallow: [
          '/api/',
          '/*/dashboard',
          '/dashboard',
          '/_next/',
          '/private/',
        ],
      },
      {
        userAgent: 'Googlebot',
        allow: [
          '/',
          '/en',
          '/uz',
          '/ru',
          '/en/pricing',
          '/uz/pricing',
          '/ru/pricing',
        ],
        disallow: [
          '/api/',
          '/*/dashboard',
          '/dashboard',
          '/_next/',
        ],
      },
    ],
    sitemap: `${baseUrl}/sitemap.xml`,
  };
}
