const { Octokit } = require('@octokit/rest');

const getExtension = (language) => {
  const map = {
    'C++': 'cpp',
    cpp: 'cpp',
    Java: 'java',
    java: 'java',
    Python: 'py',
    python: 'py',
    JavaScript: 'js',
    javascript: 'js',
    TypeScript: 'ts',
    typescript: 'ts',
    Go: 'go',
    go: 'go',
    Rust: 'rs',
    rust: 'rs',
  };
  return map[language] || 'txt';
};

/**
 * Pushes or updates solution file in GitHub repository.
 * Structure: <Topic>/<Pattern>/<Title>.<ext>
 */
const pushSolutionToGitHub = async ({ token, repo, branch = 'main', question }) => {
  if (!token) {
    throw new Error('GitHub Personal Access Token is required.');
  }

  if (!repo || !repo.includes('/')) {
    throw new Error('Repository must be in format "owner/repository".');
  }

  const [owner, repoName] = repo.split('/');
  const octokit = new Octokit({ auth: token });

  const ext = getExtension(question.language);

  // Clean title for filename
  const cleanTitle = question.title.replace(/[/\\?%*:|"<>]/g, '').trim();
  const cleanTopic = question.topic.replace(/[/\\?%*:|"<>]/g, '').trim();
  const cleanPattern = question.pattern.replace(/[/\\?%*:|"<>]/g, '').trim();

  const filePath = `${cleanTopic}/${cleanPattern}/${cleanTitle}.${ext}`;

  // Content string with metadata header
  const fileContent = `/**
 * Problem: ${question.title}
 * Platform: ${question.platform}
 * URL: ${question.problemUrl || 'N/A'}
 * Difficulty: ${question.difficulty}
 * Topic: ${question.topic}
 * Pattern: ${question.pattern}
 * Time Complexity: ${question.timeComplexity || 'N/A'}
 * Space Complexity: ${question.spaceComplexity || 'N/A'}
 *
 * Approach:
 * ${question.approach || 'N/A'}
 */

${question.solution || '// Solution code'}
`;

  const contentEncoded = Buffer.from(fileContent).toString('base64');
  const commitMessage = `Add/Update solution: ${question.title} [${question.topic} / ${question.pattern}]`;

  let existingSha = null;

  // Check if file already exists in repository to get SHA
  try {
    const { data } = await octokit.rest.repos.getContent({
      owner,
      repo: repoName,
      path: filePath,
      ref: branch,
    });
    if (data && data.sha) {
      existingSha = data.sha;
    }
  } catch (err) {
    // 404 means file doesn't exist yet, which is expected for new questions
    if (err.status !== 404) {
      throw err;
    }
  }

  // Create or update file
  const response = await octokit.rest.repos.createOrUpdateFileContents({
    owner,
    repo: repoName,
    path: filePath,
    message: commitMessage,
    content: contentEncoded,
    branch: branch,
    ...(existingSha ? { sha: existingSha } : {}),
  });

  const htmlUrl = response.data.content?.html_url || `https://github.com/${owner}/${repoName}/blob/${branch}/${filePath}`;

  return {
    success: true,
    filePath,
    htmlUrl,
    commitHash: response.data.commit.sha,
    pushedAt: new Date(),
  };
};

/**
 * Verify GitHub Token and Repository Access
 */
const verifyGitHubAccess = async ({ token, repo }) => {
  if (!token) throw new Error('Token is missing');
  const octokit = new Octokit({ auth: token });

  const { data: user } = await octokit.rest.users.getAuthenticated();

  let repoInfo = null;
  if (repo && repo.includes('/')) {
    const [owner, repoName] = repo.split('/');
    const { data } = await octokit.rest.repos.get({ owner, repo: repoName });
    repoInfo = {
      name: data.full_name,
      private: data.private,
      defaultBranch: data.default_branch,
    };
  }

  return {
    authenticatedUser: user.login,
    repository: repoInfo,
  };
};

module.exports = {
  pushSolutionToGitHub,
  verifyGitHubAccess,
};
