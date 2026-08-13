/**
 * Exports all questions as a beautifully formatted Markdown (.md) file.
 */
export const exportAsMarkdown = (questions = []) => {
  if (!questions || questions.length === 0) {
    alert('No problems available in your vault to export.');
    return;
  }

  const exportDate = new Date().toLocaleDateString('en-US', {
    year: 'numeric',
    month: 'long',
    day: 'numeric',
  });

  let mdContent = `# 📚 DSA Pattern Vault - Solved Problems\n\n`;
  mdContent += `> **Export Date:** ${exportDate}  \n`;
  mdContent += `> **Total Problems:** ${questions.length}\n\n`;
  mdContent += `---\n\n`;

  // Group by Topic -> Pattern
  const grouped = {};
  questions.forEach((q) => {
    const topic = q.topic || 'General';
    const pattern = q.pattern || 'Misc';
    if (!grouped[topic]) grouped[topic] = {};
    if (!grouped[topic][pattern]) grouped[topic][pattern] = [];
    grouped[topic][pattern].push(q);
  });

  Object.entries(grouped).forEach(([topicName, patternsMap]) => {
    mdContent += `## 📁 Topic: ${topicName}\n\n`;

    Object.entries(patternsMap).forEach(([patternName, items]) => {
      mdContent += `### 🧩 Pattern: ${patternName}\n\n`;

      items.forEach((q, idx) => {
        mdContent += `#### ${idx + 1}. ${q.title} (${q.platform || 'LeetCode'})\n`;
        mdContent += `- **Difficulty:** ${q.difficulty}\n`;
        mdContent += `- **Status:** ${q.status}\n`;
        mdContent += `- **Time Complexity:** ${q.timeComplexity || 'N/A'}\n`;
        mdContent += `- **Space Complexity:** ${q.spaceComplexity || 'N/A'}\n`;
        if (q.problemUrl) {
          mdContent += `- **Problem URL:** [${q.problemUrl}](${q.problemUrl})\n`;
        }
        if (q.githubSynced && q.githubUrl) {
          mdContent += `- **GitHub Solution:** [${q.githubUrl}](${q.githubUrl})\n`;
        }
        mdContent += `\n`;

        if (q.approach) {
          mdContent += `**Approach & Notes:**\n${q.approach}\n\n`;
        }

        if (q.solution) {
          const lang = (q.language || 'cpp').toLowerCase();
          mdContent += `**Solution (${q.language || 'Code'}):**\n\`\`\`${lang}\n${q.solution}\n\`\`\`\n\n`;
        }

        mdContent += `---\n\n`;
      });
    });
  });

  // Create downloadable blob
  const blob = new Blob([mdContent], { type: 'text/markdown;charset=utf-8;' });
  const url = URL.createObjectURL(blob);
  const link = document.createElement('a');
  link.href = url;
  link.setAttribute('download', `DSA_Pattern_Vault_Solutions_${Date.now()}.md`);
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
  URL.revokeObjectURL(url);
};

/**
 * Triggers PDF export via browser print-to-PDF with clean formatting.
 */
export const exportAsPDF = (questions = []) => {
  if (!questions || questions.length === 0) {
    alert('No problems available in your vault to export.');
    return;
  }

  const printWindow = window.open('', '_blank');
  if (!printWindow) {
    alert('Pop-up blocked. Please allow pop-ups for this site to export PDF.');
    return;
  }

  const exportDate = new Date().toLocaleDateString('en-US', {
    year: 'numeric',
    month: 'long',
    day: 'numeric',
  });

  let htmlContent = `
    <!DOCTYPE html>
    <html>
    <head>
      <title>DSA Pattern Vault Solutions - Export</title>
      <style>
        body { font-family: 'Segoe UI', Arial, sans-serif; margin: 40px; color: #18181B; line-height: 1.6; }
        h1 { font-size: 24px; border-bottom: 2px solid #18181B; padding-bottom: 8px; margin-bottom: 4px; }
        .meta { color: #71717A; font-size: 13px; margin-bottom: 24px; }
        .topic-title { font-size: 20px; color: #059669; border-bottom: 1px solid #E5E5E5; padding-bottom: 4px; margin-top: 30px; }
        .pattern-title { font-size: 16px; color: #D97706; margin-top: 16px; }
        .problem-card { border: 1px solid #E5E5E5; border-radius: 6px; padding: 16px; margin-bottom: 16px; background: #FAFAFA; page-break-inside: avoid; }
        .problem-header { display: flex; justify-content: space-between; align-items: baseline; font-weight: bold; font-size: 16px; }
        .badge { display: inline-block; padding: 2px 8px; border-radius: 4px; font-size: 11px; font-weight: 600; text-transform: uppercase; }
        .badge-Easy { background: #ECFDF5; color: #059669; }
        .badge-Medium { background: #FFFBEB; color: #D97706; }
        .badge-Hard { background: #FFF1F2; color: #E11D48; }
        .details-grid { display: flex; gap: 16px; font-size: 12px; color: #52525B; margin: 8px 0; }
        .approach { background: #FFFFFF; border-left: 3px solid #18181B; padding: 8px 12px; font-size: 13px; margin: 10px 0; }
        pre { background: #18181B; color: #FAFAFA; padding: 12px; border-radius: 6px; font-family: 'Courier New', monospace; font-size: 12px; overflow-x: auto; white-space: pre-wrap; }
        @media print {
          body { margin: 20px; }
          .problem-card { page-break-inside: avoid; }
        }
      </style>
    </head>
    <body>
      <h1>📚 DSA Pattern Vault Solutions</h1>
      <div class="meta">Exported on ${exportDate} • Total Problems: ${questions.length}</div>
  `;

  const grouped = {};
  questions.forEach((q) => {
    const topic = q.topic || 'General';
    const pattern = q.pattern || 'Misc';
    if (!grouped[topic]) grouped[topic] = {};
    if (!grouped[topic][pattern]) grouped[topic][pattern] = [];
    grouped[topic][pattern].push(q);
  });

  Object.entries(grouped).forEach(([topicName, patternsMap]) => {
    htmlContent += `<div class="topic-title">📁 Topic: ${topicName}</div>`;

    Object.entries(patternsMap).forEach(([patternName, items]) => {
      htmlContent += `<div class="pattern-title">🧩 Pattern: ${patternName}</div>`;

      items.forEach((q, idx) => {
        htmlContent += `
          <div class="problem-card">
            <div class="problem-header">
              <span>${idx + 1}. ${q.title} (${q.platform})</span>
              <span class="badge badge-${q.difficulty}">${q.difficulty}</span>
            </div>
            <div class="details-grid">
              <span><strong>Status:</strong> ${q.status}</span>
              <span><strong>Time:</strong> ${q.timeComplexity || 'N/A'}</span>
              <span><strong>Space:</strong> ${q.spaceComplexity || 'N/A'}</span>
              ${q.problemUrl ? `<span><strong>URL:</strong> ${q.problemUrl}</span>` : ''}
            </div>
            ${q.approach ? `<div class="approach"><strong>Approach:</strong><br/>${q.approach}</div>` : ''}
            ${q.solution ? `<pre><code>// Solution (${q.language})\n${q.solution}</code></pre>` : ''}
          </div>
        `;
      });
    });
  });

  htmlContent += `
      <script>
        window.onload = function() {
          window.print();
        }
      </script>
    </body>
    </html>
  `;

  printWindow.document.open();
  printWindow.document.write(htmlContent);
  printWindow.document.close();
};
