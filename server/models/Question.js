const mongoose = require('mongoose');

const QuestionSchema = new mongoose.Schema(
  {
    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: true,
    },
    title: {
      type: String,
      required: true,
      trim: true,
    },
    platform: {
      type: String,
      default: 'LeetCode',
      trim: true,
    },
    problemUrl: {
      type: String,
      trim: true,
      default: '',
    },
    topic: {
      type: String,
      required: true,
      trim: true,
    },
    pattern: {
      type: String,
      required: true,
      trim: true,
    },
    difficulty: {
      type: String,
      enum: ['Easy', 'Medium', 'Hard'],
      default: 'Easy',
    },
    status: {
      type: String,
      enum: ['Solved', 'Revision Needed', 'Attempted', 'To Do'],
      default: 'Solved',
    },
    language: {
      type: String,
      default: 'C++',
      trim: true,
    },
    solution: {
      type: String,
      default: '',
    },
    approach: {
      type: String,
      default: '',
    },
    timeComplexity: {
      type: String,
      default: 'O(n)',
    },
    spaceComplexity: {
      type: String,
      default: 'O(1)',
    },
    githubSynced: {
      type: Boolean,
      default: false,
    },
    githubUrl: {
      type: String,
      default: '',
    },
    lastPushed: {
      type: Date,
      default: null,
    },
    nextRevisionDate: {
      type: Date,
      default: null,
    },
    revisionCount: {
      type: Number,
      default: 0,
    },
    lastRevisedAt: {
      type: Date,
      default: null,
    },
  },
  {
    timestamps: true,
  }
);

module.exports = mongoose.model('Question', QuestionSchema);
