const express = require('express');
const router = express.Router();
const { pushSolutionToGitHub, verifyGitHubAccess } = require('../services/githubService');
const { authMiddleware } = require('../middleware/auth');

const getRepo = (req) => req.app.locals.repo;

router.use(authMiddleware);

// POST /api/github/push/:id - Push solution to GitHub repo
router.post('/push/:id', async (req, res) => {
  try {
    const { token, repo: targetRepo, branch } = req.body;
    const repository = getRepo(req);

    const question = await repository.getById(req.params.id, req.user.id);
    if (!question) {
      return res.status(404).json({ message: 'Question not found' });
    }

    if (!token || !targetRepo) {
      return res.status(400).json({
        message: 'GitHub Personal Access Token and target repository (owner/repo) are required.',
      });
    }

    const result = await pushSolutionToGitHub({
      token,
      repo: targetRepo,
      branch: branch || 'main',
      question,
    });

    const updated = await repository.update(question._id, req.user.id, {
      githubSynced: true,
      githubUrl: result.htmlUrl,
      lastPushed: result.pushedAt,
    });

    res.json({
      message: 'Solution pushed to GitHub successfully!',
      result,
      question: updated,
    });
  } catch (error) {
    console.error('GitHub Push Error:', error.message);
    res.status(500).json({
      message: error.message || 'Failed to push solution to GitHub',
    });
  }
});

// POST /api/github/verify - Test GitHub Access
router.post('/verify', async (req, res) => {
  try {
    const { token, repo } = req.body;
    const info = await verifyGitHubAccess({ token, repo });
    res.json({ success: true, info });
  } catch (error) {
    res.status(400).json({ success: false, message: error.message });
  }
});

module.exports = router;
