// NEXCLÍNICA — Demo Repository Implementation (Extended with 6 Layers)
import { v4 as uuidv4 } from 'uuid';
import type { Repositories } from '../../domain/repositories';
import type {
  Patient, HealthcareProfessional, Specialty, Appointment,
  ClinicalEncounter, ClinicalEvolution, PatientMeasurement,
  ExamRecord, PatientDocument, NutritionAssessment, SystemUser,
  ClinicUnit, TimelineEvent, UUID, PatientQueue, NursingRecord,
  ExamRequest, Prescription, Medication, Pharmacy
} from '../../domain/models';
import {
  seedPatients, seedProfessionals, seedSpecialties, seedAppointments,
  seedEncounters, seedEvolutions, seedMeasurements, seedExams,
  seedDocuments, seedNutrition, seedUsers, seedUnits, buildTimeline,
  seedPatientQueue, seedNursingRecords, seedExamRequests,
  seedPrescriptions, seedMedications, seedPharmacies
} from './seed';

// In-memory mutable store
let patients: Patient[] = [...seedPatients];
let professionals: HealthcareProfessional[] = [...seedProfessionals];
let specialties: Specialty[] = [...seedSpecialties];
let appointments: Appointment[] = [...seedAppointments];
let encounters: ClinicalEncounter[] = [...seedEncounters];
let evolutions: ClinicalEvolution[] = [...seedEvolutions];
let measurements: PatientMeasurement[] = [...seedMeasurements];
let exams: ExamRecord[] = [...seedExams];
let documents: PatientDocument[] = [...seedDocuments];
let nutrition: NutritionAssessment[] = [...seedNutrition];
let users: SystemUser[] = [...seedUsers];
let units: ClinicUnit[] = [...seedUnits];
let patientQueue: PatientQueue[] = [...seedPatientQueue];
let nursingRecords: NursingRecord[] = [...seedNursingRecords];
let examRequests: ExamRequest[] = [...seedExamRequests];
let prescriptions: Prescription[] = [...seedPrescriptions];
let medications: Medication[] = [...seedMedications];
let pharmacies: Pharmacy[] = [...seedPharmacies];

function now() {
  return new Date().toISOString();
}

export const demoRepositories: Repositories = {
  patients: {
    findAll: () => [...patients],
    findById: (id: UUID) => patients.find(p => p.id === id),
    findByFilters: (filters) => {
      let result = [...patients];
      if (filters.active !== undefined) {
        result = result.filter(p => p.active === filters.active);
      }
      if (filters.search) {
        const s = filters.search.toLowerCase();
        result = result.filter(p =>
          p.fullName.toLowerCase().includes(s) ||
          p.phone.includes(s) ||
          (p.cpf && p.cpf.includes(s))
        );
      }
      return result;
    },
    create: (data) => {
      const patient: Patient = {
        ...data,
        id: uuidv4(),
        createdAt: now(),
        updatedAt: now(),
      };
      patients.push(patient);
      return patient;
    },
    update: (id, data) => {
      const idx = patients.findIndex(p => p.id === id);
      if (idx === -1) return undefined;
      patients[idx] = { ...patients[idx], ...data, updatedAt: now() };
      return patients[idx];
    },
  },

  professionals: {
    findAll: () => [...professionals],
    findById: (id: UUID) => professionals.find(p => p.id === id),
    create: (data) => {
      const prof: HealthcareProfessional = { ...data, id: uuidv4(), createdAt: now(), updatedAt: now() };
      professionals.push(prof);
      return prof;
    },
    update: (id, data) => {
      const idx = professionals.findIndex(p => p.id === id);
      if (idx === -1) return undefined;
      professionals[idx] = { ...professionals[idx], ...data, updatedAt: now() };
      return professionals[idx];
    },
  },

  specialties: {
    findAll: () => [...specialties],
    findById: (id: UUID) => specialties.find(s => s.id === id),
    create: (data) => {
      const spec: Specialty = { ...data, id: uuidv4(), createdAt: now(), updatedAt: now() };
      specialties.push(spec);
      return spec;
    },
  },

  appointments: {
    findAll: () => [...appointments],
    findById: (id: UUID) => appointments.find(a => a.id === id),
    findByDateRange: (start, end) => {
      return appointments.filter(a => {
        const aStart = new Date(a.startDateTime);
        return aStart >= new Date(start) && aStart <= new Date(end);
      });
    },
    findByPatient: (patientId) => appointments.filter(a => a.patientId === patientId),
    findByProfessional: (profId) => appointments.filter(a => a.professionalId === profId),
    create: (data) => {
      const appt: Appointment = { ...data, id: uuidv4(), createdAt: now(), updatedAt: now() };
      appointments.push(appt);
      return appt;
    },
    update: (id, data) => {
      const idx = appointments.findIndex(a => a.id === id);
      if (idx === -1) return undefined;
      appointments[idx] = { ...appointments[idx], ...data, updatedAt: now() };
      return appointments[idx];
    },
  },

  encounters: {
    findAll: () => [...encounters],
    findById: (id: UUID) => encounters.find(e => e.id === id),
    findByPatient: (patientId) => encounters.filter(e => e.patientId === patientId),
    create: (data) => {
      const enc: ClinicalEncounter = { ...data, id: uuidv4(), createdAt: now(), updatedAt: now() };
      encounters.push(enc);
      return enc;
    },
    update: (id, data) => {
      const idx = encounters.findIndex(e => e.id === id);
      if (idx === -1) return undefined;
      encounters[idx] = { ...encounters[idx], ...data, updatedAt: now() };
      return encounters[idx];
    },
  },

  evolutions: {
    findByPatient: (patientId) => evolutions.filter(e => e.patientId === patientId),
    create: (data) => {
      const evo: ClinicalEvolution = { ...data, id: uuidv4(), createdAt: now(), updatedAt: now() };
      evolutions.push(evo);
      return evo;
    },
  },

  measurements: {
    findByPatient: (patientId) => measurements.filter(m => m.patientId === patientId),
    findByPatientAndType: (patientId, type) => measurements.filter(m => m.patientId === patientId && m.type === type),
    create: (data) => {
      const meas: PatientMeasurement = { ...data, id: uuidv4(), createdAt: now(), updatedAt: now() };
      measurements.push(meas);
      return meas;
    },
  },

  exams: {
    findByPatient: (patientId) => exams.filter(e => e.patientId === patientId),
    create: (data) => {
      const exam: ExamRecord = { ...data, id: uuidv4(), createdAt: now(), updatedAt: now() };
      exams.push(exam);
      return exam;
    },
  },

  documents: {
    findByPatient: (patientId) => documents.filter(d => d.patientId === patientId),
    create: (data) => {
      const doc: PatientDocument = { ...data, id: uuidv4(), createdAt: now(), updatedAt: now() };
      documents.push(doc);
      return doc;
    },
  },

  nutrition: {
    findByPatient: (patientId) => nutrition.filter(n => n.patientId === patientId),
    create: (data) => {
      const n: NutritionAssessment = { ...data, id: uuidv4(), createdAt: now(), updatedAt: now() };
      nutrition.push(n);
      return n;
    },
  },

  users: {
    findAll: () => [...users],
    findById: (id: UUID) => users.find(u => u.id === id),
    findByEmail: (email: string) => users.find(u => u.email === email),
  },

  units: {
    findAll: () => [...units],
    findById: (id: UUID) => units.find(u => u.id === id),
  },

  timeline: {
    findByPatient: (patientId: UUID): TimelineEvent[] => buildTimeline(patientId),
  },

  // NEW: Queue Repository
  queue: {
    findAll: () => [...patientQueue],
    findById: (id: UUID) => patientQueue.find(q => q.id === id),
    findByUnit: (unitId: UUID) => patientQueue.filter(q => q.unitId === unitId),
    findActive: () => patientQueue.filter(q => ['WAITING', 'CALLED', 'IN_ATTENDANCE'].includes(q.status)),
    create: (data) => {
      const q: PatientQueue = { ...data, id: uuidv4(), createdAt: now(), updatedAt: now() };
      patientQueue.push(q);
      return q;
    },
    update: (id, data) => {
      const idx = patientQueue.findIndex(q => q.id === id);
      if (idx === -1) return undefined;
      patientQueue[idx] = { ...patientQueue[idx], ...data, updatedAt: now() };
      return patientQueue[idx];
    },
  },

  // NEW: Nursing Repository
  nursing: {
    findByPatient: (patientId) => nursingRecords.filter(n => n.patientId === patientId),
    findById: (id: UUID) => nursingRecords.find(n => n.id === id),
    create: (data) => {
      const n: NursingRecord = { ...data, id: uuidv4(), createdAt: now(), updatedAt: now() };
      nursingRecords.push(n);
      return n;
    },
  },

  // NEW: Exam Request Repository
  examRequests: {
    findAll: () => [...examRequests],
    findById: (id: UUID) => examRequests.find(e => e.id === id),
    findByPatient: (patientId) => examRequests.filter(e => e.patientId === patientId),
    create: (data) => {
      const e: ExamRequest = { ...data, id: uuidv4(), createdAt: now(), updatedAt: now() };
      examRequests.push(e);
      return e;
    },
    update: (id, data) => {
      const idx = examRequests.findIndex(e => e.id === id);
      if (idx === -1) return undefined;
      examRequests[idx] = { ...examRequests[idx], ...data, updatedAt: now() };
      return examRequests[idx];
    },
  },

  // NEW: Prescription Repository
  prescriptions: {
    findAll: () => [...prescriptions],
    findById: (id: UUID) => prescriptions.find(p => p.id === id),
    findByPatient: (patientId) => prescriptions.filter(p => p.patientId === patientId),
    findByAccessCode: (code) => prescriptions.find(p => p.accessCode === code),
    findByPrescriptionNumber: (number) => prescriptions.find(p => p.prescriptionNumber === number),
    create: (data) => {
      const p: Prescription = { ...data, id: uuidv4(), createdAt: now(), updatedAt: now() };
      prescriptions.push(p);
      return p;
    },
    update: (id, data) => {
      const idx = prescriptions.findIndex(p => p.id === id);
      if (idx === -1) return undefined;
      prescriptions[idx] = { ...prescriptions[idx], ...data, updatedAt: now() };
      return prescriptions[idx];
    },
  },

  // NEW: Medication Repository
  medications: {
    findAll: () => [...medications],
    findById: (id: UUID) => medications.find(m => m.id === id),
    search: (query) => {
      const q = query.toLowerCase();
      return medications.filter(m =>
        m.name.toLowerCase().includes(q) ||
        m.genericName.toLowerCase().includes(q)
      );
    },
  },

  // NEW: Pharmacy Repository
  pharmacies: {
    findAll: () => [...pharmacies],
    findById: (id: UUID) => pharmacies.find(p => p.id === id),
  },
};

// Reset function for demo
export function resetDemoData() {
  patients = [...seedPatients];
  professionals = [...seedProfessionals];
  specialties = [...seedSpecialties];
  appointments = [...seedAppointments];
  encounters = [...seedEncounters];
  evolutions = [...seedEvolutions];
  measurements = [...seedMeasurements];
  exams = [...seedExams];
  documents = [...seedDocuments];
  nutrition = [...seedNutrition];
  users = [...seedUsers];
  units = [...seedUnits];
  patientQueue = [...seedPatientQueue];
  nursingRecords = [...seedNursingRecords];
  examRequests = [...seedExamRequests];
  prescriptions = [...seedPrescriptions];
  medications = [...seedMedications];
  pharmacies = [...seedPharmacies];
}
