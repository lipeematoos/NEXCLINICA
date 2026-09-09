// Repository interfaces for NEXCLÍNICA
import type {
  UUID, Patient, HealthcareProfessional, Specialty, Appointment,
  ClinicalEncounter, ClinicalEvolution, PatientMeasurement,
  ExamRecord, PatientDocument, NutritionAssessment, SystemUser,
  ClinicUnit, TimelineEvent
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
}
