const express = require('express');
const axios = require('axios');
const cors = require('cors');
const https = require('https'); // මේක අලුතින් එකතු කළා

const app = express();
app.use(cors());

// Security Check එක මගහැරීමට අලුත් ක්‍රමයක්
const agent = new https.Agent({  
  rejectUnauthorized: false
});

app.get('/', (req, res) => {
    res.send('Dasun TikTok API is Running! 🎬');
});

app.get('/api/tiktok', async (req, res) => {
    const videoUrl = req.query.url;
    const apiKey = req.query.apikey;

    if (apiKey !== "123") {
        return res.json({ status: false, error: "Invalid API Key!" });
    }

    if (!videoUrl) {
        return res.json({ status: false, error: "TikTok URL එකක් දෙන්න." });
    }

    try {
        // මෙතනදී අපි 'httpsAgent' එක පාවිච්චි කරනවා අර Certificate Error එක එන්නේ නැති වෙන්න
        const response = await axios.get(`https://api.tiklydown.eu.org/api/download?url=${encodeURIComponent(videoUrl)}`, {
            httpsAgent: agent 
        });
        
        if (response.data) {
            res.json({
                status: true,
                creator: "Dasun",
                data: response.data
            });
        } else {
            res.json({ status: false, error: "දත්ත හමු වුණේ නැත." });
        }

    } catch (e) {
        res.json({ 
            status: false, 
            error: "දෝෂයක් ඇති විය.",
            message: e.message 
        });
    }
});

module.exports = app;
