const express = require('express');
const ytdl = require('@distube/ytdl-core');
const cors = require('cors');
const app = express();

app.use(cors());

app.get('/', (req, res) => {
    res.send('API is Live! 🚀');
});

app.get('/api/ytmp4', async (req, res) => {
    const videoUrl = req.query.url;
    const apiKey = req.query.apikey;

    if (apiKey !== "123") {
        return res.status(403).json({ status: false, error: "වැරදි API Key එකක්!" });
    }

    if (!videoUrl) {
        return res.status(400).json({ status: false, error: "YouTube URL එකක් දෙන්න." });
    }

    try {
        // මෙතනදී අපි 'agent' එකක් නැතුව සරලවම උත්සාහ කරමු
        const info = await ytdl.getInfo(videoUrl);
        
        // වීඩියෝ එකේ format එක තෝරද්දී වඩාත් සුදුසු එකක් තෝරමු
        const format = ytdl.chooseFormat(info.formats, { 
            quality: 'highest', 
            filter: 'audioandvideo' 
        });

        if (!format) {
            throw new Error("ගැලපෙන වීඩියෝ Format එකක් හමු වුණේ නැත.");
        }

        res.json({
            status: true,
            title: info.videoDetails.title,
            author: info.videoDetails.author.name,
            download_url: format.url
        });
    } catch (e) {
        console.error(e);
        res.status(500).json({ 
            status: false, 
            error: "වීඩියෝ එක ලබාගන්න බැරි වුණා.",
            details: e.message 
        });
    }
});

module.exports = app;
