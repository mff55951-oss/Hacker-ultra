const jwt = require('jsonwebtoken');

const authMiddleware = (req, res, next) => {
    // ১. রিকোয়েস্ট হেডার থেকে টোকেনটি নেওয়া
    const authHeader = req.headers['authorization'];
    const token = authHeader && authHeader.split(' ')[1]; // 'Bearer TOKEN' ফরম্যাট থেকে টোকেন আলাদা করা

    // ২. যদি টোকেন না থাকে তবে এক্সেস বন্ধ
    if (!token) {
        return res.status(401).json({ 
            success: false, 
            message: "এক্সেস ডিনাইড! অনুগ্রহ করে লগইন করুন।" 
        });
    }

    try {
        // ৩. টোকেনটি আসল কি না তা যাচাই করা
        const verified = jwt.verify(token, process.env.JWT_SECRET || 'nexus_secret_key');
        
        // ৪. ইউজারের তথ্য রিকোয়েস্ট অবজেক্টে সেভ করা যাতে পরের ধাপে ব্যবহার করা যায়
        req.user = verified;
        
        // ৫. সব ঠিক থাকলে পরবর্তী কাজ (Next step) করার অনুমতি দেওয়া
        next();
    } catch (error) {
        res.status(403).json({ 
            success: false, 
            message: "ইনভ্যালিড টোকেন! আপনার সেশন শেষ হয়ে গেছে।" 
        });
    }
};

module.exports = authMiddleware;

