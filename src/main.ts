// src/main.ts
import { VIDEOS } from './videos/videosShort';
import fs from 'fs-extra';
import { analyzeVideo } from './analyze';
import * as dotenv from 'dotenv';
dotenv.config();

async function main() {
  const results = [];

  for (let i = 0; i < VIDEOS.length; i++) {
    const video = VIDEOS[i];
    console.log(`Analyzing video ${i + 1}/${VIDEOS.length}...`);

    try {
      const result = await analyzeVideo(video);
      console.log(result);
      results.push(result);
    } catch (err) {
      console.error(`Failed processing video ${video.video_id}:`, err);
    }
  }

  await fs.ensureDir('output');
  fs.writeFileSync('output/analyzedVideos.json', JSON.stringify(results, null, 2));
  console.log('✅ Analysis complete.');
}

main();
