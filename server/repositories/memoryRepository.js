class MemoryRepository {
  constructor() {
    this.users = [];
    this.questions = [];
  }

  // --- USER AUTH METHODS ---
  async findUserByEmail(email) {
    return this.users.find((u) => u.email.toLowerCase() === email.toLowerCase()) || null;
  }

  async findUserById(id) {
    const user = this.users.find((u) => u._id === id);
    if (!user) return null;
    const { password, ...userWithoutPassword } = user;
    return userWithoutPassword;
  }

  async createUser(userData) {
    const newUser = {
      _id: 'usr_' + Date.now() + '_' + Math.random().toString(36).substr(2, 5),
      name: userData.name,
      email: userData.email.toLowerCase(),
      password: userData.password,
      createdAt: new Date().toISOString(),
    };
    this.users.push(newUser);
    return newUser;
  }

  // --- QUESTION METHODS (USER SCOPED) ---
  async getAll(userId, filters = {}) {
    let result = this.questions.filter((q) => q.userId === userId);

    if (filters.search) {
      const term = filters.search.toLowerCase();
      result = result.filter(
        (q) =>
          q.title.toLowerCase().includes(term) ||
          q.topic.toLowerCase().includes(term) ||
          q.pattern.toLowerCase().includes(term)
      );
    }
    if (filters.topic) {
      result = result.filter((q) => q.topic.toLowerCase() === filters.topic.toLowerCase());
    }
    if (filters.pattern) {
      result = result.filter((q) => q.pattern.toLowerCase() === filters.pattern.toLowerCase());
    }
    if (filters.difficulty) {
      result = result.filter((q) => q.difficulty === filters.difficulty);
    }
    if (filters.status) {
      result = result.filter((q) => q.status === filters.status);
    }

    return result.sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt));
  }

  async getById(id, userId) {
    return this.questions.find((q) => q._id === id && q.userId === userId) || null;
  }

  async create(userId, data) {
    const newQuestion = {
      _id: 'mem_' + Date.now() + '_' + Math.random().toString(36).substr(2, 5),
      userId,
      title: data.title,
      platform: data.platform || 'LeetCode',
      problemUrl: data.problemUrl || '',
      topic: data.topic,
      pattern: data.pattern,
      difficulty: data.difficulty || 'Easy',
      status: data.status || 'Solved',
      language: data.language || 'C++',
      solution: data.solution || '',
      approach: data.approach || '',
      timeComplexity: data.timeComplexity || 'O(n)',
      spaceComplexity: data.spaceComplexity || 'O(1)',
      githubSynced: data.githubSynced || false,
      githubUrl: data.githubUrl || '',
      lastPushed: data.lastPushed || null,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    };

    this.questions.push(newQuestion);
    return newQuestion;
  }

  async update(id, userId, data) {
    const index = this.questions.findIndex((q) => q._id === id && q.userId === userId);
    if (index === -1) return null;

    this.questions[index] = {
      ...this.questions[index],
      ...data,
      updatedAt: new Date().toISOString(),
    };

    return this.questions[index];
  }

  async delete(id, userId) {
    const index = this.questions.findIndex((q) => q._id === id && q.userId === userId);
    if (index === -1) return null;

    const [deleted] = this.questions.splice(index, 1);
    return deleted;
  }

  async getStats(userId) {
    const userQuestions = this.questions.filter((q) => q.userId === userId);
    const total = userQuestions.length;
    const solved = userQuestions.filter((q) => q.status === 'Solved').length;
    const revisionDue = userQuestions.filter((q) => q.status === 'Revision Needed').length;
    const synced = userQuestions.filter((q) => q.githubSynced).length;

    const easy = userQuestions.filter((q) => q.difficulty === 'Easy').length;
    const medium = userQuestions.filter((q) => q.difficulty === 'Medium').length;
    const hard = userQuestions.filter((q) => q.difficulty === 'Hard').length;

    const topicsMap = {};
    userQuestions.forEach((q) => {
      topicsMap[q.topic] = (topicsMap[q.topic] || 0) + 1;
    });

    const patternsMap = {};
    userQuestions.forEach((q) => {
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
    const userQuestions = this.questions.filter((q) => q.userId === userId);
    const topics = Array.from(new Set(userQuestions.map((q) => q.topic))).filter(Boolean);
    const patterns = Array.from(new Set(userQuestions.map((q) => q.pattern))).filter(Boolean);
    return { topics, patterns };
  }
}

module.exports = new MemoryRepository();
