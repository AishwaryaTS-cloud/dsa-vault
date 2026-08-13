const Question = require('../models/Question');
const User = require('../models/User');

class MongoRepository {
  // --- USER AUTH METHODS ---
  async findUserByEmail(email) {
    return await User.findOne({ email: email.toLowerCase() });
  }

  async findUserById(id) {
    return await User.findById(id).select('-password');
  }

  async createUser(userData) {
    const user = new User(userData);
    return await user.save();
  }

  // --- QUESTION METHODS (USER SCOPED) ---
  async getAll(userId, filters = {}) {
    const query = { user: userId };

    if (filters.search) {
      query.$and = [
        { user: userId },
        {
          $or: [
            { title: { $regex: filters.search, $options: 'i' } },
            { topic: { $regex: filters.search, $options: 'i' } },
            { pattern: { $regex: filters.search, $options: 'i' } },
          ],
        },
      ];
    }
    if (filters.topic) query.topic = filters.topic;
    if (filters.pattern) query.pattern = filters.pattern;
    if (filters.difficulty) query.difficulty = filters.difficulty;
    if (filters.status) query.status = filters.status;
    if (filters.revisionDueOnly) {
      const now = new Date();
      query.$or = [
        { status: 'Revision Needed' },
        { nextRevisionDate: { $lte: now } },
      ];
    }

    return await Question.find(query).sort({ nextRevisionDate: 1, createdAt: -1 });
  }

  async getById(id, userId) {
    return await Question.findOne({ _id: id, user: userId });
  }

  async create(userId, data) {
    const question = new Question({ ...data, user: userId });
    return await question.save();
  }

  async update(id, userId, data) {
    return await Question.findOneAndUpdate(
      { _id: id, user: userId },
      data,
      { new: true, runValidators: true }
    );
  }

  async delete(id, userId) {
    return await Question.findOneAndDelete({ _id: id, user: userId });
  }

  async getStats(userId) {
    const questions = await Question.find({ user: userId });
    const now = new Date();

    const total = questions.length;
    const solved = questions.filter((q) => q.status === 'Solved').length;

    // Calculate revision due count (either status is Revision Needed or nextRevisionDate is in the past/today)
    const revisionDue = questions.filter((q) => {
      if (q.status === 'Revision Needed') return true;
      if (q.nextRevisionDate && new Date(q.nextRevisionDate) <= now) return true;
      return false;
    }).length;

    const synced = questions.filter((q) => q.githubSynced).length;

    const easy = questions.filter((q) => q.difficulty === 'Easy').length;
    const medium = questions.filter((q) => q.difficulty === 'Medium').length;
    const hard = questions.filter((q) => q.difficulty === 'Hard').length;

    const topicsMap = {};
    questions.forEach((q) => {
      topicsMap[q.topic] = (topicsMap[q.topic] || 0) + 1;
    });

    const patternsMap = {};
    questions.forEach((q) => {
      patternsMap[q.pattern] = (patternsMap[q.pattern] || 0) + 1;
    });

    return {
      total,
      solved,
      revisionDue,
      synced,
      difficulty: { easy, medium, hard },
      topics: Object.entries(topicsMap).map(([name, count]) => ({ name, count })),
      patterns: Object.entries(patternsMap).map(([name, count]) => ({ name, count })),
    };
  }

  async getTopicsAndPatterns(userId) {
    const questions = await Question.find({ user: userId });
    const topics = Array.from(new Set(questions.map((q) => q.topic))).filter(Boolean);
    const patterns = Array.from(new Set(questions.map((q) => q.pattern))).filter(Boolean);
    return { topics, patterns };
  }
}

module.exports = new MongoRepository();
