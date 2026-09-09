// NEXCLÍNICA — Printable Document Models
// Interfaces para documentos imprimíveis (consultórios particulares)

// ============================================
// PRINTABLE PRESCRIPTION
// ============================================

export interface PrintablePrescription {
  // Header (clínica/consultório)
  header: {
    clinicName: string;
    clinicAddress: string;
    clinicPhone: string;
    clinicEmail?: string;
    clinicLogo?: string;
    
    professionalName: string;
    professionalCouncil: string; // CRM/UF
    councilNumber: string;
    specialty: string;
  };
  
  // Dados da receita
  prescription: {
    prescriptionNumber: string;
    issueDate: string;
    validUntil: string;
    prescriptionType: 'SIMPLES' | 'ANTIBIOTICO' | 'CONTROLADO_A' | 'CONTROLADO_B';
  };
  
  // Dados do paciente
  patient: {
    fullName: string;
    birthDate: string;
    age: number;
    gender: string;
    cpf?: string;
    phone?: string;
  };
  
  // Medicamentos
  medications: PrintableMedication[];
  
  // Instruções
  instructions?: string;
  
  // Assinatura
  signature: {
    city: string;
    date: string;
    professionalName: string;
    councilNumber: string;
  };
  
  // Rodapé
  footer?: {
    warning?: string;
    contactInfo?: string;
    verificationUrl?: string;
  };
}

export interface PrintableMedication {
  name: string;
  genericName?: string;
  dosage: string;
  pharmaceuticalForm: string;
  dosageInstruction: string;
  duration?: string;
  quantity?: number;
  quantityUnit?: string;
  notes?: string;
}

// ============================================
// PRINTABLE PATIENT SUMMARY
// ============================================

export interface PrintablePatientSummary {
  // Header
  header: {
    clinicName: string;
    clinicAddress: string;
    clinicPhone: string;
  };
  
  // Dados do paciente
  patient: {
    fullName: string;
    birthDate: string;
    age: number;
    gender: string;
    cpf?: string;
    rg?: string;
    phone: string;
    email?: string;
    address?: string;
    occupation?: string;
    
    // SUS e Plano
    susCard?: string;
    healthInsurance?: string;
    insuranceNumber?: string;
    
    // Emergência
    emergencyContactName?: string;
    emergencyContactPhone?: string;
  };
  
  // Histórico clínico
  clinicalHistory?: {
    allergies?: string[];
    chronicConditions?: string[];
    currentMedications?: string[];
    surgicalHistory?: string[];
    familyHistory?: string[];
  };
  
  // Últimos atendimentos
  recentEncounters?: {
    date: string;
    professional: string;
    specialty: string;
    chiefComplaint: string;
    diagnosis?: string;
  }[];
  
  // Últimas medidas
  recentMeasurements?: {
    type: string;
    value: number;
    unit: string;
    date: string;
  }[];
  
  // Últimas prescrições
  recentPrescriptions?: {
    date: string;
    medications: string[];
    professional: string;
  }[];
  
  // Data de impressão
  printedAt: string;
}

// ============================================
// PRINTABLE MEDICAL CERTIFICATE
// ============================================

export interface PrintableMedicalCertificate {
  // Header
  header: {
    clinicName: string;
    clinicAddress: string;
    clinicPhone: string;
    professionalName: string;
    professionalCouncil: string;
    councilNumber: string;
    specialty: string;
  };
  
  // Dados do atestado
  certificate: {
    type: 'COMPARECIMENTO' | 'SAUDE' | 'LICENCA_MEDICA';
    patientName: string;
    patientCpf?: string;
    
    // Para comparecimento
    appointmentDate?: string;
    appointmentTime?: string;
    
    // Para licença
    diagnosis?: string;
    daysOff?: number;
    startDate?: string;
    endDate?: string;
    
    // Finalidade
    purpose?: string;
  };
  
  // Assinatura
  signature: {
    city: string;
    date: string;
    professionalName: string;
    councilNumber: string;
  };
}

// ============================================
// PRINTABLE REFERRAL
// ============================================

export interface PrintableReferral {
  // Médico solicitante
  requester: {
    name: string;
    council: string;
    councilNumber: string;
    specialty: string;
    clinicName: string;
    phone: string;
    email?: string;
  };
  
  // Paciente
  patient: {
    fullName: string;
    birthDate: string;
    age: number;
    phone: string;
    susCard?: string;
    healthInsurance?: string;
  };
  
  // Encaminhamento
  referral: {
    specialty: string;
    reason: string;
    urgency: 'NORMAL' | 'URGENTE' | 'EMERGENCIA';
    clinicalSummary: string;
    currentMedications?: string[];
    examsRequested?: string[];
    specificQuestions?: string[];
  };
  
  // Data
  date: string;
}

// ============================================
// PRINTABLE EXAM REQUEST
// ============================================

export interface PrintableExamRequest {
  // Médico solicitante
  requester: {
    name: string;
    council: string;
    councilNumber: string;
    specialty: string;
    clinicName: string;
    phone: string;
  };
  
  // Paciente
  patient: {
    fullName: string;
    birthDate: string;
    age: number;
    gender: string;
    cpf?: string;
    phone: string;
    susCard?: string;
    healthInsurance?: string;
    insuranceNumber?: string;
  };
  
  // Exames solicitados
  exams: {
    examName: string;
    category: string;
    instructions?: string;
    priority: 'ROTINA' | 'URGENTE';
    clinicalQuestion?: string;
  }[];
  
  // Instruções gerais
  generalInstructions?: string;
  
  // Data e assinatura
  date: string;
  signature: {
    professionalName: string;
    councilNumber: string;
  };
}

// ============================================
// PRINT SETTINGS
// ============================================

export interface PrintSettings {
  tenantId: string;
  
  // Papel timbrado
  useLetterhead: boolean;
  letterheadImageUrl?: string;
  
  // Cabeçalho padrão
  defaultHeader: {
    clinicName: string;
    clinicAddress: string;
    clinicPhone: string;
    clinicEmail?: string;
    clinicLogo?: string;
  };
  
  // Rodapé
  defaultFooter: {
    warning?: string;
    contactInfo?: string;
  };
  
  // Preferências
  defaultPaperSize: 'A4' | 'A5' | 'LETTER';
  includeQRCode: boolean;
  includeDisclaimer: boolean;
  
  // Cores
  primaryColor: string;
  textColor: string;
}

// ============================================
// PRINT METRICS
// ============================================

export interface PrintMetrics {
  totalPrints: number;
  
  byDocumentType: {
    type: 'PRESCRIPTION' | 'PATIENT_SUMMARY' | 'CERTIFICATE' | 'REFERRAL' | 'EXAM_REQUEST';
    count: number;
    percentage: number;
  }[];
  
  byProfessional: {
    professionalId: string;
    professionalName: string;
    totalPrints: number;
  }[];
  
  byDate: {
    date: string;
    count: number;
  }[];
}
