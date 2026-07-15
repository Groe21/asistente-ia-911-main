require('dotenv').config({ path: require('path').resolve(__dirname, '../.env') });
const express = require('express');
const cors = require('cors');
const path = require('path');
const prisma = require('./db');

const authRoutes = require('./routes/auth');
const patientRoutes = require('./routes/patients');
const analysisRoutes = require('./routes/analysis');
const historyRoutes = require('./routes/history');
const chatRoutes = require('./routes/chat');

const app = express();
const PORT = process.env.PORT || 3001;

// Middleware
const allowedOrigins = [
  'http://localhost:3000', 'http://localhost:3001',
  'http://localhost:3002', 'http://localhost:5173',
  'https://asistente-ia-911-production.up.railway.app',
  process.env.FRONTEND_URL
].filter(Boolean);

app.use(cors({ origin: allowedOrigins }));
app.use(express.json());

// Rutas
app.use('/api/auth', authRoutes);
app.use('/api/patients', patientRoutes);
app.use('/api/analysis', analysisRoutes);
app.use('/api/history', historyRoutes);
app.use('/api/chat', chatRoutes);

// Health check
app.get('/api/health', async (req, res) => {
  try {
    await prisma.$queryRaw`SELECT 1`;
    res.json({ status: 'ok', db: 'connected', timestamp: new Date() });
  } catch {
    res.status(500).json({ status: 'error', db: 'disconnected' });
  }
});

// Servir frontend estático en producción
const frontendPath = path.join(__dirname, '../../dist');
const fs = require('fs');
const indexHtmlPath = path.join(frontendPath, 'index.html');

if (fs.existsSync(indexHtmlPath)) {
  app.use(express.static(frontendPath));
  // Todas las rutas no-API sirven el index.html (SPA)
  app.get('*', (req, res) => {
    res.sendFile(indexHtmlPath);
  });
  console.log('📦 Sirviendo frontend desde dist/');
} else {
  app.get('*', (req, res) => {
    if (!req.path.startsWith('/api')) {
      res.status(503).json({ error: 'Frontend no disponible. Ejecuta npm run build.' });
    }
  });
  console.log('⚠️  dist/index.html no encontrado - solo API disponible');
}

// Iniciar servidor
app.listen(PORT, '0.0.0.0', () => {
  console.log(`✅ Backend corriendo en 0.0.0.0:${PORT}`);
  console.log(`📋 Health check: http://localhost:${PORT}/api/health`);
});
