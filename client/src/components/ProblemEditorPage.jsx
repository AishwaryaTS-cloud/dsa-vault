import React, { useState, useEffect } from 'react';
import { ArrowLeft, Save, Github, Copy, Check, Code2, CloudUpload } from 'lucide-react';

export default function ProblemEditorPage({
  questionToEdit,
  existingTopics = [],
  existingPatterns = [],
  onSave,
  onBack,
  onPushToGitHub,
  githubConfigured,
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
  const [copied, setCopied] = useState(false);
  const [saving, setSaving] = useState(false);

  useEffect(() => {
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

      setFormData({
        title: '',
        platform: 'LeetCode',
        problemUrl: '',
        topic: hasTopics ? existingTopics[0] : '',
        pattern: hasPatterns ? existingPatterns[0] : '',
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
  }, [questionToEdit]);

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

  const handleCopyCode = () => {
    if (formData.solution) {
      navigator.clipboard.writeText(formData.solution);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    }
  };

  const validateForm = () => {
    const finalTopic = isNewTopicMode ? customTopic.trim() : formData.topic;
    const finalPattern = isNewPatternMode ? customPattern.trim() : formData.pattern;

    if (!formData.title.trim()) {
      alert('Please enter a Problem Title.');
      return null;
    }
    if (!finalTopic) {
      alert('Please select or enter a Topic.');
      return null;
    }
    if (!finalPattern) {
      alert('Please select or enter a Pattern.');
      return null;
    }

    return {
      ...formData,
      topic: finalTopic,
      pattern: finalPattern,
    };
  };

  // Standard Save (Save and return to dashboard)
  const handleSaveOnly = async (e) => {
    if (e) e.preventDefault();
    const payload = validateForm();
    if (!payload) return;

    setSaving(true);
    try {
      await onSave(payload, false);
    } finally {
      setSaving(false);
    }
  };

  // Save & Push to GitHub directly in one click!
  const handleSaveAndPushToGitHub = async (e) => {
    if (e) e.preventDefault();
    const payload = validateForm();
    if (!payload) return;

    if (!githubConfigured) {
      alert('Please configure your GitHub Access Token and Target Repository first by clicking "Connect GitHub" in the top bar.');
      return;
    }

    setSaving(true);
    try {
      const savedQuestion = await onSave(payload, true); // save without redirecting immediately
      if (savedQuestion) {
        await onPushToGitHub(savedQuestion);
        onBack(); // Return to dashboard after successful save & push
      }
    } catch (err) {
      console.error('Save & Push error:', err);
    } finally {
      setSaving(false);
    }
  };

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem', width: '100%' }}>
      {/* Top Header Bar */}
      <div
        style={{
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
          paddingBottom: '1rem',
          borderBottom: '1px solid var(--border)',
          flexWrap: 'wrap',
          gap: '1rem',
        }}
      >
        <div style={{ display: 'flex', alignItems: 'center', gap: '1rem' }}>
          <button className="btn btn-secondary" onClick={onBack}>
            <ArrowLeft size={16} />
            <span>Back to Dashboard</span>
          </button>
          <h2 style={{ fontSize: '1.25rem', fontWeight: 700, color: 'var(--text-primary)' }}>
            {questionToEdit ? `Edit: ${formData.title || 'Problem'}` : 'New Problem Entry'}
          </h2>
        </div>

        <div style={{ display: 'flex', gap: '0.75rem', alignItems: 'center' }}>
          <button
            type="button"
            className="btn btn-secondary"
            onClick={handleSaveOnly}
            disabled={saving}
          >
            <Save size={16} />
            <span>{saving ? 'Saving...' : 'Save Only'}</span>
          </button>

          <button
            type="button"
            className="btn btn-primary"
            onClick={handleSaveAndPushToGitHub}
            disabled={saving}
            title={githubConfigured ? 'Save problem and push code to GitHub in one click' : 'Configure GitHub settings first'}
          >
            <CloudUpload size={16} />
            <span>{saving ? 'Processing...' : 'Save & Push to GitHub'}</span>
          </button>
        </div>
      </div>

      {/* Main Split Screen Container (Left / Right Layout) */}
      <div className="split-page-layout">
        {/* LEFT COLUMN: Problem Details & Notes */}
        <div className="split-left-panel">
          <h3 className="section-title">
            <Code2 size={16} />
            <span>Problem Metadata & Approach</span>
          </h3>

          <div className="form-group">
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

          <div className="form-grid">
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

          {/* Topic & Pattern Selector */}
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
                <select className="select-filter" value={formData.topic} onChange={handleTopicSelectChange}>
                  {existingTopics.map((t) => (
                    <option key={t} value={t}>{t}</option>
                  ))}
                  <option value="__CREATE_NEW__">+ Create new topic</option>
                </select>
              ) : (
                <input
                  type="text"
                  className="input input-plain"
                  placeholder="Enter topic (e.g. Arrays, DP)"
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
                <select className="select-filter" value={formData.pattern} onChange={handlePatternSelectChange}>
                  {existingPatterns.map((p) => (
                    <option key={p} value={p}>{p}</option>
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

          {/* Difficulty & Status */}
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
          </div>

          {/* Complexities */}
          <div className="form-grid">
            <div className="form-group">
              <label className="label">Time Complexity</label>
              <input
                type="text"
                className="input input-plain"
                placeholder="e.g. O(n)"
                value={formData.timeComplexity}
                onChange={(e) => setFormData({ ...formData, timeComplexity: e.target.value })}
              />
            </div>
            <div className="form-group">
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

          {/* Approach Notes */}
          <div className="form-group" style={{ flex: 1 }}>
            <label className="label">Approach & Algorithm Walkthrough</label>
            <textarea
              className="textarea"
              placeholder="Explain key intuition, edge cases, step-by-step breakdown..."
              value={formData.approach}
              onChange={(e) => setFormData({ ...formData, approach: e.target.value })}
              style={{ minHeight: '140px' }}
            />
          </div>
        </div>

        {/* RIGHT COLUMN: Full Code Editor */}
        <div className="split-right-panel">
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '0.5rem' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
              <label className="label" style={{ margin: 0 }}>Solution Code</label>
              <select
                className="select-filter"
                style={{ padding: '0.2rem 0.5rem', fontSize: '0.775rem' }}
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

            <button type="button" className="btn btn-secondary btn-sm" onClick={handleCopyCode}>
              {copied ? <Check size={14} /> : <Copy size={14} />}
              <span>{copied ? 'Copied' : 'Copy Code'}</span>
            </button>
          </div>

          <div className="code-window" style={{ display: 'flex', flexDirection: 'column', flex: 1, minHeight: '480px' }}>
            <div className="code-header">
              <div className="window-dots">
                <span className="dot dot-rose"></span>
                <span className="dot dot-amber"></span>
                <span className="dot dot-emerald"></span>
              </div>
              <span className="code-filename">
                {(isNewTopicMode ? customTopic : formData.topic) || 'Topic'}/
                {(isNewPatternMode ? customPattern : formData.pattern) || 'Pattern'}/
                {formData.title || 'Solution'}.{formData.language?.toLowerCase()}
              </span>
              <span style={{ fontSize: '0.7rem', color: 'var(--text-muted)' }}>UTF-8</span>
            </div>

            <textarea
              className="code-textarea-full"
              placeholder={`// Paste your ${formData.language} solution code here...\n\n#include <iostream>\nusing namespace std;\n\nint main() {\n    // Your solution\n    return 0;\n}`}
              value={formData.solution}
              onChange={(e) => setFormData({ ...formData, solution: e.target.value })}
            />
          </div>

          {/* Bottom Action bar */}
          <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '0.75rem', marginTop: '1rem' }}>
            <button
              type="button"
              className="btn btn-secondary"
              onClick={handleSaveOnly}
              disabled={saving}
            >
              <Save size={16} />
              <span>Save Only</span>
            </button>

            <button
              type="button"
              className="btn btn-primary"
              onClick={handleSaveAndPushToGitHub}
              disabled={saving}
            >
              <CloudUpload size={16} />
              <span>Save & Push to GitHub</span>
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
