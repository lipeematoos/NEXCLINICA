// NEXCLÍNICA — Repository Interfaces (Extended with 6 Layers)
import type {
  UUID, Patient, HealthcareProfessional, Specialty, Appointment,
  ClinicalEncounter, ClinicalEvolution, PatientMeasurement,
  ExamRecord, PatientDocument, NutritionAssessment, SystemUser,
  ClinicUnit, TimelineEvent, PatientQueue, NursingRecord,
  ExamRequest, Prescription, Medication, Pharmacy
} from './models';

export interface PatientRepository {
  findAll(): Patient[];
  findById(id: UUID): Patient | undefined;
  findByFilters(filters: { active?: boolean; search?: string }): Patient[];
  create(patient: Omit<Patient, 'id' | 'createdAt' | 'updatedAt'>): Patient;
  update(id: UUID, data: Partial<Patient>): Patient | undefined;
}

export interface ProfessionalRepository {
  findAll(): HealthcareProfessional[];
  findById(id: UUID): HealthcareProfessional | undefined;
  create(data: Omit<HealthcareProfessional, 'id' | 'createdAt' | 'updatedAt'>): HealthcareProfessional;
  update(id: UUID, data: Partial<HealthcareProfessional>): HealthcareProfessional | undefined;
}

export interface SpecialtyRepository {
  findAll(): Specialty[];
  findById(id: UUID): Specialty | undefined;
  create(data: Omit<Specialty, 'id' | 'createdAt' | 'updatedAt'>): Specialty;
}

export interface AppointmentRepository {
  findAll(): Appointment[];
  findById(id: UUID): Appointment | undefined;
  findByDateRange(start: string, end: string): Appointment[];
  findByPatient(patientId: UUID): Appointment[];
  findByProfessional(profId: UUID): Appointment[];
  create(data: Omit<Appointment, 'id' | 'createdAt' | 'updatedAt'>): Appointment;
  update(id: UUID, data: Partial<Appointment>): Appointment | undefined;
}

export interface EncounterRepository {
  findAll(): ClinicalEncounter[];
  findById(id: UUID): ClinicalEncounter | undefined;
  findByPatient(patientId: UUID): ClinicalEncounter[];
  create(data: Omit<ClinicalEncounter, 'id' | 'createdAt' | 'updatedAt'>): ClinicalEncounter;
  update(id: UUID, data: Partial<ClinicalEncounter>): ClinicalEncounter | undefined;
}

export interface EvolutionRepository {
  findByPatient(patientId: UUID): ClinicalEvolution[];
  create(data: Omit<ClinicalEvolution, 'id' | 'createdAt' | 'updatedAt'>): ClinicalEvolution;
}

export interface MeasurementRepository {
  findByPatient(patientId: UUID): PatientMeasurement[];
  findByPatientAndType(patientId: UUID, type: string): PatientMeasurement[];
  create(data: Omit<PatientMeasurement, 'id' | 'createdAt' | 'updatedAt'>): PatientMeasurement;
}

export interface ExamRepository {
  findByPatient(patientId: UUID): ExamRecord[];
  create(data: Omit<ExamRecord, 'id' | 'createdAt' | 'updatedAt'>): ExamRecord;
}

export interface DocumentRepository {
  findByPatient(patientId: UUID): PatientDocument[];
  create(data: Omit<PatientDocument, 'id' | 'createdAt' | 'updatedAt'>): PatientDocument;
}

export interface NutritionRepository {
  findByPatient(patientId: UUID): NutritionAssessment[];
  create(data: Omit<NutritionAssessment, 'id' | 'createdAt' | 'updatedAt'>): NutritionAssessment;
}

export interface UserRepository {
  findAll(): SystemUser[];
  findById(id: UUID): SystemUser | undefined;
  findByEmail(email: string): SystemUser | undefined;
}

export interface UnitRepository {
  findAll(): ClinicUnit[];
  findById(id: UUID): ClinicUnit | undefined;
}

export interface TimelineRepository {
  findByPatient(patientId: UUID): TimelineEvent[];
}

// NEW: Layer 1 - Queue
export interface QueueRepository {
  findAll(): PatientQueue[];
  findById(id: UUID): PatientQueue | undefined;
  findByUnit(unitId: UUID): PatientQueue[];
  findActive(): PatientQueue[];
  create(data: Omit<PatientQueue, 'id' | 'createdAt' | 'updatedAt'>): PatientQueue;
  update(id: UUID, data: Partial<PatientQueue>): PatientQueue | undefined;
}

// NEW: Layer 2 - Nursing
export interface NursingRepository {
  findByPatient(patientId: UUID): NursingRecord[];
  findById(id: UUID): NursingRecord | undefined;
  create(data: Omit<NursingRecord, 'id' | 'createdAt' | 'updatedAt'>): NursingRecord;
}

// NEW: Layer 4 - Exam Requests
export interface ExamRequestRepository {
  findAll(): ExamRequest[];
  findById(id: UUID): ExamRequest | undefined;
  findByPatient(patientId: UUID): ExamRequest[];
  create(data: Omit<ExamRequest, 'id' | 'createdAt' | 'updatedAt'>): ExamRequest;
  update(id: UUID, data: Partial<ExamRequest>): ExamRequest | undefined;
}

// NEW: Layer 5 - Prescriptions
export interface PrescriptionRepository {
  findAll(): Prescription[];
  findById(id: UUID): Prescription | undefined;
  findByPatient(patientId: UUID): Prescription[];
  findByAccessCode(code: string): Prescription | undefined;
  findByPrescriptionNumber(number: string): Prescription | undefined;
  create(data: Omit<Prescription, 'id' | 'createdAt' | 'updatedAt'>): Prescription;
  update(id: UUID, data: Partial<Prescription>): Prescription | undefined;
}

// NEW: Medications catalog
export interface MedicationRepository {
  findAll(): Medication[];
  findById(id: UUID): Medication | undefined;
  search(query: string): Medication[];
}

// NEW: Pharmacies
export interface PharmacyRepository {
  findAll(): Pharmacy[];
  findById(id: UUID): Pharmacy | undefined;
}

// Repository container
export interface Repositories {
  patients: PatientRepository;
  professionals: ProfessionalRepository;
  specialties: SpecialtyRepository;
  appointments: AppointmentRepository;
  encounters: EncounterRepository;
  evolutions: EvolutionRepository;
  measurements: MeasurementRepository;
  exams: ExamRepository;
  documents: DocumentRepository;
  nutrition: NutritionRepository;
  users: UserRepository;
  units: UnitRepository;
  timeline: TimelineRepository;
  queue: QueueRepository;
  nursing: NursingRepository;
  examRequests: ExamRequestRepository;
  prescriptions: PrescriptionRepository;
  medications: MedicationRepository;
  pharmacies: PharmacyRepository;
}
