
const path = require('path');
const sqlite3 = require('sqlite3');
const { open } = require('sqlite');
const jwt = require('jsonwebtoken');

// ডাটাবেস ওপেন করার ফাংশন
const getDb = async () => {
    return await open({
        filename: path.join(__dirname, '..', 'data', 'nexus_pro.sqlite'),
        driver: sqlite3.Database
    });
};

// ১. ইউজার রেজিস্ট্রেশন ও বায়োমেট্রিক সেটআপ
const register = async (req, res) => {
    const { username, fingerprintData } = req.body;
    const db = await getDb();

    try {
        // ইউজার অলরেডি আছে কি না চেক করা
        const existingUser = await db.get("SELECT * FROM users WHERE username = ?", [username]);
        if (existingUser) {
            return res.status(400).json({ success: false, message: "এই নামে ইউজার আগে থেকেই আছে।" });
        }

        // নতুন ইউজার তৈরি (ফিঙ্গারপ্রিন্ট বা ফেস আইডি টোকেনসহ)
        await db.run(
            "INSERT INTO users (username, fingerprint) VALUES (?, ?)",
            [username, fingerprintData]
        );

        res.status(201).json({ success: true, message: "রেজিস্ট্রেশন সফল হয়েছে!" });
    } catch (error) {
        res.status(500).json({ success: false, message: "সার্ভার এরর।" });
    } finally {
        await db.close();
    }
};

// ২. বায়োমেট্রিক লগইন (Fingerprint/Face ID Verification)
const login = async (req, res) => {
    const { username, fingerprintData } = req.body;
    const db = await getDb();

    try {
        const user = await db.get("SELECT * FROM users WHERE username = ?", [username]);

        if (user && user.fingerprint === fingerprintData) {
            // সিকিউর টোকেন (JWT) তৈরি করা
            const token = jwt.sign(
                { userId: user.id, username: user.username },
                process.env.JWT_SECRET || 'nexus_secret_key',
                { expiresIn: '7d' }
            );

            res.status(200).json({
                success: true,
                message: "লগইন সফল!",
                token,
                user: { id: user.id, username: user.username }
            });
        } else {
            res.status(401).json({ success: false, message: "বায়োমেট্রিক ডাটা মিলেনি।" });
        }
    } catch (error) {
        res.status(500).json({ success: false, message: "লগইন করতে সমস্যা হচ্ছে।" });
    } finally {
        await db.close();
    }
};

module.exports = { register, login };
