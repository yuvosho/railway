require('dotenv').config();
const fs = require('fs');
const path = require('path');
const { runLighthouseAudit, runResponsivenessAudit } = require('./audits/lighthouse-audit');
const { runSeoAudit } = require('./audits/seo-audit');
const { runImageAudit } = require('./audits/image-audit');
const { runAccessibilityAudit } = require('./audits/accessibility-audit');

const WEBSITE_URL = process.env.WEBSITE_URL || 'https://valsho.com.ar';
const REPORTS_DIR = process.env.REPORTS_DIR || path.join(__dirname, 'reports');

async function runFullAudit() {
  const startTime = Date.now();
  const date = new Date().toISOString().split('T')[0];

  console.log('='.repeat(60));
  console.log(`  AUDITORIA SEMANAL - ${WEBSITE_URL}`);
  console.log(`  Fecha: ${date}`);
  console.log('='.repeat(60));
  console.log('');

  const results = {
    url: WEBSITE_URL,
    date,
    timestamp: new Date().toISOString(),
    audits: {},
    summary: {},
    duration: 0
  };

  // Run audits sequentially to avoid browser conflicts
  console.log('[1/5] Ejecutando auditoria Lighthouse...');
  try {
    results.audits.lighthouse = await runLighthouseAudit(WEBSITE_URL);
    console.log(`      Performance (Mobile): ${results.audits.lighthouse.mobile?.performance || 'N/A'}/100`);
    console.log(`      SEO (Mobile): ${results.audits.lighthouse.mobile?.seo || 'N/A'}/100`);
    console.log(`      Accesibilidad (Mobile): ${results.audits.lighthouse.mobile?.accessibility || 'N/A'}/100`);
  } catch (error) {
    console.log(`      Error: ${error.message}`);
    results.audits.lighthouse = { error: error.message };
  }

  console.log('');
  console.log('[2/5] Ejecutando auditoria de Responsividad...');
  try {
    results.audits.responsiveness = await runResponsivenessAudit(WEBSITE_URL);
    for (const [device, data] of Object.entries(results.audits.responsiveness)) {
      console.log(`      ${device}: ${data.passed ? 'OK' : 'PROBLEMAS'} (${data.score}/100)`);
    }
  } catch (error) {
    console.log(`      Error: ${error.message}`);
    results.audits.responsiveness = { error: error.message };
  }

  console.log('');
  console.log('[3/5] Ejecutando auditoria SEO...');
  try {
    results.audits.seo = await runSeoAudit(WEBSITE_URL);
    console.log(`      Score SEO: ${results.audits.seo.score}/100`);
    console.log(`      Issues: ${results.audits.seo.issues?.length || 0}`);
  } catch (error) {
    console.log(`      Error: ${error.message}`);
    results.audits.seo = { error: error.message };
  }

  console.log('');
  console.log('[4/5] Ejecutando auditoria de Imagenes...');
  try {
    results.audits.images = await runImageAudit(WEBSITE_URL);
    console.log(`      Score Imagenes: ${results.audits.images.score}/100`);
    console.log(`      Total imagenes: ${results.audits.images.images?.total || 0}`);
    console.log(`      Alt text coverage: ${results.audits.images.images?.altCoverage || 0}%`);
  } catch (error) {
    console.log(`      Error: ${error.message}`);
    results.audits.images = { error: error.message };
  }

  console.log('');
  console.log('[5/5] Ejecutando auditoria de Accesibilidad...');
  try {
    results.audits.accessibility = await runAccessibilityAudit(WEBSITE_URL);
    console.log(`      Score Accesibilidad: ${results.audits.accessibility.score}/100`);
    console.log(`      Contraste AA: ${results.audits.accessibility.contrast?.aaCompliance || 0}%`);
  } catch (error) {
    console.log(`      Error: ${error.message}`);
    results.audits.accessibility = { error: error.message };
  }

  // Calculate summary
  results.summary = calculateSummary(results.audits);
  results.duration = Math.round((Date.now() - startTime) / 1000);

  // Save results
  if (!fs.existsSync(REPORTS_DIR)) {
    fs.mkdirSync(REPORTS_DIR, { recursive: true });
  }

  const jsonPath = path.join(REPORTS_DIR, `${date}-audit.json`);
  fs.writeFileSync(jsonPath, JSON.stringify(results, null, 2));

  // Print summary
  console.log('');
  console.log('='.repeat(60));
  console.log('  RESUMEN EJECUTIVO');
  console.log('='.repeat(60));
  console.log('');
  printSummary(results.summary);
  console.log('');
  console.log(`  Duracion: ${results.duration}s`);
  console.log(`  Resultados guardados: ${jsonPath}`);
  console.log('');
  console.log('  Ejecuta "npm run report" para generar reporte HTML');
  console.log('='.repeat(60));

  return results;
}

function calculateSummary(audits) {
  const scores = {
    performance: audits.lighthouse?.mobile?.performance || 0,
    seo: audits.seo?.score || 0,
    images: audits.images?.score || 0,
    accessibility: audits.accessibility?.score || 0,
    responsiveness: calculateResponsivenessScore(audits.responsiveness)
  };

  scores.overall = Math.round(
    (scores.performance + scores.seo + scores.images + scores.accessibility + scores.responsiveness) / 5
  );

  const allIssues = [
    ...(audits.seo?.issues || []),
    ...(audits.images?.issues || []),
    ...(audits.accessibility?.issues || [])
  ];

  const highPriority = allIssues.filter(i => i.priority === 'alta');
  const mediumPriority = allIssues.filter(i => i.priority === 'media');

  const allRecommendations = [
    ...(audits.seo?.recommendations || []),
    ...(audits.images?.recommendations || []),
    ...(audits.accessibility?.recommendations || [])
  ];

  return {
    scores,
    totalIssues: allIssues.length,
    highPriorityIssues: highPriority.length,
    mediumPriorityIssues: mediumPriority.length,
    issues: allIssues,
    recommendations: allRecommendations,
    coreWebVitals: {
      lcp: audits.lighthouse?.mobile?.audits?.lcp,
      cls: audits.lighthouse?.mobile?.audits?.cls,
      tbt: audits.lighthouse?.mobile?.audits?.tbt
    }
  };
}

function calculateResponsivenessScore(responsiveness) {
  if (!responsiveness || responsiveness.error) return 0;
  const scores = Object.values(responsiveness).map(d => d.score || 0);
  return scores.length > 0 ? Math.round(scores.reduce((a, b) => a + b, 0) / scores.length) : 0;
}

function printSummary(summary) {
  const { scores } = summary;

  const getIcon = (score) => {
    if (score >= 90) return 'OK';
    if (score >= 70) return 'ATENCION';
    return 'CRITICO';
  };

  console.log(`  PUNTUACION GENERAL: ${scores.overall}/100 [${getIcon(scores.overall)}]`);
  console.log('');
  console.log(`  Performance:    ${scores.performance}/100 [${getIcon(scores.performance)}]`);
  console.log(`  SEO:            ${scores.seo}/100 [${getIcon(scores.seo)}]`);
  console.log(`  Imagenes:       ${scores.images}/100 [${getIcon(scores.images)}]`);
  console.log(`  Accesibilidad:  ${scores.accessibility}/100 [${getIcon(scores.accessibility)}]`);
  console.log(`  Responsividad:  ${scores.responsiveness}/100 [${getIcon(scores.responsiveness)}]`);
  console.log('');
  console.log(`  Issues totales: ${summary.totalIssues}`);
  console.log(`    - Alta prioridad: ${summary.highPriorityIssues}`);
  console.log(`    - Media prioridad: ${summary.mediumPriorityIssues}`);

  if (summary.recommendations.length > 0) {
    console.log('');
    console.log('  TOP RECOMENDACIONES:');
    const topRecs = summary.recommendations.filter(r => r.priority === 'alta').slice(0, 5);
    topRecs.forEach((rec, i) => {
      console.log(`    ${i + 1}. ${rec.action}`);
    });
  }
}

// Run if called directly
if (require.main === module) {
  runFullAudit()
    .then(() => process.exit(0))
    .catch(err => {
      console.error('Error fatal:', err.message);
      process.exit(1);
    });
}

module.exports = { runFullAudit };
