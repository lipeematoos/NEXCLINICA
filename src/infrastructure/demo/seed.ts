// NEXCLÍNICA — Demo Mode Seed Data
// All data is fictional and deterministic for demo purposes
import { v4 as uuidv4 } from 'uuid';
import type {
  Patient, HealthcareProfessional, Specialty, Appointment,
  ClinicalEncounter, ClinicalEvolution, PatientMeasurement,
  ExamRecord, PatientDocument, NutritionAssessment, SystemUser,
  ClinicUnit, TimelineEvent
} from '../../domain/models';

// Fixed IDs for demo consistency
export const DEMO_IDS = {
  TENANT: 'tenant-001',
  UNIT: 'unit-001',
  USER_ADMIN: 'user-admin-001',
  USER_PROFESSIONAL: 'user-prof-001',
  USER_RECEPTION: 'user-rec-001',
  PROFESSIONAL_1: 'prof-001',
  PROFESSIONAL_2: 'prof-002',
  PROFESSIONAL_3: 'prof-003',
  SPECIALTY_NUTRITION: 'spec-nutrition',
  SPECIALTY_GENERAL: 'spec-general',
  SPECIALTY_PSYCHOLOGY: 'spec-psychology',
  SPECIALTY_PHYSIO: 'spec-physio',
  PATIENT_1: 'patient-001',
  PATIENT_2: 'patient-002',
  PATIENT_3: 'patient-003',
  PATIENT_4: 'patient-004',
  PATIENT_5: 'patient-005',
  PATIENT_6: 'patient-006',
  PATIENT_7: 'patient-007',
};

const now = new Date().toISOString();
const today = new Date().toISOString().split('T')[0];

// Helper to create dates relative to today
function daysFromNow(days: number): string {
  const d = new Date();
  d.setDate(d.getDate() + days);
  return d.toISOString().split('T')[0];
}

function dateTimeFromNow(days: number, hour: number, minute: number = 0): string {
  const d = new Date();
  d.setDate(d.getDate() + days);
  d.setHours(hour, minute, 0, 0);
  return d.toISOString();
}

// ============================================
// SPECIALTIES
// ============================================

export const seedSpecialties: Specialty[] = [
  {
    id: DEMO_IDS.SPECIALTY_NUTRITION,
    name: 'Nutrição',
    code: 'NUT',
    description: 'Atendimento nutricional e dietoterapia',
    appointmentDuration: 50,
    active: true,
    createdAt: now,
    updatedAt: now,
  },
  {
    id: DEMO_IDS.SPECIALTY_GENERAL,
    name: 'Clínica Geral',
    code: 'CLI',
    description: 'Atendimento clínico geral',
    appointmentDuration: 30,
    active: true,
    createdAt: now,
    updatedAt: now,
  },
  {
    id: DEMO_IDS.SPECIALTY_PSYCHOLOGY,
    name: 'Psicologia',
    code: 'PSI',
    description: 'Atendimento psicológico e psicoterapia',
    appointmentDuration: 50,
    active: true,
    createdAt: now,
    updatedAt: now,
  },
  {
    id: DEMO_IDS.SPECIALTY_PHYSIO,
    name: 'Fisioterapia',
    code: 'FIS',
    description: 'Atendimento fisioterapêutico',
    appointmentDuration: 45,
    active: true,
    createdAt: now,
    updatedAt: now,
  },
];

// ============================================
// UNITS
// ============================================

export const seedUnits: ClinicUnit[] = [
  {
    id: DEMO_IDS.UNIT,
    clinicId: DEMO_IDS.TENANT,
    name: 'NEXCLÍNICA — Unidade Centro',
    address: 'Av. Paulista, 1000 — Sala 501, São Paulo/SP',
    phone: '(11) 3000-0000',
    active: true,
    createdAt: now,
    updatedAt: now,
  },
];

// ============================================
// PROFESSIONALS
// ============================================

export const seedProfessionals: HealthcareProfessional[] = [
  {
    id: DEMO_IDS.PROFESSIONAL_1,
    personName: 'Dra. Camila Ferreira',
    specialtyId: DEMO_IDS.SPECIALTY_NUTRITION,
    professionalCouncil: 'CRN',
    councilNumber: '3-12345',
    email: 'camila.ferreira@nexclinica.demo',
    phone: '(11) 99001-0001',
    active: true,
    color: '#17AEB5',
    appointmentDuration: 50,
    unitIds: [DEMO_IDS.UNIT],
    createdAt: now,
    updatedAt: now,
  },
  {
    id: DEMO_IDS.PROFESSIONAL_2,
    personName: 'Dr. Ricardo Mendes',
    specialtyId: DEMO_IDS.SPECIALTY_GENERAL,
    professionalCouncil: 'CRM',
    councilNumber: '123456-SP',
    email: 'ricardo.mendes@nexclinica.demo',
    phone: '(11) 99001-0002',
    active: true,
    color: '#22BFC5',
    appointmentDuration: 30,
    unitIds: [DEMO_IDS.UNIT],
    createdAt: now,
    updatedAt: now,
  },
  {
    id: DEMO_IDS.PROFESSIONAL_3,
    personName: 'Dra. Beatriz Lopes',
    specialtyId: DEMO_IDS.SPECIALTY_PSYCHOLOGY,
    professionalCouncil: 'CRP',
    councilNumber: '06/98765',
    email: 'beatriz.lopes@nexclinica.demo',
    phone: '(11) 99001-0003',
    active: true,
    color: '#52B788',
    appointmentDuration: 50,
    unitIds: [DEMO_IDS.UNIT],
    createdAt: now,
    updatedAt: now,
  },
];

// ============================================
// PATIENTS
// ============================================

export const seedPatients: Patient[] = [
  {
    id: DEMO_IDS.PATIENT_1,
    tenantId: DEMO_IDS.TENANT,
    fullName: 'Maria Oliveira Santos',
    birthDate: '1988-03-15',
    cpf: '123.456.789-00',
    gender: 'F',
    phone: '(11) 98765-4321',
    email: 'maria.oliveira@email.com',
    emergencyContactName: 'Carlos Santos',
    emergencyContactPhone: '(11) 98765-4322',
    address: 'Rua das Flores, 123 — São Paulo/SP',
    occupation: 'Professora',
    healthInsurance: 'Unimed',
    insuranceNumber: '1234567890',
    notes: 'Paciente acompanhada desde janeiro/2026',
    active: true,
    avatarColor: '#17AEB5',
    createdAt: '2026-01-10T10:00:00.000Z',
    updatedAt: now,
  },
  {
    id: DEMO_IDS.PATIENT_2,
    tenantId: DEMO_IDS.TENANT,
    fullName: 'João Pedro Almeida',
    birthDate: '1975-07-22',
    cpf: '987.654.321-00',
    gender: 'M',
    phone: '(11) 91234-5678',
    email: 'joao.almeida@email.com',
    occupation: 'Engenheiro',
    active: true,
    avatarColor: '#22BFC5',
    createdAt: '2026-02-05T14:00:00.000Z',
    updatedAt: now,
  },
  {
    id: DEMO_IDS.PATIENT_3,
    tenantId: DEMO_IDS.TENANT,
    fullName: 'Ana Carolina Martins',
    birthDate: '1992-11-08',
    gender: 'F',
    phone: '(11) 99876-5432',
    occupation: 'Designer',
    active: true,
    avatarColor: '#52B788',
    createdAt: '2026-03-12T09:00:00.000Z',
    updatedAt: now,
  },
  {
    id: DEMO_IDS.PATIENT_4,
    tenantId: DEMO_IDS.TENANT,
    fullName: 'Roberto Nascimento Lima',
    birthDate: '1965-05-30',
    gender: 'M',
    phone: '(11) 97654-3210',
    occupation: 'Aposentado',
    healthInsurance: 'Bradesco Saúde',
    active: true,
    avatarColor: '#F6B85A',
    createdAt: '2026-04-20T11:00:00.000Z',
    updatedAt: now,
  },
  {
    id: DEMO_IDS.PATIENT_5,
    tenantId: DEMO_IDS.TENANT,
    fullName: 'Fernanda Costa Ribeiro',
    birthDate: '2000-09-14',
    gender: 'F',
    phone: '(11) 95432-1098',
    email: 'fernanda.costa@email.com',
    occupation: 'Estudante',
    active: true,
    avatarColor: '#E97878',
    createdAt: '2026-05-08T16:00:00.000Z',
    updatedAt: now,
  },
  {
    id: DEMO_IDS.PATIENT_6,
    tenantId: DEMO_IDS.TENANT,
    fullName: 'Lucas Barbosa Souza',
    birthDate: '1983-12-01',
    gender: 'M',
    phone: '(11) 93210-9876',
    occupation: 'Comerciante',
    active: false,
    avatarColor: '#6F8C90',
    createdAt: '2025-11-15T10:00:00.000Z',
    updatedAt: now,
  },
  {
    id: DEMO_IDS.PATIENT_7,
    tenantId: DEMO_IDS.TENANT,
    fullName: 'Patrícia Gonçalves Dias',
    birthDate: '1995-06-25',
    gender: 'F',
    phone: '(11) 94321-0987',
    email: 'patricia.dias@email.com',
    occupation: 'Advogada',
    active: true,
    avatarColor: '#17AEB5',
    createdAt: '2026-06-01T08:00:00.000Z',
    updatedAt: now,
  },
];

// ============================================
// APPOINTMENTS
// ============================================

export const seedAppointments: Appointment[] = [
  {
    id: 'appt-001',
    tenantId: DEMO_IDS.TENANT,
    patientId: DEMO_IDS.PATIENT_1,
    professionalId: DEMO_IDS.PROFESSIONAL_1,
    specialtyId: DEMO_IDS.SPECIALTY_NUTRITION,
    unitId: DEMO_IDS.UNIT,
    startDateTime: dateTimeFromNow(0, 9, 0),
    endDateTime: dateTimeFromNow(0, 9, 50),
    appointmentType: 'RETORNO',
    status: 'CONFIRMADA',
    reason: 'Acompanhamento nutricional mensal',
    confirmationStatus: 'CONFIRMADA',
    createdAt: now,
    updatedAt: now,
  },
  {
    id: 'appt-002',
    tenantId: DEMO_IDS.TENANT,
    patientId: DEMO_IDS.PATIENT_2,
    professionalId: DEMO_IDS.PROFESSIONAL_2,
    specialtyId: DEMO_IDS.SPECIALTY_GENERAL,
    unitId: DEMO_IDS.UNIT,
    startDateTime: dateTimeFromNow(0, 10, 30),
    endDateTime: dateTimeFromNow(0, 11, 0),
    appointmentType: 'PRIMEIRA_CONSULTA',
    status: 'AGENDADA',
    reason: 'Check-up anual',
    confirmationStatus: 'NAO_CONFIRMADA',
    createdAt: now,
    updatedAt: now,
  },
  {
    id: 'appt-003',
    tenantId: DEMO_IDS.TENANT,
    patientId: DEMO_IDS.PATIENT_3,
    professionalId: DEMO_IDS.PROFESSIONAL_3,
    specialtyId: DEMO_IDS.SPECIALTY_PSYCHOLOGY,
    unitId: DEMO_IDS.UNIT,
    startDateTime: dateTimeFromNow(0, 14, 0),
    endDateTime: dateTimeFromNow(0, 14, 50),
    appointmentType: 'SESSÃO',
    status: 'AGENDADA',
    reason: 'Sessão semanal de psicoterapia',
    confirmationStatus: 'CONFIRMADA',
    createdAt: now,
    updatedAt: now,
  },
  {
    id: 'appt-004',
    tenantId: DEMO_IDS.TENANT,
    patientId: DEMO_IDS.PATIENT_4,
    professionalId: DEMO_IDS.PROFESSIONAL_2,
    specialtyId: DEMO_IDS.SPECIALTY_GENERAL,
    unitId: DEMO_IDS.UNIT,
    startDateTime: dateTimeFromNow(0, 15, 30),
    endDateTime: dateTimeFromNow(0, 16, 0),
    appointmentType: 'RETORNO',
    status: 'AGENDADA',
    reason: 'Acompanhamento hipertensão',
    confirmationStatus: 'NAO_CONFIRMADA',
    createdAt: now,
    updatedAt: now,
  },
  {
    id: 'appt-005',
    tenantId: DEMO_IDS.TENANT,
    patientId: DEMO_IDS.PATIENT_5,
    professionalId: DEMO_IDS.PROFESSIONAL_1,
    specialtyId: DEMO_IDS.SPECIALTY_NUTRITION,
    unitId: DEMO_IDS.UNIT,
    startDateTime: dateTimeFromNow(1, 9, 0),
    endDateTime: dateTimeFromNow(1, 9, 50),
    appointmentType: 'AVALIAÇÃO',
    status: 'AGENDADA',
    reason: 'Avaliação nutricional inicial',
    confirmationStatus: 'NAO_CONFIRMADA',
    createdAt: now,
    updatedAt: now,
  },
  {
    id: 'appt-006',
    tenantId: DEMO_IDS.TENANT,
    patientId: DEMO_IDS.PATIENT_7,
    professionalId: DEMO_IDS.PROFESSIONAL_1,
    specialtyId: DEMO_IDS.SPECIALTY_NUTRITION,
    unitId: DEMO_IDS.UNIT,
    startDateTime: dateTimeFromNow(1, 10, 30),
    endDateTime: dateTimeFromNow(1, 11, 20),
    appointmentType: 'RETORNO',
    status: 'AGENDADA',
    reason: 'Retorno — plano alimentar',
    confirmationStatus: 'NAO_CONFIRMADA',
    createdAt: now,
    updatedAt: now,
  },
  {
    id: 'appt-007',
    tenantId: DEMO_IDS.TENANT,
    patientId: DEMO_IDS.PATIENT_1,
    professionalId: DEMO_IDS.PROFESSIONAL_1,
    specialtyId: DEMO_IDS.SPECIALTY_NUTRITION,
    unitId: DEMO_IDS.UNIT,
    startDateTime: dateTimeFromNow(-7, 9, 0),
    endDateTime: dateTimeFromNow(-7, 9, 50),
    appointmentType: 'RETORNO',
    status: 'CONCLUÍDA',
    reason: 'Acompanhamento nutricional',
    confirmationStatus: 'CONFIRMADA',
    createdAt: daysFromNow(-14),
    updatedAt: now,
  },
];

// ============================================
// CLINICAL ENCOUNTERS
// ============================================

export const seedEncounters: ClinicalEncounter[] = [
  {
    id: 'enc-001',
    tenantId: DEMO_IDS.TENANT,
    patientId: DEMO_IDS.PATIENT_1,
    professionalId: DEMO_IDS.PROFESSIONAL_1,
    appointmentId: 'appt-007',
    specialtyId: DEMO_IDS.SPECIALTY_NUTRITION,
    encounterDate: dateTimeFromNow(-7, 9, 0),
    chiefComplaint: 'Paciente relata dificuldade para manter dieta durante a semana de trabalho.',
    history: 'Paciente em acompanhamento nutricional há 3 meses. Relata perda de 2kg no último mês. Boa adesão ao plano alimentar nos finais de semana.',
    assessment: 'Paciente apresenta evolução positiva. IMC reduzindo gradualmente. Necessário ajustar lanches da tarde para maior praticidade.',
    conduct: 'Ajuste do plano de lanches para opções mais práticas. Orientação sobre preparo antecipado (meal prep). Manutenção da hidratação.',
    notes: 'Paciente motivada e colaborativa.',
    recommendedReturn: 'Retorno em 30 dias',
    status: 'COMPLETED',
    completedAt: dateTimeFromNow(-7, 9, 50),
    createdAt: dateTimeFromNow(-7, 9, 0),
    updatedAt: dateTimeFromNow(-7, 9, 50),
  },
  {
    id: 'enc-002',
    tenantId: DEMO_IDS.TENANT,
    patientId: DEMO_IDS.PATIENT_1,
    professionalId: DEMO_IDS.PROFESSIONAL_1,
    specialtyId: DEMO_IDS.SPECIALTY_NUTRITION,
    encounterDate: dateTimeFromNow(-35, 10, 0),
    chiefComplaint: 'Primeira consulta — busca emagrecimento saudável.',
    history: 'Paciente de 38 anos, sedentária, relata ganho de peso progressivo nos últimos 2 anos. Sem restrições alimentares conhecidas.',
    assessment: 'IMC 28.5 — sobrepeso. Sem comorbidades aparentes. Boa disposição para mudança de hábitos.',
    conduct: 'Plano alimentar individualizado. Orientações de reeducação alimentar. Solicitação de exames laboratoriais básicos.',
    recommendedReturn: 'Retorno em 30 dias',
    status: 'COMPLETED',
    completedAt: dateTimeFromNow(-35, 10, 50),
    createdAt: dateTimeFromNow(-35, 10, 0),
    updatedAt: dateTimeFromNow(-35, 10, 50),
  },
];

// ============================================
// EVOLUTIONS
// ============================================

export const seedEvolutions: ClinicalEvolution[] = [
  {
    id: 'evo-001',
    patientId: DEMO_IDS.PATIENT_1,
    professionalId: DEMO_IDS.PROFESSIONAL_1,
    encounterId: 'enc-001',
    date: dateTimeFromNow(-7, 9, 50),
    description: 'Evolução positiva. Paciente perdeu 2kg desde a última consulta. Mantendo boa adesão ao plano. Ajuste realizado nos lanches da tarde.',
    createdAt: dateTimeFromNow(-7, 9, 50),
    updatedAt: dateTimeFromNow(-7, 9, 50),
  },
  {
    id: 'evo-002',
    patientId: DEMO_IDS.PATIENT_1,
    professionalId: DEMO_IDS.PROFESSIONAL_1,
    encounterId: 'enc-002',
    date: dateTimeFromNow(-35, 10, 50),
    description: 'Avaliação inicial. Paciente motivada. Plano alimentar elaborado. Exames solicitados.',
    createdAt: dateTimeFromNow(-35, 10, 50),
    updatedAt: dateTimeFromNow(-35, 10, 50),
  },
];

// ============================================
// MEASUREMENTS
// ============================================

export const seedMeasurements: PatientMeasurement[] = [
  {
    id: 'meas-001',
    patientId: DEMO_IDS.PATIENT_1,
    type: 'peso',
    value: 72.5,
    unit: 'kg',
    measuredAt: dateTimeFromNow(-35, 10, 10),
    professionalId: DEMO_IDS.PROFESSIONAL_1,
    encounterId: 'enc-002',
    createdAt: dateTimeFromNow(-35, 10, 10),
    updatedAt: dateTimeFromNow(-35, 10, 10),
  },
  {
    id: 'meas-002',
    patientId: DEMO_IDS.PATIENT_1,
    type: 'altura',
    value: 165,
    unit: 'cm',
    measuredAt: dateTimeFromNow(-35, 10, 10),
    professionalId: DEMO_IDS.PROFESSIONAL_1,
    encounterId: 'enc-002',
    createdAt: dateTimeFromNow(-35, 10, 10),
    updatedAt: dateTimeFromNow(-35, 10, 10),
  },
  {
    id: 'meas-003',
    patientId: DEMO_IDS.PATIENT_1,
    type: 'peso',
    value: 70.5,
    unit: 'kg',
    measuredAt: dateTimeFromNow(-7, 9, 10),
    professionalId: DEMO_IDS.PROFESSIONAL_1,
    encounterId: 'enc-001',
    createdAt: dateTimeFromNow(-7, 9, 10),
    updatedAt: dateTimeFromNow(-7, 9, 10),
  },
  {
    id: 'meas-004',
    patientId: DEMO_IDS.PATIENT_1,
    type: 'circunferencia_abdominal',
    value: 85,
    unit: 'cm',
    measuredAt: dateTimeFromNow(-7, 9, 12),
    professionalId: DEMO_IDS.PROFESSIONAL_1,
    encounterId: 'enc-001',
    createdAt: dateTimeFromNow(-7, 9, 12),
    updatedAt: dateTimeFromNow(-7, 9, 12),
  },
  {
    id: 'meas-005',
    patientId: DEMO_IDS.PATIENT_1,
    type: 'pressao_sistolica',
    value: 120,
    unit: 'mmHg',
    measuredAt: dateTimeFromNow(-7, 9, 15),
    professionalId: DEMO_IDS.PROFESSIONAL_1,
    encounterId: 'enc-001',
    createdAt: dateTimeFromNow(-7, 9, 15),
    updatedAt: dateTimeFromNow(-7, 9, 15),
  },
  {
    id: 'meas-006',
    patientId: DEMO_IDS.PATIENT_1,
    type: 'pressao_diastolica',
    value: 80,
    unit: 'mmHg',
    measuredAt: dateTimeFromNow(-7, 9, 15),
    professionalId: DEMO_IDS.PROFESSIONAL_1,
    encounterId: 'enc-001',
    createdAt: dateTimeFromNow(-7, 9, 15),
    updatedAt: dateTimeFromNow(-7, 9, 15),
  },
];

// ============================================
// EXAMS
// ============================================

export const seedExams: ExamRecord[] = [
  {
    id: 'exam-001',
    patientId: DEMO_IDS.PATIENT_1,
    examType: 'Hemograma completo',
    examDate: daysFromNow(-30),
    requestedBy: DEMO_IDS.PROFESSIONAL_1,
    resultSummary: 'Dentro da normalidade. Colesterol total levemente elevado (210 mg/dL).',
    notes: 'Exame solicitado na avaliação inicial',
    createdAt: daysFromNow(-30),
    updatedAt: daysFromNow(-30),
  },
  {
    id: 'exam-002',
    patientId: DEMO_IDS.PATIENT_1,
    examType: 'Glicemia em jejum',
    examDate: daysFromNow(-30),
    requestedBy: DEMO_IDS.PROFESSIONAL_1,
    resultSummary: 'Normal — 85 mg/dL',
    createdAt: daysFromNow(-30),
    updatedAt: daysFromNow(-30),
  },
];

// ============================================
// DOCUMENTS
// ============================================

export const seedDocuments: PatientDocument[] = [
  {
    id: 'doc-001',
    patientId: DEMO_IDS.PATIENT_1,
    type: 'TERMO',
    title: 'Termo de Consentimento LGPD',
    date: daysFromNow(-35),
    professionalId: DEMO_IDS.PROFESSIONAL_1,
    visibility: 'PRIVATE',
    createdAt: daysFromNow(-35),
    updatedAt: daysFromNow(-35),
  },
  {
    id: 'doc-002',
    patientId: DEMO_IDS.PATIENT_1,
    type: 'EXAME',
    title: 'Resultado Hemograma',
    date: daysFromNow(-30),
    professionalId: DEMO_IDS.PROFESSIONAL_1,
    visibility: 'SHARED',
    createdAt: daysFromNow(-30),
    updatedAt: daysFromNow(-30),
  },
];

// ============================================
// NUTRITION ASSESSMENTS
// ============================================

export const seedNutrition: NutritionAssessment[] = [
  {
    id: 'nutri-001',
    patientId: DEMO_IDS.PATIENT_1,
    encounterId: 'enc-002',
    weight: 72.5,
    height: 165,
    bmi: 26.6,
    waistCircumference: 88,
    goal: 'Perda de 8kg em 4 meses com reeducação alimentar',
    dietaryNotes: 'Reduzir carboidratos refinados. Aumentar consumo de vegetais e proteínas magras.',
    hydrationNotes: 'Meta de 2L de água por dia',
    physicalActivityNotes: 'Iniciar caminhada 3x por semana, 30 minutos',
    observations: 'Paciente motivada. Boa resposta inicial ao plano.',
    createdAt: dateTimeFromNow(-35, 10, 30),
    updatedAt: dateTimeFromNow(-35, 10, 30),
  },
  {
    id: 'nutri-002',
    patientId: DEMO_IDS.PATIENT_1,
    encounterId: 'enc-001',
    weight: 70.5,
    height: 165,
    bmi: 25.9,
    waistCircumference: 85,
    goal: 'Manter perda progressiva. Meta intermediária: 68kg.',
    dietaryNotes: 'Ajuste nos lanches da tarde para maior praticidade. Meal prep aos domingos.',
    hydrationNotes: 'Mantendo boa hidratação',
    physicalActivityNotes: 'Evoluindo bem — já caminha 4x por semana',
    observations: 'Excelente evolução. Perda de 2kg em 28 dias.',
    createdAt: dateTimeFromNow(-7, 9, 30),
    updatedAt: dateTimeFromNow(-7, 9, 30),
  },
];

// ============================================
// USERS
// ============================================

export const seedUsers: SystemUser[] = [
  {
    id: DEMO_IDS.USER_ADMIN,
    name: 'Administrador NEXCLÍNICA',
    email: 'admin@nexclinica.demo',
    role: 'ADMINISTRADOR',
    active: true,
    createdAt: now,
    updatedAt: now,
  },
  {
    id: DEMO_IDS.USER_PROFESSIONAL,
    name: 'Dra. Camila Ferreira',
    email: 'camila.ferreira@nexclinica.demo',
    role: 'NUTRICIONISTA',
    professionalId: DEMO_IDS.PROFESSIONAL_1,
    active: true,
    createdAt: now,
    updatedAt: now,
  },
  {
    id: DEMO_IDS.USER_RECEPTION,
    name: 'Juliana Reis',
    email: 'recepcao@nexclinica.demo',
    role: 'RECEPCIONISTA',
    active: true,
    createdAt: now,
    updatedAt: now,
  },
];

// ============================================
// TIMELINE (computed from other entities)
// ============================================

export function buildTimeline(patientId: string): TimelineEvent[] {
  const events: TimelineEvent[] = [];

  // Patient created
  const patient = seedPatients.find(p => p.id === patientId);
  if (patient) {
    events.push({
      id: `tl-created-${patientId}`,
      patientId,
      type: 'PATIENT_CREATED',
      date: patient.createdAt,
      title: 'Paciente cadastrado',
      description: 'Cadastro realizado no sistema',
    });
  }

  // Encounters
  seedEncounters.filter(e => e.patientId === patientId).forEach(e => {
    events.push({
      id: `tl-enc-${e.id}`,
      patientId,
      type: 'ENCOUNTER',
      date: e.encounterDate,
      title: 'Atendimento realizado',
      description: e.chiefComplaint?.substring(0, 80),
      entityId: e.id,
    });
  });

  // Measurements
  seedMeasurements.filter(m => m.patientId === patientId).forEach(m => {
    events.push({
      id: `tl-meas-${m.id}`,
      patientId,
      type: 'MEASUREMENT',
      date: m.measuredAt,
      title: `Medida registrada: ${m.type}`,
      description: `${m.value} ${m.unit}`,
      entityId: m.id,
    });
  });

  // Exams
  seedExams.filter(e => e.patientId === patientId).forEach(e => {
    events.push({
      id: `tl-exam-${e.id}`,
      patientId,
      type: 'EXAM',
      date: e.examDate,
      title: `Exame: ${e.examType}`,
      description: e.resultSummary?.substring(0, 80),
      entityId: e.id,
    });
  });

  // Documents
  seedDocuments.filter(d => d.patientId === patientId).forEach(d => {
    events.push({
      id: `tl-doc-${d.id}`,
      patientId,
      type: 'DOCUMENT',
      date: d.date,
      title: `Documento: ${d.title}`,
      entityId: d.id,
    });
  });

  // Sort by date descending
  return events.sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime());
}
