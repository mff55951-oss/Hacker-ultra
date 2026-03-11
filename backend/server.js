
const express = require('express');
const cors = require('cors');
const dotenv = require('dotenv');
const path = require('path');
const { initDb } = require('./models/schema');

// ১. কনফিগারেশন লোড করা
dotenv.config();
const app = express();

// ২. মিডলওয়্যার সেটআপ
app.use(express.json()); // JSON ডাটা রিসিভ করার জন্য
app.use(cors()); // ফ্রন্টএন্ড থেকে রিকোয়েস্ট আসার অনুমতি দেওয়া

// ৩. ডাটাবেস ইনিশিয়ালাইজ করা
// সার্ভার চালু হওয়ার সাথে সাথে টেবিলগুলো তৈরি হয়ে যাবে
initDb().then(() => {
    console.log("Nexus Database is ready for action!");
}).catch(err => {
    console.error("Database connection failed:", err);
});

// ৪. রুটগুলো ইমপোর্ট করা
const authRoutes = require('./routes/auth');
const apiRoutes = require('./routes/api');

// ৫. এপিআই এন্ডপয়েন্ট সেটআপ
app.use('/auth', authRoutes); // লগইন ও রেজিস্ট্রেশন (Face ID/Fingerprint)
app.use('/api', apiRoutes);   // চ্যাট ও এডমিন ফিচার

// ৬. বেস ইউআরএল চেক (সার্ভার চলছে কি না দেখার জন্য)
app.get('/', (req, res) => {
    res.status(200).json({
        message: "Welcome to Nexus AI Ultimate Backend Service",
        developer: "MD EYASIN",
        status: "Running"
    });
});

// ৭. সার্ভার পোর্ট সেটআপ
const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
    console.log(`Server is blazing fast on port ${PORT}`);
});
