const https = require('https');
const cheerio = require('cheerio');

async function runSeoAudit(url) {
  try {
    const html = await fetchHTML(url);
    const $ = cheerio.load(html);

    const results = {
      metaTags: auditMetaTags($, url),
      headings: auditHeadings($),
      links: await auditLinks($, url, page),
      schema: auditSchema($),
      technical: await auditTechnical(url),
      keywords: auditKeywords($),
      score: 0,
      issues: [],
      recommendations: []
    };

    results.score = calculateSeoScore(results);
    results.issues = collectIssues(results);
    results.recommendations = generateRecommendations(results);

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

function checkURLExists(url) {
  return new Promise((resolve) => {
    https.head(url, (res) => {
      resolve(res.statusCode === 200);
    }).on('error', () => resolve(false));
  });
}

function auditMetaTags($, url) {
  const title = $('title').text().trim();
  const metaDesc = $('meta[name="description"]').attr('content') || '';
  const canonical = $('link[rel="canonical"]').attr('href') || '';
  const ogTitle = $('meta[property="og:title"]').attr('content') || '';
  const ogDesc = $('meta[property="og:description"]').attr('content') || '';
  const ogImage = $('meta[property="og:image"]').attr('content') || '';
  const ogType = $('meta[property="og:type"]').attr('content') || '';
  const twitterCard = $('meta[name="twitter:card"]').attr('content') || '';
  const viewport = $('meta[name="viewport"]').attr('content') || '';
  const robots = $('meta[name="robots"]').attr('content') || '';
  const charset = $('meta[charset]').attr('charset') || $('meta[http-equiv="Content-Type"]').attr('content') || '';
  const lang = $('html').attr('lang') || '';

  const issues = [];

  if (!title) issues.push('Falta title tag');
  else if (title.length < 30) issues.push(`Title muy corto (${title.length} chars, recomendado: 50-60)`);
  else if (title.length > 60) issues.push(`Title muy largo (${title.length} chars, recomendado: 50-60)`);

  if (!metaDesc) issues.push('Falta meta description');
  else if (metaDesc.length < 120) issues.push(`Meta description muy corta (${metaDesc.length} chars, recomendado: 150-160)`);
  else if (metaDesc.length > 160) issues.push(`Meta description muy larga (${metaDesc.length} chars, recomendado: 150-160)`);

  if (!canonical) issues.push('Falta canonical URL');
  if (!ogTitle) issues.push('Falta og:title (Open Graph)');
  if (!ogDesc) issues.push('Falta og:description (Open Graph)');
  if (!ogImage) issues.push('Falta og:image (Open Graph)');
  if (!viewport) issues.push('Falta meta viewport');
  if (!lang) issues.push('Falta atributo lang en <html>');

  return {
    title: { value: title, length: title.length, ok: title.length >= 30 && title.length <= 60 },
    metaDescription: { value: metaDesc, length: metaDesc.length, ok: metaDesc.length >= 120 && metaDesc.length <= 160 },
    canonical: { value: canonical, ok: !!canonical },
    openGraph: { title: ogTitle, description: ogDesc, image: ogImage, type: ogType, ok: !!(ogTitle && ogDesc && ogImage) },
    twitter: { card: twitterCard, ok: !!twitterCard },
    viewport: { value: viewport, ok: !!viewport },
    robots: { value: robots },
    charset: { value: charset, ok: !!charset },
    lang: { value: lang, ok: !!lang },
    issues
  };
}

function auditHeadings($) {
  const headings = {};
  const issues = [];

  for (let i = 1; i <= 6; i++) {
    const tags = $(`h${i}`);
    headings[`h${i}`] = {
      count: tags.length,
      texts: tags.map((_, el) => $(el).text().trim().substring(0, 100)).get()
    };
  }

  if (headings.h1.count === 0) issues.push('Falta H1 en la pagina');
  if (headings.h1.count > 1) issues.push(`Multiples H1 (${headings.h1.count}), deberia haber solo 1`);
  if (headings.h2.count === 0) issues.push('Falta H2, mejorar estructura de contenido');

  let prevLevel = 0;
  for (let i = 1; i <= 6; i++) {
    if (headings[`h${i}`].count > 0) {
      if (prevLevel > 0 && i > prevLevel + 1) {
        issues.push(`Salto en jerarquia de headings: H${prevLevel} a H${i}`);
      }
      prevLevel = i;
    }
  }

  return { headings, issues };
}

async function auditLinks($, baseUrl, page) {
  const links = $('a[href]');
  const internalLinks = [];
  const externalLinks = [];
  const issues = [];
  let noFollowCount = 0;
  let emptyLinks = 0;
  let missingTitleLinks = 0;

  links.each((_, el) => {
    const href = $(el).attr('href') || '';
    const text = $(el).text().trim();
    const rel = $(el).attr('rel') || '';
    const title = $(el).attr('title') || '';

    if (!text && !title && !$(el).find('img').length) {
      emptyLinks++;
    }

    if (rel.includes('nofollow')) noFollowCount++;

    try {
      const absoluteUrl = new URL(href, baseUrl);
      if (absoluteUrl.hostname === new URL(baseUrl).hostname) {
        internalLinks.push({ href: absoluteUrl.href, text });
      } else {
        externalLinks.push({ href: absoluteUrl.href, text });
      }
    } catch {
      // skip invalid URLs
    }
  });

  if (emptyLinks > 0) issues.push(`${emptyLinks} enlaces sin texto descriptivo`);
  if (internalLinks.length < 5) issues.push('Pocos enlaces internos, mejorar internal linking');

  return {
    total: links.length,
    internal: internalLinks.length,
    external: externalLinks.length,
    noFollow: noFollowCount,
    emptyLinks,
    issues
  };
}

function auditSchema($) {
  const schemas = [];
  const issues = [];

  $('script[type="application/ld+json"]').each((_, el) => {
    try {
      const data = JSON.parse($(el).html());
      schemas.push({
        type: data['@type'] || 'Unknown',
        data: data
      });
    } catch {
      issues.push('Schema JSON-LD con formato invalido');
    }
  });

  if (schemas.length === 0) {
    issues.push('No se encontro Schema markup (JSON-LD). Agregar para productos, organizacion, etc.');
  }

  const hasProduct = schemas.some(s => s.type === 'Product');
  const hasOrganization = schemas.some(s => s.type === 'Organization' || s.type === 'LocalBusiness');
  const hasBreadcrumb = schemas.some(s => s.type === 'BreadcrumbList');

  if (!hasProduct) issues.push('Falta Schema de tipo Product (importante para e-commerce)');
  if (!hasOrganization) issues.push('Falta Schema Organization/LocalBusiness');

  return { schemas: schemas.map(s => s.type), issues, hasProduct, hasOrganization, hasBreadcrumb };
}

async function auditTechnical(url) {
  const issues = [];
  const origin = new URL(url).origin;

  try {
    const hasRobots = await checkURLExists(`${origin}/robots.txt`);
    if (!hasRobots) issues.push('Falta robots.txt');

    const hasSitemap = await checkURLExists(`${origin}/sitemap.xml`);
    if (!hasSitemap) issues.push('Falta sitemap.xml');

    return { hasRobots, hasSitemap, issues };
  } catch {
    return { hasRobots: false, hasSitemap: false, issues: ['Error verificando archivos tecnicos'] };
  }
}

function checkURLExists(url) {
  return new Promise((resolve) => {
    https.head(url, (res) => {
      resolve(res.statusCode === 200);
    }).on('error', () => resolve(false));
  });
}

function auditKeywords($) {
  const title = $('title').text().toLowerCase();
  const metaDesc = ($('meta[name="description"]').attr('content') || '').toLowerCase();
  const h1Text = $('h1').first().text().toLowerCase();
  const bodyText = $('body').text().toLowerCase();

  const bazarKeywords = [
    'bazar', 'hogar', 'cocina', 'decoracion', 'organizacion',
    'moderno', 'diseño', 'accesorios', 'productos', 'tienda',
    'comprar', 'online', 'envio', 'oferta', 'precio'
  ];

  const found = {};
  for (const kw of bazarKeywords) {
    found[kw] = {
      inTitle: title.includes(kw),
      inDescription: metaDesc.includes(kw),
      inH1: h1Text.includes(kw),
      inBody: bodyText.includes(kw),
      bodyCount: (bodyText.match(new RegExp(kw, 'g')) || []).length
    };
  }

  const issues = [];
  const titleKeywords = bazarKeywords.filter(kw => found[kw].inTitle);
  if (titleKeywords.length === 0) issues.push('Ninguna keyword del sector en el title');

  const descKeywords = bazarKeywords.filter(kw => found[kw].inDescription);
  if (descKeywords.length === 0) issues.push('Ninguna keyword del sector en la meta description');

  return { keywords: found, issues };
}

function calculateSeoScore(results) {
  let score = 100;
  const allIssues = [
    ...results.metaTags.issues,
    ...results.headings.issues,
    ...results.links.issues,
    ...results.schema.issues,
    ...results.technical.issues,
    ...results.keywords.issues
  ];

  score -= allIssues.length * 5;
  return Math.max(0, Math.min(100, score));
}

function collectIssues(results) {
  return [
    ...results.metaTags.issues.map(i => ({ area: 'Meta Tags', issue: i, priority: 'alta' })),
    ...results.headings.issues.map(i => ({ area: 'Headings', issue: i, priority: 'media' })),
    ...results.links.issues.map(i => ({ area: 'Links', issue: i, priority: 'media' })),
    ...results.schema.issues.map(i => ({ area: 'Schema', issue: i, priority: 'alta' })),
    ...results.technical.issues.map(i => ({ area: 'Tecnico', issue: i, priority: 'alta' })),
    ...results.keywords.issues.map(i => ({ area: 'Keywords', issue: i, priority: 'media' }))
  ];
}

function generateRecommendations(results) {
  const recs = [];

  if (!results.metaTags.title.ok) {
    recs.push({ priority: 'alta', action: 'Optimizar title tag a 50-60 caracteres con keyword principal' });
  }
  if (!results.metaTags.metaDescription.ok) {
    recs.push({ priority: 'alta', action: 'Escribir meta description de 150-160 caracteres con CTA' });
  }
  if (!results.metaTags.openGraph.ok) {
    recs.push({ priority: 'media', action: 'Agregar Open Graph tags completos para compartir en redes sociales' });
  }
  if (!results.schema.hasProduct) {
    recs.push({ priority: 'alta', action: 'Agregar Schema Product a las paginas de productos' });
  }
  if (!results.schema.hasOrganization) {
    recs.push({ priority: 'media', action: 'Agregar Schema Organization con datos del negocio' });
  }
  if (results.links.internal < 10) {
    recs.push({ priority: 'media', action: 'Mejorar internal linking, agregar mas enlaces entre paginas' });
  }

  return recs;
}

module.exports = { runSeoAudit };
