# B2M – Back to Me v3.0

## Cambios en esta versión
- Idioma seleccionable al inicio (Español / English)
- 5 capas narrativas completas con contexto acumulativo
- Paywall movido al final de la capa 5 (después de la pregunta personal)
- Preview del Capítulo II: canción #1, programa de TV, líder político, titular, precios
- Inputs de ciudad, padres y pregunta libre como componentes aislados (sin lag)
- Soporte completo para usuarios que no conocieron a sus padres

## Deploy en Vercel

### 1. Sube a GitHub
Crea repo → sube todos estos archivos

### 2. Conecta Vercel
vercel.com → Add New Project → selecciona repo → Deploy

### 3. CRÍTICO — API Key
Vercel → Settings → Environment Variables:
- Key: `ANTHROPIC_API_KEY`
- Value: tu key de console.anthropic.com

Sin este paso la app NO genera historias.

### 4. Redeploy
Después de añadir la variable → Redeploy

## Desarrollo local
```bash
npm install
cp .env.example .env.local
# Edita .env.local con tu ANTHROPIC_API_KEY
npm run dev
# Abre http://localhost:3000
```
