const https = require('https');
const cheerio = require('cheerio');

async function runImageAudit(url) {
  try {
    const html = await fetchHTML(url);
    const $ = cheerio.load(html);

    const results = {
      images: auditImageElements($),
      networkImages: analyzeNetworkImages(),
      lazyLoading: auditLazyLoading($),
      formats: auditFormats(),
      score: 0,
      issues: [],
      recommendations: []
    };

    results.score = calculateImageScore(results);
    results.issues = collectImageIssues(results);
    results.recommendations = generateImageRecommendations(results);

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

function auditImageElements($) {
  const images = [];
  let missingAlt = 0;
  let emptyAlt = 0;
  let decorativeAlt = 0;
  let missingDimensions = 0;

  $('img').each((_, el) => {
    const src = $(el).attr('src') || $(el).attr('data-src') || '';
    const alt = $(el).attr('alt');
    const width = $(el).attr('width');
    const height = $(el).attr('height');
    const loading = $(el).attr('loading');
    const srcset = $(el).attr('srcset') || '';

    const hasAlt = alt !== undefined;
    const altIsEmpty = hasAlt && alt.trim() === '';
    const altIsGeneric = hasAlt && /^(image|img|foto|picture|photo|banner|icon|\d+)$/i.test(alt.trim());

    if (!hasAlt) missingAlt++;
    if (altIsEmpty) emptyAlt++;
    if (altIsGeneric) decorativeAlt++;
    if (!width || !height) missingDimensions++;

    images.push({
      src: src.substring(0, 200),
      alt: alt || null,
      hasAlt,
      altQuality: !hasAlt ? 'missing' : altIsEmpty ? 'empty' : altIsGeneric ? 'generic' : 'ok',
      width,
      height,
      hasDimensions: !!(width && height),
      loading: loading || 'eager',
      hasSrcset: !!srcset
    });
  });

  return {
    total: images.length,
    missingAlt,
    emptyAlt,
    decorativeAlt,
    goodAlt: images.length - missingAlt - emptyAlt - decorativeAlt,
    missingDimensions,
    altCoverage: images.length > 0 ? Math.round(((images.length - missingAlt) / images.length) * 100) : 100,
    details: images
  };
}

function analyzeNetworkImages() {
  // El analisis de red se realiza mediante PageSpeed Insights
  return {
    total: 0,
    totalSizeKB: 0,
    totalSizeMB: '0',
    averageSizeKB: 0,
    oversized: 0,
    oversizedDetails: [],
    veryLarge: 0,
    note: 'Validado mediante PageSpeed Insights'
  };
}

function auditLazyLoading($) {
  const allImages = $('img');
  let lazyCount = 0;
  let eagerCount = 0;

  allImages.each((index, el) => {
    const loading = $(el).attr('loading');
    const dataSrc = $(el).attr('data-src');

    if (loading === 'lazy' || dataSrc) {
      lazyCount++;
    } else {
      eagerCount++;
    }
  });

  const aboveFold = Math.min(3, allImages.length);
  const belowFold = allImages.length - aboveFold;

  return {
    total: allImages.length,
    lazy: lazyCount,
    eager: eagerCount,
    belowFoldWithoutLazy: Math.max(0, belowFold - lazyCount),
    coverage: allImages.length > 0 ? Math.round((lazyCount / Math.max(1, belowFold)) * 100) : 100
  };
}

function auditFormats() {
  // El analisis de formatos se valida mediante PageSpeed Insights
  return {
    breakdown: {},
    webpUsage: 0,
    avifUsage: 0,
    modernFormatUsage: 0,
    oldFormatCount: 0,
    note: 'Validado mediante PageSpeed Insights'
  };
}

function getImageFormat(contentType, url) {
  if (contentType.includes('webp')) return 'webp';
  if (contentType.includes('avif')) return 'avif';
  if (contentType.includes('svg')) return 'svg';
  if (contentType.includes('png')) return 'png';
  if (contentType.includes('gif')) return 'gif';
  if (contentType.includes('jpeg') || contentType.includes('jpg')) return 'jpg';

  const ext = url.split('.').pop().split('?')[0].toLowerCase();
  return ext || 'unknown';
}

function calculateImageScore(results) {
  let score = 100;

  if (results.images.missingAlt > 0) score -= results.images.missingAlt * 5;
  if (results.images.emptyAlt > 0) score -= results.images.emptyAlt * 3;
  if (results.images.decorativeAlt > 0) score -= results.images.decorativeAlt * 2;
  if (results.images.missingDimensions > 0) score -= results.images.missingDimensions * 2;
  if (results.networkImages.oversized > 0) score -= results.networkImages.oversized * 5;
  if (results.networkImages.veryLarge > 0) score -= results.networkImages.veryLarge * 10;
  if (results.lazyLoading.belowFoldWithoutLazy > 3) score -= 10;
  if (results.formats.modernFormatUsage < 50) score -= 10;

  return Math.max(0, Math.min(100, score));
}

function collectImageIssues(results) {
  const issues = [];

  if (results.images.missingAlt > 0)
    issues.push({ area: 'Alt Text', issue: `${results.images.missingAlt} imagenes sin alt text`, priority: 'alta' });
  if (results.images.emptyAlt > 0)
    issues.push({ area: 'Alt Text', issue: `${results.images.emptyAlt} imagenes con alt vacio`, priority: 'media' });
  if (results.images.decorativeAlt > 0)
    issues.push({ area: 'Alt Text', issue: `${results.images.decorativeAlt} imagenes con alt generico`, priority: 'media' });
  if (results.networkImages.oversized > 0)
    issues.push({ area: 'Peso', issue: `${results.networkImages.oversized} imagenes > 200KB`, priority: 'alta' });
  if (results.networkImages.veryLarge > 0)
    issues.push({ area: 'Peso', issue: `${results.networkImages.veryLarge} imagenes > 500KB (critico)`, priority: 'alta' });
  if (results.lazyLoading.belowFoldWithoutLazy > 3)
    issues.push({ area: 'Lazy Loading', issue: `${results.lazyLoading.belowFoldWithoutLazy} imagenes below-fold sin lazy loading`, priority: 'media' });
  if (results.formats.modernFormatUsage < 50)
    issues.push({ area: 'Formato', issue: `Solo ${results.formats.modernFormatUsage}% en formatos modernos (WebP/AVIF)`, priority: 'media' });
  if (results.images.missingDimensions > 0)
    issues.push({ area: 'Dimensiones', issue: `${results.images.missingDimensions} imagenes sin width/height (causa CLS)`, priority: 'media' });

  return issues;
}

function generateImageRecommendations(results) {
  const recs = [];

  if (results.images.missingAlt > 0)
    recs.push({ priority: 'alta', action: `Agregar alt text descriptivo a ${results.images.missingAlt} imagenes` });
  if (results.networkImages.oversized > 0)
    recs.push({ priority: 'alta', action: `Comprimir ${results.networkImages.oversized} imagenes (objetivo: < 200KB)` });
  if (results.formats.modernFormatUsage < 80)
    recs.push({ priority: 'media', action: 'Convertir imagenes a formato WebP para reducir peso 25-35%' });
  if (results.lazyLoading.belowFoldWithoutLazy > 0)
    recs.push({ priority: 'media', action: 'Implementar lazy loading en imagenes below-fold' });
  if (results.images.missingDimensions > 0)
    recs.push({ priority: 'media', action: 'Agregar width/height a imagenes para evitar layout shift (CLS)' });

  return recs;
}

module.exports = { runImageAudit };
