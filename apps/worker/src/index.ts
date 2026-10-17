import { Worker } from "bullmq";
import { QUEUE_NAMES, redisConnection, ThumbnailEvalJobData, CommentDraftJobData, WebSubPublishJobData } from "@kanal/queue";
import { GeminiService } from "@kanal/ai";
import { YouTubeService } from "@kanal/youtube";
import { prisma } from "@kanal/db";
import { bot } from "@kanal/bot/src/bot";
import { InlineKeyboard } from "grammy";

// -----------------------------------------------------------------------------
// 1. THUMBNAIL EVALUATION WORKER
// -----------------------------------------------------------------------------
export const thumbnailWorker = new Worker<ThumbnailEvalJobData>(
  QUEUE_NAMES.THUMBNAIL_EVAL,
  async (job) => {
    const { userId, videoId, imageUrl, source } = job.data;
    console.log(`[Worker] Evaluating thumbnail for user: ${userId}, source: ${source}`);

    // Download image buffer
    const response = await fetch(imageUrl);
    const arrayBuffer = await response.arrayBuffer();
    const buffer = Buffer.from(arrayBuffer);

    // Call Gemini 2.0 Flash Vision
    const result = await GeminiService.evaluateThumbnail(buffer);

    // Persist evaluation
    const evaluation = await prisma.thumbnailEvaluation.create({
      data: {
        userId,
        videoId,
        imageUrl,
        source,
        predictedCtrScore: result.predictedCtrScore,
        contrastRating: result.contrastRating,
        contrastFeedback: result.contrastFeedback,
        readabilityRating: result.readabilityRating,
        readabilityFeedback: result.readabilityFeedback,
        focalPointAnalysis: result.focalPointAnalysis,
        actionableFixes: JSON.stringify(result.actionableFixes),
      },
    });

    // Notify creator via Telegram if paired
    const user = await prisma.user.findUnique({ where: { id: userId } });
    if (user?.telegramChatId) {
      const message =
        `🎨 **Thumbnail AI Evaluation Ready!**\n\n` +
        `🎯 **Predicted CTR Score:** ${result.predictedCtrScore}/100\n` +
        `🔍 **Contrast:** ${result.contrastRating}\n` +
        `📱 **Readability:** ${result.readabilityRating}\n\n` +
        `💡 **Key Fixes:**\n${result.actionableFixes.map((f) => `• ${f}`).join("\n")}`;

      try {
        await bot.api.sendPhoto(Number(user.telegramChatId), imageUrl, {
          caption: message,
          parse_mode: "Markdown",
        });
      } catch (err) {
        console.error("Failed to notify via Telegram:", err);
      }
    }

    return evaluation;
  },
  { connection: redisConnection }
);

// -----------------------------------------------------------------------------
// 2. COMMENT COPILOT DRAFTING WORKER
// -----------------------------------------------------------------------------
export const commentWorker = new Worker<CommentDraftJobData>(
  QUEUE_NAMES.COMMENT_SYNC_DRAFT,
  async (job) => {
    const { userId, commentId, originalText, authorDisplayName } = job.data;

    // Call Gemini to detect language and draft contextual reply
    const draft = await GeminiService.draftCommentReply(originalText);

    // Update comment record with AI draft
    const updated = await prisma.commentThread.update({
      where: { id: commentId },
      data: {
        aiDraftReply: draft.draftReply,
        detectedLanguage: draft.detectedLanguage,
      },
      include: { user: true },
    });

    // Push Interactive Card to Telegram for 1-Tap Approval
    if (updated.user?.telegramChatId) {
      const keyboard = new InlineKeyboard()
        .text("✅ Approve & Post", `approve_comment:${commentId}`)
        .text("❌ Discard", `discard_comment:${commentId}`);

      const message =
        `💬 **New Comment Received** (${draft.detectedLanguage})\n\n` +
        `👤 **${authorDisplayName}:** "${originalText}"\n\n` +
        `🤖 **Suggested AI Reply:**\n"${draft.draftReply}"\n\n` +
        `_Tap below to approve or discard:_`;

      try {
        await bot.api.sendMessage(Number(updated.user.telegramChatId), message, {
          reply_markup: keyboard,
          parse_mode: "Markdown",
        });
      } catch (err) {
        console.error("Failed to push comment draft to Telegram:", err);
      }
    }

    return updated;
  },
  { connection: redisConnection }
);

console.log("🚀 TubePilot BullMQ background workers initialized and listening to queues.");
