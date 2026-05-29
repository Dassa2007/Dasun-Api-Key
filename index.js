const express = require('express');
const axios = require('axios');
const cors = require('cors');

// Security Certificate error එක මගහැරීමට (Bypass SSL)
process.env.NODE_TLS_REJECT_UNAUTHORIZED = "0";

const app = express();
app.use(cors());

app.get('/', (req, res) => {
    res.send('Dasun API is Online! 🚀');
});

app.get('/api/ytmp4', async (req, res) => {
    const videoUrl = req.query.url;
    const apiKey = req.query.apikey;

    if (apiKey !== "123") {
        return res.json({ status: false, error: "Invalid API Key!" });
    }

    if (!videoUrl) {
        return res.json({ status: false, error: "YouTube Link එක ඇතුළත් කරන්න." });
    }

    try {
        // Aggitech API එකෙන් දත්ත ලබාගැනීම
        const response = await axios.get(`https://api.aggitech.com/youtube/download?url=${videoUrl}`);
        
        if (response.data && response.data.status) {
            res.json({
                status: true,
                creator: "Dasun",
                title: response.data.title,
                thumbnail: response.data.thumbnail,
                download_url: response.data.video_url || response.data.url
            });
        } else {
            res.json({ status: false, error: "වීඩියෝ දත්ත හමු වුණේ නැත." });
        }

    } catch (e) {
        res.json({ 
            status: false, 
            error: "දත්ත ලබාගැනීමේදී දෝෂයක් ඇති විය.",
            message: e.message 
        });
    }
});

module.exports = app;
