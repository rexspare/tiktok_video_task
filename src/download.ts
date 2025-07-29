// src/download.ts
import axios from 'axios';
import fs from 'fs-extra';
import path from 'path';
import ffmpeg from 'fluent-ffmpeg';

export async function downloadVideo(url: string, outPath: string) {
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

export async function extractFrame(videoPath: string, framePath: string) {
  await fs.ensureDir(path.dirname(framePath));
  return new Promise<void>((resolve, reject) => {
    ffmpeg(videoPath)
      .on('end', (_stdout: string | null, _stderr: string | null) => resolve()) // <-- FIXED HERE
      .on('error', (err) => reject(err))
      .screenshots({
        count: 1,
        timemarks: ['1'],
        filename: path.basename(framePath),
        folder: path.dirname(framePath),
      });
  });
}
