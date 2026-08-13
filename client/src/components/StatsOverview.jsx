import React from 'react';
import { CheckCircle2, RotateCcw, Github, Code2 } from 'lucide-react';

export default function StatsOverview({ stats }) {
  const { total = 0, solved = 0, revisionDue = 0, synced = 0 } = stats || {};

  return (
    <div className="stats-grid">
      <div className="card stat-card">
        <span className="stat-label">Total Problems</span>
        <div className="stat-value-container">
          <span className="stat-value">{total}</span>
          <Code2 size={20} style={{ color: 'var(--text-muted)' }} />
        </div>
        <span className="stat-sub">Tracked in vault</span>
      </div>

      <div className="card stat-card">
        <span className="stat-label">Solved</span>
        <div className="stat-value-container">
          <span className="stat-value">{solved}</span>
          <CheckCircle2 size={20} style={{ color: 'var(--success)' }} />
        </div>
        <span className="stat-sub">{total > 0 ? Math.round((solved / total) * 100) : 0}% completion</span>
      </div>

      <div className="card stat-card">
        <span className="stat-label">Revision Due</span>
        <div className="stat-value-container">
          <span className="stat-value">{revisionDue}</span>
          <RotateCcw size={20} style={{ color: 'var(--warning)' }} />
        </div>
        <span className="stat-sub">Requires practice</span>
      </div>

      <div className="card stat-card">
        <span className="stat-label">GitHub Synced</span>
        <div className="stat-value-container">
          <span className="stat-value">{synced}</span>
          <Github size={20} style={{ color: 'var(--text-secondary)' }} />
        </div>
        <span className="stat-sub">{total > 0 ? Math.round((synced / total) * 100) : 0}% in repository</span>
      </div>
    </div>
  );
}
