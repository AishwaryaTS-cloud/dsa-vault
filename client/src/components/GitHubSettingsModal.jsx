import React, { useState, useEffect } from 'react';
import { X, Github, CheckCircle2, AlertCircle } from 'lucide-react';
import { verifyGitHubAccess } from '../services/api';

export default function GitHubSettingsModal({ isOpen, onClose, onSaveConfig, currentConfig }) {
  const [token, setToken] = useState('');
  const [repo, setRepo] = useState('');
  const [branch, setBranch] = useState('main');
  const [testing, setTesting] = useState(false);
  const [testResult, setTestResult] = useState(null);

  useEffect(() => {
    if (currentConfig) {
      setToken(currentConfig.token || '');
      setRepo(currentConfig.repo || '');
      setBranch(currentConfig.branch || 'main');
    }
  }, [currentConfig, isOpen]);

  if (!isOpen) return null;

  const handleTestConnection = async () => {
    if (!token) {
      alert('Please enter a GitHub Personal Access Token first.');
      return;
    }
    setTesting(true);
    setTestResult(null);
    try {
      const res = await verifyGitHubAccess({ token, repo });
      setTestResult({
        success: true,
        user: res.info?.authenticatedUser,
        repoInfo: res.info?.repository,
      });
    } catch (err) {
      setTestResult({
        success: false,
        error: err.message || 'Verification failed',
      });
    } finally {
      setTesting(false);
    }
  };

  const handleSave = (e) => {
    e.preventDefault();
    onSaveConfig({ token, repo, branch });
    onClose();
  };

  return (
    <div className="modal-overlay" onClick={onClose}>
      <div className="modal-content" style={{ maxWidth: '540px' }} onClick={(e) => e.stopPropagation()}>
        <div className="modal-header">
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
            <Github size={20} />
            <h3 className="modal-title">GitHub Integration Settings</h3>
          </div>
          <button className="btn btn-secondary btn-sm btn-icon-only" onClick={onClose}>
            <X size={18} />
          </button>
        </div>

        <form onSubmit={handleSave}>
          <div className="modal-body">
            <p style={{ fontSize: '0.85rem', color: 'var(--text-secondary)', lineHeight: '1.5' }}>
              Solutions will be committed directly to your repository structure:
              <br />
              <code style={{ fontSize: '0.775rem', color: 'var(--text-primary)', background: 'var(--surface-muted)', padding: '0.2rem 0.4rem', borderRadius: '4px' }}>
                {repo || 'owner/repository'}/[Topic]/[Pattern]/[ProblemName].ext
              </code>
            </p>

            <div className="form-group">
              <label className="label">GitHub Personal Access Token (PAT) *</label>
              <input
                type="password"
                className="input input-plain"
                placeholder="ghp_xxxxxxxxxxxxxxxxxxxx"
                value={token}
                onChange={(e) => setToken(e.target.value)}
                required
              />
              <span style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>
                Requires <code>repo</code> scope permission.
              </span>
            </div>

            <div className="form-group">
              <label className="label">Target Repository (owner/repo) *</label>
              <input
                type="text"
                className="input input-plain"
                placeholder="username/dsa-solutions"
                value={repo}
                onChange={(e) => setRepo(e.target.value)}
                required
              />
            </div>

            <div className="form-group">
              <label className="label">Target Branch</label>
              <input
                type="text"
                className="input input-plain"
                placeholder="main"
                value={branch}
                onChange={(e) => setBranch(e.target.value)}
              />
            </div>

            <button
              type="button"
              className="btn btn-secondary btn-sm"
              onClick={handleTestConnection}
              disabled={testing}
              style={{ width: 'fit-content' }}
            >
              <span>{testing ? 'Verifying...' : 'Test Connection'}</span>
            </button>

            {testResult && (
              <div
                className="card"
                style={{
                  padding: '0.75rem 1rem',
                  fontSize: '0.825rem',
                  backgroundColor: testResult.success ? 'var(--easy-bg)' : 'var(--hard-bg)',
                  borderColor: testResult.success ? 'var(--easy)' : 'var(--hard)',
                }}
              >
                {testResult.success ? (
                  <div style={{ color: 'var(--easy)', display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                    <CheckCircle2 size={16} />
                    <span>
                      Authenticated as <strong>{testResult.user}</strong>.
                      {testResult.repoInfo && ` Connected to ${testResult.repoInfo.name}.`}
                    </span>
                  </div>
                ) : (
                  <div style={{ color: 'var(--hard)', display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                    <AlertCircle size={16} />
                    <span>{testResult.error}</span>
                  </div>
                )}
              </div>
            )}
          </div>

          <div className="modal-footer">
            <button type="button" className="btn btn-secondary" onClick={onClose}>
              Cancel
            </button>
            <button type="submit" className="btn btn-primary">
              Save Settings
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
