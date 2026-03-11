
const express = require('express');
const router = express.Router();

// কন্ট্রোলারগুলো ইমপোর্ট করা
const { handleChat } = require('../controllers/aiController');
const { 
    addFeature, 
    approveFeature, 
    getActiveFeatures, 
    getPendingFeatures 
} = require('../controllers/adminController');

// ১. এআই চ্যাট রুট
// ইউজার যখন DeepSeek-এর সাথে চ্যাট করবে
router.post('/chat', handleChat);

// ২. ইউজারদের জন্য ফিচার রুট
// ইউজাররা যখন তাদের ড্যাশবোর্ডে নতুন ফিচারগুলো দেখতে পাবে
router.get('/features/active', getActiveFeatures);

// ৩. এডমিন কন্ট্রোল রুট (Admin Panel)
// নতুন ফিচার যোগ করার জন্য
router.post('/admin/add-feature', addFeature);

// ফিচার অ্যাপ্রুভ বা পাবলিশ করার জন্য
router.post('/admin/approve-feature', approveFeature);

// এডমিন যাতে পাবলিশ করার আগে ফিচার চেক করতে পারে
router.get('/admin/pending-features', getPendingFeatures);

module.exports = router;
