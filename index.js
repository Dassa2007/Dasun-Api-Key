const express = require('express');
const ytdl = require('@distube/ytdl-core');
const cors = require('cors');
const app = express();

app.use(cors());

app.get('/', (req, res) => {
    res.send('API එක සාර්ථකව වැඩ කරනවා! 🚀');
});

app.get('/api/ytmp4', async (req, res) => {
    const videoUrl = req.query.url;
    const apiKey = req.query.apikey;

    if (apiKey !== "123") {
        return res.json({ status: false, error: "වැරදි API Key එකක්!" });
    }

    if (!videoUrl) {
        return res.json({ status: false, error: "YouTube Link එක ඇතුළත් කරන්න." });
    }

    try {
        const info = await ytdl.getInfo(videoUrl);
        const format = ytdl.chooseFormat(info.formats, { quality: 'highest', filter: 'audioandvideo' });

        res.json({
            status: true,
            title: info.videoDetails.title,
            download_url: format.url
        });
    } catch (e) {
        res.json({ status: false, error: "වීඩියෝ එක ලබාගන්න බැරි වුණා." });
    }
});

module.exports = app;
