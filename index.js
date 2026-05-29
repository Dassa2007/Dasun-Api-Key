const express = require('express');
const axios = require('axios');
const cors = require('cors');

// SSL Check එක නැවැත්වීම
process.env.NODE_TLS_REJECT_UNAUTHORIZED = '0';

const app = express();
app.use(cors());

app.get('/', (req, res) => {
    res.send('Dasun TikTok API is Online! 🚀');
});

app.get('/api/tiktok', async (req, res) => {
    const videoUrl = req.query.url;
    const apiKey = req.query.apikey;

    if (apiKey !== "123") return res.json({ status: false, error: "Invalid Key" });
    if (!videoUrl) return res.json({ status: false, error: "No URL provided" });

    try {
        const response = await axios.get(`https://api.tiklydown.eu.org/api/download?url=${encodeURIComponent(videoUrl)}`);
        const result = response.data;

        // දත්ත ලැබී ඇත්දැයි පරීක්ෂා කර පිරිසිදුව ලබාදීම
        if (result && result.video) {
            res.json({
                status: true,
                creator: "Dasun",
                title: result.title || "TikTok Video",
                no_watermark: result.video.noWatermark || result.video.url,
                music: result.music ? result.music.play_url : null,
                author: result.author ? result.author.name : "Unknown"
            });
        } else {
            // දත්ත ලැබුණත් වීඩියෝ ලින්ක් එක නැතිනම් සම්පූර්ණ දත්ත ටික පෙන්වන්න
            res.json({ status: true, creator: "Dasun", all_data: result });
        }
    } catch (e) {
        res.json({ 
            status: false, 
            error: "දත්ත ලබාගැනීමේ දෝෂයකි", 
            message: e.message 
        });
    }
});

module.exports = app;
