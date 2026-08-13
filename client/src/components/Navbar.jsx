import React, { useState } from 'react';
import { Layers, Plus, Github, Sun, Moon, CheckCircle2, LogOut, Download, FileText, Printer } from 'lucide-react';
import { exportAsMarkdown, exportAsPDF } from '../utils/exportUtils';

export default function Navbar({
  user,
  questions = [],
  onLogout,
  onAddProblem,
  onOpenGitHubSettings,
  githubConfigured,
  theme,
  toggleTheme,
}) {
  const [showExportMenu, setShowExportMenu] = useState(false);
  const userInitial = user?.name ? user.name.charAt(0).toUpperCase() : 'U';

  const handleExportMd = () => {
    exportAsMarkdown(questions);
    setShowExportMenu(false);
  };

  const handleExportPdf = () => {
    exportAsPDF(questions);
    setShowExportMenu(false);
  };

  return (
    <header className="navbar">
      <div className="brand">
        <div className="brand-icon">
          <Layers size={20} />
        </div>
        <span>DSA PATTERN VAULT</span>
      </div>

      <div className="nav-actions">
        {user && (
          <div
            style={{
              display: 'flex',
              alignItems: 'center',
              gap: '0.5rem',
              paddingRight: '0.5rem',
              borderRight: '1px solid var(--border)',
            }}
          >
            <div
              style={{
                width: '28px',
                height: '28px',
                borderRadius: '50%',
                backgroundColor: 'var(--surface-muted)',
                border: '1px solid var(--border-strong)',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                fontSize: '0.75rem',
                fontWeight: 700,
                color: 'var(--text-primary)',
              }}
            >
              {userInitial}
            </div>
            <span style={{ fontSize: '0.825rem', fontWeight: 600, color: 'var(--text-primary)' }}>
              {user.name}
            </span>
          </div>
        )}

        {/* Export Dropdown Button */}
        <div style={{ position: 'relative' }}>
          <button
            className="btn btn-secondary btn-sm"
            onClick={() => setShowExportMenu(!showExportMenu)}
            title="Download Vault Problems"
          >
            <Download size={16} />
            <span>Export Vault</span>
          </button>

          {showExportMenu && (
            <div
              className="card"
              style={{
                position: 'absolute',
                top: 'calc(100% + 6px)',
                right: 0,
                zIndex: 90,
                width: '190px',
                padding: '0.4rem',
                boxShadow: '0 10px 15px -3px rgba(0, 0, 0, 0.5)',
                display: 'flex',
                flexDirection: 'column',
                gap: '0.25rem',
              }}
            >
              <button
                className="btn btn-secondary btn-sm"
                style={{ justifyContent: 'flex-start', width: '100%', borderWidth: 0 }}
                onClick={handleExportMd}
              >
                <FileText size={15} />
                <span>Export as .md (Markdown)</span>
              </button>

              <button
                className="btn btn-secondary btn-sm"
                style={{ justifyContent: 'flex-start', width: '100%', borderWidth: 0 }}
                onClick={handleExportPdf}
              >
                <Printer size={15} />
                <span>Export as .pdf (PDF)</span>
              </button>
            </div>
          )}
        </div>

        <button
          className="btn btn-secondary btn-sm"
          onClick={onOpenGitHubSettings}
          title="Configure GitHub Repository & Token"
        >
          <Github size={16} />
          <span>{githubConfigured ? 'GitHub Connected' : 'Connect GitHub'}</span>
          {githubConfigured && <CheckCircle2 size={14} className="synced-check" />}
        </button>

        <button
          className="btn btn-secondary btn-icon-only"
          onClick={toggleTheme}
          title={`Switch to ${theme === 'dark' ? 'Light' : 'Dark'} Mode`}
        >
          {theme === 'dark' ? <Sun size={18} /> : <Moon size={18} />}
        </button>

        <button className="btn btn-primary" onClick={onAddProblem}>
          <Plus size={16} />
          <span>Add Problem</span>
        </button>

        {user && (
          <button
            className="btn btn-danger btn-sm btn-icon-only"
            onClick={onLogout}
            title="Log Out"
          >
            <LogOut size={16} />
          </button>
        )}
      </div>
    </header>
  );
}
