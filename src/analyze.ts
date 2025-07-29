// src/analyzeVideo.ts
import path from 'path';
import { downloadVideo, extractFrames, extractAudio } from './download';
import { GoogleGenAI } from '@google/genai';
import fs from 'fs-extra';
import * as dotenv from 'dotenv';
dotenv.config(); // <-- Load env vars

const ai = new GoogleGenAI({ apiKey: process.env.GEMINI_API_KEY });

function fileToBase64(filePath: string): string {
  return fs.readFileSync(filePath).toString('base64');
}

export async function analyzeVideo(video: any): Promise<{
  video_id: string;
  url: string;
  description: string;
}> {
  const id = video.video_id;
  const videoPath = `videos/video_${id}.mp4`;
  const frameDir = `frames/${id}`;
  const audioPath = `audio/audio_${id}.mp3`;

  // Step 1: Download
  await downloadVideo(video.play, videoPath);

  // Step 2: Extract multiple frames + audio
  const frames = await extractFrames(videoPath, frameDir, 3); // You can increase to 5 if needed
  await extractAudio(videoPath, audioPath);

  // Step 3: Prepare Gemini prompt with frames + audio
  const contents: any[] = [];

  // Visual parts
  for (const framePath of frames) {
    const base64Image = fileToBase64(framePath);
    contents.push({
      inlineData: {
        mimeType: 'image/jpeg',
        data: base64Image,
      },
    });
  }

  // Audio as context
  const audioBase64 = fileToBase64(audioPath);
  contents.push({
    inlineData: {
      mimeType: 'audio/mp3',
      data: audioBase64,
    },
  });

  contents.push({
    text: `Describe the main essence of this video. What is visually happening and what is being said or heard? Return 2–3 clear sentences.`,
  });

  const result = await ai.models.generateContent({
    model: 'gemini-1.5-pro',
    contents: [{ role: 'user', parts: contents }],
  });

  return {
    video_id: id,
    url: video.play,
    description: result.candidates?.[0]?.content?.parts?.[0]?.text ?? 'No description'// <-- new SDK just uses .text()
  };
}



