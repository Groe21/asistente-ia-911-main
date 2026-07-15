const DEMO_USERS_KEY = 'ia911_demo_users';
const DEMO_PATIENTS_KEY = 'ia911_demo_patients';

const defaultUsers = [
  {
    cedula: '1234567890',
    nombre: 'Demo',
    apellido: 'Doctor',
    password: 'demo123',
    role: 'MEDICO'
  }
];

const buildDemoPatients = () => [
  {
    id: 'demo-1',
    code: 'EMG-001',
    name: 'Carlos Mendoza',
    age: 48,
    gender: 'Masculino',
    bloodType: 'O+',
    allergies: 'Penicilina',
    conditions: 'Hipertensión',
    symptoms: 'Dolor torácico, disnea, diaforesis',
    urgencyLevel: 'CRITICO',
    status: 'EN_EVALUACION',
    arrivalTime: new Date().toISOString(),
    aiAnalyses: [{
      diagnosis: 'Síndrome coronario agudo probable',
      recommendedAction: 'Activar protocolo de emergencia y monitoreo continuo'
    }]
  },
  {
    id: 'demo-2',
    code: 'EMG-002',
    name: 'Ana López',
    age: 31,
    gender: 'Femenino',
    bloodType: 'A-',
    allergies: 'Ninguna',
    conditions: 'Asma',
    symptoms: 'Dificultad respiratoria y sibilancias',
    urgencyLevel: 'ALTO',
    status: 'EN_TRATAMIENTO',
    arrivalTime: new Date().toISOString(),
    aiAnalyses: [{
      diagnosis: 'Crisis asmática moderada',
      recommendedAction: 'Oxigenoterapia y broncodilatador inhalado'
    }]
  },
  {
    id: 'demo-3',
    code: 'EMG-003',
    name: 'Julián Pérez',
    age: 24,
    gender: 'Masculino',
    bloodType: 'B+',
    allergies: 'Ninguna',
    conditions: 'Ninguna',
    symptoms: 'Fiebre, dolor abdominal y náuseas',
    urgencyLevel: 'MODERADO',
    status: 'ESTABLE',
    arrivalTime: new Date().toISOString(),
    aiAnalyses: [{
      diagnosis: 'Gastroenteritis aguda',
      recommendedAction: 'Hidratación y observación clínica'
    }]
  },
  {
    id: 'demo-4',
    code: 'EMG-004',
    name: 'Marta Ruiz',
    age: 67,
    gender: 'Femenino',
    bloodType: 'AB+',
    allergies: 'Ibuprofeno',
    conditions: 'Diabetes',
    symptoms: 'Mareo leve y deshidratación',
    urgencyLevel: 'BAJO',
    status: 'DADO_DE_ALTA',
    arrivalTime: new Date().toISOString(),
    aiAnalyses: [{
      diagnosis: 'Síntomas leves sin alarma',
      recommendedAction: 'Seguimiento ambulatorio y reposo'
    }]
  }
];

const readStorage = (key, fallback) => {
  if (typeof window === 'undefined') return fallback;
  try {
    const value = localStorage.getItem(key);
    return value ? JSON.parse(value) : fallback;
  } catch {
    return fallback;
  }
};

const writeStorage = (key, value) => {
  if (typeof window === 'undefined') return;
  localStorage.setItem(key, JSON.stringify(value));
};

export const getDemoUsers = () => {
  const users = readStorage(DEMO_USERS_KEY, defaultUsers);
  return Array.isArray(users) ? users : defaultUsers;
};

export const loginDemoUser = (cedula, password) => {
  const normalizedCedula = String(cedula || '').trim();
  const normalizedPassword = String(password || '').trim();
  const users = getDemoUsers();
  const match = users.find((user) => user.cedula === normalizedCedula && user.password === normalizedPassword);

  if (!match) {
    return null;
  }

  return {
    user: {
      id: `demo-${match.cedula}`,
      cedula: match.cedula,
      nombre: match.nombre,
      apellido: match.apellido,
      role: match.role || 'MEDICO'
    },
    token: 'demo-token'
  };
};

export const registerDemoUser = ({ cedula, nombre, apellido, password }) => {
  const users = getDemoUsers();
  const normalizedCedula = String(cedula || '').trim();
  const exists = users.some((user) => user.cedula === normalizedCedula);

  if (exists) {
    return null;
  }

  const newUser = {
    cedula: normalizedCedula,
    nombre: String(nombre || '').trim(),
    apellido: String(apellido || '').trim(),
    password: String(password || '').trim(),
    role: 'RESCATISTA'
  };

  users.push(newUser);
  writeStorage(DEMO_USERS_KEY, users);

  return {
    user: {
      id: `demo-${normalizedCedula}`,
      cedula: newUser.cedula,
      nombre: newUser.nombre,
      apellido: newUser.apellido,
      role: newUser.role
    },
    token: 'demo-token'
  };
};

export const getDemoPatients = () => {
  const storedPatients = readStorage(DEMO_PATIENTS_KEY, null);
  if (storedPatients) {
    return storedPatients;
  }

  const patients = buildDemoPatients();
  writeStorage(DEMO_PATIENTS_KEY, patients);
  return patients;
};

const normalizeText = (text) => String(text || '')
  .normalize('NFD')
  .replace(/[\u0300-\u036f]/g, '')
  .toLowerCase();

const mapUrgency = (urgency) => {
  const map = { critico: 'Crítico', alto: 'Alto', moderado: 'Moderado', bajo: 'Bajo' };
  return map[urgency] || urgency;
};

const mapStatus = (status) => {
  const map = { en_evaluacion: 'En evaluación', en_tratamiento: 'En tratamiento', estable: 'Estable', dado_de_alta: 'Dado de alta' };
  return map[status] || status;
};

const buildPatientSummary = (patient) => {
  const diagnosis = patient?.aiAnalyses?.[0]?.diagnosis || 'Sin diagnóstico registrado';
  const action = patient?.aiAnalyses?.[0]?.recommendedAction || 'Seguimiento clínico';
  return `Paciente ${patient.name} (${patient.code}). Edad ${patient.age} años. Urgencia ${mapUrgency(patient.urgencyLevel.toLowerCase())}. Estado ${mapStatus(patient.status.toLowerCase())}. Síntomas: ${patient.symptoms}. Alergias: ${patient.allergies || 'Ninguna'}. Diagnóstico demo: ${diagnosis}. Recomendación: ${action}.`;
};

export const getDemoChatReply = (message) => {
  const lowerMessage = normalizeText(message);

  if (!lowerMessage.trim()) {
    return 'Estoy listo para ayudarte. Puedes preguntarme por pacientes, urgencias o un resumen general.';
  }

  if (lowerMessage.includes('hola') || lowerMessage.includes('buenos') || lowerMessage.includes('buenas') || lowerMessage.includes('como estas')) {
    return 'Estoy listo para apoyar la exposición. Puedo resumir pacientes, priorizar urgencias y responder preguntas sobre cualquier caso del sistema.';
  }

  const patients = getDemoPatients();
  const patientMatch = patients.find((patient) => {
    const normalizedName = normalizeText(patient.name);
    const normalizedCode = normalizeText(patient.code);
    return lowerMessage.includes(normalizedName) || lowerMessage.includes(normalizedCode) || normalizedName.split(' ').some((word) => lowerMessage.includes(word));
  });

  if (patientMatch) {
    if (lowerMessage.includes('alerg') || lowerMessage.includes('alergia') || lowerMessage.includes('comida')) {
      return `${buildPatientSummary(patientMatch)} Además, su alergia registrada es: ${patientMatch.allergies || 'ninguna'}.`;
    }

    if (lowerMessage.includes('accidente') || lowerMessage.includes('caida') || lowerMessage.includes('cayo') || lowerMessage.includes('escalera') || lowerMessage.includes('hospital')) {
      return `${buildPatientSummary(patientMatch)} En una caída o accidente, se debe valorar dolor, estabilidad hemodinámica y necesidad de observación clínica adicional.`;
    }

    return buildPatientSummary(patientMatch);
  }

  if (lowerMessage.includes('cuantos') || lowerMessage.includes('cuántos') || lowerMessage.includes('pacientes')) {
    return 'Actualmente hay 4 pacientes en seguimiento: 1 crítico, 1 alto, 1 moderado y 1 bajo.';
  }

  if (lowerMessage.includes('critico') || lowerMessage.includes('criticos') || lowerMessage.includes('nivel critico') || lowerMessage.includes('paciente critico')) {
    const criticalPatient = patients.find((patient) => patient.urgencyLevel === 'CRITICO') || patients[0];
    return `El paciente crítico en este momento es ${criticalPatient.name} (${criticalPatient.code}). ${criticalPatient.symptoms}.`;
  }

  if (lowerMessage.includes('resumen') || lowerMessage.includes('estado')) {
    return 'Resumen general: 1 caso crítico, 1 alto, 1 moderado y 1 bajo. El foco principal es el paciente Carlos Mendoza por dolor torácico y disnea.';
  }

  if (lowerMessage.includes('alerg') || lowerMessage.includes('alergia') || lowerMessage.includes('comida')) {
    return 'En el sistema demo, Marta Ruiz registra alergia a ibuprofeno. En general, se recomienda evitar ese medicamento y consultar el plan clínico.';
  }

  if (lowerMessage.includes('accidente') || lowerMessage.includes('caida') || lowerMessage.includes('cayo') || lowerMessage.includes('escalera') || lowerMessage.includes('hospital')) {
    return 'Si un paciente tuvo una caída y requiere hospitalización, se debe valorar traumatismo, dolor, mareo y estabilidad clínica antes de definir el manejo.';
  }

  if (lowerMessage.includes('dolor') || lowerMessage.includes('toracico') || lowerMessage.includes('corazon')) {
    return 'En caso de dolor torácico con diaphoresis y disnea, se considera una urgencia potencial y se prioriza evaluación rápida.';
  }

  return 'Puedo responder sobre cualquier paciente del sistema demo. Prueba preguntando por un nombre, por ejemplo: “háblame de Ana López” o “qué pasa con Carlos Mendoza”.';
};
