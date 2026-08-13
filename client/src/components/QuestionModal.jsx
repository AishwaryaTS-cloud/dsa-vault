import React, { useState, useEffect } from 'react';
import { X } from 'lucide-react';

export default function QuestionModal({
  isOpen,
  onClose,
  onSave,
  questionToEdit,
  existingTopics = [],
  existingPatterns = [],
}) {
  const [formData, setFormData] = useState({
    title: '',
    platform: 'LeetCode',
    problemUrl: '',
    topic: '',
    pattern: '',
    difficulty: 'Easy',
    status: 'Solved',
    language: 'C++',
    solution: '',
    approach: '',
    timeComplexity: 'O(n)',
    spaceComplexity: 'O(1)',
  });

  const [isNewTopicMode, setIsNewTopicMode] = useState(false);
  const [isNewPatternMode, setIsNewPatternMode] = useState(false);
  const [customTopic, setCustomTopic] = useState('');
  const [customPattern, setCustomPattern] = useState('');

  // Reset/populate form ONLY when modal is opened or target question to edit changes
  useEffect(() => {
    if (!isOpen) return;

    if (questionToEdit) {
      setFormData({
        title: questionToEdit.title || '',
        platform: questionToEdit.platform || 'LeetCode',
        problemUrl: questionToEdit.problemUrl || '',
        topic: questionToEdit.topic || '',
        pattern: questionToEdit.pattern || '',
        difficulty: questionToEdit.difficulty || 'Easy',
        status: questionToEdit.status || 'Solved',
        language: questionToEdit.language || 'C++',
        solution: questionToEdit.solution || '',
        approach: questionToEdit.approach || '',
        timeComplexity: questionToEdit.timeComplexity || 'O(n)',
        spaceComplexity: questionToEdit.spaceComplexity || 'O(1)',
      });
      setIsNewTopicMode(false);
      setIsNewPatternMode(false);
      setCustomTopic('');
      setCustomPattern('');
    } else {
      const hasTopics = existingTopics && existingTopics.length > 0;
      const hasPatterns = existingPatterns && existingPatterns.length > 0;

      const defaultTopic = hasTopics ? existingTopics[0] : '';
      const defaultPattern = hasPatterns ? existingPatterns[0] : '';

      setFormData({
        title: '',
        platform: 'LeetCode',
        problemUrl: '',
        topic: defaultTopic,
        pattern: defaultPattern,
        difficulty: 'Easy',
        status: 'Solved',
        language: 'C++',
        solution: '',
        approach: '',
        timeComplexity: 'O(n)',
        spaceComplexity: 'O(1)',
      });

      setIsNewTopicMode(!hasTopics);
      setIsNewPatternMode(!hasPatterns);
      setCustomTopic('');
      setCustomPattern('');
    }
  }, [isOpen, questionToEdit]); // DO NOT include existingTopics or existingPatterns here to prevent resetting typed user inputs

  if (!isOpen) return null;

  const handleTopicSelectChange = (e) => {
    const val = e.target.value;
    if (val === '__CREATE_NEW__') {
      setIsNewTopicMode(true);
      setCustomTopic('');
    } else {
      setIsNewTopicMode(false);
      setFormData((prev) => ({ ...prev, topic: val }));
    }
  };

  const handlePatternSelectChange = (e) => {
    const val = e.target.value;
    if (val === '__CREATE_NEW__') {
      setIsNewPatternMode(true);
      setCustomPattern('');
    } else {
      setIsNewPatternMode(false);
      setFormData((prev) => ({ ...prev, pattern: val }));
    }
  };

  const handleSubmit = (e) => {
    e.preventDefault();

    const finalTopic = isNewTopicMode ? customTopic.trim() : formData.topic;
    const finalPattern = isNewPatternMode ? customPattern.trim() : formData.pattern;

    if (!formData.title.trim()) {
      alert('Please enter a Problem Title.');
      return;
    }
    if (!finalTopic) {
      alert('Please select or enter a Topic.');
      return;
    }
    if (!finalPattern) {
      alert('Please select or enter a Pattern.');
      return;
    }

    onSave({
      ...formData,
      topic: finalTopic,
      pattern: finalPattern,
    });
  };

  return (
    <div className="modal-overlay" onClick={onClose}>
      <div className="modal-content" style={{ maxWidth: '720px' }} onClick={(e) => e.stopPropagation()}>
        <div className="modal-header">
          <h3 className="modal-title">
            {questionToEdit ? 'Edit Problem' : 'Add New Problem'}
          </h3>
          <button className="btn btn-secondary btn-sm btn-icon-only" type="button" onClick={onClose}>
            <X size={18} />
          </button>
        </div>

        <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', flex: 1 }}>
          <div className="modal-body">
            {/* Title & Platform */}
            <div className="form-grid">
              <div className="form-group form-group-full">
                <label className="label">Problem Title *</label>
                <input
                  type="text"
                  className="input input-plain"
                  placeholder="e.g. Two Sum"
                  value={formData.title}
                  onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                  required
                />
              </div>

              <div className="form-group">
                <label className="label">Platform</label>
                <select
                  className="select-filter"
                  value={formData.platform}
                  onChange={(e) => setFormData({ ...formData, platform: e.target.value })}
                >
                  <option value="LeetCode">LeetCode</option>
                  <option value="Codeforces">Codeforces</option>
                  <option value="HackerRank">HackerRank</option>
                  <option value="GeeksforGeeks">GeeksforGeeks</option>
                  <option value="InterviewBit">InterviewBit</option>
                  <option value="Custom">Custom / Other</option>
                </select>
              </div>

              <div className="form-group">
                <label className="label">Problem URL</label>
                <input
                  type="url"
                  className="input input-plain"
                  placeholder="https://leetcode.com/problems/two-sum/"
                  value={formData.problemUrl}
                  onChange={(e) => setFormData({ ...formData, problemUrl: e.target.value })}
                />
              </div>
            </div>

            {/* Dynamic Topic & Dynamic Pattern */}
            <div className="form-grid">
              <div className="form-group">
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                  <label className="label">Topic *</label>
                  {isNewTopicMode && existingTopics && existingTopics.length > 0 && (
                    <button
                      type="button"
                      style={{ background: 'none', border: 'none', color: 'var(--text-muted)', fontSize: '0.75rem', cursor: 'pointer' }}
                      onClick={() => {
                        setIsNewTopicMode(false);
                        setFormData((prev) => ({ ...prev, topic: existingTopics[0] || '' }));
                      }}
                    >
                      ← Select existing
                    </button>
                  )}
                </div>

                {!isNewTopicMode && existingTopics && existingTopics.length > 0 ? (
                  <select
                    className="select-filter"
                    value={formData.topic}
                    onChange={handleTopicSelectChange}
                  >
                    {existingTopics.map((t) => (
                      <option key={t} value={t}>
                        {t}
                      </option>
                    ))}
                    <option value="__CREATE_NEW__">+ Create new topic</option>
                  </select>
                ) : (
                  <input
                    type="text"
                    className="input input-plain"
                    placeholder="Enter topic (e.g. Arrays, Dynamic Programming)"
                    value={customTopic}
                    onChange={(e) => setCustomTopic(e.target.value)}
                    required
                  />
                )}
              </div>

              <div className="form-group">
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                  <label className="label">Pattern *</label>
                  {isNewPatternMode && existingPatterns && existingPatterns.length > 0 && (
                    <button
                      type="button"
                      style={{ background: 'none', border: 'none', color: 'var(--text-muted)', fontSize: '0.75rem', cursor: 'pointer' }}
                      onClick={() => {
                        setIsNewPatternMode(false);
                        setFormData((prev) => ({ ...prev, pattern: existingPatterns[0] || '' }));
                      }}
                    >
                      ← Select existing
                    </button>
                  )}
                </div>

                {!isNewPatternMode && existingPatterns && existingPatterns.length > 0 ? (
                  <select
                    className="select-filter"
                    value={formData.pattern}
                    onChange={handlePatternSelectChange}
                  >
                    {existingPatterns.map((p) => (
                      <option key={p} value={p}>
                        {p}
                      </option>
                    ))}
                    <option value="__CREATE_NEW__">+ Create new pattern</option>
                  </select>
                ) : (
                  <input
                    type="text"
                    className="input input-plain"
                    placeholder="Enter pattern (e.g. Two Pointers, Hashing)"
                    value={customPattern}
                    onChange={(e) => setCustomPattern(e.target.value)}
                    required
                  />
                )}
              </div>
            </div>

            {/* Difficulty, Status, Language */}
            <div className="form-grid">
              <div className="form-group">
                <label className="label">Difficulty</label>
                <select
                  className="select-filter"
                  value={formData.difficulty}
                  onChange={(e) => setFormData({ ...formData, difficulty: e.target.value })}
                >
                  <option value="Easy">Easy</option>
                  <option value="Medium">Medium</option>
                  <option value="Hard">Hard</option>
                </select>
              </div>

              <div className="form-group">
                <label className="label">Status</label>
                <select
                  className="select-filter"
                  value={formData.status}
                  onChange={(e) => setFormData({ ...formData, status: e.target.value })}
                >
                  <option value="Solved">Solved</option>
                  <option value="Revision Needed">Revision Needed</option>
                  <option value="Attempted">Attempted</option>
                  <option value="To Do">To Do</option>
                </select>
              </div>

              <div className="form-group">
                <label className="label">Language</label>
                <select
                  className="select-filter"
                  value={formData.language}
                  onChange={(e) => setFormData({ ...formData, language: e.target.value })}
                >
                  <option value="C++">C++</option>
                  <option value="Java">Java</option>
                  <option value="Python">Python</option>
                  <option value="JavaScript">JavaScript</option>
                  <option value="TypeScript">TypeScript</option>
                  <option value="Go">Go</option>
                  <option value="Rust">Rust</option>
                </select>
              </div>

              <div className="form-group">
                <div style={{ display: 'flex', gap: '0.5rem' }}>
                  <div style={{ flex: 1 }}>
                    <label className="label">Time Complexity</label>
                    <input
                      type="text"
                      className="input input-plain"
                      placeholder="e.g. O(n)"
                      value={formData.timeComplexity}
                      onChange={(e) => setFormData({ ...formData, timeComplexity: e.target.value })}
                    />
                  </div>
                  <div style={{ flex: 1 }}>
                    <label className="label">Space Complexity</label>
                    <input
                      type="text"
                      className="input input-plain"
                      placeholder="e.g. O(1)"
                      value={formData.spaceComplexity}
                      onChange={(e) => setFormData({ ...formData, spaceComplexity: e.target.value })}
                    />
                  </div>
                </div>
              </div>
            </div>

            {/* Approach Notes */}
            <div className="form-group">
              <label className="label">Approach & Notes</label>
              <textarea
                className="textarea"
                placeholder="Explain key intuition, edge cases, and algorithm breakdown..."
                value={formData.approach}
                onChange={(e) => setFormData({ ...formData, approach: e.target.value })}
                rows={3}
              />
            </div>

            {/* Solution Code */}
            <div className="form-group">
              <label className="label">Solution Code ({formData.language})</label>
              <textarea
                className="textarea code-textarea"
                placeholder={`// Paste your ${formData.language} solution code here...`}
                value={formData.solution}
                onChange={(e) => setFormData({ ...formData, solution: e.target.value })}
                rows={8}
                style={{ minHeight: '180px', fontFamily: "'JetBrains Mono', monospace" }}
              />
            </div>
          </div>

          <div className="modal-footer">
            <button type="button" className="btn btn-secondary" onClick={onClose}>
              Cancel
            </button>
            <button type="submit" className="btn btn-primary">
              {questionToEdit ? 'Save Changes' : 'Add Problem'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
