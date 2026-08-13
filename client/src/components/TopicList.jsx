import React from 'react';
import { Folder } from 'lucide-react';

export default function TopicList({ topics = [], selectedTopic, onSelectTopic }) {
  if (!topics || topics.length === 0) {
    return null; // Don't render empty topic container if zero topics exist yet
  }

  return (
    <div style={{ marginBottom: '1.5rem' }}>
      <h3 className="section-title">
        <Folder size={16} />
        <span>Topics</span>
      </h3>
      <div className="topic-pills-container">
        <button
          className={`topic-pill ${!selectedTopic ? 'active' : ''}`}
          onClick={() => onSelectTopic('')}
        >
          <span>All Topics</span>
        </button>
        {topics.map((t) => (
          <button
            key={t.name}
            className={`topic-pill ${selectedTopic === t.name ? 'active' : ''}`}
            onClick={() => onSelectTopic(t.name === selectedTopic ? '' : t.name)}
          >
            <span>{t.name}</span>
            <span className="count-badge">{t.count}</span>
          </button>
        ))}
      </div>
    </div>
  );
}
