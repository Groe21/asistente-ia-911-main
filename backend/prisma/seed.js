const { PrismaClient } = require('@prisma/client');
const bcrypt = require('bcryptjs');
const prisma = new PrismaClient();

async function main() {
  console.log('🌱 Seeding database...');

  // Crear usuarios
  const hashedPassword = await bcrypt.hash('Admin123!', 10);
  const admin = await prisma.user.upsert({
    where: { cedula: '0000000001' },
    update: {},
    create: {
      cedula: '0000000001',
      password: hashedPassword,
      nombre: 'Carlos',
      apellido: 'Administrador',
      role: 'ADMINISTRADOR'
    }
  });

  const medicoPass = await bcrypt.hash('Medico123!', 10);
  const medico = await prisma.user.upsert({
    where: { cedula: '0000000002' },
    update: {},
    create: {
      cedula: '0000000002',
      password: medicoPass,
      nombre: 'Carlos',
      apellido: 'Mendoza',
      role: 'MEDICO'
    }
  });

  const rescatistaPass = await bcrypt.hash('Rescatista123!', 10);
  await prisma.user.upsert({
    where: { cedula: '0000000003' },
    update: {},
    create: {
      cedula: '0000000003',
      password: rescatistaPass,
      nombre: 'Ana',
      apellido: 'García',
      role: 'RESCATISTA'
    }
  });

  // Crear pacientes de ejemplo
  const patient1 = await prisma.patient.upsert({
    where: { code: 'EMG-001' },
    update: {},
    create: {
      code: 'EMG-001',
      name: 'María González Rodríguez',
      age: 34,
      gender: 'Femenino',
      bloodType: 'O+',
      contactNumber: '+34 612 345 678',
      emergencyContact: 'Juan González - Esposo - +34 698 765 432',
      allergies: 'Penicilina, Polen',
      conditions: 'Asma leve, Hipertensión controlada',
      symptoms: 'Dolor torácico intenso, dificultad respiratoria, sudoración excesiva',
      urgencyLevel: 'CRITICO',
      status: 'EN_EVALUACION',
      registeredById: medico.id
    }
  });

  const patient2 = await prisma.patient.upsert({
    where: { code: 'EMG-002' },
    update: {},
    create: {
      code: 'EMG-002',
      name: 'Carlos Martín López',
      age: 67,
      gender: 'Masculino',
      bloodType: 'A+',
      symptoms: 'Confusión mental, debilidad en lado derecho, dificultad para hablar',
      urgencyLevel: 'CRITICO',
      status: 'EN_TRATAMIENTO',
      registeredById: medico.id
    }
  });

  const patient3 = await prisma.patient.upsert({
    where: { code: 'EMG-003' },
    update: {},
    create: {
      code: 'EMG-003',
      name: 'Ana Fernández Castro',
      age: 28,
      gender: 'Femenino',
      bloodType: 'B-',
      symptoms: 'Fractura abierta en antebrazo derecho, sangrado moderado',
      urgencyLevel: 'ALTO',
      status: 'EN_TRATAMIENTO',
      registeredById: medico.id
    }
  });

  // Signos vitales
  await prisma.vitalSigns.createMany({
    data: [
      { patientId: patient1.id, heartRate: '110 bpm', bloodPressure: '145/95 mmHg', temperature: '37.2°C', oxygenSaturation: '94%' },
      { patientId: patient2.id, heartRate: '88 bpm', bloodPressure: '160/100 mmHg', temperature: '36.8°C', oxygenSaturation: '96%' },
      { patientId: patient3.id, heartRate: '95 bpm', bloodPressure: '120/80 mmHg', temperature: '36.5°C', oxygenSaturation: '98%' }
    ],
    skipDuplicates: true
  });

  // Análisis de IA simulados
  const analysis1 = await prisma.aIAnalysis.create({
    data: {
      patientId: patient1.id,
      diagnosis: 'Posible infarto agudo de miocardio',
      confidence: 92,
      recommendedAction: 'Traslado inmediato a UCI',
      riskFactors: ['Antecedentes familiares de cardiopatía', 'Estrés laboral elevado'],
      reasoning: 'La presentación clínica con dolor torácico irradiado, sudoración y disnea es altamente sugestiva de SCA.',
      symptoms: {
        create: [
          { name: 'Dolor Torácico Agudo', severity: 'Crítico', confidence: 95, category: 'Cardiovascular', description: 'Dolor torácico de características anginosas' },
          { name: 'Disnea', severity: 'Alto', confidence: 88, category: 'Respiratorio', description: 'Dificultad respiratoria asociada' }
        ]
      }
    }
  });

  const analysis2 = await prisma.aIAnalysis.create({
    data: {
      patientId: patient2.id,
      diagnosis: 'Probable accidente cerebrovascular',
      confidence: 89,
      recommendedAction: 'Protocolo de ictus activado',
      riskFactors: ['Hipertensión arterial', 'Edad avanzada', 'Diabetes mellitus'],
      reasoning: 'Déficit neurológico focal de inicio brusco con afasia y hemiparesia derecha.',
      symptoms: {
        create: [
          { name: 'Confusión Mental', severity: 'Crítico', confidence: 91, category: 'Neurológico', description: 'Alteración del nivel de consciencia' },
          { name: 'Hemiparesia', severity: 'Crítico', confidence: 87, category: 'Neurológico', description: 'Debilidad en hemicuerpo derecho' }
        ]
      }
    }
  });

  // Historial de casos
  await prisma.caseEntry.createMany({
    data: [
      { type: 'registro', title: 'Nuevo paciente registrado', description: 'María González ha sido registrada con síntomas de dolor torácico.', urgencyLevel: 'CRITICO', patientId: patient1.id, userId: medico.id },
      { type: 'analisis_ia', title: 'Análisis de IA completado', description: 'Diagnóstico: Posible infarto agudo de miocardio (92% confianza)', urgencyLevel: 'CRITICO', patientId: patient1.id, userId: medico.id },
      { type: 'intervencion', title: 'Protocolo de emergencia activado', description: 'Se ha activado el protocolo de emergencia cardíaca.', urgencyLevel: 'CRITICO', patientId: patient1.id, userId: medico.id },
      { type: 'registro', title: 'Nuevo paciente registrado', description: 'Carlos Martín ha sido registrado con síntomas neurológicos.', urgencyLevel: 'CRITICO', patientId: patient2.id, userId: medico.id },
      { type: 'analisis_ia', title: 'Análisis de IA completado', description: 'Diagnóstico: Probable ACV (89% confianza)', urgencyLevel: 'CRITICO', patientId: patient2.id, userId: medico.id },
      { type: 'registro', title: 'Nuevo paciente registrado', description: 'Ana Fernández registrada con fractura abierta.', urgencyLevel: 'ALTO', patientId: patient3.id, userId: medico.id }
    ]
  });

  console.log('✅ Seed completado exitosamente');
  console.log(`   - 3 usuarios creados`);
  console.log(`   - 3 pacientes creados`);
  console.log(`   - 2 análisis de IA creados`);
  console.log(`   - 6 entradas de historial creadas`);
}

main()
  .catch((e) => {
    console.error('❌ Error en seed:', e);
    process.exit(1);
  })
  .finally(() => prisma.$disconnect());
