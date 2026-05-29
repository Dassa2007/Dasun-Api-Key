const express = require('express');
const axios = require('axios');
const cors = require('cors');

const app = express();
app.use(cors());

app.get('/', (req, res) => {
    res.send('Dasun API is running perfectly! 🌟');
});

app.get('/api/ytmp4', async (req, res) => {
    const videoUrl = req.query.url;
    const apiKey = req.query.apikey;

    if (apiKey !== "123") {
        return res.json({ status: false, error: "වැරදි API Key එකකි." });
    }

    if (!videoUrl) {
        return res.json({ status: false, error: "YouTube URL එකක් ලබා දෙන්න." });
    }

    try {
        // ඉතාමත් ස්ථාවර වෙනත් API එකක් පාවිච්චි කරමු
        const response = await axios.get(`https://widipe.com/download/ytdl?url=${encodeURIComponent(videoUrl)}`);
        
        if (response.data && response.data.status) {
            const result = response.data.result;
            res.json({
                status: true,
                creator: "Dasun",
                title: result.title,
                thumbnail: result.thumb,
                duration: result.duration,
                download_url: result.mp4 // වීඩියෝ ලින්ක් එක
            });
        } else {
            res.json({ status: false, error: "වීඩියෝ එක සොයාගත නොහැකි විය." });
        }

    } catch (e) {
        res.json({ 
            status: false, 
            error: "සර්වර් එකේ දෝෂයක් පවතී. පසුව උත්සාහ කරන්න.",
            message: e.message 
        });
    }
});

module.exports = app;
