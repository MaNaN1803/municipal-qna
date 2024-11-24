const express = require('express');
const Report = require('../models/Report');
const Question = require('../models/Question');
const Answer = require('../models/Answer');
const authMiddleware = require('../middlewares/authMiddleware');
const roleMiddleware = require('../middlewares/roleMiddleware');
const router = express.Router();

// Report Content
router.post('/report', authMiddleware, async (req, res) => {
  try {
    const { contentId, contentType, reason } = req.body;
    const report = new Report({
      contentId,
      contentType,
      reason,
      reportedBy: req.user.id,
    });
    await report.save();
    res.status(201).json(report);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

// Get All Reports
router.get('/reports', authMiddleware, roleMiddleware('admin', 'superAdmin'), async (req, res) => {
  try {
    const reports = await Report.find().populate('reportedBy', 'name');
    res.json(reports);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

// Resolve Report
router.put('/reports/:id', authMiddleware, roleMiddleware('moderator', 'admin'), async (req, res) => {
  try {
    const report = await Report.findById(req.params.id);
    if (!report) return res.status(404).json({ message: 'Report not found.' });

    const { action } = req.body;
    if (action === 'delete') {
      if (report.contentType === 'question') await Question.findByIdAndDelete(report.contentId);
      if (report.contentType === 'answer') await Answer.findByIdAndDelete(report.contentId);
    }

    report.status = 'reviewed';
    await report.save();
    res.json(report);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

module.exports = router;
