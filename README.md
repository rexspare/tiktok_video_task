# TikTok Video Auto-Approval Script 🎥✅


This project fetches trending TikTok videos from a third-party API, analyzes their content using Google's Gemini AI (text + image + audio), and auto-approves videos that meet specific criteria.


## ✨ Features

- 🔍 Fetch videos via [RapidAPI TikTok Scraper](https://rapidapi.com/)
- 🤖 Analyze video content using Gemini 1.5 Pro (via Google AI)
- 🧠 Understand what happens visually & audibly
- ✅ Automatically apply strict approval rules:
  - Portrait format (9:16)
  - No watermarks or text overlays
  - Single continuous scene
  - No spoken words
  - Only instrumental or ambient audio
  - Minimum 8 seconds duration
  - Must not be silent

---



## 📦 Project Structure

src/

├── analyze.ts # Analyze each video with Gemini 

├── download.ts # Download video, extract audio & frames

├── main.ts # Main script entrypoint

├── tiktokApi.ts # Fetch videos from RapidAPI

├── validator.ts # Auto-approval logic based on content
output/

├── allVideos.json # All scanned video results

├── approvedVideos.json # Only approved video data

videos/, frames/, audio/ # Temporary directories for processing

.env # API keys (not committed)



## 🚀 Getting Started

### 1. Clone the Repo

```bash
git clone https://github.com/rexspare/tiktok_video_task.git

cd tiktok_video_task

```

### 2. Install Dependencies


```bash
npm install
```

## 3.  Set Up API Keys

Create a .env file in the root of the project:

``` bash
RAPIDAPI_KEY=your_rapidapi_key_here
GEMINI_API_KEY=your_google_gemini_api_key
```


## 4. Install FFmpeg (required)
Make sure ffmpeg is available on your system.

#### macOS
```bash
brew install ffmpeg
```

#### Ubuntu/Linux
```bash
sudo apt install ffmpeg
```

#### Windows
```bash
Download from: https://ffmpeg.org/download.html and add to your system PATH.
```

## ▶️ Running the Script
```bash
npx tsx src/main.ts
```

### This will:

Fetch a list of videos

Download them

Analyze visual + audio content using Gemini

Apply approval filters

### Save results to:

output/allVideos.json

output/approvedVideos.json
