const express = require('express');
const User = require('../models/User');
const Report = require('../models/Report');
const Question = require('../models/Question');
const Answer = require('../models/Answer');
const authMiddleware = require('../middlewares/authMiddleware');
const roleMiddleware = require('../middlewares/roleMiddleware');
const router = express.Router();

// Get Dashboard Stats
router.get('/stats', authMiddleware, roleMiddleware('admin', 'moderator'), async (req, res) => {
  try {
    const [totalUsers, totalQuestions, totalAnswers, pendingReports] = await Promise.all([
      User.countDocuments(),
      Question.countDocuments(),
      Answer.countDocuments(),
      Report.countDocuments({ status: 'pending' })
    ]);

    res.json({
      totalUsers,
      totalQuestions,
      totalAnswers,
      pendingReports
    });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

// Get All Users with Pagination and Filtering
router.get('/users', authMiddleware, roleMiddleware('admin'), async (req, res) => {
  try {
    const { page = 1, limit = 10, role, search } = req.query;
    const query = {};
    
    if (role) query.role = role;
    if (search) {
      query.$or = [
        { name: { $regex: search, $options: 'i' } },
        { email: { $regex: search, $options: 'i' } }
      ];
    }

    const users = await User.find(query)
      .select('-password')
      .limit(limit * 1)
      .skip((page - 1) * limit)
      .sort({ createdAt: -1 });

    const total = await User.countDocuments(query);

    res.json({
      users,
      totalPages: Math.ceil(total / limit),
      currentPage: page
    });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

// Update User Role
router.put('/users/:id/role', authMiddleware, roleMiddleware('admin'), async (req, res) => {
  try {
    const { role } = req.body;
    const user = await User.findByIdAndUpdate(
      req.params.id,
      { role },
      { new: true }
    ).select('-password');
    
    if (!user) return res.status(404).json({ message: 'User not found' });
    res.json(user);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

// Delete User
router.delete('/users/:id', authMiddleware, roleMiddleware('admin'), async (req, res) => {
  try {
    const user = await User.findByIdAndDelete(req.params.id);
    if (!user) return res.status(404).json({ message: 'User not found' });
    
    // Delete all user's questions, answers, and reports
    await Promise.all([
      Question.deleteMany({ user: req.params.id }),
      Answer.deleteMany({ user: req.params.id }),
      Report.deleteMany({ reportedBy: req.params.id })
    ]);

    res.json({ message: 'User and associated content deleted' });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

// Get Reports with Pagination and Filtering
router.get('/reports', authMiddleware, roleMiddleware('admin', 'moderator'), async (req, res) => {
  try {
    const { page = 1, limit = 10, status, type } = req.query;
    const query = {};
    
    if (status) query.status = status;
    if (type) query.contentType = type;

    const reports = await Report.find(query)
      .populate('reportedBy', 'name')
      .populate({
        path: 'contentId',
        select: 'title content',
        model: query.contentType === 'question' ? Question : Answer
      })
      .limit(limit * 1)
      .skip((page - 1) * limit)
      .sort({ createdAt: -1 });

    const total = await Report.countDocuments(query);

    res.json({
      reports,
      totalPages: Math.ceil(total / limit),
      currentPage: page
    });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

// Handle Report
router.put('/reports/:id', authMiddleware, roleMiddleware('admin', 'moderator'), async (req, res) => {
  try {
    const report = await Report.findById(req.params.id);
    if (!report) return res.status(404).json({ message: 'Report not found' });

    const { action } = req.body;
    report.status = 'reviewed';

    if (action === 'delete') {
      if (report.contentType === 'question') {
        await Question.findByIdAndDelete(report.contentId);
        // Delete associated answers
        await Answer.deleteMany({ question: report.contentId });
      } else if (report.contentType === 'answer') {
        const answer = await Answer.findByIdAndDelete(report.contentId);
        if (answer) {
          // Update question's answer count
          await Question.findByIdAndUpdate(answer.question, {
            $inc: { answersCount: -1 }
          });
        }
      }
    } else if (action === 'warn') {
      const content = report.contentType === 'question'
        ? await Question.findById(report.contentId)
        : await Answer.findById(report.contentId);
      
      if (content) {
        // Send warning notification to user (implement notification system)
        console.log(`Warning sent to user ${content.user}`);
      }
    }

    await report.save();
    res.json(report);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

// Get System Activity Logs
router.get('/activity-logs', authMiddleware, roleMiddleware('admin'), async (req, res) => {
  try {
    const { page = 1, limit = 20, type } = req.query;
    const query = {};
    if (type) query.type = type;

    // Implement activity logging system
    res.json({ message: 'Activity logs feature to be implemented' });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

module.exports = router;