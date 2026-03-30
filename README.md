# 📊 Valsho Web Audit System

Sistema automatizado de auditoría semanal para **valsho.com.ar** que monitorea 6 áreas clave: performance, SEO, imágenes, accesibilidad, diseño y conversión.

## 🚀 Inicio Rápido

### 1. Instalar Dependencias
```bash
npm install
```

### 2. Configurar API Keys (HECHO ✅)
El archivo `.env` ya está configurado con tu API Key de Google PageSpeed Insights.

### 3. Ejecutar Auditoría Manual
```bash
npm run audit
```

Esto ejecutará las 5 auditorías y generará un JSON con los resultados en `/monitoring/reports/`.

### 4. Generar Reporte HTML
```bash
npm run report
```

Crea un reporte HTML interactivo basado en el JSON más reciente.

### 5. Ejecutar Todo (Recomendado)
```bash
npm run audit:full
```

Ejecuta auditoría + genera reporte en una sola comando.

---

## 📁 Estructura del Proyecto

```
railway/
├── monitoring/
│   ├── weekly-audit.js           # Orquestador principal
│   ├── generate-report.js        # Generador de reportes HTML
│   ├── config.json               # Configuracion del proyecto
│   ├── audits/                   # Scripts de auditoria
│   │   ├── lighthouse-audit.js   # Performance + Core Web Vitals
│   │   ├── seo-audit.js          # SEO + meta tags + keywords
│   │   ├── image-audit.js        # Imagenes + alt text + peso
│   │   └── accessibility-audit.js # WCAG + contraste + navegacion
│   └── reports/                  # Reportes generados (JSON + HTML)
├── docs/
│   ├── seo-checklist.md          # Checklist SEO manual semanal
│   ├── accessibility-checklist.md # Checklist WCAG
│   ├── image-guidelines.md       # Guia de optimizacion de imagenes
│   ├── setup-api-keys.md         # Como configurar Google APIs
│   └── SETUP-GOOGLE-APIS-PASO-A-PASO.md # Guia detallada paso a paso
├── .github/workflows/
│   └── weekly-audit.yml          # Automatizacion GitHub Actions
├── .env                          # Variables de entorno (no pusheado)
├── .env.example                  # Plantilla de .env
├── package.json                  # Dependencias npm
└── README.md                      # Este archivo
```

---

## 🔧 Scripts Disponibles

| Script | Descripcion |
|--------|-------------|
| `npm run audit` | Ejecuta todas las auditorias |
| `npm run report` | Genera reporte HTML desde JSON mas reciente |
| `npm run audit:full` | Audita + genera reporte |

---

## 📊 ¿Qué se Audita?

### 1. Performance (Lighthouse)
- ⚡ Velocidad de carga (target: <2.5s mobile)
- 🎯 Core Web Vitals (LCP, CLS, TBT)
- 📈 Diagnosticos de rendimiento
- **Resultado:** JSON + Puntuacion /100

### 2. SEO
- 🔍 Meta tags (title, description, canonical)
- 📝 Estructura de headings (H1, H2, H3)
- 🔗 Internal linking
- 🏷️ Schema markup (JSON-LD)
- 🎯 Keywords del sector
- **Resultado:** Puntuacion /100 + issues + recomendaciones

### 3. Imagenes
- 🖼️ Alt text descriptivo (target: 100%)
- 📦 Peso y compresion (<150KB por imagen)
- 🎨 Formatos modernos (WebP/AVIF target: >80%)
- 🚀 Lazy loading en below-the-fold
- **Resultado:** Analisis detallado + score /100

### 4. Accesibilidad (WCAG AA)
- 🌈 Contraste de colores (ratio minimo 4.5:1)
- ⌨️ Navegacion por teclado
- 🏷️ Labels en formularios
- 🎯 ARIA landmarks
- 📺 Soporte para screen readers
- **Resultado:** Score /100 + issues + recomendaciones

### 5. Responsividad
- 📱 Mobile (375px)
- 📊 Tablet (768px)
- 🖥️ Desktop (1920px)
- ✅ Sin scroll horizontal
- ✅ Botones >= 44x44px
- **Resultado:** Issues por dispositivo

### 6. Análisis Adicional
- 📊 Metricas de Core Web Vitals
- 🎨 Paleta de colores y consistencia
- 📐 Dimensiones y espaciado
- 🔗 Validación de links

---

## 📈 Salida de Reportes

### Formato JSON
Se guarda en: `monitoring/reports/YYYY-MM-DD-audit.json`

Contiene:
- Scores de cada auditoria
- Issues detectados (prioridad: alta/media)
- Recomendaciones accionables
- Metricas Core Web Vitals
- Detalles de cada categoria

### Formato HTML
Se guarda en: `monitoring/reports/YYYY-MM-DD-report.html`

Incluye:
- Dashboard visual con scores
- Graficos y barras de progreso
- Issues por categoria
- Recomendaciones priorizadas
- Detalles de Lighthouse, imagenes, accesibilidad
- Core Web Vitals

---

## ⚙️ Configuracion

### Variables de Entorno (.env)

```bash
# Sitio a auditar
WEBSITE_URL=https://valsho.com.ar

# Google APIs
GOOGLE_API_KEY=tu_api_key_aqui
GOOGLE_CLIENT_ID=tu_client_id (opcional)
GOOGLE_CLIENT_SECRET=tu_client_secret (opcional)
GOOGLE_REFRESH_TOKEN=tu_refresh_token (opcional)

# Email para reportes (opcional)
EMAIL_FROM=reportes@valsho.com.ar
EMAIL_PASSWORD=
EMAIL_TO=admin@valsho.com.ar

# Lighthouse
LIGHTHOUSE_THROTTLING=true
LIGHTHOUSE_EMULATION=true

# Reportes
REPORTS_DIR=./monitoring/reports
```

---

## 🤖 Automatizacion (GitHub Actions)

El sistema esta configurado para ejecutar automáticamente **cada lunes a las 8:00 AM** (hora Argentina).

### Configurar GitHub Actions

1. Ve a tu repositorio en GitHub
2. Ir a **Settings** > **Secrets and variables** > **Actions**
3. Agregar estos secrets:
   - `WEBSITE_URL`: https://valsho.com.ar
   - `GOOGLE_API_KEY`: tu API key

4. Los reportes se generaran automáticamente cada lunes
5. Se commitean en `monitoring/reports/`

### Ejecutar Manualmente
En GitHub:
1. Ve a **Actions** > **Weekly Website Audit**
2. Click en **Run workflow**

---

## 📋 Checklists Manuales

Complementa las auditorias automáticas con revisiones semanales manuales:

- **`docs/seo-checklist.md`** - Revisión SEO manual
- **`docs/accessibility-checklist.md`** - Validacion WCAG
- **`docs/image-guidelines.md`** - Estandares de imagenes

---

## 🔍 Casos de Uso

### Semana 1: Analisis Inicial
```bash
npm run audit:full
```
Ves los issues criticos y comienzas a priorizar mejoras.

### Semanas 2-4: Implementar Mejoras
Sigues el checklist de recomendaciones de alta prioridad:
- Velocidad: optimizar CSS/JS
- SEO: mejorar meta tags
- Imagenes: comprimir y agregar alt text
- Accesibilidad: fijar contraste

### Semana 5: Auditar de Nuevo
```bash
npm run audit:full
```
Comparas el nuevo score con el inicial. ¡Deberías ver mejoras!

### Automatizacion: Cada Lunes
GitHub Actions ejecuta la auditoria automáticamente.
Ves un commit nuevo con el reporte cada lunes a las 8 AM.

---

## 🎯 Métricas Clave

| Métrica | Target | Importancia |
|---------|--------|-------------|
| Performance (Mobile) | > 80 | 🔴 Crítica |
| SEO Score | > 85 | 🟠 Alta |
| Accesibilidad | 100% AA | 🟠 Alta |
| Alt Text Coverage | 100% | 🟡 Media |
| Tiempo Carga | < 2.5s | 🔴 Crítica |
| LCP (Core Web Vitals) | <= 2.5s | 🔴 Crítica |
| CLS (Core Web Vitals) | <= 0.1 | 🔴 Crítica |
| Responsividad | 100% | 🟠 Alta |

---

## 📚 Recursos Utiles

- [Google PageSpeed Insights](https://pagespeedonline.com)
- [Google Search Console](https://search.google.com/search-console)
- [WAVE (Accesibilidad)](https://wave.webaim.org)
- [Axe DevTools](https://www.deque.com/axe/devtools/)
- [Lighthouse Docs](https://developers.google.com/web/tools/lighthouse)
- [WCAG 2.1 Guidelines](https://www.w3.org/WAI/WCAG21/quickref/)

---

## 🆘 Troubleshooting

### "Error: lighthouse not found"
```bash
npm install
```

### "Error: GOOGLE_API_KEY not configured"
Asegúrate de que el archivo `.env` existe y tiene:
```
GOOGLE_API_KEY=tu_api_key
```

### "Error: Chrome not found"
```bash
npx puppeteer browsers install chrome
```

### Los reportes HTML no se generan
Verifica que exista la carpeta:
```bash
mkdir -p monitoring/reports
```

---

## 📞 Soporte

Para preguntas sobre:
- **SEO**: Ver `docs/seo-checklist.md`
- **Accesibilidad**: Ver `docs/accessibility-checklist.md`
- **Imagenes**: Ver `docs/image-guidelines.md`
- **Google APIs**: Ver `docs/setup-api-keys.md`

---

## 📅 Cronograma Recomendado

| Dia | Tarea |
|-----|-------|
| Lunes 8 AM | ✅ Auditoria automática (GitHub Actions) |
| Lunes 9 AM | 📊 Revisar reporte HTML |
| Lunes 10 AM | 📋 Revisar checklists manuales |
| Martes-Viernes | 🔧 Implementar mejoras |
| Proximo Lunes | 📈 Comparar metricas |

---

## ✅ Checklist Inicial

- [x] Sistema de auditorias creado
- [x] Scripts de auditorias implementados
- [x] Generador de reportes HTML
- [x] GitHub Actions configurado
- [x] Documentacion completada
- [ ] Google APIs configuradas ✅ HECHO
- [ ] Primera auditoria ejecutada
- [ ] Reporte HTML revisado
- [ ] Mejoras priorizadas
- [ ] Automatizacion en produccion

---

## 🎉 ¡Listo!

Tu sistema de auditoría semanal está listo. Ejecuta:

```bash
npm run audit:full
```

Y veras el primer reporte en: `monitoring/reports/YYYY-MM-DD-report.html`

---

**Valsho Web Audit System** - Monitorea tu web, mejora tus metricas, crece tu negocio 📈
