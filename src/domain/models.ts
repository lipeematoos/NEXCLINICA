// NEXCLÍNICA — Domain Models (Extended with 6 Layers)
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
// TENANT / ORGANIZATION
// ============================================

export interface Organization extends BaseEntity {
  name: string;
  type: 'PUBLIC' | 'PRIVATE' | 'MIXED';
  documentNumber: string;
  active: boolean;
}

export interface Clinic extends BaseEntity {
  organizationId: UUID;
  name: string;
  type: 'UBS' | 'CLINIC' | 'HOSPITAL' | 'SPECIALTY_CENTER';
  address?: string;
  phone?: string;
  managerId?: UUID;
  active: boolean;
}

export interface ClinicUnit extends BaseEntity {
  clinicId: UUID;
  name: string;
  type: 'RECEPTION' | 'NURSING' | 'MEDICAL' | 'EXAM' | 'PROCEDURE';
  address?: string;
  phone?: string;
  active: boolean;
}

export interface Room extends BaseEntity {
  unitId: UUID;
  name: string;
  type: string;
  equipment?: string[];
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
  tenantId: UUID;
  personName: string;
  specialtyId: UUID;
  professionalCouncil: string; // CRM, CRN, CRP, CREFITO, CRO, COREN, CREFONO, CRF
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
  type: string;
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

export type ExamRequestStatus = 'REQUESTED' | 'COLLECTED' | 'IN_ANALYSIS' | 'COMPLETED' | 'CANCELLED';
export type ExamPriority = 'ROUTINE' | 'URGENT';

export interface ExamRequest extends BaseEntity {
  patientId: UUID;
  encounterId?: UUID;
  requestedBy: UUID;
  requestedAt: string;
  priority: ExamPriority;
  exams: ExamItem[];
  instructions?: string;
  status: ExamRequestStatus;
  resultDate?: string;
  resultSummary?: string;
}

export interface ExamItem {
  examTypeId: string;
  name: string;
  category: string;
  instructions?: string;
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
// PATIENT QUEUE (Layer 1 - Reception)
// ============================================

export type QueueType = 'NORMAL' | 'PRIORIDADE' | 'URGÊNCIA';
export type QueueStatus = 'WAITING' | 'CALLED' | 'IN_ATTENDANCE' | 'COMPLETED' | 'NO_SHOW';

export interface PatientQueue extends BaseEntity {
  tenantId: UUID;
  unitId: UUID;
  patientId: UUID;
  queueNumber: string; // "A001", "B015"
  queueType: QueueType;
  status: QueueStatus;
  checkInTime: string;
  calledTime?: string;
  attendanceStartTime?: string;
  attendanceEndTime?: string;
  destinationProfessionalId?: UUID;
  destinationRoom?: string;
  notes?: string;
}

export interface CallScreenConfig {
  showQueueNumber: boolean;
  showPatientName: boolean;
  showDestination: boolean;
  audioCall: boolean;
  displayMode: 'SINGLE' | 'MULTIPLE';
}

// ============================================
// NURSING RECORD (Layer 2 - Nursing/Triage)
// ============================================

export interface NursingRecord extends BaseEntity {
  patientId: UUID;
  professionalId: UUID;
  encounterId?: UUID;
  queueId?: UUID;
  recordedAt: string;

  // Vital signs
  bloodPressureSystolic?: number;
  bloodPressureDiastolic?: number;
  heartRate?: number;
  temperature?: number;
  respiratoryRate?: number;
  oxygenSaturation?: number;
  weight?: number;
  height?: number;
  bmi?: number;

  // Assessment
  chiefComplaint?: string;
  painLevel?: number; // 0-10
  riskClassification?: 'VERDE' | 'AZUL' | 'AMARELO' | 'LARANJA' | 'VERMELHO';

  // Procedures
  procedures?: NursingProcedure[];
  medications?: AdministeredMedication[];

  // Referral
  referralToProfessional?: UUID;
  referralReason?: string;
  priority?: 'NORMAL' | 'PRIORITY' | 'URGENT';

  notes?: string;
}

export interface NursingProcedure {
  type: string;
  description: string;
  performedAt: string;
  performedBy: string;
}

export interface AdministeredMedication {
  name: string;
  dose: string;
  route: string;
  administeredAt: string;
  administeredBy: string;
}

// ============================================
// PRESCRIPTION / PHARMACY (Layer 5)
// ============================================

export type PrescriptionType = 'SIMPLES' | 'ANTIBIOTICO' | 'CONTROLADO_A' | 'CONTROLADO_B';
export type PrescriptionStatus = 'DRAFT' | 'ISSUED' | 'PARTIALLY_DISPENSED' | 'DISPENSED' | 'CANCELLED' | 'EXPIRED';

export interface Prescription extends BaseEntity {
  tenantId: UUID;
  patientId: UUID;
  encounterId: UUID;
  professionalId: UUID;
  specialtyId: UUID;

  prescriptionNumber: string; // "RX-2026-001234"
  accessCode: string; // 6 digits

  prescriptionType: PrescriptionType;
  medications: PrescriptionMedication[];
  instructions?: string;
  validUntil: string;

  status: PrescriptionStatus;

  issuedAt: string;
  issuedBy: UUID;
  cancelledAt?: string;
  cancelledBy?: UUID;
  cancelReason?: string;

  sentToPatientEmail?: boolean;
  sentAt?: string;

  dispensingPharmacyId?: UUID;
  dispensingPharmacyName?: string;
}

export interface PrescriptionMedication {
  id: string;
  name: string;
  genericName?: string;
  dosage: string;
  pharmaceuticalForm: string;
  concentration?: string;

  dosageInstruction: string;
  frequency?: string;
  duration?: string;
  route: string;
  timing?: string;

  quantity: number;
  quantityUnit: string;

  notes?: string;
  controlled?: boolean;
  allowGeneric?: boolean;
}

export type DispensationStatus = 'PENDING' | 'DISPENSED' | 'PARTIAL' | 'CANCELLED';

export interface DispensationRecord extends BaseEntity {
  prescriptionId: UUID;
  medicationId: string;
  dispensedAt: string;
  dispensedBy: UUID;
  pharmacyId: UUID;

  quantityDispensed: number;
  quantityUnit: string;
  batchNumber?: string;
  expiryDate?: string;

  status: DispensationStatus;
  denialReason?: string;
  pharmacistName: string;
  pharmacistCrf: string;
  notes?: string;
}

// ============================================
// MEDICATION CATALOG
// ============================================

export interface Medication extends BaseEntity {
  tenantId: UUID;
  name: string;
  genericName: string;
  therapeuticClass: string;
  requiresPrescription: boolean;
  controlledSubstance?: 'A' | 'B' | 'NONE';
  antibiotic?: boolean;
  active: boolean;
  presentations: MedicationPresentation[];
}

export interface MedicationPresentation {
  id: string;
  medicationId: string;
  dosage: string;
  pharmaceuticalForm: string;
  concentration: string;
  packageSize: string;
  manufacturer?: string;
}

// ============================================
// PHARMACY
// ============================================

export interface Pharmacy extends BaseEntity {
  tenantId: UUID;
  name: string;
  type: 'PUBLIC' | 'PRIVATE' | 'MIXED';
  cnpj?: string;
  address?: string;
  phone: string;
  email?: string;
  integratedWithNexclinica: boolean;
  active: boolean;
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
  | 'ENFERMEIRO'
  | 'FARMACEUTICO'
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
  | 'PRESCRIPTION'
  | 'NURSING'
  | 'QUEUE'
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
  ENFERMEIRO: 'Enfermeiro(a)',
  FARMACEUTICO: 'Farmacêutico(a)',
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
  { code: 'saturacao_oxigenio', label: 'Saturação O₂', unit: '%' },
];

export const QUEUE_STATUS_LABELS: Record<QueueStatus, string> = {
  WAITING: 'Aguardando',
  CALLED: 'Chamado',
  IN_ATTENDANCE: 'Em Atendimento',
  COMPLETED: 'Concluído',
  NO_SHOW: 'Não Compareceu',
};

export const QUEUE_TYPE_LABELS: Record<QueueType, string> = {
  NORMAL: 'Normal',
  PRIORIDADE: 'Prioridade',
  'URGÊNCIA': 'Urgência',
};

export const RISK_CLASSIFICATION_LABELS: Record<string, { label: string; color: string }> = {
  VERDE: { label: 'Verde — Pouco urgente', color: '#52B788' },
  AZUL: { label: 'Azul — Pouco urgente', color: '#3B82F6' },
  AMARELO: { label: 'Amarelo — Moderado', color: '#F6B85A' },
  LARANJA: { label: 'Laranja — Urgente', color: '#F97316' },
  VERMELHO: { label: 'Vermelho — Emergência', color: '#E97878' },
};

export const PRESCRIPTION_TYPE_LABELS: Record<PrescriptionType, string> = {
  SIMPLES: 'Receita Simples',
  ANTIBIOTICO: 'Receita de Antibiótico',
  CONTROLADO_A: 'Receita Controlada A',
  CONTROLADO_B: 'Receita Controlada B',
};

export const PRESCRIPTION_STATUS_LABELS: Record<PrescriptionStatus, string> = {
  DRAFT: 'Rascunho',
  ISSUED: 'Emitida',
  PARTIALLY_DISPENSED: 'Parcialmente Dispensada',
  DISPENSED: 'Dispensada',
  CANCELLED: 'Cancelada',
  EXPIRED: 'Vencida',
};

export const EXAM_REQUEST_STATUS_LABELS: Record<ExamRequestStatus, string> = {
  REQUESTED: 'Solicitado',
  COLLECTED: 'Coletado',
  IN_ANALYSIS: 'Em Análise',
  COMPLETED: 'Concluído',
  CANCELLED: 'Cancelado',
};
