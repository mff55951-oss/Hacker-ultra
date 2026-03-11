const path = require('path');
const sqlite3 = require('sqlite3');
const { open } = require('sqlite');

// ডাটাবেস ইনিশিয়ালাইজ করার ফাংশন
const initDb = async () => {
    try {
        const db = await open({
            filename: path.join(__dirname, '..', 'data', 'nexus_pro.sqlite'),
            driver: sqlite3.Database
        });

        // ১. ইউজার টেবিল (ইউজার তথ্য ও বায়োমেট্রিক ডাটা)
        await db.exec(`
            CREATE TABLE IF NOT EXISTS users (
                id INTEGER PRIMARY KEY AUTOINCREMENT,
                username TEXT NOT NULL UNIQUE,
                fingerprint TEXT,
                face_id_token TEXT,
                theme_preference TEXT DEFAULT 'dark',
                created_at DATETIME DEFAULT CURRENT_TIMESTAMP
            )
        `);

        // ২. চ্যাট হিস্ট্রি টেবিল (ইউজার ও এআই-এর কথোপকথন)
        await db.exec(`
            CREATE TABLE IF NOT EXISTS chats (
                id INTEGER PRIMARY KEY AUTOINCREMENT,
                user_id INTEGER,
                role TEXT CHECK(role IN ('user', 'assistant', 'system')),
                content TEXT NOT NULL,
                model_used TEXT DEFAULT 'deepseek-chat',
                timestamp DATETIME DEFAULT CURRENT_TIMESTAMP,
                FOREIGN KEY (user_id) REFERENCES users(id)
            )
        `);

        // ৩. ডাইনামিক ফিচার টেবিল (এডমিন কন্ট্রোল প্যানেল থেকে ফিচার পুশ করার জন্য)
        await db.exec(`
            CREATE TABLE IF NOT EXISTS features (
                id INTEGER PRIMARY KEY AUTOINCREMENT,
                name TEXT NOT NULL,
                code TEXT NOT NULL,
                icon_style TEXT CHECK(icon_style IN ('round', 'square')),
                location TEXT,
                status TEXT CHECK(status IN ('pending', 'active')) DEFAULT 'pending',
                created_at DATETIME DEFAULT CURRENT_TIMESTAMP
            )
        `);

        console.log("Database Tables Created Successfully!");
        return db;

    } catch (error) {
        console.error("Database Schema Error:", error.message);
    }
};

module.exports = { initDb };

