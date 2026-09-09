// Demo Repository Implementation — In-memory store for NEXCLÍNICA Demo Mode
import { v4 as uuidv4 } from 'uuid';
import type { Repositories } from '../../domain/repositories';
import type {
  Patient, HealthcareProfessional, Specialty, Appointment,
  ClinicalEncounter, ClinicalEvolution, PatientMeasurement,
  ExamRecord, PatientDocument, NutritionAssessment, SystemUser,
  ClinicUnit, TimelineEvent, UUID
} from '../../domain/models';
import {
  seedPatients, seedProfessionals, seedSpecialties, seedAppointments,
  seedEncounters, seedEvolutions, seedMeasurements, seedExams,
  seedDocuments, seedNutrition, seedUsers, seedUnits, buildTimeline
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
}
