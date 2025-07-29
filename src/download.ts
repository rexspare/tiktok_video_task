// src/download.ts
import axios from 'axios';
import fs from 'fs-extra';
import path from 'path';
import ffmpeg from 'fluent-ffmpeg';

/**
 * Downloads a video from a given URL if it doesn't already exist.
 */
export async function downloadVideo(url: string, outPath: string): Promise<void> {
  if (fs.existsSync(outPath)) return;
  await fs.ensureDir(path.dirname(outPath));
  const writer = fs.createWriteStream(outPath);
  const res = await axios.get(url, { responseType: 'stream' });
  res.data.pipe(writer);
  return new Promise<void>((resolve, reject) => {
    writer.on('finish', resolve);
    writer.on('error', reject);
  });
}

/**
 * Extracts multiple frames from a video (default: 5 frames spaced 1s apart).
 */
export async function extractFrames(videoPath: string, frameDir: string, count = 5): Promise<string[]> {
  await fs.ensureDir(frameDir);
  const framePaths: string[] = [];

  return new Promise((resolve, reject) => {
    ffmpeg(videoPath)
      .on('end', () => {
        // Collect generated frame filenames
        for (let i = 1; i <= count; i++) {
          const frameFile = path.join(frameDir, `frame_%i.jpg`.replace('%i', `${i}`));
          framePaths.push(frameFile);
        }
        resolve(framePaths);
      })
      .on('error', reject)
      .screenshots({
        count,
        filename: 'frame_%i.jpg',
        folder: frameDir,
        timemarks: Array(count).fill(0).map((_, i) => `${i + 1}`), // ['1', '2', ...]
      });
  });
}

/**
 * Extracts the audio track from a video as MP3 for transcription.
 */
export async function extractAudio(videoPath: string, audioOutPath: string): Promise<void> {
  await fs.ensureDir(path.dirname(audioOutPath));
  return new Promise<void>((resolve, reject) => {
    ffmpeg(videoPath)
      .noVideo()
      .audioCodec('libmp3lame')
      .save(audioOutPath)
      .on('end', () => resolve())
      .on('error', reject);
  });
}
