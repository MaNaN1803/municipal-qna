const express = require('express');
const Question = require('../models/Question');
const authMiddleware = require('../middlewares/authMiddleware');
const router = express.Router();

// Create a Question
router.post('/', authMiddleware, async (req, res) => {
  try {
    const { title, description, category, images, gpsLocation, attempts } = req.body;
    const question = new Question({
      title,
      description,
      category,
      images,
      gpsLocation,
      attempts,
      user: req.user.id,
    });
    await question.save();
    res.status(201).json(question);
  } catch (err) {
    res.status(500).send(err.message);
  }
});

// Get All Questions
router.get('/', async (req, res) => {
  try {
    const questions = await Question.find().populate('user', 'name');
    res.json(questions);
  } catch (err) {
    res.status(500).send(err.message);
  }
});

// Get Question by ID
router.get('/:id', async (req, res) => {
  try {
    const question = await Question.findById(req.params.id).populate('user', 'name');
    if (!question) return res.status(404).send("Question not found.");
    res.json(question);
  } catch (err) {
    res.status(500).send(err.message);
  }
});

// Update Question Status (Moderation)
router.put('/:id/status', authMiddleware, async (req, res) => {
  try {
    const { status } = req.body;
    const question = await Question.findById(req.params.id);
    if (!question) return res.status(404).send("Question not found.");

    question.status = status;
    await question.save();
    res.json(question);
  } catch (err) {
    res.status(500).send(err.message);
  }
});

module.exports = router;
