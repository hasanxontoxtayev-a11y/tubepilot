import crypto from "crypto";

const ALGORITHM = "aes-256-gcm";
const IV_LENGTH = 12;
const TAG_LENGTH = 16;

/**
 * Encrypts sensitive tokens (e.g. YouTube OAuth refresh tokens) using AES-256-GCM
 */
export function encryptToken(text: string): string {
  const secret = process.env.TOKEN_ENCRYPTION_KEY;
  if (!secret || secret.length !== 64) {
    throw new Error("TOKEN_ENCRYPTION_KEY must be a 64-character (32-byte) hex string.");
  }

  const iv = crypto.randomBytes(IV_LENGTH);
  const cipher = crypto.createCipheriv(ALGORITHM, Buffer.from(secret, "hex"), iv);
  
  const encrypted = Buffer.concat([cipher.update(text, "utf8"), cipher.final()]);
  const tag = cipher.getAuthTag();

  // Return iv:tag:encrypted as hex
  return `${iv.toString("hex")}:${tag.toString("hex")}:${encrypted.toString("hex")}`;
}

/**
 * Decrypts an encrypted token string using AES-256-GCM
 */
export function decryptToken(encryptedPayload: string): string {
  const secret = process.env.TOKEN_ENCRYPTION_KEY;
  if (!secret || secret.length !== 64) {
    throw new Error("TOKEN_ENCRYPTION_KEY must be a 64-character (32-byte) hex string.");
  }

  const [ivHex, tagHex, contentHex] = encryptedPayload.split(":");
  if (!ivHex || !tagHex || !contentHex) {
    throw new Error("Invalid encrypted token format.");
  }

  const iv = Buffer.from(ivHex, "hex");
  const tag = Buffer.from(tagHex, "hex");
  const content = Buffer.from(contentHex, "hex");

  const decipher = crypto.createDecipheriv(ALGORITHM, Buffer.from(secret, "hex"), iv);
  decipher.setAuthTag(tag);

  const decrypted = Buffer.concat([decipher.update(content), decipher.final()]);
  return decrypted.toString("utf8");
}
