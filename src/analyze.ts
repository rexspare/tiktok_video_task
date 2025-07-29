// src/analyze.ts
import fs from 'fs-extra';
import path from 'path';
import { GoogleGenAI } from '@google/genai';

const ai = new GoogleGenAI({ apiKey: process.env.GEMINI_API_KEY! });

function fileToBase64(filePath: string) {
  return fs.readFileSync(filePath).toString('base64');
}

export async function describeFrame(framePath: string): Promise<string> {
  const imageBase64 = fs.readFileSync(framePath).toString('base64');

  const result = await ai.models.generateContent({
    model: 'gemini-1.5-flash',
    contents: [
      {
        role: 'user',
        parts: [
          {
            inlineData: {
              mimeType: 'image/jpeg',
              data: imageBase64,
            },
          },
          {
            text: 'What is happening in this frame? Describe it briefly in 1-2 sentences. Ignore logos or watermarks.',
          },
        ],
      },
    ],
  });

  // ✅ Safely extract the candidate text
  const description = result.candidates?.[0]?.content?.parts?.[0]?.text ?? 'No description';
  return description;
}
