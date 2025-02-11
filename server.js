const express = require("express");
const bodyParser = require("body-parser");
const TelegramBot = require("node-telegram-bot-api");

const app = express();
const bot = new TelegramBot("7821024795:AAGfdozO4IPBy_20yZiKypxh0HECwIMQoP8", { polling: false });

app.use(bodyParser.json());

// ✅ API Status Check
app.get("/", (req, res) => {
    res.send("✅ Broadcast API is running successfully!");
});

// ✅ Broadcast Route
app.post("/save-broadcast", async (req, res) => {
    const { message, image, users } = req.body;

    if (!message || !users) {
        return res.status(400).send("❌ Invalid request, missing data");
    }

    for (const userId of users) {
        try {
            if (image) {
                await bot.sendPhoto(userId, image, { caption: message });
            } else {
                await bot.sendMessage(userId, message);
            }
        } catch (error) {
            console.error(`❌ Error sending to ${userId}:`, error.message);
        }
    }

    res.send("✅ ब्रॉडकास्ट सफलतापूर्वक भेजा गया!");
});

// ✅ Server Start
const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
    console.log(`🚀 Broadcast API running on port ${PORT}`);
});
