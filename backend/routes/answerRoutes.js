const express = require('express');
const Answer = require('../models/Answer');
const authMiddleware = require('../middlewares/authMiddleware');
const router = express.Router();

// Add an Answer
router.post('/', authMiddleware, async (req, res) => {
  try {
    const { content, questionId } = req.body;
    const answer = new Answer({
      content,
      question: questionId,
      user: req.user.id,
    });
    await answer.save();
    res.status(201).json(answer);
  } catch (err) {
    res.status(500).send(err.message);
  }
});

// Get Answers for a Question
router.get('/:questionId', async (req, res) => {
  try {
    const answers = await Answer.find({ question: req.params.questionId }).populate('user', 'name');
    res.json(answers);
  } catch (err) {
    res.status(500).send(err.message);
  }
});

module.exports = router;
