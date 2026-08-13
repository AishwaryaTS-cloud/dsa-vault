import React from 'react';
import {
  Search,
  ExternalLink,
  Code2,
  CheckCircle2,
  AlertCircle,
  XCircle,
  RotateCcw,
  Plus,
  Trash2,
  Edit,
  Github,
  Layers,
} from 'lucide-react';

export default function QuestionTable({
  questions = [],
  allTopics = [],
  allPatterns = [],
  search,
  setSearch,
  topicFilter,
  setTopicFilter,
  patternFilter,
  setPatternFilter,
  difficultyFilter,
  setDifficultyFilter,
  statusFilter,
  setStatusFilter,
  onAddProblem,
  onViewSolution,
  onEditQuestion,
  onDeleteQuestion,
  onPushToGitHub,
  githubConfigured,
}) {
  const getDifficultyBadge = (diff) => {
    switch (diff) {
      case 'Easy':
        return <span className="badge badge-easy">Easy</span>;
      case 'Medium':
        return <span className="badge badge-medium">Medium</span>;
      case 'Hard':
        return <span className="badge badge-hard">Hard</span>;
      default:
        return <span className="badge">{diff}</span>;
    }
  };

  const getStatusBadge = (status) => {
    switch (status) {
      case 'Solved':
        return (
          <span className="status-indicator synced-check">
            <CheckCircle2 size={14} /> Solved
          </span>
        );
      case 'Revision Needed':
        return (
          <span className="status-indicator revision-due">
            <RotateCcw size={14} /> Revision Due
          </span>
        );
      case 'Attempted':
        return <span className="status-indicator not-synced">Attempted</span>;
      default:
        return <span className="status-indicator not-synced">{status}</span>;
    }
  };

  const getGitHubSyncBadge = (q) => {
    if (q.githubSynced) {
      return (
        <a
          href={q.githubUrl || '#'}
          target="_blank"
          rel="noopener noreferrer"
          className="status-indicator synced-check link-external"
          title={`Pushed ${q.lastPushed ? new Date(q.lastPushed).toLocaleDateString() : ''}`}
          onClick={(e) => e.stopPropagation()}
        >
          <CheckCircle2 size={15} />
          <span>Synced</span>
          <ExternalLink size={12} />
        </a>
      );
    }
    return (
      <span className="status-indicator not-synced" title="Not pushed to GitHub">
        <AlertCircle size={15} />
        <span>Not Synced</span>
      </span>
    );
  };

  return (
    <div>
      {/* Search & Filters Controls Bar */}
      <div className="controls-bar">
        <div className="search-input-wrapper">
          <Search className="search-icon" />
          <input
            type="text"
            className="input"
            placeholder="Search problems, topics, patterns..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
          />
        </div>

        <div style={{ display: 'flex', gap: '0.5rem', flexWrap: 'wrap' }}>
          <select
            className="select-filter"
            value={topicFilter}
            onChange={(e) => setTopicFilter(e.target.value)}
          >
            <option value="">All Topics</option>
            {allTopics.map((t) => (
              <option key={t} value={t}>
                {t}
              </option>
            ))}
          </select>

          <select
            className="select-filter"
            value={patternFilter}
            onChange={(e) => setPatternFilter(e.target.value)}
          >
            <option value="">All Patterns</option>
            {allPatterns.map((p) => (
              <option key={p} value={p}>
                {p}
              </option>
            ))}
          </select>

          <select
            className="select-filter"
            value={difficultyFilter}
            onChange={(e) => setDifficultyFilter(e.target.value)}
          >
            <option value="">All Difficulties</option>
            <option value="Easy">Easy</option>
            <option value="Medium">Medium</option>
            <option value="Hard">Hard</option>
          </select>

          <select
            className="select-filter"
            value={statusFilter}
            onChange={(e) => setStatusFilter(e.target.value)}
          >
            <option value="">All Statuses</option>
            <option value="Solved">Solved</option>
            <option value="Revision Needed">Revision Needed</option>
            <option value="Attempted">Attempted</option>
            <option value="To Do">To Do</option>
          </select>
        </div>
      </div>

      {/* Main Table or Initial Empty State */}
      {questions.length === 0 ? (
        <div className="empty-state">
          <Layers className="empty-icon" />
          <h3 className="empty-title">No problems added yet</h3>
          <p className="empty-desc">
            Your vault is completely empty. Add your solved DSA problems to build your topic and
            pattern tree.
          </p>
          <button className="btn btn-primary" onClick={onAddProblem}>
            <Plus size={16} />
            <span>+ Add Problem</span>
          </button>
        </div>
      ) : (
        <div className="table-wrapper">
          <table className="question-table">
            <thead>
              <tr>
                <th>Problem</th>
                <th>Topic</th>
                <th>Pattern</th>
                <th>Difficulty</th>
                <th>Status</th>
                <th>GitHub Sync</th>
                <th style={{ textAlign: 'right' }}>Actions</th>
              </tr>
            </thead>
            <tbody>
              {questions.map((q) => (
                <tr key={q._id}>
                  <td>
                    <div style={{ fontWeight: 600 }}>{q.title}</div>
                    <div style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>
                      {q.platform}{' '}
                      {q.problemUrl && (
                        <a
                          href={q.problemUrl}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="link link-external"
                          onClick={(e) => e.stopPropagation()}
                        >
                          link <ExternalLink size={10} />
                        </a>
                      )}
                    </div>
                  </td>
                  <td>
                    <span style={{ color: 'var(--text-secondary)', fontWeight: 500 }}>
                      {q.topic}
                    </span>
                  </td>
                  <td>
                    <span style={{ color: 'var(--text-secondary)' }}>{q.pattern}</span>
                  </td>
                  <td>{getDifficultyBadge(q.difficulty)}</td>
                  <td>{getStatusBadge(q.status)}</td>
                  <td>{getGitHubSyncBadge(q)}</td>
                  <td style={{ textAlign: 'right' }}>
                    <div
                      style={{
                        display: 'inline-flex',
                        gap: '0.35rem',
                        alignItems: 'center',
                        justifyContent: 'flex-end',
                      }}
                    >
                      <button
                        className="btn btn-secondary btn-sm"
                        onClick={() => onViewSolution(q)}
                        title="View Solution & Notes"
                      >
                        <Code2 size={14} />
                        <span>Code</span>
                      </button>

                      <button
                        className="btn btn-secondary btn-sm btn-icon-only"
                        onClick={() => onPushToGitHub(q)}
                        title={
                          githubConfigured
                            ? q.githubSynced
                              ? 'Re-push code to GitHub'
                              : 'Push to GitHub'
                            : 'Configure GitHub settings to push'
                        }
                      >
                        <Github size={14} />
                      </button>

                      <button
                        className="btn btn-secondary btn-sm btn-icon-only"
                        onClick={() => onEditQuestion(q)}
                        title="Edit Question"
                      >
                        <Edit size={14} />
                      </button>

                      <button
                        className="btn btn-danger btn-sm btn-icon-only"
                        onClick={() => onDeleteQuestion(q._id)}
                        title="Delete Question"
                      >
                        <Trash2 size={14} />
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
}
