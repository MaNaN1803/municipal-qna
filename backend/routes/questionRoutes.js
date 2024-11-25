const express = require('express');
const multer = require('multer');
const Question = require('../models/Question');
const authMiddleware = require('../middlewares/authMiddleware');
const router = express.Router();

// Configure multer for file uploads
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, 'uploads/');
  },
  filename: (req, file, cb) => {
    cb(null, `${Date.now()}-${file.originalname}`);
  },
});
const upload = multer({ storage });

// POST /api/questions - Create a Question
// POST /api/questions - Create a Question
router.post('/', authMiddleware, upload.array('images', 10), async (req, res) => {
  try {
    const { title, description, category, gpsLocation, attempts } = req.body;

    // Extract paths of uploaded images
    const imagePaths = req.files.map((file) => `uploads/${file.filename}`);

    const question = new Question({
      title,
      description,
      category,
      images: imagePaths, // Store all image paths
      gpsLocation,
      attempts,
      user: req.user.id,
    });

    await question.save();
    res.status(201).json(question);
  } catch (err) {
    console.error('Error creating question:', err);
    res.status(500).send('Server error');
  }
});



// GET /api/questions - Get All Questions with optional filters
router.get('/', async (req, res) => {
  const { category, search } = req.query;
  const filter = {};

  if (category) filter.category = category;
  if (search) filter.$text = { $search: search };

  try {
    const questions = await Question.find(filter).populate('user', 'name');
    res.json(questions);
  } catch (err) {
    console.error('Error fetching questions:', err);
    res.status(500).send('Server error');
  }
});

// GET /api/questions/:id - Get Question by ID
router.get('/:id', async (req, res) => {
  try {
    const question = await Question.findById(req.params.id).populate('user', 'name');
    if (!question) return res.status(404).send('Question not found');
    res.json(question);
  } catch (err) {
    res.status(500).send('Server error');
  }
});

// PUT /api/questions/:id/status - Update Question Status
router.put('/:id/status', authMiddleware, async (req, res) => {
  try {
    const { status } = req.body;
    const question = await Question.findById(req.params.id);
    if (!question) return res.status(404).send('Question not found');

    question.status = status;
    await question.save();
    res.json(question);
  } catch (err) {
    res.status(500).send('Server error');
  }
});

module.exports = router;
