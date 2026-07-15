const express = require('express');
const prisma = require('../db');
const auth = require('../middleware/auth');
const { analyzePatient } = require('../services/aiService');

const router = express.Router();

// GET /api/patients — Listar pacientes con filtros
router.get('/', auth, async (req, res) => {
  try {
    const { urgencyLevel, status, search } = req.query;
    const where = {};

    if (urgencyLevel && urgencyLevel !== 'todos') {
      where.urgencyLevel = urgencyLevel.toUpperCase();
    }
    if (status && status !== 'todos') {
      where.status = status.toUpperCase().replace(/ /g, '_');
    }
    if (search) {
      where.OR = [
        { name: { contains: search, mode: 'insensitive' } },
        { code: { contains: search, mode: 'insensitive' } },
        { symptoms: { contains: search, mode: 'insensitive' } }
      ];
    }

    const patients = await prisma.patient.findMany({
      where,
      include: {
        aiAnalyses: { orderBy: { processedAt: 'desc' }, take: 1 },
        vitalSigns: { orderBy: { recordedAt: 'desc' }, take: 1 }
      },
      orderBy: { arrivalTime: 'desc' }
    });

    res.json(patients);
  } catch (error) {
    res.status(500).json({ error: 'Error al obtener pacientes' });
  }
});

// GET /api/patients/stats — Métricas del dashboard
router.get('/stats', auth, async (req, res) => {
  try {
    const [total, criticos, enTratamiento, dadosDeAlta] = await Promise.all([
      prisma.patient.count(),
      prisma.patient.count({ where: { urgencyLevel: 'CRITICO' } }),
      prisma.patient.count({ where: { status: 'EN_TRATAMIENTO' } }),
      prisma.patient.count({ where: { status: 'DADO_DE_ALTA' } })
    ]);

    const urgencyDistribution = await prisma.patient.groupBy({
      by: ['urgencyLevel'],
      _count: { id: true }
    });

    res.json({
      totalPacientes: total,
      casosCriticos: criticos,
      enTratamiento,
      dadosDeAlta,
      urgencyDistribution: urgencyDistribution.map(d => ({
        level: d.urgencyLevel,
        count: d._count.id
      }))
    });
  } catch (error) {
    res.status(500).json({ error: 'Error al obtener estadísticas' });
  }
});

// GET /api/patients/:id — Detalle de un paciente
router.get('/:id', auth, async (req, res) => {
  try {
    const patient = await prisma.patient.findUnique({
      where: { id: req.params.id },
      include: {
        aiAnalyses: {
          include: { symptoms: true },
          orderBy: { processedAt: 'desc' }
        },
        vitalSigns: { orderBy: { recordedAt: 'desc' } },
        caseEntries: { orderBy: { createdAt: 'desc' } },
        registeredBy: { select: { id: true, nombre: true, apellido: true, role: true } }
      }
    });

    if (!patient) {
      return res.status(404).json({ error: 'Paciente no encontrado' });
    }

    res.json(patient);
  } catch (error) {
    res.status(500).json({ error: 'Error al obtener paciente' });
  }
});

// POST /api/patients — Registrar nuevo paciente
router.post('/', auth, async (req, res) => {
  try {
    const {
      name, age, gender, bloodType, contactNumber,
      emergencyContact, allergies, conditions, symptoms,
      urgencyLevel, vitalSigns
    } = req.body;

    // Generar código secuencial
    const lastPatient = await prisma.patient.findFirst({
      orderBy: { createdAt: 'desc' },
      select: { code: true }
    });
    const nextNum = lastPatient
      ? parseInt(lastPatient.code.split('-')[1]) + 1
      : 1;
    const code = `EMG-${String(nextNum).padStart(3, '0')}`;

    const patient = await prisma.patient.create({
      data: {
        code,
        name,
        age: parseInt(age),
        gender,
        bloodType,
        contactNumber,
        emergencyContact,
        allergies,
        conditions,
        symptoms,
        urgencyLevel: urgencyLevel.toUpperCase(),
        registeredById: req.user.id
      }
    });

    // Guardar signos vitales si se proporcionan
    if (vitalSigns) {
      await prisma.vitalSigns.create({
        data: {
          patientId: patient.id,
          heartRate: vitalSigns.heartRate,
          bloodPressure: vitalSigns.bloodPressure,
          temperature: vitalSigns.temperature,
          oxygenSaturation: vitalSigns.oxygenSaturation
        }
      });
    }

    // Crear entrada en historial
    await prisma.caseEntry.create({
      data: {
        type: 'registro',
        title: 'Nuevo paciente registrado',
        description: `${name} ha sido registrado con síntomas: ${symptoms}`,
        urgencyLevel: urgencyLevel.toUpperCase(),
        patientId: patient.id,
        userId: req.user.id
      }
    });

    // Disparar análisis de IA automáticamente (en background)
    analyzePatient({
      name, age: parseInt(age), gender, symptoms,
      allergies, conditions, bloodType
    }).then(async (aiResult) => {
      try {
        await prisma.aIAnalysis.create({
          data: {
            patientId: patient.id,
            diagnosis: aiResult.diagnosis,
            confidence: aiResult.confidence,
            recommendedAction: aiResult.recommendedAction,
            riskFactors: aiResult.riskFactors,
            reasoning: aiResult.reasoning,
            modelVersion: aiResult.modelVersion,
            symptoms: {
              create: aiResult.symptoms.map(s => ({
                name: s.name,
                severity: s.severity,
                confidence: s.confidence,
                category: s.category,
                description: s.description || ''
              }))
            }
          }
        });

        await prisma.patient.update({
          where: { id: patient.id },
          data: { urgencyLevel: aiResult.urgencyLevel }
        });

        await prisma.caseEntry.create({
          data: {
            type: 'analisis_ia',
            title: 'Análisis de IA completado',
            description: `Diagnóstico: ${aiResult.diagnosis} (Confianza: ${aiResult.confidence}%)`,
            urgencyLevel: aiResult.urgencyLevel,
            patientId: patient.id,
            userId: req.user.id
          }
        });

        console.log(`🧠 Análisis IA completado para ${patient.code}: ${aiResult.diagnosis}`);
      } catch (err) {
        console.error('Error guardando análisis automático:', err.message);
      }
    }).catch(err => console.error('Error en análisis automático:', err.message));

    res.status(201).json(patient);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Error al registrar paciente' });
  }
});

// PATCH /api/patients/:id — Actualizar estado
router.patch('/:id', auth, async (req, res) => {
  try {
    const { status, urgencyLevel } = req.body;
    const data = {};

    if (status) data.status = status.toUpperCase().replace(/ /g, '_');
    if (urgencyLevel) data.urgencyLevel = urgencyLevel.toUpperCase();

    const patient = await prisma.patient.update({
      where: { id: req.params.id },
      data
    });

    // Registrar cambio en historial
    await prisma.caseEntry.create({
      data: {
        type: 'cambio_estado',
        title: 'Estado actualizado',
        description: `Estado cambiado a: ${status || urgencyLevel}`,
        patientId: patient.id,
        userId: req.user.id
      }
    });

    res.json(patient);
  } catch (error) {
    res.status(500).json({ error: 'Error al actualizar paciente' });
  }
});

module.exports = router;
