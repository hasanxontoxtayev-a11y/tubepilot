import { Queue, Worker, QueueEvents } from "bullmq";
import Redis from "ioredis";

const connection = new Redis(process.env.REDIS_URL || "redis://localhost:6379", {
  maxRetriesPerRequest: null,
});

export const QUEUE_NAMES = {
  THUMBNAIL_EVAL: "thumbnail-eval-queue",
  COMMENT_SYNC_DRAFT: "comment-sync-draft-queue",
  WEBSUB_EVENT: "websub-event-queue",
  POSTING_TIME_ANALYSIS: "posting-time-analysis-queue",
} as const;

export interface ThumbnailEvalJobData {
  userId: string;
  videoId?: string;
  imageUrl: string;
  source: "MANUAL_WEB" | "MANUAL_TELEGRAM" | "AUTO_CHANNEL_PUBLISH";
}

export interface CommentDraftJobData {
  userId: string;
  channelId: string;
  commentId: string;
  videoId: string;
  authorDisplayName: string;
  originalText: string;
}

export interface WebSubPublishJobData {
  channelId: string;
  videoId: string;
  videoTitle: string;
  publishedAt: string;
}

export const thumbnailEvalQueue = new Queue<ThumbnailEvalJobData>(QUEUE_NAMES.THUMBNAIL_EVAL, { connection });
export const commentDraftQueue = new Queue<CommentDraftJobData>(QUEUE_NAMES.COMMENT_SYNC_DRAFT, { connection });
export const webSubEventQueue = new Queue<WebSubPublishJobData>(QUEUE_NAMES.WEBSUB_EVENT, { connection });

export { connection as redisConnection, Worker, QueueEvents };
