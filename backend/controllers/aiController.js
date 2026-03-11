
const axios = require('axios');
const path = require('path');
const sqlite3 = require('sqlite3');
const { open } = require('sqlite');

// DeepSeek API-এর জন্য কনফিগারেশন
const DEEPSEEK_API_URL = "https://api.deepseek.com/chat/completions";

const handleChat = async (req, res) => {
    const { prompt, model, userId } = req.body;

    // ১. ডাটাবেস ওপেন করা (যাতে চ্যাট সেভ করা যায়)
    const db = await open({
        filename: path.join(__dirname, '..', 'data', 'nexus_pro.sqlite'),
        driver: sqlite3.Database
    });

    try {
        // ২. DeepSeek API-তে রিকোয়েস্ট পাঠানো
        const response = await axios.post(DEEPSEEK_API_URL, {
            model: "deepseek-chat", // তোমার পছন্দের ডিপসিক মডেল
            messages: [
                { 
                    role: "system", 
                    content: "You are Nexus AI Ultimate, a highly advanced AI developed by MD EYASIN. You are an expert in programming, science, and education. Provide precise, professional, and secure code or solutions." 
                },
                { role: "user", content: prompt }
            ],
            stream: false
        }, {
            headers: {
                'Authorization': `Bearer ${process.env.DEEPSEEK_API_KEY}`,
                'Content-Type': 'application/json'
            }
        });

        const aiResponse = response.data.choices[0].message.content;

        // ৩. ইউজারের মেসেজ এবং এআই-এর উত্তর ডাটাবেসে সেভ করা
        await db.run(
            "INSERT INTO chats (role, content, user_id) VALUES (?, ?, ?)",
            ['user', prompt, userId || 1]
        );
        await db.run(
            "INSERT INTO chats (role, content, user_id) VALUES (?, ?, ?)",
            ['assistant', aiResponse, userId || 1]
        );

        // ৪. ফ্রন্টএন্ডে উত্তর পাঠানো
        res.status(200).json({
            success: true,
            message: aiResponse
        });

    } catch (error) {
        console.error("AI Error:", error.response ? error.response.data : error.message);
        res.status(500).json({
            success: false,
            message: "DeepSeek API-এর সাথে যোগাযোগ করতে সমস্যা হচ্ছে। আপনার API Key চেক করুন।"
        });
    } finally {
        await db.close(); // কাজ শেষ হলে ডাটাবেস বন্ধ করা
    }
};

module.exports = { handleChat };
