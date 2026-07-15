const express = require('express');
const prisma = require('../db');
const auth = require('../middleware/auth');
const { analyzePatient, chatAboutPatient } = require('../services/aiService');

const router = express.Router();

// GET /api/analysis/:patientId — Obtener análisis de un paciente
router.get('/:patientId', auth, async (req, res) => {
  try {
    const analyses = await prisma.aIAnalysis.findMany({
      where: { patientId: req.params.patientId },
      include: { symptoms: true },
      orderBy: { processedAt: 'desc' }
    });

    res.json(analyses);
  } catch (error) {
    res.status(500).json({ error: 'Error al obtener análisis' });
  }
});

// POST /api/analysis/:patientId/run — Ejecutar análisis de IA sobre un paciente
router.post('/:patientId/run', auth, async (req, res) => {
  try {
    const { patientId } = req.params;

    // Obtener datos del paciente
    const patient = await prisma.patient.findUnique({
      where: { id: patientId },
      include: { vitalSigns: { orderBy: { recordedAt: 'desc' }, take: 1 } }
    });

    if (!patient) {
      return res.status(404).json({ error: 'Paciente no encontrado' });
    }

    // Ejecutar análisis de IA
    const aiResult = await analyzePatient({
      name: patient.name,
      age: patient.age,
      gender: patient.gender,
      symptoms: patient.symptoms,
      allergies: patient.allergies,
      conditions: patient.conditions,
      bloodType: patient.bloodType
    });

    // Guardar resultado en BD
    const analysis = await prisma.aIAnalysis.create({
      data: {
        patientId,
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
      },
      include: { symptoms: true }
    });

    // Actualizar nivel de urgencia del paciente según la IA
    await prisma.patient.update({
      where: { id: patientId },
      data: { urgencyLevel: aiResult.urgencyLevel }
    });

    // Registrar en historial
    await prisma.caseEntry.create({
      data: {
        type: 'analisis_ia',
        title: 'Análisis de IA completado',
        description: `Diagnóstico: ${aiResult.diagnosis} (Confianza: ${aiResult.confidence}%) — Modelo: ${aiResult.modelVersion}`,
        urgencyLevel: aiResult.urgencyLevel,
        patientId,
        userId: req.user.id,
        details: {
          confidence: aiResult.confidence,
          model: aiResult.modelVersion,
          reasoning: aiResult.reasoning
        }
      }
    });

    res.status(201).json(analysis);
  } catch (error) {
    console.error('Error en análisis de IA:', error);
    res.status(500).json({ error: 'Error al ejecutar análisis de IA' });
  }
});

// POST /api/analysis/:patientId — Guardar resultado de análisis manual
router.post('/:patientId', auth, async (req, res) => {
  try {
    const { patientId } = req.params;
    const {
      diagnosis, confidence, recommendedAction,
      riskFactors, reasoning, symptoms
    } = req.body;

    const analysis = await prisma.aIAnalysis.create({
      data: {
        patientId,
        diagnosis,
        confidence,
        recommendedAction,
        riskFactors: riskFactors || [],
        reasoning,
        symptoms: symptoms ? {
          create: symptoms.map(s => ({
            name: s.name,
            severity: s.severity,
            confidence: s.confidence,
            category: s.category,
            description: s.description || ''
          }))
        } : undefined
      },
      include: { symptoms: true }
    });

    // Registrar en historial
    await prisma.caseEntry.create({
      data: {
        type: 'analisis_ia',
        title: 'Análisis de IA completado',
        description: `Diagnóstico: ${diagnosis} (Confianza: ${confidence}%)`,
        urgencyLevel: confidence > 80 ? 'CRITICO' : confidence > 60 ? 'ALTO' : 'MODERADO',
        patientId,
        userId: req.user.id
      }
    });

    res.status(201).json(analysis);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Error al guardar análisis' });
  }
});

// POST /api/analysis/:patientId/chat — Chat con IA sobre un paciente
router.post('/:patientId/chat', auth, async (req, res) => {
  try {
    const { patientId } = req.params;
    const { message, conversationHistory } = req.body;

    if (!message || typeof message !== 'string' || message.trim().length === 0) {
      return res.status(400).json({ error: 'El mensaje es requerido' });
    }

    const patient = await prisma.patient.findUnique({
      where: { id: patientId }
    });

    if (!patient) {
      return res.status(404).json({ error: 'Paciente no encontrado' });
    }

    const result = await chatAboutPatient(
      {
        name: patient.name,
        age: patient.age,
        gender: patient.gender,
        symptoms: patient.symptoms,
        allergies: patient.allergies,
        conditions: patient.conditions,
        bloodType: patient.bloodType
      },
      message.trim(),
      conversationHistory || []
    );

    res.json(result);
  } catch (error) {
    console.error('Error en chat IA:', error);
    res.status(500).json({ error: 'Error al procesar la consulta' });
  }
});

module.exports = router;
