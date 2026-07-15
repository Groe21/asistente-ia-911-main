const express = require('express');
const prisma = require('../db');
const auth = require('../middleware/auth');

const router = express.Router();

// GET /api/history — Historial con filtros
router.get('/', auth, async (req, res) => {
  try {
    const { type, urgencyLevel, search, startDate, endDate } = req.query;
    const where = {};

    if (type && type !== 'todos') where.type = type;
    if (urgencyLevel && urgencyLevel !== 'todos') where.urgencyLevel = urgencyLevel.toUpperCase();
    if (search) {
      where.OR = [
        { title: { contains: search, mode: 'insensitive' } },
        { description: { contains: search, mode: 'insensitive' } }
      ];
    }
    if (startDate || endDate) {
      where.createdAt = {};
      if (startDate) where.createdAt.gte = new Date(startDate);
      if (endDate) where.createdAt.lte = new Date(endDate);
    }

    const entries = await prisma.caseEntry.findMany({
      where,
      include: {
        patient: { select: { id: true, code: true, name: true } },
        user: { select: { id: true, nombre: true, apellido: true } }
      },
      orderBy: { createdAt: 'desc' },
      take: 100
    });

    res.json(entries);
  } catch (error) {
    res.status(500).json({ error: 'Error al obtener historial' });
  }
});

// GET /api/history/stats — Estadísticas del historial
router.get('/stats', auth, async (req, res) => {
  try {
    const [totalCasos, analisisCompletados, casosCriticos, intervenciones] = await Promise.all([
      prisma.caseEntry.count(),
      prisma.caseEntry.count({ where: { type: 'analisis_ia' } }),
      prisma.caseEntry.count({ where: { urgencyLevel: 'CRITICO' } }),
      prisma.caseEntry.count({ where: { type: 'intervencion' } })
    ]);

    res.json({
      totalCasos,
      analisisCompletados,
      casosCriticos,
      intervencionesMedicas: intervenciones
    });
  } catch (error) {
    res.status(500).json({ error: 'Error al obtener estadísticas' });
  }
});

// POST /api/history — Crear entrada manual
router.post('/', auth, async (req, res) => {
  try {
    const { type, title, description, urgencyLevel, patientId, details } = req.body;

    const entry = await prisma.caseEntry.create({
      data: {
        type,
        title,
        description,
        urgencyLevel,
        details,
        patientId,
        userId: req.user.id
      }
    });

    res.status(201).json(entry);
  } catch (error) {
    res.status(500).json({ error: 'Error al crear entrada' });
  }
});

module.exports = router;
