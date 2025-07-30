// src/main.ts
import { } from './videos/videosShort';
import fs from 'fs-extra';
import { analyzeVideo } from './analyze';
import { validateVideo } from './validator';
import * as dotenv from 'dotenv';
import { fetchTikTokVideos } from './tiktokApi';
dotenv.config();

async function main() {


  const VIDEOS: any = await fetchTikTokVideos();

  if (VIDEOS.length === 0) {
    console.error('No videos fetched. Exiting...');
    return;
  }

  const approved = [];
  const allResults = [];

  for (let i = 0; i < VIDEOS.length; i++) {
    const video = VIDEOS[i];
    console.log(`Analyzing video ${i + 1}/${VIDEOS.length}...`);

    try {
      const result = await analyzeVideo(video);
      const videoPath = `videos/video_${video.video_id}.mp4`;

      const validation = await validateVideo(video, videoPath, result.description);

      const finalResult = {
        video_id: video.video_id,
        url: result.url,
        description: result.description,
        approved: validation.passed,
        checks: validation.checks,
        reasons: validation.reasons
      };

      allResults.push(finalResult);
      if (validation.passed) approved.push(finalResult);

      console.log(finalResult);
    } catch (err) {
      console.error(`Failed processing video ${video.video_id}:`, err);
    }
  }

  await fs.ensureDir('output');
  fs.writeFileSync('output/allVideos.json', JSON.stringify(allResults, null, 2));
  fs.writeFileSync('output/approvedVideos.json', JSON.stringify(approved, null, 2));
  console.log('✅ Analysis & filtering complete.');
}

main();
