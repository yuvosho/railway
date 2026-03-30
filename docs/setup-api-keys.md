# Configuracion de API Keys

## 1. Google PageSpeed Insights API

La API de PageSpeed Insights es gratuita y permite medir la velocidad de tu sitio.

### Pasos:
1. Ir a Google Cloud Console: console.cloud.google.com
2. Crear un proyecto nuevo o seleccionar uno existente
3. Habilitar "PageSpeed Insights API" en la biblioteca de APIs
4. Ir a Credenciales > Crear credenciales > API Key
5. Copiar la API Key

### Configuracion:
```bash
# En tu archivo .env
GOOGLE_API_KEY=tu_api_key_aqui
```

## 2. Google Search Console API (Opcional)

Permite obtener datos de busqueda: impresiones, clicks, CTR, posiciones.

### Pasos:
1. Ir a Google Cloud Console
2. Habilitar "Search Console API"
3. Crear credenciales OAuth 2.0
4. Configurar pantalla de consentimiento
5. Descargar credenciales JSON

### Configuracion:
```bash
# En tu archivo .env
GOOGLE_CLIENT_ID=tu_client_id
GOOGLE_CLIENT_SECRET=tu_client_secret
GOOGLE_REFRESH_TOKEN=tu_refresh_token
```

## 3. Variables de Entorno

Crea un archivo `.env` en la raiz del proyecto (copia de `.env.example`):

```bash
cp .env.example .env
```

Edita el archivo con tus valores reales.

**IMPORTANTE**: Nunca commits el archivo `.env` al repositorio.

## 4. GitHub Secrets (para GitHub Actions)

Para que la auditoria automatica funcione, configura los secrets en tu repositorio:

1. Ir a Settings > Secrets and variables > Actions
2. Agregar los siguientes secrets:
   - `WEBSITE_URL`: https://valsho.com.ar
   - `GOOGLE_API_KEY`: tu API key de PageSpeed

### Pasos en GitHub:
1. Ir a tu repositorio en GitHub
2. Click en "Settings" (pestana)
3. Menu lateral: "Secrets and variables" > "Actions"
4. Click en "New repository secret"
5. Agregar cada secret con su nombre y valor
