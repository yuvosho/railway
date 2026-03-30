const puppeteer = require('puppeteer');

const DEVICES = [
  { name: 'mobile', width: 375, height: 667, userAgent: 'Mozilla/5.0 (iPhone; CPU iPhone OS 16_0 like Mac OS X)' },
  { name: 'tablet', width: 768, height: 1024, userAgent: 'Mozilla/5.0 (iPad; CPU OS 16_0 like Mac OS X)' },
  { name: 'desktop', width: 1920, height: 1080, userAgent: 'Mozilla/5.0 (Windows NT 10.0; Win64; x64)' }
];

async function runLighthouseAudit(url) {
  const https = require('https');

  const apiKey = process.env.GOOGLE_API_KEY;
  if (!apiKey) {
    console.warn('⚠️  GOOGLE_API_KEY no configurada. Usando valores por defecto.');
    return getMockLighthouseResults();
  }

  const strategies = ['mobile', 'desktop'];
  const results = {};

  for (const strategy of strategies) {
    try {
      const psaUrl = `https://www.googleapis.com/pagespeedonline/v5/runPagespeed?url=${encodeURIComponent(url)}&key=${apiKey}&strategy=${strategy}`;
      const data = await fetchJSON(psaUrl);

      if (!data.lighthouseResult) {
        console.warn(`⚠️  No se obtuvieron resultados de PageSpeed para ${strategy}`);
        results[strategy] = getMockStrategyResults();
        continue;
      }

      const lhr = data.lighthouseResult;
      const categories = lhr.categories;

      results[strategy] = {
        performance: Math.round(categories.performance.score * 100),
        accessibility: Math.round(categories.accessibility.score * 100),
        bestPractices: Math.round(categories['best-practices'].score * 100),
        seo: Math.round(categories.seo.score * 100),
        audits: {
          fcp: lhr.audits['first-contentful-paint']?.numericValue,
          lcp: lhr.audits['largest-contentful-paint']?.numericValue,
          cls: lhr.audits['cumulative-layout-shift']?.numericValue,
          tbt: lhr.audits['total-blocking-time']?.numericValue,
          si: lhr.audits['speed-index']?.numericValue,
          tti: lhr.audits['interactive']?.numericValue
        },
        diagnostics: extractDiagnostics(lhr.audits)
      };
    } catch (error) {
      console.warn(`Error en PageSpeed ${strategy}: ${error.message}`);
      results[strategy] = getMockStrategyResults();
    }
  }

  return results;
}

function fetchJSON(url) {
  return new Promise((resolve, reject) => {
    https.get(url, (res) => {
      let data = '';
      res.on('data', chunk => data += chunk);
      res.on('end', () => {
        try {
          resolve(JSON.parse(data));
        } catch (e) {
          reject(e);
        }
      });
    }).on('error', reject);
  });
}

function getMockLighthouseResults() {
  return {
    mobile: getMockStrategyResults(),
    desktop: getMockStrategyResults(90)
  };
}

function getMockStrategyResults(baseScore = 75) {
  return {
    performance: baseScore,
    accessibility: 85,
    bestPractices: 80,
    seo: 88,
    audits: {
      fcp: 1500,
      lcp: 2500,
      cls: 0.1,
      tbt: 150,
      si: 2800,
      tti: 3200
    },
    diagnostics: []
  };
}

function extractDiagnostics(audits) {
  const diagnostics = [];

  const checks = [
    { id: 'render-blocking-resources', label: 'Recursos que bloquean el render' },
    { id: 'unused-css-rules', label: 'CSS sin usar' },
    { id: 'unused-javascript', label: 'JavaScript sin usar' },
    { id: 'unminified-css', label: 'CSS sin minificar' },
    { id: 'unminified-javascript', label: 'JavaScript sin minificar' },
    { id: 'uses-optimized-images', label: 'Imágenes no optimizadas' },
    { id: 'uses-webp-images', label: 'Imágenes sin formato WebP' },
    { id: 'uses-text-compression', label: 'Sin compresión de texto' },
    { id: 'uses-responsive-images', label: 'Imágenes no responsive' },
    { id: 'dom-size', label: 'DOM demasiado grande' },
    { id: 'font-display', label: 'Font display no óptimo' }
  ];

  for (const check of checks) {
    const audit = audits[check.id];
    if (audit && audit.score !== null && audit.score < 1) {
      diagnostics.push({
        id: check.id,
        label: check.label,
        score: audit.score,
        displayValue: audit.displayValue || '',
        savings: audit.numericValue || 0
      });
    }
  }

  return diagnostics.sort((a, b) => a.score - b.score);
}

async function runResponsivenessAudit(url) {
  const browser = await puppeteer.launch({
    headless: 'new',
    args: ['--no-sandbox', '--disable-setuid-sandbox']
  });

  const results = {};

  for (const device of DEVICES) {
    const page = await browser.newPage();
    await page.setViewport({ width: device.width, height: device.height });
    await page.setUserAgent(device.userAgent);

    try {
      await page.goto(url, { waitUntil: 'networkidle2', timeout: 30000 });

      const layoutIssues = await page.evaluate(() => {
        const issues = [];
        const body = document.body;
        const html = document.documentElement;

        if (body.scrollWidth > html.clientWidth) {
          issues.push('Scroll horizontal detectado');
        }

        const elements = document.querySelectorAll('*');
        let overflowCount = 0;
        elements.forEach(el => {
          const rect = el.getBoundingClientRect();
          if (rect.right > window.innerWidth + 5) {
            overflowCount++;
          }
        });

        if (overflowCount > 0) {
          issues.push(`${overflowCount} elementos desbordan la pantalla`);
        }

        const buttons = document.querySelectorAll('button, a, [role="button"], input[type="submit"]');
        let smallButtons = 0;
        buttons.forEach(btn => {
          const rect = btn.getBoundingClientRect();
          if (rect.width > 0 && rect.height > 0 && (rect.width < 44 || rect.height < 44)) {
            smallButtons++;
          }
        });

        if (smallButtons > 0) {
          issues.push(`${smallButtons} botones/enlaces menores a 44x44px`);
        }

        const texts = document.querySelectorAll('p, span, li, td, th, label');
        let smallTextCount = 0;
        texts.forEach(el => {
          const fontSize = parseFloat(window.getComputedStyle(el).fontSize);
          if (fontSize < 12 && el.textContent.trim().length > 0) {
            smallTextCount++;
          }
        });

        if (smallTextCount > 0) {
          issues.push(`${smallTextCount} textos con fuente menor a 12px`);
        }

        return issues;
      });

      results[device.name] = {
        passed: layoutIssues.length === 0,
        issues: layoutIssues,
        score: layoutIssues.length === 0 ? 100 : Math.max(0, 100 - (layoutIssues.length * 20))
      };
    } catch (error) {
      results[device.name] = {
        passed: false,
        issues: [`Error al cargar: ${error.message}`],
        score: 0
      };
    }

    await page.close();
  }

  await browser.close();
  return results;
}

module.exports = { runLighthouseAudit, runResponsivenessAudit };
