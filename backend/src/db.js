const { PrismaClient } = require('@prisma/client');
const bcrypt = require('bcryptjs');

const buildDemoUsers = () => [
  {
    id: 'demo-user-1',
    cedula: '1234567890',
    nombre: 'Demo',
    apellido: 'Doctor',
    password: bcrypt.hashSync('demo123', 10),
    role: 'MEDICO',
    createdAt: new Date(),
    updatedAt: new Date()
  }
];

const buildDemoPatients = () => [
  {
    id: 'demo-patient-1',
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
    createdAt: new Date(),
    updatedAt: new Date(),
    aiAnalyses: [{ diagnosis: 'Síndrome coronario agudo probable', recommendedAction: 'Activar protocolo de emergencia' }],
    vitalSigns: []
  },
  {
    id: 'demo-patient-2',
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
    createdAt: new Date(),
    updatedAt: new Date(),
    aiAnalyses: [{ diagnosis: 'Crisis asmática moderada', recommendedAction: 'Oxigenoterapia y broncodilatador' }],
    vitalSigns: []
  }
];

const createDemoClient = () => {
  const state = {
    users: buildDemoUsers(),
    patients: buildDemoPatients()
  };

  const pick = (record, select) => {
    if (!select) return record;
    const result = {};
    Object.keys(select).forEach((key) => {
      if (record[key] !== undefined) result[key] = record[key];
    });
    return result;
  };

  return {
    $queryRaw: async () => [{ result: 1 }],
    $disconnect: async () => {},
    user: {
      findUnique: async ({ where }) => {
        if (where?.cedula) {
          return state.users.find((user) => user.cedula === where.cedula) || null;
        }
        if (where?.id) {
          return state.users.find((user) => user.id === where.id) || null;
        }
        return null;
      },
      create: async ({ data, select }) => {
        const created = {
          id: `user-${Date.now()}`,
          ...data,
          role: data.role || 'RESCATISTA',
          createdAt: new Date(),
          updatedAt: new Date()
        };
        state.users.push(created);
        return pick(created, select);
      }
    },
    patient: {
      findMany: async () => state.patients.map((patient) => ({ ...patient })),
      count: async () => state.patients.length,
      groupBy: async () => {
        const counts = state.patients.reduce((acc, patient) => {
          acc[patient.urgencyLevel] = (acc[patient.urgencyLevel] || 0) + 1;
          return acc;
        }, {});
        return Object.entries(counts).map(([urgencyLevel, count]) => ({ urgencyLevel, _count: { id: count } }));
      },
      findFirst: async () => state.patients[0] || null,
      findUnique: async ({ where }) => {
        if (where?.id) {
          return state.patients.find((patient) => patient.id === where.id) || null;
        }
        if (where?.code) {
          return state.patients.find((patient) => patient.code === where.code) || null;
        }
        return null;
      },
      create: async ({ data }) => {
        const created = {
          id: `patient-${Date.now()}`,
          ...data,
          status: 'EN_EVALUACION',
          createdAt: new Date(),
          updatedAt: new Date(),
          arrivalTime: new Date().toISOString(),
          aiAnalyses: [],
          vitalSigns: []
        };
        state.patients.push(created);
        return created;
      },
      update: async ({ where, data }) => {
        const index = state.patients.findIndex((patient) => patient.id === where.id || patient.code === where.code);
        if (index === -1) return null;
        const updated = { ...state.patients[index], ...data, updatedAt: new Date() };
        state.patients[index] = updated;
        return updated;
      }
    },
    aIAnalysis: {
      findMany: async () => [],
      create: async () => ({ id: `analysis-${Date.now()}`, createdAt: new Date() })
    },
    vitalSigns: {
      create: async () => ({ id: `vitals-${Date.now()}`, createdAt: new Date() })
    },
    caseEntry: {
      count: async () => 0,
      create: async () => ({ id: `entry-${Date.now()}`, createdAt: new Date() })
    }
  };
};

let prisma;

if (process.env.DATABASE_URL) {
  prisma = new PrismaClient();
} else {
  console.warn('⚠️ DATABASE_URL no configurada; usando modo demo en memoria');
  prisma = createDemoClient();
}

module.exports = prisma;
