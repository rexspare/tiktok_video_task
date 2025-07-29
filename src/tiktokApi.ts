// src/tiktokApi.ts
import axios from 'axios';
import * as dotenv from 'dotenv';

import { VIDEOS } from './videos/videos';

dotenv.config();

export interface Video {
    id: string;
    author: string;
    desc: string;
    play_url: string;
    thumbnail: string;
}

export async function fetchTikTokVideos(): Promise<Video[]> {
    const options = {
        method: 'GET',
        url: 'https://tiktok-scraper7.p.rapidapi.com/feed/list',
        params: {
            region: 'us',
            count: '10',
        },
        headers: {
            'x-rapidapi-host': 'tiktok-scraper7.p.rapidapi.com',
            'x-rapidapi-key': process.env.RAPIDAPI_KEY || '',
        },
    };

    try {
        // const response = await axios.request(options);
        // const data = response.data?.data || [];

        // // Normalize the output


        // return data;

        return VIDEOS
    } catch (error) {
        console.error('Failed to fetch TikTok videos:', error);
        return [];
    }
}
