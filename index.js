const express = require('express');
const axios = require('axios'); // axios පාවිච්චි කරමු
const cors = require('cors');
const app = express();

app.use(cors());

app.get('/', (req, res) => {
    res.send('Dasun API is Active! 🚀');
});

app.get('/api/ytmp4', async (req, res) => {
    const videoUrl = req.query.url;
    const apiKey = req.query.apikey;

    if (apiKey !== "123") {
        return res.json({ status: false, error: "Invalid API Key!" });
    }

    if (!videoUrl) {
        return res.json({ status: false, error: "Please provide a YouTube URL." });
    }

    try {
        // අපි වෙනත් Public API එකක් පාවිච්චි කරලා ලින්ක් එක ගමු
        // මොකද Vercel IPs ගොඩක් වෙලාවට YouTube එකෙන් කෙලින්ම ගන්න දෙන්නේ නැහැ
        const response = await axios.get(`https://api.aggitech.com/youtube/download?url=${videoUrl}`);
        
        if (response.data) {
            res.json({
                status: true,
                creator: "Dasun",
                title: response.data.title || "YouTube Video",
                download_url: response.data.video_url || response.data.url
            });
        } else {
            throw new Error("Data not found");
        }

    } catch (e) {
        res.json({ 
            status: false, 
            error: "දැනට YouTube එකෙන් දත්ත ලබාගැනීම අවහිර කර ඇත. පසුව උත්සාහ කරන්න.",
            msg: e.message 
        });
    }
});

module.exports = app;
