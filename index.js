const express = require('express');
const axios = require('axios');
const cors = require('cors');

// සර්වර් එකේ ඕනෑම තැනක සිදුවන Certificate Error එකක් සම්පූර්ණයෙන්ම නවත්වන්න
process.env.NODE_TLS_REJECT_UNAUTHORIZED = '0';

const app = express();
app.use(cors());

app.get('/', (req, res) => {
    res.send('Dasun API is Online! 🚀');
});

app.get('/api/tiktok', async (req, res) => {
    const videoUrl = req.query.url;
    const apiKey = req.query.apikey;

    if (apiKey !== "123") return res.json({ status: false, error: "Invalid Key" });
    if (!videoUrl) return res.json({ status: false, error: "No URL" });

    try {
        const response = await axios.get(`https://api.tiklydown.eu.org/api/download?url=${encodeURIComponent(videoUrl)}`);
        
        if (response.data) {
            res.json({
                status: true,
                creator: "Dasun",
                title: response.data.title,
                video_url: response.data.video.noWatermark,
                music_url: response.data.music.play_url,
                author: response.data.author.name
            });
        } else {
            res.json({ status: false, error: "දත්ත ලැබුණේ නැත." });
        }
    } catch (e) {
        res.json({ 
            status: false, 
            error: "API Error", 
            message: e.message 
        });
    }
});

module.exports = app;
