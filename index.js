const express = require('express');
const axios = require('axios');
const cors = require('cors');

const app = express();
app.use(cors());

app.get('/', (req, res) => {
    res.send('Dasun TikTok Downloader API is Live! 🎬');
});

app.get('/api/tiktok', async (req, res) => {
    const videoUrl = req.query.url;
    const apiKey = req.query.apikey;

    if (apiKey !== "123") {
        return res.json({ status: false, error: "Invalid API Key!" });
    }

    if (!videoUrl) {
        return res.json({ status: false, error: "TikTok URL එකක් ලබා දෙන්න." });
    }

    try {
        // TikTok දත්ත ලබාගැනීම සඳහා විශ්වාසවන්ත API එකක්
        const response = await axios.get(`https://api.tiklydown.eu.org/api/download?url=${encodeURIComponent(videoUrl)}`);
        
        if (response.data) {
            const data = response.data;
            res.json({
                status: true,
                creator: "Dasun",
                title: data.title || "TikTok Video",
                author: data.author.name,
                nowatermark_url: data.video.noWatermark, // Watermark නැති ලින්ක් එක
                watermark_url: data.video.watermark,
                cover: data.video.cover
            });
        } else {
            res.json({ status: false, error: "වීඩියෝව සොයාගත නොහැකි විය." });
        }

    } catch (e) {
        res.json({ 
            status: false, 
            error: "TikTok දත්ත ලබාගැනීමේ දෝෂයකි.",
            message: e.message 
        });
    }
});

module.exports = app;
