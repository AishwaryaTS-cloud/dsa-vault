const express = require('express');
const router = express.Router();
const { authMiddleware } = require('../middleware/auth');

const getRepo = (req) => req.app.locals.repo;

// Protect all question routes with JWT authentication
router.use(authMiddleware);

// GET /api/questions - List questions scoped to logged-in user
router.get('/', async (req, res) => {
  try {
    const { search, topic, pattern, difficulty, status } = req.query;
    const repo = getRepo(req);
    const questions = await repo.getAll(req.user.id, { search, topic, pattern, difficulty, status });
    res.json(questions);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// GET /api/questions/stats - Get dynamic metrics scoped to logged-in user
router.get('/stats', async (req, res) => {
  try {
    const repo = getRepo(req);
    const stats = await repo.getStats(req.user.id);
    res.json(stats);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// GET /api/questions/topics-patterns - Get dynamic list of topics & patterns scoped to user
router.get('/topics-patterns', async (req, res) => {
  try {
    const repo = getRepo(req);
    const result = await repo.getTopicsAndPatterns(req.user.id);
    res.json(result);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// GET /api/questions/:id - Get specific question
router.get('/:id', async (req, res) => {
  try {
    const repo = getRepo(req);
    const question = await repo.getById(req.params.id, req.user.id);
    if (!question) {
      return res.status(404).json({ message: 'Question not found' });
    }
    res.json(question);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// POST /api/questions - Create new question
router.post('/', async (req, res) => {
  try {
    const { title, topic, pattern } = req.body;
    if (!title || !topic || !pattern) {
      return res.status(400).json({ message: 'Title, Topic, and Pattern are required.' });
    }
    const repo = getRepo(req);
    const question = await repo.create(req.user.id, req.body);
    res.status(201).json(question);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
});

// PUT /api/questions/:id - Update question
router.put('/:id', async (req, res) => {
  try {
    const repo = getRepo(req);
    const updated = await repo.update(req.params.id, req.user.id, req.body);
    if (!updated) {
      return res.status(404).json({ message: 'Question not found' });
    }
    res.json(updated);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
});

// DELETE /api/questions/:id - Delete question
router.delete('/:id', async (req, res) => {
  try {
    const repo = getRepo(req);
    const deleted = await repo.delete(req.params.id, req.user.id);
    if (!deleted) {
      return res.status(404).json({ message: 'Question not found' });
    }
    res.json({ message: 'Question deleted successfully', id: req.params.id });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

module.exports = router;
