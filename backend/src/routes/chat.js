const express = require('express');
const prisma = require('../db');
const auth = require('../middleware/auth');
const { generalChat } = require('../services/aiService');

const router = express.Router();

// POST /api/chat — Chat general con IA (acceso a todos los pacientes)
router.post('/', auth, async (req, res) => {
  try {
    const { message, conversationHistory } = req.body;

    if (!message || typeof message !== 'string' || message.trim().length === 0) {
      return res.status(400).json({ error: 'El mensaje es requerido' });
    }

    // Obtener todos los pacientes para dar contexto a la IA
    const patients = await prisma.patient.findMany({
      include: {
        vitalSigns: { orderBy: { recordedAt: 'desc' }, take: 1 },
        aiAnalyses: { orderBy: { processedAt: 'desc' }, take: 1 }
      },
      orderBy: [
        { urgencyLevel: 'asc' }, // CRITICO primero
        { arrivalTime: 'desc' }
      ]
    });

    // Construir contexto de pacientes para la IA
    const patientsContext = patients.map(p => {
      const vitals = p.vitalSigns[0];
      const lastAnalysis = p.aiAnalyses[0];
      return `- [${p.code}] ${p.name} | ${p.age} años | ${p.gender} | Urgencia: ${p.urgencyLevel} | Estado: ${p.status}
  Síntomas: ${p.symptoms}
  Alergias: ${p.allergies || 'Ninguna'} | Condiciones: ${p.conditions || 'Ninguna'} | Sangre: ${p.bloodType || 'N/R'}
  ${vitals ? `Vitales: FC ${vitals.heartRate}, TA ${vitals.bloodPressure}, T° ${vitals.temperature}, SpO2 ${vitals.oxygenSaturation}` : 'Sin vitales registrados'}
  ${lastAnalysis ? `Último Dx IA: ${lastAnalysis.diagnosis} (${lastAnalysis.confidence}% confianza)` : 'Sin análisis IA'}`;
    }).join('\n');

    const summary = `Total de pacientes: ${patients.length}
Críticos: ${patients.filter(p => p.urgencyLevel === 'CRITICO').length}
Altos: ${patients.filter(p => p.urgencyLevel === 'ALTO').length}
Moderados: ${patients.filter(p => p.urgencyLevel === 'MODERADO').length}
Bajos: ${patients.filter(p => p.urgencyLevel === 'BAJO').length}

LISTADO DE PACIENTES:
${patientsContext}`;

    const result = await generalChat(
      message.trim(),
      conversationHistory || [],
      summary
    );

    res.json(result);
  } catch (error) {
    console.error('Error en chat general:', error);
    res.status(500).json({ error: 'Error al procesar la consulta' });
  }
});

module.exports = router;
