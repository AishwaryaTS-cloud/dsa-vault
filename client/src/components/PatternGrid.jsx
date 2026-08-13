import React from 'react';
import { Network } from 'lucide-react';

export default function PatternGrid({ patterns = [], selectedPattern, onSelectPattern }) {
  if (!patterns || patterns.length === 0) {
    return null; // Don't render empty pattern grid if zero patterns exist yet
  }

  return (
    <div style={{ marginBottom: '2rem' }}>
      <h3 className="section-title">
        <Network size={16} />
        <span>Patterns</span>
      </h3>
      <div className="pattern-grid">
        {patterns.map((p) => {
          const isSelected = selectedPattern === p.name;
          return (
            <div
              key={p.name}
              className="card pattern-card"
              style={{
                borderColor: isSelected ? 'var(--text-primary)' : 'var(--border)',
                backgroundColor: isSelected ? 'var(--surface-muted)' : 'var(--surface)',
              }}
              onClick={() => onSelectPattern(isSelected ? '' : p.name)}
            >
              <div className="pattern-name">{p.name}</div>
              <div className="pattern-stats">
                <span>{p.count} {p.count === 1 ? 'problem' : 'problems'}</span>
                {isSelected && <span style={{ fontSize: '0.75rem', fontWeight: 600 }}>Active Filter</span>}
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
