const express = require('express');
const axios = require('axios');
const cors = require('cors');

const app = express();
app.use(cors());

app.get('/', (req, res) => {
    res.send('Dasun TikTok API is 100% Working! 🚀');
});

app.get('/api/tiktok', async (req, res) => {
    const videoUrl = req.query.url;
    const apiKey = req.query.apikey;

    if (apiKey !== "123") return res.json({ status: false, error: "Invalid Key" });
    if (!videoUrl) return res.json({ status: false, error: "No URL" });

    try {
        // මම මෙතනට වඩාත් පිරිසිදු දත්ත දෙන API එකක් දැම්මා
        const response = await axios.get(`https://api.tiklydown.eu.org/api/download?url=${encodeURIComponent(videoUrl)}`);
        
        // අපිට ඕන දත්ත ටික විතරක් වෙන් කරලා ගමු
        const result = response.data;
        
        res.json({
            status: true,
            title: result.title,
            video_url: result.video.noWatermark, // Watermark නැති ලින්ක් එක
            audio_url: result.music.play_url, // සින්දුව විතරක් ඕන නම්
            author: result.author.name
        });

    } catch (e) {
        res.json({ status: false, error: "API Error", msg: e.message });
    }
});

module.exports = app;
