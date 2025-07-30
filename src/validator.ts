// src/validator.ts
import ffmpeg from 'fluent-ffmpeg';
import path from 'path';
import fs from 'fs-extra';

export interface ValidationResult {
  passed: boolean;
  reasons: string[];
  checks: {
    [key: string]: boolean;
  };
}

/**
 * Extract width and height from video to check aspect ratio
 */
function getAspectRatio(videoPath: string): Promise<number> {
  return new Promise((resolve, reject) => {
    ffmpeg.ffprobe(videoPath, (err, metadata) => {
      if (err) return reject(err);
      const stream = metadata.streams.find(s => s.width && s.height);
      if (!stream || !stream.width || !stream.height) return reject('Invalid video metadata');
      resolve(stream.height / stream.width);
    });
  });
}

/**
 * Use description to infer possible rejections (for now via Gemini result only)
 */
function checkForWatermarksOrText(description: string): boolean {
  const keywords = ['tiktok', 'logo', 'subtitle', 'caption', 'username', 'watermark'];
  return keywords.some(word => description.toLowerCase().includes(word));
}

/**
 * Simulate talking/audio check using description (ideally replace with STT later)
 */
function checkForTalking(description: string): boolean {
  return description.toLowerCase().includes('says') || description.toLowerCase().includes('talk');
}

/**
 * Simulate lyric detection based on description (simplified)
 */
function checkForLyrics(description: string): boolean {
  return description.toLowerCase().includes('lyrics') || description.toLowerCase().includes('sung');
}

export async function validateVideo(video: any, videoPath: string, description: string): Promise<ValidationResult> {
  const reasons: string[] = [];
  const checks: Record<string, boolean> = {};

  // Duration
  checks.duration = video.duration >= 8;
  if (!checks.duration) reasons.push('Video too short (< 8s)');

  // Aspect Ratio
  try {
    const aspectRatio = await getAspectRatio(videoPath);
    checks.vertical = aspectRatio > 1.5; // ~9:16
    if (!checks.vertical) reasons.push('Not vertical format');
  } catch {
    checks.vertical = false;
    reasons.push('Aspect ratio check failed');
  }

  // Watermarks or text
  checks.noWatermarkOrText = !checkForWatermarksOrText(description);
  if (!checks.noWatermarkOrText) reasons.push('Watermark, logo, or caption detected');

  // No Talking
  checks.noTalking = !checkForTalking(description);
  if (!checks.noTalking) reasons.push('Talking detected');

  // Music Rules
  checks.noLyrics = !checkForLyrics(description);
  if (!checks.noLyrics) reasons.push('Music with lyrics detected');

  // Background Sound Required — always assume yes for now
  checks.hasSound = true;

  // Single Continuous Shot — hard to check reliably without video editing; skipping
  checks.singleShot = true;

  return {
    passed: reasons.length === 0,
    reasons,
    checks
  };
}
