import React, { useState, useEffect, useCallback } from 'react';
import Navbar from '../components/Navbar';
import StatsOverview from '../components/StatsOverview';
import TopicList from '../components/TopicList';
import PatternGrid from '../components/PatternGrid';
import QuestionTable from '../components/QuestionTable';
import ProblemEditorPage from '../components/ProblemEditorPage';
import SolutionModal from '../components/SolutionModal';
import GitHubSettingsModal from '../components/GitHubSettingsModal';
import AuthModal from '../components/AuthModal';
import {
  fetchCurrentUser,
  setAuthToken,
  fetchQuestions,
  fetchStats,
  fetchTopicsAndPatterns,
  createQuestion,
  updateQuestion,
  deleteQuestion,
  pushToGitHub,
} from '../services/api';

export default function Dashboard() {
  const [theme, setTheme] = useState(() => {
    return localStorage.getItem('dsa_vault_theme') || 'dark';
  });

  const [currentUser, setCurrentUser] = useState(null);
  const [authChecking, setAuthChecking] = useState(true);

  // View state: 'dashboard' | 'editor'
  const [viewMode, setViewMode] = useState('dashboard');
  const [editingQuestion, setEditingQuestion] = useState(null);

  const [questions, setQuestions] = useState([]);
  const [stats, setStats] = useState({ total: 0, solved: 0, revisionDue: 0, synced: 0 });
  const [topics, setTopics] = useState([]);
  const [patterns, setPatterns] = useState([]);
  const [allTopics, setAllTopics] = useState([]);
  const [allPatterns, setAllPatterns] = useState([]);

  // Filters
  const [search, setSearch] = useState('');
  const [selectedTopic, setSelectedTopic] = useState('');
  const [selectedPattern, setSelectedPattern] = useState('');
  const [difficultyFilter, setDifficultyFilter] = useState('');
  const [statusFilter, setStatusFilter] = useState('');

  // Modals state
  const [isSolutionModalOpen, setIsSolutionModalOpen] = useState(false);
  const [activeSolutionQuestion, setActiveSolutionQuestion] = useState(null);

  const [isGitHubModalOpen, setIsGitHubModalOpen] = useState(false);
  const [githubConfig, setGithubConfig] = useState(() => {
    const saved = localStorage.getItem('dsa_vault_github');
    return saved ? JSON.parse(saved) : { token: '', repo: '', branch: 'main' };
  });

  // Apply Theme
  useEffect(() => {
    document.documentElement.setAttribute('data-theme', theme);
    localStorage.setItem('dsa_vault_theme', theme);
  }, [theme]);

  const toggleTheme = () => {
    setTheme((prev) => (prev === 'dark' ? 'light' : 'dark'));
  };

  // Check initial Auth Session
  useEffect(() => {
    const initAuth = async () => {
      try {
        const user = await fetchCurrentUser();
        if (user) {
          setCurrentUser(user);
        }
      } catch (err) {
        console.log('Session check:', err.message);
      } finally {
        setAuthChecking(false);
      }
    };
    initAuth();
  }, []);

  // Load Data from API
  const loadData = useCallback(async () => {
    if (!currentUser) return;
    try {
      const [qData, sData, tpData] = await Promise.all([
        fetchQuestions({
          search,
          topic: selectedTopic,
          pattern: selectedPattern,
          difficulty: difficultyFilter,
          status: statusFilter,
        }),
        fetchStats(),
        fetchTopicsAndPatterns(),
      ]);

      setQuestions(qData);
      setStats(sData);
      setTopics(sData.topics || []);
      setPatterns(sData.patterns || []);
      setAllTopics(tpData.topics || []);
      setAllPatterns(tpData.patterns || []);
    } catch (err) {
      console.error('Failed to load data:', err);
    }
  }, [currentUser, search, selectedTopic, selectedPattern, difficultyFilter, statusFilter]);

  useEffect(() => {
    loadData();
  }, [loadData]);

  const handleLoginSuccess = (user) => {
    setCurrentUser(user);
  };

  const handleLogout = () => {
    setAuthToken(null);
    setCurrentUser(null);
    setQuestions([]);
    setStats({ total: 0, solved: 0, revisionDue: 0, synced: 0 });
    setTopics([]);
    setPatterns([]);
    setViewMode('dashboard');
  };

  // Handlers for Problem Editor View
  const handleOpenAdd = () => {
    setEditingQuestion(null);
    setViewMode('editor');
  };

  const handleOpenEdit = (q) => {
    setEditingQuestion(q);
    setViewMode('editor');
  };

  const handleSaveQuestion = async (formData, stayOnPage = false) => {
    try {
      let saved;
      if (editingQuestion) {
        saved = await updateQuestion(editingQuestion._id, formData);
      } else {
        saved = await createQuestion(formData);
      }
      loadData();
      if (!stayOnPage) {
        setViewMode('dashboard');
      }
      return saved;
    } catch (err) {
      alert(err.message || 'Error saving question');
      throw err;
    }
  };

  const handleDeleteQuestion = async (id) => {
    if (window.confirm('Are you sure you want to delete this problem entry?')) {
      try {
        await deleteQuestion(id);
        loadData();
      } catch (err) {
        alert(err.message || 'Failed to delete question');
      }
    }
  };

  // Solution View Handler
  const handleViewSolution = (q) => {
    setActiveSolutionQuestion(q);
    setIsSolutionModalOpen(true);
  };

  // GitHub Push Handler
  const handlePushQuestionToGitHub = async (question) => {
    if (!githubConfig.token || !githubConfig.repo) {
      setIsGitHubModalOpen(true);
      return;
    }

    try {
      const res = await pushToGitHub(question._id, githubConfig);
      alert(`Success! Pushed to GitHub repo:\n${res.result?.filePath}`);
      loadData();
      if (activeSolutionQuestion && activeSolutionQuestion._id === question._id) {
        setActiveSolutionQuestion({
          ...activeSolutionQuestion,
          githubSynced: true,
          githubUrl: res.result?.htmlUrl,
        });
      }
      return res;
    } catch (err) {
      alert(`GitHub Push Failed: ${err.message}`);
      throw err;
    }
  };

  const handleSaveGitHubConfig = (newConfig) => {
    setGithubConfig(newConfig);
    localStorage.setItem('dsa_vault_github', JSON.stringify(newConfig));
  };

  const githubConfigured = Boolean(githubConfig.token && githubConfig.repo);

  if (authChecking) {
    return (
      <div className="app-container" style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', height: '80vh' }}>
        <span style={{ color: 'var(--text-secondary)' }}>Loading DSA Pattern Vault...</span>
      </div>
    );
  }

  return (
    <div className="app-container">
      {!currentUser && <AuthModal onLoginSuccess={handleLoginSuccess} />}

      <Navbar
        user={currentUser}
        questions={questions}
        onLogout={handleLogout}
        onAddProblem={handleOpenAdd}
        onOpenGitHubSettings={() => setIsGitHubModalOpen(true)}
        githubConfigured={githubConfigured}
        theme={theme}
        toggleTheme={toggleTheme}
      />

      {viewMode === 'editor' ? (
        <ProblemEditorPage
          questionToEdit={editingQuestion}
          existingTopics={allTopics}
          existingPatterns={allPatterns}
          onSave={handleSaveQuestion}
          onBack={() => setViewMode('dashboard')}
          onPushToGitHub={handlePushQuestionToGitHub}
          githubConfigured={githubConfigured}
        />
      ) : (
        <>
          <StatsOverview stats={stats} />

          <TopicList
            topics={topics}
            selectedTopic={selectedTopic}
            onSelectTopic={setSelectedTopic}
          />

          <PatternGrid
            patterns={patterns}
            selectedPattern={selectedPattern}
            onSelectPattern={setSelectedPattern}
          />

          <QuestionTable
            questions={questions}
            allTopics={allTopics}
            allPatterns={allPatterns}
            search={search}
            setSearch={setSearch}
            topicFilter={selectedTopic}
            setTopicFilter={setSelectedTopic}
            patternFilter={selectedPattern}
            setPatternFilter={setSelectedPattern}
            difficultyFilter={difficultyFilter}
            setDifficultyFilter={setDifficultyFilter}
            statusFilter={statusFilter}
            setStatusFilter={setStatusFilter}
            onAddProblem={handleOpenAdd}
            onViewSolution={handleViewSolution}
            onEditQuestion={handleOpenEdit}
            onDeleteQuestion={handleDeleteQuestion}
            onPushToGitHub={handlePushQuestionToGitHub}
            githubConfigured={githubConfigured}
          />
        </>
      )}

      {/* Modals */}
      <SolutionModal
        isOpen={isSolutionModalOpen}
        onClose={() => setIsSolutionModalOpen(false)}
        question={activeSolutionQuestion}
        onPushToGitHub={handlePushQuestionToGitHub}
        githubConfigured={githubConfigured}
      />

      <GitHubSettingsModal
        isOpen={isGitHubModalOpen}
        onClose={() => setIsGitHubModalOpen(false)}
        onSaveConfig={handleSaveGitHubConfig}
        currentConfig={githubConfig}
      />
    </div>
  );
}
