const API_BASE = '/api';

let authToken = localStorage.getItem('dsa_vault_token') || null;

export const setAuthToken = (token) => {
  authToken = token;
  if (token) {
    localStorage.setItem('dsa_vault_token', token);
  } else {
    localStorage.removeItem('dsa_vault_token');
  }
};

export const getAuthToken = () => authToken;

const getHeaders = () => {
  const headers = { 'Content-Type': 'application/json' };
  if (authToken) {
    headers['Authorization'] = `Bearer ${authToken}`;
  }
  return headers;
};

/**
 * Helper function to safely parse API responses.
 * Prevents "Unexpected token '<', <!DOCTYPE..." crashes when backend is offline or returns HTML 404/500 pages.
 */
const handleResponse = async (res) => {
  const contentType = res.headers.get('content-type') || '';

  if (contentType.includes('application/json')) {
    const data = await res.json();
    if (!res.ok) {
      throw new Error(data.message || `Request failed with status ${res.status}`);
    }
    return data;
  }

  // Response is not JSON (likely HTML from Vite proxy when server is down or 404/500 error page)
  const text = await res.text();
  if (text.includes('<!DOCTYPE') || text.includes('<html')) {
    throw new Error(
      `Backend server is offline or unreachable on port 5000. Please start the backend server by running "npm start" inside the server directory.`
    );
  }

  if (!res.ok) {
    throw new Error(text || `Request failed with status ${res.status}`);
  }

  try {
    return JSON.parse(text);
  } catch {
    return text;
  }
};

// --- AUTH API METHODS ---
export const loginUser = async ({ email, password }) => {
  try {
    const res = await fetch(`${API_BASE}/auth/login`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ email, password }),
    });
    const data = await handleResponse(res);
    setAuthToken(data.token);
    return data;
  } catch (err) {
    if (err.name === 'TypeError' && err.message.includes('fetch')) {
      throw new Error('Cannot connect to server. Please ensure backend is running on port 5000.');
    }
    throw err;
  }
};

export const registerUser = async ({ name, email, password }) => {
  try {
    const res = await fetch(`${API_BASE}/auth/register`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ name, email, password }),
    });
    const data = await handleResponse(res);
    setAuthToken(data.token);
    return data;
  } catch (err) {
    if (err.name === 'TypeError' && err.message.includes('fetch')) {
      throw new Error('Cannot connect to server. Please ensure backend is running on port 5000.');
    }
    throw err;
  }
};

export const fetchCurrentUser = async () => {
  if (!authToken) return null;
  try {
    const res = await fetch(`${API_BASE}/auth/me`, {
      headers: getHeaders(),
    });
    if (!res.ok) {
      setAuthToken(null);
      return null;
    }
    const data = await handleResponse(res);
    return data.user;
  } catch {
    return null;
  }
};

// --- QUESTION & GITHUB METHODS ---
export const fetchQuestions = async (filters = {}) => {
  const query = new URLSearchParams();
  if (filters.search) query.append('search', filters.search);
  if (filters.topic) query.append('topic', filters.topic);
  if (filters.pattern) query.append('pattern', filters.pattern);
  if (filters.difficulty) query.append('difficulty', filters.difficulty);
  if (filters.status) query.append('status', filters.status);

  const res = await fetch(`${API_BASE}/questions?${query.toString()}`, {
    headers: getHeaders(),
  });
  return await handleResponse(res);
};

export const fetchStats = async () => {
  const res = await fetch(`${API_BASE}/questions/stats`, {
    headers: getHeaders(),
  });
  return await handleResponse(res);
};

export const fetchTopicsAndPatterns = async () => {
  const res = await fetch(`${API_BASE}/questions/topics-patterns`, {
    headers: getHeaders(),
  });
  return await handleResponse(res);
};

export const createQuestion = async (data) => {
  const res = await fetch(`${API_BASE}/questions`, {
    method: 'POST',
    headers: getHeaders(),
    body: JSON.stringify(data),
  });
  return await handleResponse(res);
};

export const updateQuestion = async (id, data) => {
  const res = await fetch(`${API_BASE}/questions/${id}`, {
    method: 'PUT',
    headers: getHeaders(),
    body: JSON.stringify(data),
  });
  return await handleResponse(res);
};

export const deleteQuestion = async (id) => {
  const res = await fetch(`${API_BASE}/questions/${id}`, {
    method: 'DELETE',
    headers: getHeaders(),
  });
  return await handleResponse(res);
};

export const pushToGitHub = async (id, { token, repo, branch }) => {
  const res = await fetch(`${API_BASE}/github/push/${id}`, {
    method: 'POST',
    headers: getHeaders(),
    body: JSON.stringify({ token, repo, branch }),
  });
  return await handleResponse(res);
};

export const verifyGitHubAccess = async ({ token, repo }) => {
  const res = await fetch(`${API_BASE}/github/verify`, {
    method: 'POST',
    headers: getHeaders(),
    body: JSON.stringify({ token, repo }),
  });
  return await handleResponse(res);
};
