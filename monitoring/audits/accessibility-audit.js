const https = require('https');
const cheerio = require('cheerio');

async function runAccessibilityAudit(url) {
  try {
    const html = await fetchHTML(url);
    const $ = cheerio.load(html);

    const results = {
      contrast: {
        totalChecked: 0,
        passedAA: 0,
        failedAA: 0,
        failedAAA: 0,
        aaCompliance: 100,
        failures: []
      },
      forms: auditForms($),
      aria: auditAria($),
      navigation: { tabOrder: { totalFocusable: 0, negativeTabindex: 0, highTabindex: 0 }, focusStyles: {}, issues: [] },
      media: auditMedia($),
      semantics: auditSemantics($),
      score: 0,
      issues: [],
      recommendations: []
    };

    results.score = calculateA11yScore(results);
    results.issues = collectA11yIssues(results);
    results.recommendations = generateA11yRecommendations(results);

    return results;
  } catch (error) {
    return { error: error.message, score: 0, issues: [`Error: ${error.message}`] };
  }
}

function fetchHTML(url) {
  return new Promise((resolve, reject) => {
    https.get(url, (res) => {
      let data = '';
      res.on('data', chunk => data += chunk);
      res.on('end', () => resolve(data));
    }).on('error', reject);
  });
}

function auditForms($) {
  const forms = $('form');
  const inputs = $('input, select, textarea').not('[type="hidden"]');
  let missingLabels = 0;
  let missingPlaceholders = 0;
  let missingAutocomplete = 0;
  const issues = [];

  inputs.each((_, el) => {
    const id = $(el).attr('id');
    const ariaLabel = $(el).attr('aria-label');
    const ariaLabelledBy = $(el).attr('aria-labelledby');
    const placeholder = $(el).attr('placeholder');
    const autocomplete = $(el).attr('autocomplete');
    const type = $(el).attr('type') || 'text';

    const hasLabel = (id && $(`label[for="${id}"]`).length > 0) || ariaLabel || ariaLabelledBy;
    if (!hasLabel) missingLabels++;
    if (!placeholder && !['checkbox', 'radio', 'submit', 'button', 'file'].includes(type)) missingPlaceholders++;

    const autoTypes = ['email', 'tel', 'text', 'password'];
    if (autoTypes.includes(type) && !autocomplete) missingAutocomplete++;
  });

  if (missingLabels > 0) issues.push(`${missingLabels} campos sin label asociado`);

  return {
    totalForms: forms.length,
    totalInputs: inputs.length,
    missingLabels,
    missingPlaceholders,
    missingAutocomplete,
    issues
  };
}

function auditAria($) {
  const issues = [];

  const landmarks = {
    main: $('[role="main"], main').length,
    nav: $('[role="navigation"], nav').length,
    banner: $('[role="banner"], header').length,
    contentinfo: $('[role="contentinfo"], footer').length
  };

  if (landmarks.main === 0) issues.push('Falta landmark main');
  if (landmarks.nav === 0) issues.push('Falta landmark navigation');

  const skipLink = $('a[href="#main"], a[href="#content"], a[href="#main-content"], .skip-link, .skip-to-content');
  if (skipLink.length === 0) issues.push('Falta skip-to-content link');

  const buttons = $('button, [role="button"]');
  let unlabeledButtons = 0;
  buttons.each((_, el) => {
    const text = $(el).text().trim();
    const ariaLabel = $(el).attr('aria-label');
    const title = $(el).attr('title');
    if (!text && !ariaLabel && !title) unlabeledButtons++;
  });

  if (unlabeledButtons > 0) issues.push(`${unlabeledButtons} botones sin texto accesible`);

  const icons = $('i, svg, [class*="icon"]');
  let decorativeWithoutAria = 0;
  icons.each((_, el) => {
    const ariaHidden = $(el).attr('aria-hidden');
    const ariaLabel = $(el).attr('aria-label');
    const role = $(el).attr('role');
    if (!ariaHidden && !ariaLabel && role !== 'presentation') {
      decorativeWithoutAria++;
    }
  });

  if (decorativeWithoutAria > 5) {
    issues.push(`${decorativeWithoutAria} iconos sin aria-hidden o aria-label`);
  }

  return { landmarks, skipLink: skipLink.length > 0, unlabeledButtons, decorativeWithoutAria, issues };
}

function auditMedia($) {
  const issues = [];

  const videos = $('video');
  let videosWithoutCaptions = 0;
  videos.each((_, el) => {
    const tracks = $(el).find('track[kind="captions"], track[kind="subtitles"]');
    if (tracks.length === 0) videosWithoutCaptions++;
  });

  if (videosWithoutCaptions > 0) {
    issues.push(`${videosWithoutCaptions} videos sin subtitulos/captions`);
  }

  const iframes = $('iframe');
  let iframesWithoutTitle = 0;
  iframes.each((_, el) => {
    if (!$(el).attr('title')) iframesWithoutTitle++;
  });

  if (iframesWithoutTitle > 0) {
    issues.push(`${iframesWithoutTitle} iframes sin atributo title`);
  }

  return {
    videos: videos.length,
    videosWithoutCaptions,
    iframes: iframes.length,
    iframesWithoutTitle,
    issues
  };
}

function auditSemantics($) {
  const issues = [];

  const hasHeader = $('header').length > 0;
  const hasFooter = $('footer').length > 0;
  const hasMain = $('main').length > 0;
  const hasNav = $('nav').length > 0;

  if (!hasHeader) issues.push('Falta elemento <header>');
  if (!hasFooter) issues.push('Falta elemento <footer>');
  if (!hasMain) issues.push('Falta elemento <main>');
  if (!hasNav) issues.push('Falta elemento <nav>');

  const tables = $('table');
  let tablesWithoutHeaders = 0;
  tables.each((_, el) => {
    if ($(el).find('th').length === 0) tablesWithoutHeaders++;
  });

  if (tablesWithoutHeaders > 0) {
    issues.push(`${tablesWithoutHeaders} tablas sin encabezados <th>`);
  }

  const lang = $('html').attr('lang');
  if (!lang) issues.push('Falta atributo lang en <html>');

  return { hasHeader, hasFooter, hasMain, hasNav, lang: lang || '', tablesWithoutHeaders, issues };
}

function calculateA11yScore(results) {
  let score = 100;

  score -= results.contrast.failedAA * 3;
  score -= results.forms.missingLabels * 5;
  score -= results.aria.issues.length * 3;
  score -= results.navigation.issues?.length * 3 || 0;
  score -= results.media.issues.length * 5;
  score -= results.semantics.issues.length * 3;

  return Math.max(0, Math.min(100, score));
}

function collectA11yIssues(results) {
  return [
    ...(results.contrast.failedAA > 0
      ? [{ area: 'Contraste', issue: `${results.contrast.failedAA} elementos no cumplen WCAG AA`, priority: 'alta' }]
      : []),
    ...results.forms.issues.map(i => ({ area: 'Formularios', issue: i, priority: 'alta' })),
    ...results.aria.issues.map(i => ({ area: 'ARIA', issue: i, priority: 'media' })),
    ...(results.navigation.issues?.map(i => ({ area: 'Navegacion', issue: i, priority: 'media' })) || []),
    ...results.media.issues.map(i => ({ area: 'Media', issue: i, priority: 'media' })),
    ...results.semantics.issues.map(i => ({ area: 'Semantica', issue: i, priority: 'media' }))
  ];
}

function generateA11yRecommendations(results) {
  const recs = [];

  if (results.contrast.failedAA > 0) {
    recs.push({ priority: 'alta', action: `Corregir contraste en ${results.contrast.failedAA} elementos (minimo 4.5:1)` });
  }
  if (results.forms.missingLabels > 0) {
    recs.push({ priority: 'alta', action: `Agregar labels a ${results.forms.missingLabels} campos de formulario` });
  }
  if (!results.aria.skipLink) {
    recs.push({ priority: 'media', action: 'Agregar skip-to-content link para navegacion por teclado' });
  }
  if (!results.semantics.hasMain) {
    recs.push({ priority: 'media', action: 'Usar elemento <main> para el contenido principal' });
  }

  return recs;
}

module.exports = { runAccessibilityAudit };
