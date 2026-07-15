const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();

async function main() {
  console.log('🔥 Insertando 10 pacientes de prueba de estrés...\n');

  // Obtener un usuario médico existente para asociar
  const medico = await prisma.user.findFirst({ where: { role: 'MEDICO' } });
  const registeredById = medico ? medico.id : null;

  // Obtener el último código EMG para continuar la secuencia
  const lastPatient = await prisma.patient.findFirst({
    orderBy: { code: 'desc' }
  });
  let nextNum = 4; // default
  if (lastPatient && lastPatient.code.startsWith('EMG-')) {
    nextNum = parseInt(lastPatient.code.replace('EMG-', '')) + 1;
  }

  const patients = [
    // === CRÍTICOS (3) ===
    {
      name: 'Roberto Alejandro Díaz Mejía',
      age: 58,
      gender: 'Masculino',
      bloodType: 'A-',
      contactNumber: '+1 809-555-0147',
      emergencyContact: 'Laura Díaz - Esposa - +1 809-555-0291',
      allergies: 'Aspirina, Sulfamidas',
      conditions: 'Diabetes mellitus tipo 2, Hipertensión arterial, Obesidad grado II',
      symptoms: 'Dolor precordial opresivo irradiado a brazo izquierdo y mandíbula, diaforesis profusa, náuseas, disnea súbita, palidez generalizada',
      urgencyLevel: 'CRITICO',
      status: 'EN_EVALUACION',
      vitals: { heartRate: '125 bpm', bloodPressure: '180/110 mmHg', temperature: '36.9°C', oxygenSaturation: '88%' }
    },
    {
      name: 'Isabel Cristina Vargas Peña',
      age: 45,
      gender: 'Femenino',
      bloodType: 'O-',
      contactNumber: '+1 809-555-0384',
      emergencyContact: 'Pedro Vargas - Hermano - +1 809-555-0512',
      allergies: 'Látex, Ibuprofeno, Mariscos',
      conditions: 'Lupus eritematoso sistémico, Nefritis lúpica en seguimiento',
      symptoms: 'Convulsiones tónico-clónicas generalizadas de 4 minutos de duración, pérdida de consciencia, cianosis peribucal, mordedura de lengua, incontinencia urinaria',
      urgencyLevel: 'CRITICO',
      status: 'EN_EVALUACION',
      vitals: { heartRate: '138 bpm', bloodPressure: '90/55 mmHg', temperature: '38.8°C', oxygenSaturation: '82%' }
    },
    {
      name: 'Miguel Ángel Torres Santana',
      age: 72,
      gender: 'Masculino',
      bloodType: 'B+',
      contactNumber: '+1 809-555-0623',
      emergencyContact: 'Carmen Torres - Hija - +1 809-555-0744',
      allergies: 'Penicilina, Contraste yodado',
      conditions: 'EPOC severo, Fibrilación auricular crónica, Anticoagulación con Warfarina, ICC clase III',
      symptoms: 'Hemoptisis masiva con coágulos, disnea severa en reposo, taquipnea 32rpm, crepitantes bilaterales, edema en miembros inferiores, confusión mental aguda',
      urgencyLevel: 'CRITICO',
      status: 'EN_TRATAMIENTO',
      vitals: { heartRate: '142 bpm', bloodPressure: '85/50 mmHg', temperature: '37.6°C', oxygenSaturation: '76%' }
    },

    // === ALTOS (3) ===
    {
      name: 'Sofía Elena Ramírez Guzmán',
      age: 31,
      gender: 'Femenino',
      bloodType: 'AB+',
      contactNumber: '+1 809-555-0891',
      emergencyContact: 'Andrés Ramírez - Esposo - +1 809-555-0932',
      allergies: 'Metoclopramida',
      conditions: 'Embarazo de 32 semanas, Preeclampsia diagnosticada hace 2 semanas',
      symptoms: 'Cefalea frontal intensa persistente, visión borrosa con escotomas, dolor epigástrico tipo barra, edema facial y en manos, tensión arterial elevada, hiperreflexia',
      urgencyLevel: 'ALTO',
      status: 'EN_EVALUACION',
      vitals: { heartRate: '105 bpm', bloodPressure: '165/105 mmHg', temperature: '37.0°C', oxygenSaturation: '95%' }
    },
    {
      name: 'Fernando José Castillo Mora',
      age: 22,
      gender: 'Masculino',
      bloodType: 'O+',
      contactNumber: '+1 809-555-1045',
      emergencyContact: 'Rosa Mora - Madre - +1 809-555-1102',
      allergies: 'Ninguna conocida',
      conditions: 'Ninguna conocida',
      symptoms: 'Politraumatismo por accidente de motocicleta: trauma craneoencefálico con escala Glasgow 12, laceración profunda en muslo izquierdo con sangrado activo, deformidad en clavícula derecha, abrasiones múltiples',
      urgencyLevel: 'ALTO',
      status: 'EN_TRATAMIENTO',
      vitals: { heartRate: '112 bpm', bloodPressure: '100/65 mmHg', temperature: '36.3°C', oxygenSaturation: '93%' }
    },
    {
      name: 'Patricia Altagracia Medina Reyes',
      age: 55,
      gender: 'Femenino',
      bloodType: 'A+',
      contactNumber: '+1 809-555-1256',
      emergencyContact: 'Luis Medina - Hijo - +1 809-555-1308',
      allergies: 'Cefalosporinas, Dipirona',
      conditions: 'Cáncer de mama en remisión (quimioterapia hace 6 meses), Hipotiroidismo',
      symptoms: 'Fiebre de 39.5°C persistente por 3 días, neutropenia febril sospechada, dolor abdominal difuso, mucositis oral severa, astenia marcada, petequias en extremidades',
      urgencyLevel: 'ALTO',
      status: 'EN_EVALUACION',
      vitals: { heartRate: '118 bpm', bloodPressure: '95/60 mmHg', temperature: '39.5°C', oxygenSaturation: '94%' }
    },

    // === MODERADOS (2) ===
    {
      name: 'Diego Armando Herrera Vásquez',
      age: 40,
      gender: 'Masculino',
      bloodType: 'B-',
      contactNumber: '+1 809-555-1467',
      emergencyContact: 'María Vásquez - Esposa - +1 809-555-1523',
      allergies: 'Metamizol',
      conditions: 'Gastritis crónica, Hernia discal L4-L5',
      symptoms: 'Dolor lumbar agudo irradiado a pierna derecha tipo ciático, parestesias en pie derecho, dificultad para la marcha, dolor al toser y estornudar, Lasègue positivo',
      urgencyLevel: 'MODERADO',
      status: 'EN_EVALUACION',
      vitals: { heartRate: '88 bpm', bloodPressure: '135/85 mmHg', temperature: '36.7°C', oxygenSaturation: '98%' }
    },
    {
      name: 'Valentina María Peña Acosta',
      age: 8,
      gender: 'Femenino',
      bloodType: 'O+',
      contactNumber: '+1 809-555-1678',
      emergencyContact: 'Carmen Acosta - Madre - +1 809-555-1734',
      allergies: 'Amoxicilina (rash cutáneo)',
      conditions: 'Asma bronquial intermitente',
      symptoms: 'Crisis asmática moderada, sibilancias espiratorias difusas, tiraje intercostal leve, tos productiva con expectoración verdosa, saturación al límite, rinorrea purulenta',
      urgencyLevel: 'MODERADO',
      status: 'EN_TRATAMIENTO',
      vitals: { heartRate: '115 bpm', bloodPressure: '95/60 mmHg', temperature: '38.2°C', oxygenSaturation: '91%' }
    },

    // === BAJOS (2) ===
    {
      name: 'Alejandro David Núñez Bautista',
      age: 35,
      gender: 'Masculino',
      bloodType: 'A+',
      contactNumber: '+1 809-555-1890',
      emergencyContact: 'Sandra Bautista - Esposa - +1 809-555-1945',
      allergies: 'Ninguna conocida',
      conditions: 'Rinitis alérgica estacional',
      symptoms: 'Dolor de garganta de 2 días de evolución, odinofagia leve, congestión nasal, febrícula de 37.8°C, malestar general leve, sin dificultad respiratoria',
      urgencyLevel: 'BAJO',
      status: 'EN_EVALUACION',
      vitals: { heartRate: '78 bpm', bloodPressure: '120/78 mmHg', temperature: '37.8°C', oxygenSaturation: '99%' }
    },
    {
      name: 'Gabriela Lucía Jiménez Polanco',
      age: 27,
      gender: 'Femenino',
      bloodType: 'AB-',
      contactNumber: '+1 809-555-2056',
      emergencyContact: 'Jorge Jiménez - Padre - +1 809-555-2112',
      allergies: 'Polen, Ácaros',
      conditions: 'Migraña crónica con aura',
      symptoms: 'Cefalea hemicraneal pulsátil derecha de intensidad 6/10, fotofobia, náuseas leves sin vómitos, aura visual previa de 20 minutos, sin déficit neurológico focal',
      urgencyLevel: 'BAJO',
      status: 'EN_EVALUACION',
      vitals: { heartRate: '72 bpm', bloodPressure: '115/72 mmHg', temperature: '36.5°C', oxygenSaturation: '99%' }
    }
  ];

  for (let i = 0; i < patients.length; i++) {
    const p = patients[i];
    const code = `EMG-${String(nextNum + i).padStart(3, '0')}`;

    const created = await prisma.patient.create({
      data: {
        code,
        name: p.name,
        age: p.age,
        gender: p.gender,
        bloodType: p.bloodType,
        contactNumber: p.contactNumber,
        emergencyContact: p.emergencyContact,
        allergies: p.allergies,
        conditions: p.conditions,
        symptoms: p.symptoms,
        urgencyLevel: p.urgencyLevel,
        status: p.status,
        registeredById: registeredById
      }
    });

    // Insertar signos vitales
    await prisma.vitalSigns.create({
      data: {
        patientId: created.id,
        heartRate: p.vitals.heartRate,
        bloodPressure: p.vitals.bloodPressure,
        temperature: p.vitals.temperature,
        oxygenSaturation: p.vitals.oxygenSaturation
      }
    });

    // Insertar entrada en historial
    await prisma.caseEntry.create({
      data: {
        type: 'registro',
        title: 'Paciente ingresado por emergencia',
        description: `${p.name} ingresado con síntomas: ${p.symptoms.substring(0, 100)}...`,
        urgencyLevel: p.urgencyLevel,
        patientId: created.id,
        userId: registeredById
      }
    });

    const urgencyEmoji = { CRITICO: '🔴', ALTO: '🟠', MODERADO: '🟡', BAJO: '🟢' };
    console.log(`  ${urgencyEmoji[p.urgencyLevel]} ${code} | ${p.name.padEnd(40)} | ${p.urgencyLevel.padEnd(9)} | ${p.age} años`);
  }

  const total = await prisma.patient.count();
  console.log(`\n✅ 10 pacientes insertados exitosamente`);
  console.log(`📊 Total de pacientes en BD: ${total}`);
}

main()
  .catch((e) => {
    console.error('❌ Error:', e);
    process.exit(1);
  })
  .finally(() => prisma.$disconnect());
