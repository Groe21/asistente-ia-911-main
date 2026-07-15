# IA-911 Assist

Aplicación web para gestión de emergencias médicas con asistente de IA, panel de pacientes, historial clínico y análisis de urgencia.

## 🚀 Tecnologías

- Frontend: React + Vite + Tailwind CSS
- Backend: Node.js + Express
- Base de datos: Prisma (opcional, con modo demo si no hay DATABASE_URL)
- IA: Groq via OpenAI-compatible API

## 📋 Requisitos

- Node.js 18+
- npm

## 🔧 Instalación local

1. Clona el repositorio y entra a la carpeta:

```bash
cd asistente-ia-911
npm install
cd backend && npm install && cd ..
```

2. Crea un archivo .env en la raíz del proyecto con:

```env
PORT=3001
JWT_SECRET=tu_secreto
GROQ_API_KEY=tu_api_key
FRONTEND_URL=http://localhost:3000
VITE_API_URL=http://localhost:3001/api
```

3. Ejecuta el proyecto en modo desarrollo:

```bash
npm run dev
```

Esto levanta el frontend en Vite y el backend debe correr por separado con:

```bash
cd backend
npm run dev
```

## 🧪 Build de producción

```bash
npm run build
```

## ☁️ Despliegue en Vercel

Este proyecto está preparado para desplegarse en Vercel con:
- frontend servido desde Vite
- API bajo la ruta /api

### Variables de entorno en Vercel

Agrega estas variables en el panel de Vercel:

```env
PORT=3001
JWT_SECRET=tu_secreto
GROQ_API_KEY=tu_api_key
DATABASE_URL=tu_url_de_postgres_opcional
FRONTEND_URL=https://tu-dominio.vercel.app
VITE_API_URL=/api
```

### Pasos

1. Conecta el repositorio en Vercel.
2. Usa la carpeta raíz del proyecto como Root Directory.
3. Añade las variables de entorno anteriores.
4. Haz deploy.

## 🧠 Funcionalidades principales

- Login y registro de usuarios
- Panel de control con pacientes y métricas
- Historial de casos
- Chat de asistencia con IA
- Análisis de urgencia y recomendaciones

## 📁 Estructura principal

```text
backend/        # API Express
src/            # Frontend React
public/         # Assets estáticos
vercel.json     # Configuración para Vercel
```

