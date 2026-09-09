// NEXCLÍNICA — Domain Models
// All canonical entities for the clinical management platform

// ============================================
// BASE TYPES
// ============================================

export type UUID = string;

export interface BaseEntity {
  id: UUID;
  createdAt: string;
  updatedAt: string;
}

// ============================================
// TENANT / CLINIC
// ============================================

export interface Clinic extends BaseEntity {
  name: string;
  cnpj?: string;
  phone?: string;
  email?: string;
  address?: string;
}

export interface ClinicUnit extends BaseEntity {
  clinicId: UUID;
  name: string;
  address?: string;
  phone?: string;
  active: boolean;
}

// ============================================
// SPECIALTY
// ============================================

export interface Specialty extends BaseEntity {
  name: string;
  code: string;
  description?: string;
  appointmentDuration: number; // minutes
  active: boolean;
}

// ============================================
// PROFESSIONAL
// ============================================

export interface HealthcareProfessional extends BaseEntity {
  personName: string;
  specialtyId: UUID;
  professionalCouncil: string; // CRM, CRN, CRP, CREFITO, CRO, COREN, CREFONO
  councilNumber: string;
  email: string;
  phone: string;
  active: boolean;
  color?: string;
  appointmentDuration: number;
  unitIds: UUID[];
}

// ============================================
// PATIENT
// ============================================

export interface Patient extends BaseEntity {
  tenantId: UUID;
  fullName: string;
  socialName?: string;
  birthDate: string;
  cpf?: string;
  rg?: string;
  gender?: 'M' | 'F' | 'O' | 'N';
  phone: string;
  email?: string;
  emergencyContactName?: string;
  emergencyContactPhone?: string;
  address?: string;
  occupation?: string;
  healthInsurance?: string;
  insuranceNumber?: string;
  notes?: string;
  active: boolean;
  avatarColor?: string;
}

// ============================================
// APPOINTMENT
// ============================================

export type AppointmentStatus =
  | 'AGENDADA'
  | 'CONFIRMADA'
  | 'EM_ATENDIMENTO'
  | 'CONCLUÍDA'
  | 'CANCELADA'
  | 'FALTOU';

export type AppointmentType =
  | 'PRIMEIRA_CONSULTA'
  | 'RETORNO'
  | 'SESSÃO'
  | 'AVALIAÇÃO'
  | 'PROCEDIMENTO'
  | 'OUTRO';

export type ConfirmationStatus = 'NAO_CONFIRMADA' | 'CONFIRMADA' | 'RECUSADA';

export interface Appointment extends BaseEntity {
  tenantId: UUID;
  patientId: UUID;
  professionalId: UUID;
  specialtyId: UUID;
  unitId: UUID;
  startDateTime: string;
  endDateTime: string;
  appointmentType: AppointmentType;
  status: AppointmentStatus;
  reason?: string;
  notes?: string;
  confirmationStatus: ConfirmationStatus;
}

// ============================================
// CLINICAL ENCOUNTER
// ============================================

export type EncounterStatus = 'DRAFT' | 'IN_PROGRESS' | 'COMPLETED' | 'AMENDED';

export interface ClinicalEncounter extends BaseEntity {
  tenantId: UUID;
  patientId: UUID;
  professionalId: UUID;
  appointmentId?: UUID;
  specialtyId: UUID;
  encounterDate: string;
  chiefComplaint?: string;
  history?: string;
  assessment?: string;
  conduct?: string;
  notes?: string;
  recommendedReturn?: string;
  status: EncounterStatus;
  completedAt?: string;
}

// ============================================
// CLINICAL EVOLUTION
// ============================================

export interface ClinicalEvolution extends BaseEntity {
  patientId: UUID;
  professionalId: UUID;
  encounterId?: UUID;
  date: string;
  description: string;
}

// ============================================
// MEASUREMENTS
// ============================================

export interface PatientMeasurement extends BaseEntity {
  patientId: UUID;
  type: string; // peso, altura, IMC, pressão sistólica, etc.
  value: number;
  unit: string;
  measuredAt: string;
  professionalId: UUID;
  encounterId?: UUID;
  notes?: string;
}

// ============================================
// EXAMS
// ============================================

export interface ExamRecord extends BaseEntity {
  patientId: UUID;
  examType: string;
  examDate: string;
  requestedBy?: UUID;
  resultSummary?: string;
  documentReference?: string;
  notes?: string;
}

// ============================================
// DOCUMENTS
// ============================================

export type PatientDocumentType =
  | 'EXAME'
  | 'LAUDO'
  | 'TERMO'
  | 'RELATORIO'
  | 'DOCUMENTO_PESSOAL'
  | 'ENCAMINHAMENTO'
  | 'OUTRO';

export interface PatientDocument extends BaseEntity {
  patientId: UUID;
  type: PatientDocumentType;
  title: string;
  date: string;
  fileReference?: string;
  professionalId?: UUID;
  visibility: 'PRIVATE' | 'SHARED';
}

// ============================================
// NUTRITION EXTENSION
// ============================================

export interface NutritionAssessment extends BaseEntity {
  patientId: UUID;
  encounterId?: UUID;
  weight?: number;
  height?: number;
  bmi?: number;
  waistCircumference?: number;
  goal?: string;
  dietaryNotes?: string;
  hydrationNotes?: string;
  physicalActivityNotes?: string;
  observations?: string;
}

// ============================================
// CONSENT
// ============================================

export interface PatientConsent extends BaseEntity {
  patientId: UUID;
  consentType: string;
  accepted: boolean;
  acceptedAt: string;
  revokedAt?: string;
  documentVersion: string;
  evidenceReference?: string;
}

// ============================================
// USER / RBAC
// ============================================

export type UserRole =
  | 'ADMINISTRADOR'
  | 'GESTOR_CLINICA'
  | 'MEDICO'
  | 'NUTRICIONISTA'
  | 'PSICOLOGO'
  | 'FISIOTERAPEUTA'
  | 'OUTRO_PROFISSIONAL'
  | 'RECEPCIONISTA'
  | 'AUDITOR';

export interface SystemUser extends BaseEntity {
  name: string;
  email: string;
  role: UserRole;
  professionalId?: UUID;
  active: boolean;
}

// ============================================
// AUDIT LOG
// ============================================

export interface AuditLog {
  id: UUID;
  timestamp: string;
  userId: UUID;
  userName: string;
  action: string;
  entity: string;
  entityId: UUID;
  details?: string;
}

// ============================================
// TIMELINE EVENT
// ============================================

export type TimelineEventType =
  | 'APPOINTMENT'
  | 'ENCOUNTER'
  | 'MEASUREMENT'
  | 'DOCUMENT'
  | 'EXAM'
  | 'EVOLUTION'
  | 'PATIENT_CREATED';

export interface TimelineEvent {
  id: UUID;
  patientId: UUID;
  type: TimelineEventType;
  date: string;
  title: string;
  description?: string;
  entityId?: UUID;
}

// ============================================
// UI DISPLAY HELPERS
// ============================================

export const APPOINTMENT_STATUS_LABELS: Record<AppointmentStatus, string> = {
  AGENDADA: 'Agendada',
  CONFIRMADA: 'Confirmada',
  EM_ATENDIMENTO: 'Em Atendimento',
  CONCLUÍDA: 'Concluída',
  CANCELADA: 'Cancelada',
  FALTOU: 'Faltou',
};

export const APPOINTMENT_TYPE_LABELS: Record<AppointmentType, string> = {
  PRIMEIRA_CONSULTA: 'Primeira Consulta',
  RETORNO: 'Retorno',
  SESSÃO: 'Sessão',
  AVALIAÇÃO: 'Avaliação',
  PROCEDIMENTO: 'Procedimento',
  OUTRO: 'Outro',
};

export const ENCOUNTER_STATUS_LABELS: Record<EncounterStatus, string> = {
  DRAFT: 'Rascunho',
  IN_PROGRESS: 'Em Andamento',
  COMPLETED: 'Concluído',
  AMENDED: 'Retificado',
};

export const USER_ROLE_LABELS: Record<UserRole, string> = {
  ADMINISTRADOR: 'Administrador',
  GESTOR_CLINICA: 'Gestor da Clínica',
  MEDICO: 'Médico(a)',
  NUTRICIONISTA: 'Nutricionista',
  PSICOLOGO: 'Psicólogo(a)',
  FISIOTERAPEUTA: 'Fisioterapeuta',
  OUTRO_PROFISSIONAL: 'Outro Profissional',
  RECEPCIONISTA: 'Recepcionista',
  AUDITOR: 'Auditor',
};

export const GENDER_LABELS: Record<string, string> = {
  M: 'Masculino',
  F: 'Feminino',
  O: 'Outro',
  N: 'Prefiro não informar',
};

export const MEASUREMENT_TYPES = [
  { code: 'peso', label: 'Peso', unit: 'kg' },
  { code: 'altura', label: 'Altura', unit: 'cm' },
  { code: 'imc', label: 'IMC', unit: 'kg/m²' },
  { code: 'pressao_sistolica', label: 'Pressão Sistólica', unit: 'mmHg' },
  { code: 'pressao_diastolica', label: 'Pressão Diastólica', unit: 'mmHg' },
  { code: 'frequencia_cardiaca', label: 'Frequência Cardíaca', unit: 'bpm' },
  { code: 'temperatura', label: 'Temperatura', unit: '°C' },
  { code: 'circunferencia_abdominal', label: 'Circunferência Abdominal', unit: 'cm' },
  { code: 'glicemia', label: 'Glicemia', unit: 'mg/dL' },
];
