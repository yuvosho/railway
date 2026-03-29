# 📊 PLAN DE AUDITORÍA SEMANAL - VALSHO.COM.AR
## Versión Resumida

---

## 🎯 OBJETIVO
Crear un sistema automatizado que **cada lunes audite tu sitio web** (valsho.com.ar) en 6 áreas clave y genere un reporte con recomendaciones priorizadas para mejorar visitas y conversión.

---

## 📋 ¿QUÉ SE AUDITARÁ CADA SEMANA?

| Área | Qué se mide | Target |
|------|-------------|--------|
| **⚡ Velocidad** | Tiempo de carga, Core Web Vitals | < 2.5s en móvil |
| **🔍 SEO** | Meta tags, H1, keywords, schema | Top 5 en búsquedas |
| **🖼️ Imágenes** | Alt text, tamaño, formato (WebP) | 100% optimizado |
| **♿ Accesibilidad** | Contraste, navegación, labels | WCAG AA 100% |
| **🎨 Diseño Visual** | Responsive, CTA claros, UI/UX | Mobile-first |
| **💰 Conversión** | Botones, formularios, checkout | Zero friction |

---

## 🛠️ COMPONENTES DEL SISTEMA

### 1️⃣ **Scripts de Auditoría** (automatizados)
- `weekly-audit.js` → Ejecuta todas las pruebas
- `lighthouse-audit.js` → Performance + SEO + Accesibilidad
- `seo-audit.js` → Meta tags, keywords, estructura
- `image-audit.js` → Alt text, compresión, formatos
- Resultados guardados en JSON

### 2️⃣ **Generador de Reportes** (automático)
- `generate-report.js` → Crea HTML interactivo
- Incluye: métricas numéricas, gráficos, recomendaciones
- Se guardará en `/monitoring/reports/FECHA-report.html`

### 3️⃣ **GitHub Actions** (automatización)
- Se ejecuta automáticamente cada **lunes a las 8 AM**
- Corre los scripts
- Genera reporte
- Hace commit automático con resultados

### 4️⃣ **Checklists Manuales** (documentos)
- `seo-checklist.md` → Qué revisar manualmente
- `accessibility-checklist.md` → Estándares WCAG
- `image-guidelines.md` → Estándares de fotos

### 5️⃣ **Documentación**
- `README.md` → Cómo usar el sistema
- `setup-api-keys.md` → Configurar APIs (PageSpeed, Search Console)

---

## 📂 ESTRUCTURA DE CARPETAS

```
railway/
├── package.json                 # Dependencias npm
├── monitoring/
│   ├── weekly-audit.js         # Script principal
│   ├── generate-report.js      # Generador de reportes
│   ├── audits/
│   │   ├── lighthouse-audit.js
│   │   ├── seo-audit.js
│   │   ├── image-audit.js
│   │   └── accessibility-audit.js
│   ├── templates/
│   │   └── report.html         # Template del reporte
│   └── reports/                # Reportes generados
│       ├── 2026-03-31-report.html
│       └── 2026-04-07-report.html
├── docs/
│   ├── seo-checklist.md
│   ├── accessibility-checklist.md
│   ├── image-guidelines.md
│   └── setup-api-keys.md
├── .github/workflows/
│   └── weekly-audit.yml        # Automatización
└── .env.example                # Plantilla de credenciales
```

---

## ⚙️ CÓMO FUNCIONA

### Diagrama de Flujo
```
[Cada lunes 8 AM]
        ↓
[GitHub Actions ejecuta]
        ↓
[weekly-audit.js corre 6 auditorías]
        ↓
[Guarda resultados en JSON]
        ↓
[generate-report.js crea HTML interactivo]
        ↓
[Reporte guardado en /reports/]
        ↓
[Commit automático al repositorio]
        ↓
[Tú accedes a: /monitoring/reports/DATE-report.html]
```

### Ejemplo de Reporte
```
VALSHO.COM.AR - AUDITORÍA SEMANAL
Semana del 31 marzo - 6 abril 2026

📊 RESUMEN EJECUTIVO
- Velocidad (Lighthouse): 78/100 ⚠️
- SEO: 92/100 ✅
- Accesibilidad: 85/100 ⚠️
- Imágenes: 100% optimizadas ✅

🔴 PRIORIDAD ALTA (Esta semana)
1. Reducir CSS sin usar → +5 puntos velocidad
2. Aumentar contraste en botones → WCAG AA
3. Agregar alt text a 12 imágenes → SEO + A11y

🟡 PRIORIDAD MEDIA (Próximas 2 semanas)
1. Implementar lazy loading en galería
2. Meta description en 8 productos
3. Schema markup para reseñas

🟢 PRIORIDAD BAJA (Próximo mes)
1. Integrar chat en vivo
2. Testimonios de clientes
3. Blog posts SEO
```

---

## 🚀 FLUJO DE IMPLEMENTACIÓN

| Paso | Qué se hace | Tiempo |
|------|------------|--------|
| 1 | Crear estructura + package.json | 5 min |
| 2 | Escribir 4 scripts de auditoría | 60 min |
| 3 | Generador de reportes HTML | 30 min |
| 4 | Documentación y checklists | 20 min |
| 5 | Configurar GitHub Actions | 10 min |
| 6 | Commit y push al branch | 5 min |
| **TOTAL** | | **~2 horas** |

---

## 🔑 PUNTOS CLAVE

✅ **Automático**: Se ejecuta cada lunes, no necesitas hacer nada
✅ **Datos claros**: Reportes HTML con métricas numéricas
✅ **Accionable**: Recomendaciones priorizadas por impacto
✅ **Histórico**: Todos los reportes guardados = ver progreso
✅ **Integrado**: Usa APIs Google (PageSpeed Insights, Search Console)

---

## 📌 TECNOLOGÍAS

- **Node.js** (servidor)
- **Lighthouse** (auditoría de performance)
- **Puppeteer** (automatización de navegador)
- **Cheerio** (parsing de HTML)
- **GitHub Actions** (automatización semanal)

---

## ❓ PRÓXIMOS PASOS

1. ✅ Revisar este plan (lo estás haciendo)
2. ❓ **¿APRUEBAS ESTE ENFOQUE?** O ¿tienes cambios/preguntas?
3. Si apruebas → Implementar todos los scripts
4. Si tienes cambios → Dímelo y ajusto el plan

---

## 📞 PREGUNTAS FINALES

**¿Cuál es tu respuesta a estos puntos?**

- ¿Te parece bien que se ejecute automáticamente cada lunes?
- ¿Quieres que los reportes se envíen por email también?
- ¿Necesitas acceso a APIs de Google Search Console o solo PageSpeed Insights?
- ¿Hay algo que quieras agregar o cambiar?
