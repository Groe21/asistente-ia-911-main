const GROQ_API_URL = 'https://api.groq.com/openai/v1/chat/completions';
const AI_MODEL = 'llama-3.3-70b-versatile';

const SYSTEM_PROMPT = `Eres un asistente de apoyo médico y operativo para recepcionistas, auxiliares y personal de salud del sistema IA-911.
Tu función es ayudar a analizar síntomas, priorizar urgencias, organizar información clínica y responder preguntas de apoyo para la atención inicial.

IMPORTANTE: Este es un sistema de APOYO y ENTRENAMIENTO. No reemplaza diagnósticos médicos reales, pero sí ayuda a razonar, priorizar y estructurar la información de forma útil para el personal.

Cuando recibas información de un paciente, debes responder ÚNICAMENTE con un JSON válido (sin markdown, sin \`\`\`json) con esta estructura exacta:

{
  "diagnosis": "Diagnóstico principal probable",
  "confidence": 85,
  "urgencyLevel": "CRITICO|ALTO|MODERADO|BAJO",
  "recommendedAction": "Acción inmediata recomendada",
  "reasoning": "Explicación del razonamiento clínico",
  "riskFactors": ["Factor 1", "Factor 2"],
  "symptoms": [
    {
      "name": "Nombre del síntoma",
      "severity": "Crítico|Alto|Moderado|Bajo",
      "confidence": 90,
      "category": "Cardiovascular|Neurológico|Respiratorio|Traumatológico|Gastrointestinal|Sistémico|Otro",
      "description": "Descripción breve del síntoma analizado"
    }
  ]
}

Reglas:
- confidence: número entre 0 y 100
- urgencyLevel: solo CRITICO, ALTO, MODERADO o BAJO
- symptoms: analiza cada síntoma mencionado individualmente
- Considera que el usuario puede ser una recepcionista o personal de apoyo y prioriza respuestas claras, prácticas y orientadas a la acción
- Responde SOLO con el JSON, sin texto adicional ni formato markdown`;

async function callGroq(systemPrompt, userPrompt, maxTokens = 1536) {
  const apiKey = process.env.GROQ_API_KEY;
  if (!apiKey) return null;

  try {
    const response = await fetch(GROQ_API_URL, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${apiKey}`
      },
      body: JSON.stringify({
        model: AI_MODEL,
        messages: [
          { role: 'system', content: systemPrompt },
          { role: 'user', content: userPrompt }
        ],
        temperature: 0.3,
        max_tokens: maxTokens
      })
    });

    if (!response.ok) {
      const errBody = await response.text();
      throw new Error(`Groq API error ${response.status}: ${errBody}`);
    }

    const data = await response.json();
    return data.choices?.[0]?.message?.content?.trim() || null;
  } catch (error) {
    console.error('Error en Groq:', error.message);
    return null;
  }
}

async function getLlmText(systemPrompt, userPrompt, maxTokens = 1536) {
  const groqText = await callGroq(systemPrompt, userPrompt, maxTokens);
  if (groqText) return { text: groqText, provider: 'groq' };

  return { text: null, provider: null };
}

async function analyzePatient(patientData) {
  try {
    const prompt = `Analiza al siguiente paciente de emergencia:

Nombre: ${patientData.name}
Edad: ${patientData.age} años
Género: ${patientData.gender}
Síntomas reportados: ${patientData.symptoms}
${patientData.allergies ? `Alergias: ${patientData.allergies}` : ''}
${patientData.conditions ? `Condiciones previas: ${patientData.conditions}` : ''}
${patientData.bloodType ? `Tipo de sangre: ${patientData.bloodType}` : ''}

Genera el análisis médico de emergencia en formato JSON.`;

    const llmResponse = await getLlmText(SYSTEM_PROMPT, prompt, 2048);
    const responseText = llmResponse?.text;

    if (!responseText) {
      console.warn('⚠️ No hay clave de IA configurada, usando análisis de respaldo');
      return generateFallbackAnalysis(patientData);
    }

    const cleanJson = responseText
      .replace(/^```json\s*/i, '')
      .replace(/^```\s*/i, '')
      .replace(/\s*```$/i, '')
      .trim();

    const analysis = JSON.parse(cleanJson);

    if (!analysis.diagnosis || !analysis.confidence || !analysis.urgencyLevel) {
      throw new Error('Respuesta de IA incompleta');
    }

    return {
      diagnosis: analysis.diagnosis,
      confidence: Math.min(100, Math.max(0, analysis.confidence)),
      urgencyLevel: ['CRITICO', 'ALTO', 'MODERADO', 'BAJO'].includes(analysis.urgencyLevel) 
        ? analysis.urgencyLevel : 'MODERADO',
      recommendedAction: analysis.recommendedAction || 'Evaluación médica requerida',
      reasoning: analysis.reasoning || '',
      riskFactors: analysis.riskFactors || [],
      symptoms: (analysis.symptoms || []).map(s => ({
        name: s.name,
        severity: s.severity || 'Moderado',
        confidence: Math.min(100, Math.max(0, s.confidence || 50)),
        category: s.category || 'Otro',
        description: s.description || ''
      })),
      modelVersion: llmResponse.provider === 'groq'
        ? `groq-${AI_MODEL}`
        : 'fallback-v1.0'
    };
  } catch (error) {
    console.error('Error en análisis de IA:', error.message);
    return generateFallbackAnalysis(patientData);
  }
}

// Análisis básico de respaldo cuando Groq no está disponible
function generateFallbackAnalysis(patientData) {
  const symptoms = patientData.symptoms.toLowerCase();
  
  let urgencyLevel = 'MODERADO';
  let diagnosis = 'Evaluación médica requerida';
  let confidence = 45;
  let recommendedAction = 'Evaluación clínica completa';

  // Reglas básicas de urgencia por palabras clave
  const critical = ['infarto', 'paro', 'inconsciente', 'no respira', 'hemorragia', 'convulsión', 'shock'];
  const high = ['fractura', 'sangrado', 'dolor torácico', 'dificultad respiratoria', 'quemadura grave'];
  const moderate = ['fiebre alta', 'dolor severo', 'vómitos', 'mareo', 'cefalea intensa'];

  if (critical.some(k => symptoms.includes(k))) {
    urgencyLevel = 'CRITICO';
    diagnosis = 'Emergencia médica - Requiere atención inmediata';
    confidence = 70;
    recommendedAction = 'Activar protocolo de emergencia inmediato';
  } else if (high.some(k => symptoms.includes(k))) {
    urgencyLevel = 'ALTO';
    diagnosis = 'Condición urgente que requiere evaluación prioritaria';
    confidence = 60;
    recommendedAction = 'Evaluación médica urgente';
  } else if (moderate.some(k => symptoms.includes(k))) {
    urgencyLevel = 'MODERADO';
    diagnosis = 'Condición que requiere evaluación médica';
    confidence = 55;
    recommendedAction = 'Evaluación médica programada';
  } else {
    urgencyLevel = 'BAJO';
    diagnosis = 'Síntomas leves - observación recomendada';
    confidence = 50;
    recommendedAction = 'Observación y seguimiento';
  }

  return {
    diagnosis,
    confidence,
    urgencyLevel,
    recommendedAction,
    reasoning: 'Análisis generado por reglas básicas (modelo de IA no disponible). Configure GROQ_API_KEY para análisis avanzado.',
    riskFactors: ['Análisis limitado sin modelo de IA'],
    symptoms: [{
      name: 'Síntomas reportados',
      severity: urgencyLevel === 'CRITICO' ? 'Crítico' : urgencyLevel === 'ALTO' ? 'Alto' : 'Moderado',
      confidence,
      category: 'Otro',
      description: patientData.symptoms
    }],
    modelVersion: 'fallback-v1.0'
  };
}

async function chatAboutPatient(patientData, message, conversationHistory = []) {
  const systemMessage = `Eres un asistente de apoyo clínico integrado al sistema IA-911 para recepcionistas, auxiliares y personal sanitario.
Tu audiencia puede ser personal de recepción, apoyo y salud que necesita orientación práctica para entender el caso y priorizar la atención.

CONTEXTO DEL PACIENTE ACTIVO:
- Nombre: ${patientData.name}
- Edad: ${patientData.age} años
- Género: ${patientData.gender}
- Síntomas: ${patientData.symptoms}
- Alergias: ${patientData.allergies || 'Ninguna conocida'}
- Condiciones previas: ${patientData.conditions || 'Ninguna conocida'}
- Tipo de sangre: ${patientData.bloodType || 'No registrado'}

INSTRUCCIONES ESTRICTAS DE COMPORTAMIENTO:
1. Responde como un apoyo clínico útil y directo. Sé CONCISO, claro y práctico.
2. Tu audiencia puede incluir recepcionistas y personal de apoyo, por lo que evita jerga excesiva y explica lo esencial de forma comprensible.
3. Ayuda a priorizar urgencia, identificar datos faltantes, resumir el caso y sugerir pasos de acción inmediatos.
4. Cuando pregunten sobre medicamentos, da información directa y segura: indicaciones, interacciones con alergias o condiciones previas y contraindicaciones relevantes.
5. Si no tienes suficiente información clínica para dar una respuesta precisa, indica qué datos adicionales necesitas.
6. Estructura tus respuestas de forma práctica: resumen del caso, prioridad clínica, información clave y próximos pasos.
7. No inventes datos clínicos que no estén proporcionados.
8. Responde siempre en español.
9. Sé útil y accionable. Cada respuesta debe aportar valor para la atención y la organización del caso.`;

  try {
    const historyText = conversationHistory.slice(-10).map(m => `${m.role === 'user' ? 'Usuario' : 'Asistente'}: ${m.content}`).join('\n');
    const userPrompt = `Historial de conversación:\n${historyText}\n\nUsuario: ${message}`;
    const llmResponse = await getLlmText(systemMessage, userPrompt, 1536);

    return { reply: llmResponse.text || 'Lo siento, hubo un error al procesar tu consulta. Intenta de nuevo.' };
  } catch (error) {
    console.error('Error en chat IA:', error.message);
    return { reply: 'Lo siento, hubo un error al procesar tu consulta. Intenta de nuevo.' };
  }
}

async function generalChat(message, conversationHistory = [], patientsContext = '') {
  const systemMessage = `Eres el asistente de apoyo clínico principal del sistema IA-911.
Tu audiencia son recepcionistas, auxiliares y personal sanitario que necesitan orientación práctica para entender casos, priorizar urgencias y organizar la atención.

DATOS ACTUALES DEL SISTEMA:
${patientsContext}

INSTRUCCIONES:
1. Eres el asistente general del sistema. Tienes acceso a TODOS los pacientes registrados.
2. Puedes dar resúmenes generales, estadísticas, listar pacientes por urgencia, comparar casos y apoyar decisiones operativas del personal.
3. Si preguntan por un paciente específico (por nombre o código), busca en los datos y responde con toda la información disponible de forma clara.
4. Sé DIRECTO y CONCISO. Tu audiencia puede ser personal de recepción o de salud, así que evita lenguaje excesivamente técnico cuando no sea necesario.
5. Usa terminología médica apropiada, pero mantén la respuesta comprensible para apoyo clínico y operativo.
6. Cuando pregunten "cuántos pacientes hay", da el número exacto con desglose por urgencia.
7. Si piden un resumen, estructura la respuesta: críticos primero, luego altos, moderados, bajos.
8. Responde siempre en español.
9. Sé útil, práctico y accionable en cada respuesta.`;

  try {
    const historyText = conversationHistory.slice(-10).map(m => `${m.role === 'user' ? 'Usuario' : 'Asistente'}: ${m.content}`).join('\n');
    const userPrompt = `Historial de conversación:\n${historyText}\n\nUsuario: ${message}`;
    const llmResponse = await getLlmText(systemMessage, userPrompt, 2048);

    return { reply: llmResponse.text || 'Lo siento, hubo un error al procesar tu consulta. Intenta de nuevo.' };
  } catch (error) {
    console.error('Error en chat general IA:', error.message);
    return { reply: 'Lo siento, hubo un error al procesar tu consulta. Intenta de nuevo.' };
  }
}

module.exports = { analyzePatient, chatAboutPatient, generalChat };
