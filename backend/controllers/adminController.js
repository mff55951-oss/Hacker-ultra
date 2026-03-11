
const path = require('path');
const sqlite3 = require('sqlite3');
const { open } = require('sqlite');

// ডাটাবেস ওপেন করার হেল্পার ফাংশন
const getDb = async () => {
    return await open({
        filename: path.join(__dirname, '..', 'data', 'nexus_pro.sqlite'),
        driver: sqlite3.Database
    });
};

// ১. নতুন ফিচার অ্যাড করা (এডমিন দ্বারা)
const addFeature = async (req, res) => {
    const { name, code, iconStyle, location } = req.body;
    const db = await getDb();

    try {
        // নতুন ফিচারটি 'pending' স্ট্যাটাসে সেভ হবে (এডমিনের প্রিভিউ-এর জন্য)
        await db.run(
            "INSERT INTO features (name, code, iconStyle, location, status) VALUES (?, ?, ?, ?, ?)",
            [name, code, iconStyle, location, 'pending']
        );

        res.status(201).json({ 
            success: true, 
            message: "ফিচারটি সফলভাবে যোগ করা হয়েছে। এখন এটি প্রিভিউ করুন।" 
        });
    } catch (error) {
        res.status(500).json({ success: false, message: "ফিচার যোগ করতে সমস্যা হয়েছে।" });
    } finally {
        await db.close();
    }
};

// ২. ফিচার অ্যাপ্রুভ করা (সকল ইউজারের কাছে পাঠানোর জন্য)
const approveFeature = async (req, res) => {
    const { featureId } = req.body;
    const db = await getDb();

    try {
        await db.run("UPDATE features SET status = 'active' WHERE id = ?", [featureId]);
        res.status(200).json({ success: true, message: "ফিচারটি এখন সকল ইউজারের কাছে দৃশ্যমান!" });
    } catch (error) {
        res.status(500).json({ success: false, message: "অ্যাপ্রুভ করতে সমস্যা হয়েছে।" });
    } finally {
        await db.close();
    }
};

// ৩. সকল একটিভ ফিচার গেট করা (ইউজারদের জন্য)
const getActiveFeatures = async (req, res) => {
    const db = await getDb();
    try {
        const activeFeatures = await db.all("SELECT * FROM features WHERE status = 'active'");
        res.status(200).json({ success: true, features: activeFeatures });
    } catch (error) {
        res.status(500).json({ success: false, message: "ফিচার লোড করতে সমস্যা হয়েছে।" });
    } finally {
        await db.close();
    }
};

// ৪. পেন্ডিং ফিচার প্রিভিউ দেখা (শুধুমাত্র এডমিনের জন্য)
const getPendingFeatures = async (req, res) => {
    const db = await getDb();
    try {
        const pendingFeatures = await db.all("SELECT * FROM features WHERE status = 'pending'");
        res.status(200).json({ success: true, features: pendingFeatures });
    } catch (error) {
        res.status(500).json({ success: false, message: "প্রিভিউ লোড করতে সমস্যা হয়েছে।" });
    } finally {
        await db.close();
    }
};

module.exports = { addFeature, approveFeature, getActiveFeatures, getPendingFeatures };
