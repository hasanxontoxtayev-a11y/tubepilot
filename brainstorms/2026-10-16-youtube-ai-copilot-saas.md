# TubePilot AI - YouTube AI SaaS Copilot (VidIQ Competitor): Brainstorm / Discovery Notes
Date: 2026-10-16 · Goal: Architect and build TubePilot AI — a full-scale VidIQ competitor with YouTube Data API v3, Google Gemini, and Telegram Bot synchronization.

## Summary / key decisions
- **Scope & Core Features**:
  - Freemium model with monthly subscriptions.
  - Languages: English, Russian, Uzbek UI, plus deep contextual Telegram Helpdesk.
  - Multilingual AI Comment Copilot: Human-in-the-loop approval via Telegram Bot or Web dashboard (no auto-post).
  - Thumbnail Evaluator: Gemini Flash Vision contrast, readability, and CTR scoring (Web/Telegram upload + background auto-scan on channel publish).
  - Best Posting Time Engine based on audience activity data.
  - Synchronized Telegram Bot companion.
  - Payments: Stripe (Cards/Apple Pay/Google Pay), PayPal, and Crypto.
- **Architecture Stack (Decided)**:
  - Monorepo TypeScript structure (e.g. Turborepo / npm workspaces).
  - Next.js 15 (App Router / Fullstack API) for Dashboard & core endpoints.
  - PostgreSQL + Prisma ORM.
  - Redis + BullMQ for background worker queues (thumbnail auto-scanner, scheduled channel syncing, AI generation jobs).
  - grammY for Telegram Bot (type-safe, high throughput, shares Prisma DB and BullMQ queues directly).

- **Auth & Account Pairing (Decided)**:
  - Web uses Google OAuth requesting YouTube Data API scopes (`youtube.readonly`, `youtube.force-ssl` for drafting/replying to comments).
  - Web dashboard generates a 1-time short-lived deep-link ticket (`https://t.me/YourBot?start=link_TOKEN`).
  - When creator taps `/start link_TOKEN` in Telegram, grammY pairs their `telegramUserId` and chat ID directly to their User record in PostgreSQL.
- **YouTube Quota & Sync Architecture (Decided)**:
  - Google PubSubHubbub (WebSub) webhooks: Zero-quota instant push notification when any connected channel publishes a new video or updates metadata. Immediately triggers the thumbnail AI analysis worker.
  - Tier-differentiated BullMQ scheduled polling for comments & analytics (e.g., Free: every 6h, Pro: every 15-30m).
  - Quota accounting & rate-limiter service in Redis to avoid hitting the 10,000 units/day project ceiling.
- **Monetization & Multi-Gateway Billing (Decided)**:
  - Unified `SubscriptionService` in backend.
  - Gateways: Stripe (Cards, Apple Pay, Google Pay), PayPal REST Subscriptions, and Crypto (e.g. Cryptomus / NOWPayments) handling webhooks to normalize lifecycle states (`ACTIVE`, `PAST_DUE`, `CANCELED`, `EXPIRED`) on the user record.
- **Thumbnail Evaluator AI Pipeline (Decided)**:
  - Google Gemini Flash Multimodal using official Google Gen AI SDK (`@google/genai`).
  - Strict JSON schema enforcement (`responseSchema`) guaranteeing:
    - `predictedCtrScore` (number 1-100)
    - `contrastAnalysis` (rating & feedback)
    - `textReadability` (font size, contrast against background, mobile clarity)
    - `focalPoint` (rule of thirds / face emotion / visual hook)
    - `actionableFixes` (array of concrete bullet points)
  - Evaluator jobs triggered either via direct user upload (Web/Telegram) or automatically by the WebSub publisher worker upon new video detection.
- **Multilingual AI Comment Copilot Approval UX (Decided)**:
  - Background worker detects unanswered top comments.
  - Gemini detects source language and crafts a personalized, creator-voiced reply in that same language.
  - Telegram Bot pushes interactive inline keyboard card: `[✅ Approve & Send] [✏️ Edit Reply] [❌ Discard]`.
  - Tapping `Approve` dispatches YouTube Data API `comments.insert` via the creator's stored OAuth token.
  - Web dashboard provides a synchronized batch approval queue with identical actions.
- **Best Posting Time Engine (Decided)**:
  - Hybrid Analytics Engine:
    - Primary: Queries YouTube Analytics API (`reports.query`) with dimensions `dayOfWeek,hour` to build a 7x24 audience activity heatmap matrix.
    - Fallback: If YouTube Analytics scope is omitted or restricted, runs heuristic velocity analysis across the channel's top 50 recent videos (historical view count / age / upload timestamp clustering).
- **Contextual Helpdesk (Decided)**:
  - Deep-link convention: `https://t.me/YourBot?start=help_<feature_key>` (e.g. `help_thumbnails`, `help_posting_time`, `help_comment_copilot`).
  - Telegram bot parses `ctx.match`, checks user's UI language preference (`en`, `ru`, `uz`), and delivers instant rich localized cards with step-by-step guidance, action buttons, and FAQs.
- **Monorepo Directory Structure (Decided)**:
  - Managed via **Turborepo** + `pnpm`/`npm`:
    - `apps/web`: Next.js 15 (App Router, Tailwind CSS, shadcn/ui, next-intl for en/ru/uz, API routes, Google OAuth).
    - `apps/worker`: BullMQ background consumers (WebSub receiver, comment sync, thumbnail evaluator job, subscription reconciliation).
    - `apps/bot`: grammY bot process (Telegram inline keyboard handlers, deep-link authentication, contextual helpdesk).
    - `packages/db`: Prisma schema, client, migrations, and database seed.
    - `packages/queue`: BullMQ queue definitions, job payloads, and connection managers.
    - `packages/ai`: Gemini Flash Vision and Gemini text generation clients with strict JSON schemas.
    - `packages/youtube`: YouTube Data API v3 & YouTube Analytics API wrapper with Redis token refresh & quota management.
    - `packages/config`: Shared ESLint, TypeScript, and Tailwind configurations.

## Q&A log
### Q1 — Core Stack & Architecture Topology
- Asked: Which core architectural stack topology do you want to establish for the Web Dashboard, Backend Services, Background Workers, and Telegram Bot?
- Captured: Selected Monorepo TypeScript stack: Next.js 15 (App Router) + Node.js Worker (BullMQ + Redis) + grammY Bot with shared Prisma ORM models and types.
- Flags: None.

### Q2 — User Auth, YouTube OAuth & Telegram Pairing Flow
- Asked: How should user authentication, YouTube OAuth permission grants, and Telegram user account pairing interact?
- Captured: Dual-token link. Creator logs into Web with Google OAuth (granting YouTube scopes), then pairs Telegram via a 1-time deep link (`/start <token>`), uniting the Web and Telegram bot session on the same database record.
- Flags: Need robust refresh token rotation & secure encrypted storage for Google OAuth tokens.

### Q3 — YouTube Quota & Background Sync Strategy
- Asked: YouTube Data API v3 has strict default quota limits (10,000 units/day per project). How do you want to architect channel video detection and comment synchronization?
- Captured: Hybrid PubSubHubbub (WebSub) push webhooks for immediate zero-quota video publish alerts + Tier-based BullMQ polling for comments (Free 6h, Pro 15-30m) with Redis quota tracking.
- Flags: WebSub subscription lease renewal worker required every few days.

### Q4 — Monetization & Multi-Gateway Billing Engine
- Asked: For monetization (Stripe, PayPal, Crypto), which billing infrastructure architecture do you want to implement?
- Captured: Tiered payment gateway router: Stripe + PayPal REST + Crypto webhook provider (e.g., Cryptomus) feeding into an abstracted `SubscriptionService`.
- Flags: Crypto subscriptions are typically fixed-period invoices (30 days) rather than recurring card charges; need expiration reconciliation cron.

### Q5 — Thumbnail AI Evaluator Pipeline
- Asked: For the Thumbnail AI Evaluator, what processing architecture do you want for calculating contrast, readability, and CTR score?
- Captured: Direct structured output with Google Gemini Flash Vision enforcing strict JSON schema (score, contrast, readability, focal points, actionable fixes).
- Flags: Store original thumbnail image buffers temporarily in S3/Cloudflare R2 or pass YouTube CDN URLs directly to Gemini.

### Q6 — Comment Copilot Approval UX
- Asked: For the Human-in-the-Loop Multilingual AI Comment Copilot, how should the interaction and approval UX behave between Telegram and the Web Dashboard?
- Captured: Inline Keyboard cards in Telegram (`[✅ Approve] [✏️ Edit] [❌ Discard]`) for 1-tap mobile execution + batch inbox in Web Dashboard.
- Flags: Handling comment edit state in Telegram (using conversation plugin or temporary edit prompt).

### Q7 — Best Posting Time Engine
- Asked: For the Best Posting Time Engine, how should channel audience peak activity be derived?
- Captured: Hybrid method: First attempts YouTube Analytics API reports (`dayOfWeek,hour`), and falls back to publication velocity heuristics on recent uploads if user scopes don't include YouTube Analytics.
- Flags: Handle creator local timezone conversion for accurate UI display.

### Q8 — Contextual Helpdesk UX & Telegram Linking
- Asked: For the Contextual Helpdesk (every feature having direct Telegram help), what interaction pattern do you prefer?
- Captured: Direct Telegram deep links `https://t.me/YourBot?start=help_<feature_key>` mapped to localized, multi-language Telegram help cards.
- Flags: Ensure fallback in web UI if user does not have Telegram installed.

### Q9 — Monorepo Tooling & Package Structure
- Asked: For monorepo workspace orchestration, do you want to configure Turborepo with shared packages (Prisma DB, Queue definitions, YouTube client, AI client) and separate app runtimes?
- Captured: Turborepo architecture with `apps/{web, worker, bot}` and `packages/{db, queue, ai, youtube, config}`.
- Flags: None.

### Q10 — Next.js 15 Web Application & UI System Implementation
- Asked: Implement the complete Next.js 15 Web Application with next-intl (en, ru, uz), Onboarding Modal, Telegram Helpdesk triggers, Creator Dashboard, Comment Copilot Inbox, Thumbnail Studio, and OAuth flows.
- Captured:
  - `apps/web`: Next.js 15 App Router configured with `next-intl` (en, ru, uz locale routing and dictionary files).
  - `OnboardingModal`: Illustrated animated 4-step walk-through introducing Vision AI, Multilingual Copilot, Heatmaps, and the Telegram bot.
  - `TelegramHelpButton`: Contextual deep-link launcher (`https://t.me/Bot?start=help_<feature_key>`) integrated across every dashboard card.
  - `CommentInbox`: Human-in-the-loop approval inbox with multi-lingual badge detection, inline reply editor, and batch approval trigger.
  - `ThumbnailStudio`: Multimodal image uploader with real-time Gemini Flash Vision CTR scoring, contrast/readability ratings, and actionable fixes.
  - `PostingHeatmap`: 7x24 audience activity matrix visualizing peak engagement hours.
  - `TelegramPairingCard`: 1-click token pairing generator connecting creator web accounts to the Telegram companion bot.
  - API Routes: `/api/auth/youtube`, `/api/auth/callback/google`, `/api/telegram/pair`, `/api/thumbnails/evaluate`, and `/api/comments/approve`.

## Open flags (pending input)
