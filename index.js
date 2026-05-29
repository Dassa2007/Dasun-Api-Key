const express = require('express');
const ytdl = require('@distube/ytdl-core');
const cors = require('cors');

const app = express();
app.use(cors());

// මුල් පිටුවට එන අයට පෙනෙන පණිවිඩය
app.get('/', (req, res) => {
    res.send('My YouTube Downloader API is Running! 🚀');
});

// ප්‍රධාන API Endpoint එක: /api/ytmp4
app.get('/api/ytmp4', async (req, res) => {
    const videoUrl = req.query.url;
    const apiKey = req.query.apikey;

    // 1. API Key එකක් තියෙනවද බලන්න (මම මෙතන key එක ලෙස '123' දාලා තියෙන්නේ)
    const MY_KEY = "123"; 
    if (apiKey !== MY_KEY) {
        return res.json({ status: false, message: "Invalid API Key! Please use apikey=123" });
    }

    // 2. URL එකක් එවලා නැත්නම් error එකක් දෙන්න
    if (!videoUrl) {
        return res.json({ status: false, message: "Please provide a YouTube URL." });
    }

    try {
        // වීඩියෝ එකේ විස්තර ලබාගන්න
        const info = await ytdl.getInfo(videoUrl);
        
        // වීඩියෝ + ඕඩියෝ දෙකම තියෙන හොඳම Quality එක තෝරන්න
        const format = ytdl.chooseFormat(info.formats, { 
            quality: 'highest', 
            filter: 'audioandvideo' 
        });

        // අවසාන ප්‍රතිඵලය JSON එකක් විදිහට ලබාදෙන්න
        res.json({
            status: true,
            creator: "Dasun",
            data: {
                title: info.videoDetails.title,
                thumbnail: info.videoDetails.thumbnails[0].url,
                duration: info.videoDetails.lengthSeconds + " seconds",
                download_url: format.url // මෙන්න මේක තමයි Download Link එක
            }
        });

    } catch (error) {
        console.error(error);
        res.json({ status: false, message: "Error: වීඩියෝ එක ලබාගැනීමට නොහැකි වුණා. URL එක නිවැරදිදැයි බලන්න." });
    }
});

// Vercel එක සඳහා Port එක Setup කිරීම
const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`);
});
