// NEXCLÍNICA — AI Clinical Assistant Service
// Protocol-based clinical decision support (SAFE & ASSISTIVE ONLY)
import type { 
  AISuggestion, ClinicalProtocol, SuggestedMedication, 
  AISuggestionAlert, EvidenceLevel 
} from '../../domain/models';
import { v4 as uuidv4 } from 'uuid';

// ============================================
// CLINICAL PROTOCOLS DATABASE
// ============================================

const CLINICAL_PROTOCOLS: ClinicalProtocol[] = [
  {
    id: 'protocol-001',
    name: 'Cefaleia Tensional',
    condition: 'Cefaleia tensional',
    icd10Codes: ['G44.2'],
    indications: ['dor de cabeça', 'cefaleia', 'pressão na cabeça', 'dor tensional'],
    firstLineMedications: [
      {
        id: 'med-001',
        medicationId: 'med-dipirona',
        name: 'Dipirona Sódica',
        genericName: 'Dipirona',
        dosage: '500mg',
        dosageInstruction: '1 comprimido de 6 em 6 horas se necessário',
        duration: '5 dias',
        maxDailyDose: '4g',
        contraindications: ['Alergia a dipirona', 'Discrasias sanguíneas'],
        sideEffects: ['Hipotensão', 'Reações alérgicas'],
        pregnancyCategory: 'B',
      },
      {
        id: 'med-002',
        medicationId: 'med-paracetamol',
        name: 'Paracetamol',
        genericName: 'Paracetamol',
        dosage: '750mg',
        dosageInstruction: '1 comprimido de 6 em 6 horas se necessário',
        duration: '5 dias',
        maxDailyDose: '3g',
        contraindications: ['Insuficiência hepática grave'],
        sideEffects: ['Hepatotoxicidade em doses elevadas'],
        pregnancyCategory: 'B',
      },
    ],
    secondLineMedications: [
      {
        id: 'med-003',
        medicationId: 'med-ibuprofeno',
        name: 'Ibuprofeno',
        genericName: 'Ibuprofeno',
        dosage: '400mg',
        dosageInstruction: '1 comprimido de 8 em 8 horas após refeições',
        duration: '5 dias',
        maxDailyDose: '1200mg',
        contraindications: ['Úlcera péptica ativa', 'Insuficiência renal grave'],
        sideEffects: ['Dispepsia', 'Risco cardiovascular'],
        pregnancyCategory: 'C',
      },
    ],
    suggestedExams: [
      {
        examTypeId: 'hemograma',
        examName: 'Hemograma completo',
        category: 'Laboratorial',
        reason: 'Avaliar discrasias sanguíneas se uso prolongado de AINEs',
        priority: 'ROUTINE',
      },
    ],
    lifestyleRecommendations: [
      'Manter hidratação adequada (2L de água/dia)',
      'Regular horário de sono',
      'Evitar jejum prolongado',
      'Praticar relaxamento e exercícios físicos',
      'Reduzir estresse e ansiedade',
    ],
    evidenceLevel: 'A',
    guidelines: [
      'Diretriz Brasileira de Cefaleias (2023)',
      'International Classification of Headache Disorders (ICHD-3)',
    ],
    lastUpdated: new Date().toISOString(),
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
  },
  {
    id: 'protocol-002',
    name: 'Hipertensão Arterial Sistêmica',
    condition: 'Hipertensão arterial sistêmica',
    icd10Codes: ['I10'],
    indications: ['pressão alta', 'hipertensão', 'PA elevada', 'pressão arterial'],
    firstLineMedications: [
      {
        id: 'med-004',
        medicationId: 'med-losartana',
        name: 'Losartana Potássica',
        genericName: 'Losartana',
        dosage: '50mg',
        dosageInstruction: '1 comprimido 1x ao dia',
        duration: 'Contínuo',
        maxDailyDose: '100mg',
        contraindications: ['Gravidez', 'Estenose bilateral de artéria renal'],
        sideEffects: ['Hipotensão', 'Hipercalemia', 'Tontura'],
        pregnancyCategory: 'D',
      },
    ],
    secondLineMedications: [
      {
        id: 'med-005',
        medicationId: 'med-anlodipino',
        name: 'Anlodipino',
        genericName: 'Anlodipino',
        dosage: '5mg',
        dosageInstruction: '1 comprimido 1x ao dia',
        duration: 'Contínuo',
        maxDailyDose: '10mg',
        contraindications: ['Hipotensão grave', 'Choque cardiogênico'],
        sideEffects: ['Edema de membros inferiores', 'Rubor facial'],
        pregnancyCategory: 'C',
      },
    ],
    suggestedExams: [
      {
        examTypeId: 'ecg',
        examName: 'Eletrocardiograma',
        category: 'Cardiológico',
        reason: 'Avaliar sobrecarga ventricular esquerda',
        priority: 'ROUTINE',
      },
      {
        examTypeId: 'creatinina',
        examName: 'Creatinina sérica',
        category: 'Laboratorial',
        reason: 'Avaliar função renal',
        priority: 'ROUTINE',
      },
    ],
    lifestyleRecommendations: [
      'Reduzir consumo de sal (<5g/dia)',
      'Praticar atividade física regular (150min/semana)',
      'Manter peso adequado (IMC <25)',
      'Limitar consumo de álcool',
      'Parar de fumar',
      'Controlar estresse',
    ],
    evidenceLevel: 'A',
    guidelines: [
      'VII Diretriz Brasileira de Hipertensão Arterial (2023)',
      'Diretrizes da Sociedade Brasileira de Cardiologia',
    ],
    lastUpdated: new Date().toISOString(),
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
  },
  {
    id: 'protocol-003',
    name: 'Diabetes Mellitus Tipo 2',
    condition: 'Diabetes mellitus tipo 2',
    icd10Codes: ['E11'],
    indications: ['diabetes', 'glicemia alta', 'glicose elevada', 'diabético'],
    firstLineMedications: [
      {
        id: 'med-006',
        medicationId: 'med-metformina',
        name: 'Metformina',
        genericName: 'Metformina',
        dosage: '850mg',
        dosageInstruction: '1 comprimido 2x ao dia após refeições',
        duration: 'Contínuo',
        maxDailyDose: '2550mg',
        contraindications: ['Insuficiência renal grave (TFG<30)', 'Acidose metabólica'],
        sideEffects: ['Distúrbios gastrointestinais', 'Deficiência de B12'],
        pregnancyCategory: 'B',
      },
    ],
    suggestedExams: [
      {
        examTypeId: 'hba1c',
        examName: 'Hemoglobina Glicada (HbA1c)',
        category: 'Laboratorial',
        reason: 'Controle glicêmico trimestral',
        priority: 'ROUTINE',
      },
      {
        examTypeId: 'glicemia_jejum',
        examName: 'Glicemia de jejum',
        category: 'Laboratorial',
        reason: 'Monitoramento glicêmico',
        priority: 'ROUTINE',
      },
    ],
    lifestyleRecommendations: [
      'Dieta balanceada com controle de carboidratos',
      'Atividade física regular (150min/semana)',
      'Perda de peso se sobrepeso/obesidade',
      'Monitoramento glicêmico domiciliar',
      'Cessação do tabagismo',
      'Exame de fundo de olho anual',
    ],
    evidenceLevel: 'A',
    guidelines: [
      'Diretrizes da Sociedade Brasileira de Diabetes (2023)',
      'American Diabetes Association Standards of Care',
    ],
    lastUpdated: new Date().toISOString(),
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
  },
];

// ============================================
// AI SERVICE
// ============================================

export class AIClinicalService {
  /**
   * Generate clinical suggestions based on patient data and encounter
   * IMPORTANT: This is ASSISTIVE ONLY - doctor makes final decision
   */
  static generateSuggestions(
    patientId: string,
    professionalId: string,
    encounterId: string,
    chiefComplaint: string,
    assessment: string,
    patientAge: number,
    patientGender: string,
    allergies: string[] = [],
    currentMedications: string[] = []
  ): AISuggestion[] {
    const suggestions: AISuggestion[] = [];
    const complaintLower = (chiefComplaint + ' ' + assessment).toLowerCase();

    // Match protocols based on indications
    const matchedProtocols = CLINICAL_PROTOCOLS.filter(protocol =>
      protocol.indications.some(indication => 
        complaintLower.includes(indication.toLowerCase())
      )
    );

    matchedProtocols.forEach(protocol => {
      // Generate medication suggestions
      const medicationSuggestions = this.generateMedicationSuggestions(
        protocol,
        allergies,
        currentMedications,
        patientAge,
        patientGender
      );

      if (medicationSuggestions.length > 0) {
        const alerts = this.checkSafetyAlerts(
          medicationSuggestions,
          allergies,
          currentMedications,
          patientAge,
          patientGender
        );

        suggestions.push({
          id: uuidv4(),
          tenantId: 'demo-tenant',
          encounterId,
          patientId,
          professionalId,
          suggestionType: 'MEDICATION',
          title: `Sugestão de Tratamento: ${protocol.name}`,
          description: `Com base nos sintomas relatados e protocolos clínicos vigentes, sugerimos o seguinte esquema terapêutico.`,
          category: protocol.condition,
          medications: medicationSuggestions,
          rationale: this.generateRationale(protocol, chiefComplaint, assessment),
          evidenceLevel: protocol.evidenceLevel,
          guidelines: protocol.guidelines,
          references: protocol.guidelines,
          alerts: alerts.length > 0 ? alerts : undefined,
          confidenceScore: this.calculateConfidence(protocol, chiefComplaint, assessment),
          status: 'SUGGESTED',
          suggestedAt: new Date().toISOString(),
          createdAt: new Date().toISOString(),
          updatedAt: new Date().toISOString(),
        });
      }

      // Generate exam suggestions
      if (protocol.suggestedExams && protocol.suggestedExams.length > 0) {
        suggestions.push({
          id: uuidv4(),
          tenantId: 'demo-tenant',
          encounterId,
          patientId,
          professionalId,
          suggestionType: 'EXAM',
          title: 'Exames Complementares Sugeridos',
          description: 'Para melhor avaliação do caso, sugerimos os seguintes exames complementares.',
          category: protocol.condition,
          exams: protocol.suggestedExams.map(exam => ({
            examTypeId: exam.examTypeId,
            examName: exam.examName,
            category: exam.category,
            reason: exam.reason,
            priority: exam.priority,
            preparation: exam.priority === 'URGENT' ? 'Jejum de 8 horas' : undefined,
          })),
          rationale: `Exames recomendados pelo protocolo ${protocol.name} para avaliação complementar.`,
          evidenceLevel: protocol.evidenceLevel,
          guidelines: protocol.guidelines,
          confidenceScore: 0.85,
          status: 'SUGGESTED',
          suggestedAt: new Date().toISOString(),
          createdAt: new Date().toISOString(),
          updatedAt: new Date().toISOString(),
        });
      }

      // Generate lifestyle suggestions
      if (protocol.lifestyleRecommendations && protocol.lifestyleRecommendations.length > 0) {
        suggestions.push({
          id: uuidv4(),
          tenantId: 'demo-tenant',
          encounterId,
          patientId,
          professionalId,
          suggestionType: 'LIFESTYLE',
          title: 'Recomendações de Estilo de Vida',
          description: 'Medidas não farmacológicas importantes para o tratamento.',
          category: protocol.condition,
          lifestyleRecommendations: protocol.lifestyleRecommendations,
          rationale: 'Mudanças no estilo de vida são fundamentais para o controle da condição.',
          evidenceLevel: protocol.evidenceLevel,
          guidelines: protocol.guidelines,
          confidenceScore: 0.95,
          status: 'SUGGESTED',
          suggestedAt: new Date().toISOString(),
          createdAt: new Date().toISOString(),
          updatedAt: new Date().toISOString(),
        });
      }
    });

    return suggestions;
  }

  private static generateMedicationSuggestions(
    protocol: ClinicalProtocol,
    allergies: string[],
    currentMedications: string[],
    patientAge: number,
    patientGender: string
  ): SuggestedMedication[] {
    const suggestions: SuggestedMedication[] = [];

    // First line medications
    protocol.firstLineMedications.forEach(med => {
      const isAllergic = allergies.some(allergy => 
        med.name.toLowerCase().includes(allergy.toLowerCase()) ||
        med.genericName.toLowerCase().includes(allergy.toLowerCase())
      );

      if (!isAllergic) {
        suggestions.push({
          medicationId: med.medicationId,
          medicationName: med.name,
          genericName: med.genericName,
          dosage: med.dosage,
          pharmaceuticalForm: 'Comprimido',
          dosageInstruction: med.dosageInstruction,
          duration: med.duration,
          quantity: this.calculateQuantity(med.dosageInstruction, med.duration || '7 dias'),
          reason: `Medicamento de primeira linha para ${protocol.condition}`,
          evidenceLevel: protocol.evidenceLevel,
          alerts: {
            contraindication: med.contraindications?.join(', '),
            sideEffect: med.sideEffects?.join(', '),
          },
        });
      }
    });

    return suggestions;
  }

  private static checkSafetyAlerts(
    medications: SuggestedMedication[],
    allergies: string[],
    currentMedications: string[],
    patientAge: number,
    patientGender: string
  ): AISuggestionAlert[] {
    const alerts: AISuggestionAlert[] = [];

    // Check allergies
    medications.forEach(med => {
      const allergyMatch = allergies.find(allergy =>
        med.medicationName.toLowerCase().includes(allergy.toLowerCase()) ||
        med.genericName.toLowerCase().includes(allergy.toLowerCase())
      );

      if (allergyMatch) {
        alerts.push({
          type: 'ALLERGY',
          severity: 'CRITICAL',
          message: `ALERGA: Paciente possui alergia a ${allergyMatch}`,
          details: `O medicamento ${med.medicationName} pode causar reação alérgica.`,
          recommendation: 'NÃO PRESCREVER. Considerar alternativa terapêutica.',
        });
      }
    });

    // Check age-related alerts
    if (patientAge > 65) {
      alerts.push({
        type: 'SIDE_EFFECT',
        severity: 'MEDIUM',
        message: 'Paciente idoso (>65 anos)',
        details: 'Ajustar doses e monitorar efeitos adversos com maior atenção.',
        recommendation: 'Iniciar com dose reduzida e titular gradualmente.',
      });
    }

    // Check duplicate therapy
    medications.forEach(med => {
      const duplicate = currentMedications.find(current =>
        current.toLowerCase().includes(med.genericName.toLowerCase())
      );

      if (duplicate) {
        alerts.push({
          type: 'DUPLICATE_THERAPY',
          severity: 'HIGH',
          message: `Possível duplicidade terapêutica`,
          details: `Paciente já utiliza medicamento similar: ${duplicate}`,
          recommendation: 'Verificar se há necessidade de manutenção ou ajuste.',
        });
      }
    });

    return alerts;
  }

  private static generateRationale(
    protocol: ClinicalProtocol,
    chiefComplaint: string,
    assessment: string
  ): string {
    return `Baseado no protocolo "${protocol.name}" e nas informações clínicas fornecidas (queixa: "${chiefComplaint.substring(0, 50)}..."), este esquema terapêutico segue as diretrizes atuais com nível de evidência ${protocol.evidenceLevel}.`;
  }

  private static calculateConfidence(
    protocol: ClinicalProtocol,
    chiefComplaint: string,
    assessment: string
  ): number {
    const text = (chiefComplaint + ' ' + assessment).toLowerCase();
    const matchCount = protocol.indications.filter(ind => 
      text.includes(ind.toLowerCase())
    ).length;
    
    const baseConfidence = matchCount / protocol.indications.length;
    const evidenceBonus = protocol.evidenceLevel === 'A' ? 0.2 : 
                          protocol.evidenceLevel === 'B' ? 0.1 : 0;
    
    return Math.min(0.95, baseConfidence * 0.7 + evidenceBonus + 0.2);
  }

  private static calculateQuantity(dosageInstruction: string, duration: string): number {
    // Simple calculation - in production, use more sophisticated logic
    const timesPerDay = (dosageInstruction.match(/(\d+)x/g) || ['1x']).length;
    const days = parseInt(duration.match(/(\d+)/)?.[0] || '7');
    return timesPerDay * days;
  }
}

// ============================================
// SAFETY SERVICE
// ============================================

export class AISafetyService {
  /**
   * Validate AI suggestion before showing to doctor
   */
  static validateSuggestion(suggestion: AISuggestion): { valid: boolean; errors: string[] } {
    const errors: string[] = [];

    // Check required fields
    if (!suggestion.title) errors.push('Título obrigatório');
    if (!suggestion.description) errors.push('Descrição obrigatória');
    if (!suggestion.rationale) errors.push('Justificativa obrigatória');

    // Check evidence level
    if (!suggestion.evidenceLevel) {
      errors.push('Nível de evidência não informado');
    }

    // Check for critical alerts
    if (suggestion.alerts) {
      const criticalAlerts = suggestion.alerts.filter(a => a.severity === 'CRITICAL');
      if (criticalAlerts.length > 0) {
        errors.push(`ATENÇÃO: ${criticalAlerts.length} alerta(s) crítico(s) detectado(s)`);
      }
    }

    return {
      valid: errors.length === 0,
      errors,
    };
  }

  /**
   * Check drug interactions
   */
  static checkDrugInteractions(medications: string[]): AISuggestionAlert[] {
    // Simplified - in production, use comprehensive drug interaction database
    const alerts: AISuggestionAlert[] = [];

    // Example: AINEs + Anticoagulantes
    const hasAINS = medications.some(m => 
      m.toLowerCase().includes('ibuprofeno') || 
      m.toLowerCase().includes('diclofenaco') ||
      m.toLowerCase().includes('naproxeno')
    );
    const hasAnticoagulant = medications.some(m =>
      m.toLowerCase().includes('varfarina') ||
      m.toLowerCase().includes('rivaroxabana')
    );

    if (hasAINS && hasAnticoagulant) {
      alerts.push({
        type: 'DRUG_INTERACTION',
        severity: 'HIGH',
        message: 'Interação medicamentosa grave',
        details: 'AINEs aumentam risco de sangramento com anticoagulantes',
        recommendation: 'Evitar associação ou monitorar INR com maior frequência',
      });
    }

    return alerts;
  }
}
