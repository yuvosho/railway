const fs = require('fs');
const path = require('path');

const REPORTS_DIR = process.env.REPORTS_DIR || path.join(__dirname, 'reports');

function generateHTMLReport(jsonPath) {
  if (!jsonPath) {
    // Find most recent JSON report
    const files = fs.readdirSync(REPORTS_DIR)
      .filter(f => f.endsWith('-audit.json'))
      .sort()
      .reverse();

    if (files.length === 0) {
      console.error('No se encontraron reportes JSON. Ejecuta primero: npm run audit');
      process.exit(1);
    }

    jsonPath = path.join(REPORTS_DIR, files[0]);
  }

  console.log(`Generando reporte HTML desde: ${jsonPath}`);
  const data = JSON.parse(fs.readFileSync(jsonPath, 'utf-8'));
  const html = buildHTML(data);

  const htmlPath = jsonPath.replace('-audit.json', '-report.html');
  fs.writeFileSync(htmlPath, html);
  console.log(`Reporte HTML generado: ${htmlPath}`);

  return htmlPath;
}

function buildHTML(data) {
  const { url, date, summary, audits, duration } = data;
  const scores = summary.scores || {};

  return `<!DOCTYPE html>
<html lang="es">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>Auditoria Semanal - ${url} - ${date}</title>
  <style>
    * { margin: 0; padding: 0; box-sizing: border-box; }
    body {
      font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif;
      background: #f5f7fa;
      color: #333;
      line-height: 1.6;
    }
    .container { max-width: 1200px; margin: 0 auto; padding: 20px; }
    header {
      background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
      color: white;
      padding: 40px 0;
      text-align: center;
    }
    header h1 { font-size: 28px; margin-bottom: 8px; }
    header p { opacity: 0.9; font-size: 16px; }
    .scores-grid {
      display: grid;
      grid-template-columns: repeat(auto-fit, minmax(200px, 1fr));
      gap: 20px;
      margin: 30px 0;
    }
    .score-card {
      background: white;
      border-radius: 12px;
      padding: 24px;
      text-align: center;
      box-shadow: 0 2px 8px rgba(0,0,0,0.08);
    }
    .score-card h3 { font-size: 14px; color: #666; margin-bottom: 12px; text-transform: uppercase; }
    .score-value {
      font-size: 48px;
      font-weight: 700;
      margin-bottom: 4px;
    }
    .score-value.green { color: #10b981; }
    .score-value.yellow { color: #f59e0b; }
    .score-value.red { color: #ef4444; }
    .score-label { font-size: 12px; color: #999; }
    .section {
      background: white;
      border-radius: 12px;
      padding: 24px;
      margin-bottom: 20px;
      box-shadow: 0 2px 8px rgba(0,0,0,0.08);
    }
    .section h2 {
      font-size: 20px;
      margin-bottom: 16px;
      padding-bottom: 12px;
      border-bottom: 2px solid #f0f0f0;
    }
    .issue-list { list-style: none; }
    .issue-item {
      display: flex;
      align-items: flex-start;
      padding: 12px 0;
      border-bottom: 1px solid #f5f5f5;
    }
    .issue-item:last-child { border-bottom: none; }
    .issue-badge {
      display: inline-block;
      padding: 2px 8px;
      border-radius: 4px;
      font-size: 11px;
      font-weight: 600;
      text-transform: uppercase;
      margin-right: 12px;
      flex-shrink: 0;
    }
    .badge-alta { background: #fee2e2; color: #dc2626; }
    .badge-media { background: #fef3c7; color: #d97706; }
    .badge-baja { background: #d1fae5; color: #059669; }
    .issue-area {
      display: inline-block;
      padding: 2px 8px;
      background: #f3f4f6;
      border-radius: 4px;
      font-size: 11px;
      color: #6b7280;
      margin-right: 8px;
      flex-shrink: 0;
    }
    .issue-text { font-size: 14px; }
    .rec-item {
      padding: 12px 16px;
      background: #f8fafc;
      border-left: 3px solid #667eea;
      margin-bottom: 8px;
      border-radius: 0 8px 8px 0;
    }
    .rec-item.alta { border-left-color: #ef4444; }
    .rec-item.media { border-left-color: #f59e0b; }
    .cwv-grid {
      display: grid;
      grid-template-columns: repeat(3, 1fr);
      gap: 16px;
      margin-top: 16px;
    }
    .cwv-item {
      text-align: center;
      padding: 16px;
      background: #f8fafc;
      border-radius: 8px;
    }
    .cwv-item .label { font-size: 12px; color: #666; }
    .cwv-item .value { font-size: 24px; font-weight: 700; margin-top: 4px; }
    .meta-info {
      display: flex;
      gap: 20px;
      flex-wrap: wrap;
      margin-top: 16px;
      font-size: 13px;
      color: #666;
    }
    .lighthouse-detail {
      display: grid;
      grid-template-columns: 1fr 1fr;
      gap: 16px;
      margin-top: 16px;
    }
    .lh-strategy {
      padding: 16px;
      background: #f8fafc;
      border-radius: 8px;
    }
    .lh-strategy h4 { margin-bottom: 12px; font-size: 14px; }
    .lh-metric {
      display: flex;
      justify-content: space-between;
      padding: 6px 0;
      font-size: 13px;
    }
    .progress-bar {
      width: 100%;
      height: 6px;
      background: #e5e7eb;
      border-radius: 3px;
      margin-top: 8px;
    }
    .progress-fill {
      height: 100%;
      border-radius: 3px;
      transition: width 0.3s;
    }
    .progress-fill.green { background: #10b981; }
    .progress-fill.yellow { background: #f59e0b; }
    .progress-fill.red { background: #ef4444; }
    footer {
      text-align: center;
      padding: 30px;
      color: #999;
      font-size: 13px;
    }
    @media (max-width: 768px) {
      .scores-grid { grid-template-columns: repeat(2, 1fr); }
      .lighthouse-detail { grid-template-columns: 1fr; }
      .cwv-grid { grid-template-columns: 1fr; }
    }
  </style>
</head>
<body>
  <header>
    <div class="container">
      <h1>Auditoria Semanal</h1>
      <p>${url} | Semana del ${date}</p>
    </div>
  </header>

  <div class="container">
    <!-- Overall Scores -->
    <div class="scores-grid">
      ${renderScoreCard('General', scores.overall)}
      ${renderScoreCard('Performance', scores.performance)}
      ${renderScoreCard('SEO', scores.seo)}
      ${renderScoreCard('Imagenes', scores.images)}
      ${renderScoreCard('Accesibilidad', scores.accessibility)}
      ${renderScoreCard('Responsividad', scores.responsiveness)}
    </div>

    <!-- Core Web Vitals -->
    ${summary.coreWebVitals ? `
    <div class="section">
      <h2>Core Web Vitals</h2>
      <div class="cwv-grid">
        <div class="cwv-item">
          <div class="label">LCP (Largest Contentful Paint)</div>
          <div class="value ${getCWVColor('lcp', summary.coreWebVitals.lcp)}">${formatCWV('lcp', summary.coreWebVitals.lcp)}</div>
        </div>
        <div class="cwv-item">
          <div class="label">CLS (Cumulative Layout Shift)</div>
          <div class="value ${getCWVColor('cls', summary.coreWebVitals.cls)}">${formatCWV('cls', summary.coreWebVitals.cls)}</div>
        </div>
        <div class="cwv-item">
          <div class="label">TBT (Total Blocking Time)</div>
          <div class="value ${getCWVColor('tbt', summary.coreWebVitals.tbt)}">${formatCWV('tbt', summary.coreWebVitals.tbt)}</div>
        </div>
      </div>
    </div>
    ` : ''}

    <!-- Issues -->
    <div class="section">
      <h2>Problemas Detectados (${summary.totalIssues})</h2>
      <p style="margin-bottom:16px;color:#666">
        <strong>${summary.highPriorityIssues}</strong> alta prioridad |
        <strong>${summary.mediumPriorityIssues}</strong> media prioridad
      </p>
      <ul class="issue-list">
        ${(summary.issues || [])
          .sort((a, b) => (a.priority === 'alta' ? -1 : 1) - (b.priority === 'alta' ? -1 : 1))
          .map(issue => `
            <li class="issue-item">
              <span class="issue-badge badge-${issue.priority}">${issue.priority}</span>
              <span class="issue-area">${issue.area}</span>
              <span class="issue-text">${issue.issue}</span>
            </li>
          `).join('')}
      </ul>
    </div>

    <!-- Recommendations -->
    <div class="section">
      <h2>Recomendaciones</h2>
      ${(summary.recommendations || [])
        .sort((a, b) => (a.priority === 'alta' ? -1 : 1) - (b.priority === 'alta' ? -1 : 1))
        .map(rec => `
          <div class="rec-item ${rec.priority}">
            <strong>[${rec.priority.toUpperCase()}]</strong> ${rec.action}
          </div>
        `).join('')}
    </div>

    <!-- Lighthouse Details -->
    ${audits.lighthouse && !audits.lighthouse.error ? `
    <div class="section">
      <h2>Detalle Lighthouse</h2>
      <div class="lighthouse-detail">
        ${renderLighthouseStrategy('Mobile', audits.lighthouse.mobile)}
        ${renderLighthouseStrategy('Desktop', audits.lighthouse.desktop)}
      </div>
      ${audits.lighthouse.mobile?.diagnostics?.length > 0 ? `
        <h3 style="margin-top:20px;margin-bottom:12px;font-size:16px">Diagnosticos</h3>
        <ul class="issue-list">
          ${audits.lighthouse.mobile.diagnostics.slice(0, 8).map(d => `
            <li class="issue-item">
              <span class="issue-text">${d.label} ${d.displayValue ? `(${d.displayValue})` : ''}</span>
            </li>
          `).join('')}
        </ul>
      ` : ''}
    </div>
    ` : ''}

    <!-- Image Details -->
    ${audits.images && !audits.images.error ? `
    <div class="section">
      <h2>Detalle de Imagenes</h2>
      <div class="cwv-grid">
        <div class="cwv-item">
          <div class="label">Total Imagenes</div>
          <div class="value">${audits.images.images?.total || 0}</div>
        </div>
        <div class="cwv-item">
          <div class="label">Alt Text Coverage</div>
          <div class="value ${audits.images.images?.altCoverage >= 100 ? 'green' : audits.images.images?.altCoverage >= 80 ? 'yellow' : 'red'}">${audits.images.images?.altCoverage || 0}%</div>
        </div>
        <div class="cwv-item">
          <div class="label">Peso Total</div>
          <div class="value">${audits.images.networkImages?.totalSizeMB || 0} MB</div>
        </div>
      </div>
      ${audits.images.networkImages?.oversizedDetails?.length > 0 ? `
        <h3 style="margin-top:20px;margin-bottom:12px;font-size:16px">Imagenes Pesadas (&gt;200KB)</h3>
        <ul class="issue-list">
          ${audits.images.networkImages.oversizedDetails.slice(0, 5).map(img => `
            <li class="issue-item">
              <span class="issue-badge badge-alta">${img.sizeKB}KB</span>
              <span class="issue-text" style="word-break:break-all">${img.url}</span>
            </li>
          `).join('')}
        </ul>
      ` : ''}
    </div>
    ` : ''}

    <!-- Accessibility Details -->
    ${audits.accessibility && !audits.accessibility.error ? `
    <div class="section">
      <h2>Detalle de Accesibilidad</h2>
      <div class="cwv-grid">
        <div class="cwv-item">
          <div class="label">Contraste WCAG AA</div>
          <div class="value ${audits.accessibility.contrast?.aaCompliance >= 100 ? 'green' : audits.accessibility.contrast?.aaCompliance >= 80 ? 'yellow' : 'red'}">${audits.accessibility.contrast?.aaCompliance || 0}%</div>
        </div>
        <div class="cwv-item">
          <div class="label">Campos sin Label</div>
          <div class="value ${audits.accessibility.forms?.missingLabels === 0 ? 'green' : 'red'}">${audits.accessibility.forms?.missingLabels || 0}</div>
        </div>
        <div class="cwv-item">
          <div class="label">Skip Link</div>
          <div class="value ${audits.accessibility.aria?.skipLink ? 'green' : 'red'}">${audits.accessibility.aria?.skipLink ? 'Si' : 'No'}</div>
        </div>
      </div>
      ${audits.accessibility.contrast?.failures?.length > 0 ? `
        <h3 style="margin-top:20px;margin-bottom:12px;font-size:16px">Problemas de Contraste</h3>
        <ul class="issue-list">
          ${audits.accessibility.contrast.failures.slice(0, 5).map(f => `
            <li class="issue-item">
              <span class="issue-badge badge-alta">${f.ratio}:1</span>
              <span class="issue-area">&lt;${f.tag}&gt;</span>
              <span class="issue-text">"${f.text}" (requiere ${f.required}:1)</span>
            </li>
          `).join('')}
        </ul>
      ` : ''}
    </div>
    ` : ''}

    <!-- Meta -->
    <div class="meta-info">
      <span>Generado: ${new Date().toISOString()}</span>
      <span>Duracion auditoria: ${duration}s</span>
      <span>Valsho Bazar - Sistema de Auditoria Semanal</span>
    </div>
  </div>

  <footer>
    <p>Auditoria automatica generada por Valsho Web Audit System</p>
  </footer>
</body>
</html>`;
}

function renderScoreCard(label, score) {
  const colorClass = score >= 90 ? 'green' : score >= 70 ? 'yellow' : 'red';
  const status = score >= 90 ? 'Excelente' : score >= 70 ? 'Necesita mejora' : 'Critico';
  return `
    <div class="score-card">
      <h3>${label}</h3>
      <div class="score-value ${colorClass}">${score || 0}</div>
      <div class="score-label">${status}</div>
      <div class="progress-bar">
        <div class="progress-fill ${colorClass}" style="width:${score || 0}%"></div>
      </div>
    </div>
  `;
}

function renderLighthouseStrategy(name, data) {
  if (!data) return '';
  return `
    <div class="lh-strategy">
      <h4>${name}</h4>
      <div class="lh-metric"><span>Performance</span><strong>${data.performance}/100</strong></div>
      <div class="lh-metric"><span>SEO</span><strong>${data.seo}/100</strong></div>
      <div class="lh-metric"><span>Accesibilidad</span><strong>${data.accessibility}/100</strong></div>
      <div class="lh-metric"><span>Best Practices</span><strong>${data.bestPractices}/100</strong></div>
      ${data.audits ? `
        <hr style="margin:12px 0;border:none;border-top:1px solid #e5e7eb">
        <div class="lh-metric"><span>FCP</span><strong>${(data.audits.fcp / 1000).toFixed(1)}s</strong></div>
        <div class="lh-metric"><span>LCP</span><strong>${(data.audits.lcp / 1000).toFixed(1)}s</strong></div>
        <div class="lh-metric"><span>CLS</span><strong>${data.audits.cls?.toFixed(3) || 'N/A'}</strong></div>
        <div class="lh-metric"><span>TBT</span><strong>${Math.round(data.audits.tbt || 0)}ms</strong></div>
      ` : ''}
    </div>
  `;
}

function getCWVColor(metric, value) {
  if (value === undefined || value === null) return '';
  if (metric === 'lcp') return value <= 2500 ? 'green' : value <= 4000 ? 'yellow' : 'red';
  if (metric === 'cls') return value <= 0.1 ? 'green' : value <= 0.25 ? 'yellow' : 'red';
  if (metric === 'tbt') return value <= 200 ? 'green' : value <= 600 ? 'yellow' : 'red';
  return '';
}

function formatCWV(metric, value) {
  if (value === undefined || value === null) return 'N/A';
  if (metric === 'lcp') return `${(value / 1000).toFixed(1)}s`;
  if (metric === 'cls') return value.toFixed(3);
  if (metric === 'tbt') return `${Math.round(value)}ms`;
  return value;
}

// Run if called directly
if (require.main === module) {
  const jsonPath = process.argv[2] || null;
  generateHTMLReport(jsonPath);
}

module.exports = { generateHTMLReport };
