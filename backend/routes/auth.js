
const express = require('express');
const router = express.Router();

// অথেন্টিকেশন কন্ট্রোলার ইমপোর্ট করা
const { register, login } = require('../controllers/authController');

// ১. নতুন ইউজার রেজিস্ট্রেশন রুট
// এখান থেকে ইউজারের নাম এবং প্রাথমিক বায়োমেট্রিক ডাটা সেভ হবে
router.post('/register', register);

// ২. বায়োমেট্রিক লগইন রুট
// ফেস আইডি বা ফিঙ্গারপ্রিন্ট ভেরিফিকেশনের জন্য এই রুটটি ব্যবহৃত হবে
router.post('/login', login);

// ৩. টোকেন ভেরিফিকেশন (অপশনাল কিন্তু প্রফেশনাল)
// ইউজার যখন অ্যাপটি ওপেন করবে, সে কি আগে থেকেই লগইন কি না তা চেক করার জন্য
router.get('/verify', (req, res) => {
    res.status(200).json({ success: true, message: "User is authenticated" });
});

module.exports = router;
