// main.ts
import { VIDEOS } from './videos/videosShort'; // <-- your export above!
import path from 'path';
import * as dotenv from 'dotenv';
dotenv.config();

import { downloadVideo, extractFrame } from './download';
import { describeFrame } from './analyze';
import fs from 'fs-extra';

async function main() {
    const results = [];

    for (let video of VIDEOS) {
        const videoPath = `videos/video_${video.video_id}.mp4`;
        const framePath = `frames/frame_${video.video_id}.jpg`;

        try {
            await downloadVideo(video.play, videoPath);
            await extractFrame(videoPath, framePath);
            const description = await describeFrame(framePath);

            const output = {
                video_id: video.video_id,
                url: video.play,
                description,
            };

            console.log(output);
            results.push(output);
        } catch (err) {
            console.error(`Failed processing video ${video.video_id}:`, err);
        }
    }

    await fs.ensureDir('output');
    fs.writeFileSync('output/describedVideos.json', JSON.stringify(results, null, 2));
    console.log('✅ Analysis complete.');
}

main();
