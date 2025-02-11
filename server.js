const express = require("express");
const bodyParser = require("body-parser");
const axios = require("axios");
require("dotenv").config(); // ✅ .env से TOKEN लेने के लिए

const app = express();
app.use(bodyParser.json());

const BOT_TOKEN = process.env.BOT_TOKEN; // ✅ Render में Bot Token सेव करें

// ✅ होम पेज API (Fix for "Cannot GET /")
app.get("/", (req, res) => {
    res.send("✅ Broadcast API is running successfully!");
});

// ✅ ब्रॉडकास्ट API
app.post("/broadcast", async (req, res) => {
    const { message, image, users } = req.body;

    if (!users || users.length === 0) {
        return res.status(400).send("❌ No users provided!");
    }

    for (const userId of users) {
        try {
            if (image && message) {
                // ✅ इमेज + टेक्स्ट
                await axios.post(`https://api.telegram.org/bot${BOT_TOKEN}/sendPhoto`, {
                    chat_id: userId,
                    photo: image,
                    caption: message,
                    parse_mode: "HTML"
                });
            } else if (image) {
                // ✅ सिर्फ इमेज
                await axios.post(`https://api.telegram.org/bot${BOT_TOKEN}/sendPhoto`, {
                    chat_id: userId,
                    photo: image
                });
            } else if (message) {
                // ✅ सिर्फ टेक्स्ट
                await axios.post(`https://api.telegram.org/bot${BOT_TOKEN}/sendMessage`, {
                    chat_id: userId,
                    text: message,
                    parse_mode: "HTML"
                });
            }
        } catch (error) {
            console.error(`❌ Error sending to ${userId}:`, error.response ? error.response.data : error.message);
        }
    }

    res.send("✅ ब्रॉडकास्ट सफलतापूर्वक भेजा गया!");
});

// ✅ सर्वर रन करें
const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
    console.log(`✅ Broadcast API is running on port ${PORT}`);
});
