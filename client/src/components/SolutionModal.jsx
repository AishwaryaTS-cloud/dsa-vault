import React, { useState } from 'react';
import { X, Github, ExternalLink, CheckCircle2, Copy, Check } from 'lucide-react';

export default function SolutionModal({
  isOpen,
  onClose,
  question,
  onPushToGitHub,
  githubConfigured,
}) {
  const [copied, setCopied] = useState(false);
  const [pushing, setPushing] = useState(false);

  if (!isOpen || !question) return null;

  const handleCopyCode = () => {
    if (question.solution) {
      navigator.clipboard.writeText(question.solution);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    }
  };

  const handlePush = async () => {
    setPushing(true);
    try {
      await onPushToGitHub(question);
    } finally {
      setPushing(false);
    }
  };

  return (
    <div className="modal-overlay" onClick={onClose}>
      <div className="modal-content" style={{ maxWidth: '780px' }} onClick={(e) => e.stopPropagation()}>
        <div className="modal-header">
          <div>
            <h3 className="modal-title">{question.title}</h3>
            <div style={{ fontSize: '0.8rem', color: 'var(--text-secondary)', display: 'flex', gap: '0.75rem', marginTop: '0.2rem' }}>
              <span>Topic: {question.topic}</span>
              <span>•</span>
              <span>Pattern: {question.pattern}</span>
              <span>•</span>
              <span>{question.difficulty}</span>
            </div>
          </div>
          <button className="btn btn-secondary btn-sm btn-icon-only" onClick={onClose}>
            <X size={18} />
          </button>
        </div>

        <div className="modal-body">
          {/* Complexity & Metadata Bar */}
          <div style={{ display: 'flex', gap: '1rem', flexWrap: 'wrap', alignItems: 'center' }}>
            <div className="card" style={{ padding: '0.6rem 1rem', flex: 1 }}>
              <span className="stat-label">Time Complexity</span>
              <div style={{ fontSize: '0.95rem', fontWeight: 600, color: 'var(--text-primary)' }}>
                {question.timeComplexity || 'O(n)'}
              </div>
            </div>
            <div className="card" style={{ padding: '0.6rem 1rem', flex: 1 }}>
              <span className="stat-label">Space Complexity</span>
              <div style={{ fontSize: '0.95rem', fontWeight: 600, color: 'var(--text-primary)' }}>
                {question.spaceComplexity || 'O(1)'}
              </div>
            </div>
            <div className="card" style={{ padding: '0.6rem 1rem', flex: 1 }}>
              <span className="stat-label">GitHub Sync</span>
              <div style={{ fontSize: '0.85rem', fontWeight: 500, marginTop: '0.1rem' }}>
                {question.githubSynced ? (
                  <span className="status-indicator synced-check">
                    <CheckCircle2 size={14} /> Synced ✓
                  </span>
                ) : (
                  <span className="status-indicator not-synced">Not Synced ✗</span>
                )}
              </div>
            </div>
          </div>

          {/* Approach Walkthrough */}
          {question.approach && (
            <div>
              <h4 className="label" style={{ marginBottom: '0.35rem' }}>Approach & Intuition</h4>
              <div
                className="card"
                style={{
                  backgroundColor: 'var(--surface-muted)',
                  fontSize: '0.875rem',
                  lineHeight: '1.6',
                  whiteSpace: 'pre-wrap',
                }}
              >
                {question.approach}
              </div>
            </div>
          )}

          {/* Code Window */}
          <div>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '0.35rem' }}>
              <h4 className="label">Solution Code ({question.language})</h4>
              <button className="btn btn-secondary btn-sm" onClick={handleCopyCode}>
                {copied ? <Check size={14} /> : <Copy size={14} />}
                <span>{copied ? 'Copied' : 'Copy Code'}</span>
              </button>
            </div>

            <div className="code-window">
              <div className="code-header">
                <div className="window-dots">
                  <span className="dot dot-rose"></span>
                  <span className="dot dot-amber"></span>
                  <span className="dot dot-emerald"></span>
                </div>
                <span className="code-filename">
                  {question.topic}/{question.pattern}/{question.title}.{question.language?.toLowerCase()}
                </span>
                <span></span>
              </div>
              <pre className="code-content">
                <code>{question.solution || '// No solution code provided yet.'}</code>
              </pre>
            </div>
          </div>
        </div>

        <div className="modal-footer">
          {question.githubSynced && question.githubUrl && (
            <a
              href={question.githubUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="btn btn-secondary link-external"
              style={{ marginRight: 'auto' }}
            >
              <Github size={16} />
              <span>View on GitHub</span>
              <ExternalLink size={12} />
            </a>
          )}

          <button type="button" className="btn btn-secondary" onClick={onClose}>
            Close
          </button>

          <button
            type="button"
            className="btn btn-primary"
            onClick={handlePush}
            disabled={pushing || !githubConfigured}
            title={githubConfigured ? 'Push/Update code in GitHub repo' : 'Configure GitHub Settings first'}
          >
            <Github size={16} />
            <span>{pushing ? 'Pushing...' : question.githubSynced ? 'Re-push to GitHub' : 'Push to GitHub'}</span>
          </button>
        </div>
      </div>
    </div>
  );
}
