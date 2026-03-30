# 🔑 GUIA PASO A PASO - Configurar Google APIs

## Prerequisitos
- Cuenta de Google (Gmail)
- Acceso a Google Cloud Console (console.cloud.google.com)
- valsho.com.ar ya verificado en Google Search Console

---

## PARTE 1: Crear Proyecto en Google Cloud

### Paso 1: Ir a Google Cloud Console
1. Abre: https://console.cloud.google.com
2. Inicia sesión con tu cuenta de Google
3. En la parte superior, haz click en el selector de proyectos (donde dice "Select a project")
4. Click en "NEW PROJECT"
5. Nombre: `Valsho-Audit-System`
6. Haz click en "CREATE"
7. Espera a que se cree (puede tardar 1-2 minutos)

---

## PARTE 2: Habilitar PageSpeed Insights API

### Paso 1: Habilitar API
1. En Google Cloud Console, ve al proyecto que acabas de crear
2. En el menu lateral, click en "APIs & Services" > "Enabled APIs & services"
3. Click en "+ ENABLE APIS AND SERVICES"
4. Busca: "PageSpeed Insights API"
5. Click en el resultado
6. Click en "ENABLE"
7. Espera a que se habilite

---

## PARTE 3: Crear API Key

### Paso 1: Crear credencial
1. Ve a "APIs & Services" > "Credentials"
2. Click en "CREATE CREDENTIALS" > "API Key"
3. Se creara tu API Key (aparece en un popup)
4. **COPIA LA API KEY** (la necesitaras enseguida)
5. Click en "CLOSE"

### Paso 2: Restringir API Key (Seguridad)
1. Click en tu API Key recien creada
2. En "Application restrictions":
   - Selecciona "None"
   - O si quieres ser mas restrictivo: "Web applications" y agrega tu dominio valsho.com.ar
3. En "API restrictions":
   - Click en "Restrict key"
   - Busca y selecciona "PageSpeed Insights API"
   - Click en "SAVE"

---

## PARTE 4: Google Search Console API (Opcional pero recomendado)

### Paso 1: Habilitar API
1. Ve a "APIs & Services" > "Enabled APIs & services"
2. Click en "+ ENABLE APIS AND SERVICES"
3. Busca: "Google Search Console API"
4. Click en el resultado
5. Click en "ENABLE"

### Paso 2: Crear OAuth 2.0 Credentials
1. Ve a "APIs & Services" > "Credentials"
2. Click en "CREATE CREDENTIALS" > "OAuth client ID"
3. Si aparece "Configure OAuth consent screen":
   - Selecciona "External" como tipo de usuario
   - Click en "CREATE"
   - Rellena:
     - App name: `Valsho Audit`
     - User support email: tu email
     - Developer contact: tu email
   - Click en "SAVE AND CONTINUE"
   - (Puedes saltar los scopes opcionales)
   - Click en "SAVE AND CONTINUE"
   - Click en "BACK TO DASHBOARD"

4. Ahora crea el OAuth client ID:
   - Click en "CREATE CREDENTIALS" > "OAuth client ID"
   - Application type: "Desktop application"
   - Name: `Valsho Audit Desktop`
   - Click en "CREATE"
   - **COPIA EL CLIENT ID Y CLIENT SECRET** (necesitaras ambos)

### Paso 3: Obtener Refresh Token
1. Ve a: https://myaccount.google.com/permissions
2. Ve a "Apps and websites with account access"
3. Si aparece tu app "Valsho Audit", click en ella y desconecta (para empezar limpio)

4. Abre esta URL en tu navegador (REEMPLAZA TU_CLIENT_ID):
```
https://accounts.google.com/o/oauth2/v2/auth?client_id=TU_CLIENT_ID&redirect_uri=urn:ietf:wg:oauth:2.0:oob&response_type=code&scope=https://www.googleapis.com/auth/webmasters.readonly
```

5. Google te pedira que autorices la app
6. Click en "Allow"
7. Google te dara un CODIGO (authorization code)
8. **COPIA ESTE CODIGO**

9. Ahora intercambia el codigo por refresh token usando esta URL (REEMPLAZA):
```
https://oauth2.googleapis.com/token \
  -d client_id=TU_CLIENT_ID \
  -d client_secret=TU_CLIENT_SECRET \
  -d code=TU_AUTHORIZATION_CODE \
  -d grant_type=authorization_code \
  -d redirect_uri=urn:ietf:wg:oauth:2.0:oob
```

O usa este script en tu terminal:
```bash
curl -X POST https://oauth2.googleapis.com/token \
  -d "client_id=TU_CLIENT_ID" \
  -d "client_secret=TU_CLIENT_SECRET" \
  -d "code=TU_AUTHORIZATION_CODE" \
  -d "grant_type=authorization_code" \
  -d "redirect_uri=urn:ietf:wg:oauth:2.0:oob"
```

10. En la respuesta, busca "refresh_token"
11. **COPIA EL REFRESH TOKEN**

---

## RESUMEN: Que necesitas recopilar

Anota estos valores (los necesitaras enseguida):

```
GOOGLE_API_KEY = [Tu API Key de PageSpeed]
GOOGLE_CLIENT_ID = [Tu Client ID de OAuth]
GOOGLE_CLIENT_SECRET = [Tu Client Secret de OAuth]
GOOGLE_REFRESH_TOKEN = [Tu Refresh Token de Search Console]
```

---

## SIGUIENTE PASO

Proporciona estos 4 valores y configuraré automáticamente tu archivo `.env`
