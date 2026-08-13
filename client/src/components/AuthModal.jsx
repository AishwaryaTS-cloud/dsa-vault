import React, { useState } from 'react';
import { Layers, LogIn, UserPlus, AlertCircle } from 'lucide-react';
import { loginUser, registerUser } from '../services/api';

export default function AuthModal({ onLoginSuccess }) {
  const [mode, setMode] = useState('login'); // 'login' or 'register'
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError(null);
    setLoading(true);

    try {
      let data;
      if (mode === 'login') {
        data = await loginUser({ email, password });
      } else {
        if (!name.trim()) {
          setError('Please enter your name.');
          setLoading(false);
          return;
        }
        data = await registerUser({ name, email, password });
      }
      onLoginSuccess(data.user);
    } catch (err) {
      setError(err.message || 'Authentication failed');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="modal-overlay" style={{ backdropFilter: 'blur(8px)' }}>
      <div className="modal-content" style={{ maxWidth: '440px' }}>
        <div
          className="modal-header"
          style={{ flexDirection: 'column', alignItems: 'center', gap: '0.5rem', textAlign: 'center', paddingTop: '1.75rem' }}
        >
          <div className="brand-icon" style={{ width: '42px', height: '42px' }}>
            <Layers size={24} />
          </div>
          <h3 className="modal-title" style={{ fontSize: '1.25rem' }}>
            DSA PATTERN VAULT
          </h3>
          <p style={{ fontSize: '0.825rem', color: 'var(--text-secondary)' }}>
            {mode === 'login' ? 'Sign in to access your vault' : 'Create a new account to start tracking'}
          </p>
        </div>

        {/* Tab Switcher */}
        <div
          style={{
            display: 'flex',
            margin: '1rem 1.5rem 0 1.5rem',
            backgroundColor: 'var(--surface-muted)',
            padding: '0.25rem',
            borderRadius: '6px',
            border: '1px solid var(--border)',
          }}
        >
          <button
            type="button"
            className={`btn ${mode === 'login' ? 'btn-primary' : 'btn-secondary'}`}
            style={{ flex: 1, justifyContent: 'center', borderRadius: '4px', borderWidth: 0 }}
            onClick={() => {
              setMode('login');
              setError(null);
            }}
          >
            <LogIn size={15} />
            <span>Sign In</span>
          </button>

          <button
            type="button"
            className={`btn ${mode === 'register' ? 'btn-primary' : 'btn-secondary'}`}
            style={{ flex: 1, justifyContent: 'center', borderRadius: '4px', borderWidth: 0 }}
            onClick={() => {
              setMode('register');
              setError(null);
            }}
          >
            <UserPlus size={15} />
            <span>Create Account</span>
          </button>
        </div>

        <form onSubmit={handleSubmit}>
          <div className="modal-body" style={{ padding: '1.25rem 1.5rem' }}>
            {error && (
              <div
                className="card"
                style={{
                  padding: '0.75rem 1rem',
                  fontSize: '0.825rem',
                  backgroundColor: 'var(--hard-bg)',
                  borderColor: 'var(--hard)',
                  color: 'var(--hard)',
                  display: 'flex',
                  alignItems: 'center',
                  gap: '0.5rem',
                }}
              >
                <AlertCircle size={16} />
                <span>{error}</span>
              </div>
            )}

            {mode === 'register' && (
              <div className="form-group">
                <label className="label">Full Name *</label>
                <input
                  type="text"
                  className="input input-plain"
                  placeholder="e.g. Alex Rivera"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  required
                />
              </div>
            )}

            <div className="form-group">
              <label className="label">Email Address *</label>
              <input
                type="email"
                className="input input-plain"
                placeholder="name@example.com"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
              />
            </div>

            <div className="form-group">
              <label className="label">Password *</label>
              <input
                type="password"
                className="input input-plain"
                placeholder="••••••••"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
                minLength={6}
              />
              <span style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>
                Must be at least 6 characters.
              </span>
            </div>
          </div>

          <div className="modal-footer" style={{ padding: '1.25rem 1.5rem', flexDirection: 'column' }}>
            <button
              type="submit"
              className="btn btn-primary"
              disabled={loading}
              style={{ width: '100%', justifyContent: 'center', padding: '0.65rem' }}
            >
              {loading ? (
                'Processing...'
              ) : mode === 'login' ? (
                <>
                  <LogIn size={16} />
                  <span>Sign In</span>
                </>
              ) : (
                <>
                  <UserPlus size={16} />
                  <span>Create Account</span>
                </>
              )}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
