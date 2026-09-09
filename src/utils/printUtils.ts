// NEXCLÍNICA — Print Utilities
// CSS e funções para geração de documentos imprimíveis

export const printCSS = `
  @page {
    size: A4;
    margin: 2cm;
  }
  
  * {
    box-sizing: border-box;
  }
  
  body {
    font-family: 'Arial', 'Helvetica', sans-serif;
    font-size: 11pt;
    line-height: 1.6;
    color: #000;
    background: #fff;
    margin: 0;
    padding: 0;
  }
  
  .no-print {
    display: none !important;
  }
  
  .page-break {
    page-break-before: always;
  }
  
  a {
    text-decoration: none;
    color: #000;
  }
  
  /* Header Styles */
  .doc-header {
    text-align: center;
    border-bottom: 2px solid #17AEB5;
    padding-bottom: 15px;
    margin-bottom: 25px;
  }
  
  .doc-header h1 {
    font-size: 16pt;
    margin: 0 0 5px 0;
    color: #17AEB5;
  }
  
  .doc-header .clinic-name {
    font-size: 14pt;
    font-weight: bold;
    margin: 0 0 3px 0;
  }
  
  .doc-header .clinic-info {
    font-size: 9pt;
    color: #666;
    margin: 0;
  }
  
  .doc-header .professional-info {
    margin-top: 10px;
    font-size: 10pt;
  }
  
  .doc-header .professional-name {
    font-weight: bold;
    font-size: 11pt;
  }
  
  /* Section Styles */
  .doc-section {
    margin-bottom: 20px;
  }
  
  .doc-section-title {
    font-size: 11pt;
    font-weight: bold;
    color: #17AEB5;
    border-bottom: 1px solid #ddd;
    padding-bottom: 5px;
    margin-bottom: 10px;
    text-transform: uppercase;
  }
  
  /* Patient Info Box */
  .patient-box {
    background: #f8f9fa;
    border: 1px solid #e9ecef;
    border-radius: 4px;
    padding: 12px;
    margin-bottom: 20px;
  }
  
  .patient-box .patient-name {
    font-size: 12pt;
    font-weight: bold;
    margin: 0 0 5px 0;
  }
  
  .patient-box .patient-details {
    font-size: 9pt;
    color: #666;
    margin: 0;
  }
  
  /* Medication Item */
  .medication-item {
    margin-bottom: 15px;
    padding: 10px;
    border-left: 3px solid #17AEB5;
    background: #f9f9f9;
  }
  
  .medication-item .med-number {
    font-weight: bold;
    color: #17AEB5;
    margin-right: 5px;
  }
  
  .medication-item .med-name {
    font-weight: bold;
    font-size: 11pt;
  }
  
  .medication-item .med-form {
    font-size: 9pt;
    color: #666;
    font-style: italic;
  }
  
  .medication-item .med-instructions {
    margin-top: 5px;
    font-size: 10pt;
  }
  
  .medication-item .med-details {
    font-size: 9pt;
    color: #666;
    margin-top: 3px;
  }
  
  /* Signature Section */
  .signature-section {
    margin-top: 50px;
    text-align: center;
  }
  
  .signature-line {
    border-top: 1px solid #000;
    width: 300px;
    margin: 40px auto 10px auto;
  }
  
  .signature-name {
    font-weight: bold;
    margin: 0;
  }
  
  .signature-council {
    font-size: 9pt;
    color: #666;
    margin: 0;
  }
  
  /* Footer */
  .doc-footer {
    margin-top: 30px;
    padding-top: 15px;
    border-top: 1px solid #ddd;
    text-align: center;
    font-size: 8pt;
    color: #999;
  }
  
  /* Info Grid */
  .info-grid {
    display: grid;
    grid-template-columns: 1fr 1fr;
    gap: 10px;
    margin-bottom: 15px;
  }
  
  .info-item {
    font-size: 10pt;
  }
  
  .info-label {
    font-weight: bold;
    color: #666;
    font-size: 9pt;
  }
  
  .info-value {
    margin-top: 2px;
  }
  
  /* List Styles */
  .doc-list {
    margin: 0;
    padding-left: 20px;
  }
  
  .doc-list li {
    margin-bottom: 5px;
    font-size: 10pt;
  }
  
  /* Table Styles */
  .doc-table {
    width: 100%;
    border-collapse: collapse;
    margin-bottom: 15px;
  }
  
  .doc-table th,
  .doc-table td {
    padding: 8px;
    border: 1px solid #ddd;
    text-align: left;
    font-size: 10pt;
  }
  
  .doc-table th {
    background: #f8f9fa;
    font-weight: bold;
  }
  
  /* Certificate Specific */
  .certificate-text {
    text-align: justify;
    line-height: 2;
    margin: 30px 0;
    font-size: 11pt;
  }
  
  /* QR Code */
  .qr-code-section {
    text-align: center;
    margin: 20px 0;
  }
  
  .qr-code-section img {
    max-width: 120px;
  }
  
  /* Urgency Badge */
  .urgency-badge {
    display: inline-block;
    padding: 3px 10px;
    border-radius: 3px;
    font-size: 9pt;
    font-weight: bold;
    text-transform: uppercase;
  }
  
  .urgency-normal {
    background: #e9ecef;
    color: #495057;
  }
  
  .urgency-urgente {
    background: #fff3cd;
    color: #856404;
  }
  
  .urgency-emergencia {
    background: #f8d7da;
    color: #721c24;
  }
  
  /* Print-specific adjustments */
  @media print {
    body {
      -webkit-print-color-adjust: exact;
      print-color-adjust: exact;
    }
    
    .doc-header {
      page-break-inside: avoid;
    }
    
    .signature-section {
      page-break-inside: avoid;
    }
    
    .medication-item {
      page-break-inside: avoid;
    }
  }
`;

// ============================================
// DOCUMENT GENERATORS
// ============================================

export function generatePrescriptionHTML(data: any): string {
  const { header, prescription, patient, medications, instructions, signature, footer } = data;
  
  const prescriptionTypeLabels: Record<string, string> = {
    'SIMPLES': 'RECEITUÁRIO SIMPLES',
    'ANTIBIOTICO': 'RECEITUÁRIO DE ANTIBIÓTICO',
    'CONTROLADO_A': 'RECEITUÁRIO DE MEDICAMENTO CONTROLADO - A',
    'CONTROLADO_B': 'RECEITUÁRIO DE MEDICAMENTO CONTROLADO - B',
  };
  const prescriptionTypeLabel = prescriptionTypeLabels[prescription.prescriptionType] || 'RECEITUÁRIO MÉDICO';
  
  const medsHTML = medications.map((med: any, idx: number) => `
    <div class="medication-item">
      <div>
        <span class="med-number">${idx + 1}.</span>
        <span class="med-name">${med.name} ${med.dosage}</span>
        <span class="med-form">— ${med.pharmaceuticalForm}</span>
      </div>
      ${med.genericName ? `<div class="med-details">(${med.genericName})</div>` : ''}
      <div class="med-instructions">${med.dosageInstruction}</div>
      ${med.duration ? `<div class="med-details">Duração: ${med.duration}</div>` : ''}
      ${med.quantity ? `<div class="med-details">Quantidade: ${med.quantity} ${med.quantityUnit || ''}</div>` : ''}
      ${med.notes ? `<div class="med-details"><em>${med.notes}</em></div>` : ''}
    </div>
  `).join('');
  
  return `
    <div class="doc-header">
      <h1>${header.clinicName}</h1>
      <p class="clinic-info">${header.clinicAddress}</p>
      <p class="clinic-info">Telefone: ${header.clinicPhone}</p>
      ${header.clinicEmail ? `<p class="clinic-info">Email: ${header.clinicEmail}</p>` : ''}
      <div class="professional-info">
        <p class="professional-name">${header.professionalName}</p>
        <p>${header.professionalCouncil}: ${header.councilNumber} — ${header.specialty}</p>
      </div>
    </div>
    
    <div style="text-align: center; margin-bottom: 20px;">
      <h2 style="font-size: 14pt; margin: 0;">${prescriptionTypeLabel}</h2>
      <p style="font-size: 9pt; color: #666; margin: 5px 0;">
        Nº: ${prescription.prescriptionNumber} | 
        Data: ${formatDate(prescription.issueDate)} | 
        Válida até: ${formatDate(prescription.validUntil)}
      </p>
    </div>
    
    <div class="patient-box">
      <p class="patient-name">${patient.fullName}</p>
      <p class="patient-details">
        Idade: ${patient.age} anos | Sexo: ${patient.gender}
        ${patient.cpf ? `| CPF: ${patient.cpf}` : ''}
        ${patient.phone ? `| Tel: ${patient.phone}` : ''}
      </p>
    </div>
    
    <div class="doc-section">
      <div class="doc-section-title">Medicamentos Prescritos</div>
      ${medsHTML}
    </div>
    
    ${instructions ? `
      <div class="doc-section">
        <div class="doc-section-title">Instruções</div>
        <p style="font-size: 10pt;">${instructions}</p>
      </div>
    ` : ''}
    
    <div class="signature-section">
      <p style="font-size: 10pt;">${signature.city}, ${formatDateLong(signature.date)}</p>
      <div class="signature-line"></div>
      <p class="signature-name">${signature.professionalName}</p>
      <p class="signature-council">${header.professionalCouncil}: ${signature.councilNumber}</p>
    </div>
    
    ${footer ? `
      <div class="doc-footer">
        ${footer.warning || 'Este receituário foi emitido eletronicamente.'}
        ${footer.verificationUrl ? `<br>Verifique em: ${footer.verificationUrl}` : ''}
      </div>
    ` : ''}
  `;
}

export function generatePatientSummaryHTML(data: any): string {
  const { header, patient, clinicalHistory, recentEncounters, recentMeasurements, recentPrescriptions, printedAt } = data;
  
  return `
    <div class="doc-header">
      <h1>${header.clinicName}</h1>
      <p class="clinic-info">${header.clinicAddress}</p>
      <p class="clinic-info">Telefone: ${header.clinicPhone}</p>
    </div>
    
    <div style="text-align: center; margin-bottom: 20px;">
      <h2 style="font-size: 14pt; margin: 0;">FICHA DO PACIENTE</h2>
      <p style="font-size: 9pt; color: #666; margin: 5px 0;">
        Impresso em: ${formatDateTime(printedAt)}
      </p>
    </div>
    
    <div class="doc-section">
      <div class="doc-section-title">Dados Pessoais</div>
      <div class="info-grid">
        <div class="info-item">
          <div class="info-label">Nome Completo</div>
          <div class="info-value">${patient.fullName}</div>
        </div>
        <div class="info-item">
          <div class="info-label">Data de Nascimento</div>
          <div class="info-value">${formatDate(patient.birthDate)} (${patient.age} anos)</div>
        </div>
        <div class="info-item">
          <div class="info-label">Gênero</div>
          <div class="info-value">${patient.gender}</div>
        </div>
        <div class="info-item">
          <div class="info-label">CPF</div>
          <div class="info-value">${patient.cpf || 'Não informado'}</div>
        </div>
        ${patient.rg ? `
          <div class="info-item">
            <div class="info-label">RG</div>
            <div class="info-value">${patient.rg}</div>
          </div>
        ` : ''}
        <div class="info-item">
          <div class="info-label">Telefone</div>
          <div class="info-value">${patient.phone}</div>
        </div>
        ${patient.email ? `
          <div class="info-item">
            <div class="info-label">Email</div>
            <div class="info-value">${patient.email}</div>
          </div>
        ` : ''}
        ${patient.address ? `
          <div class="info-item">
            <div class="info-label">Endereço</div>
            <div class="info-value">${patient.address}</div>
          </div>
        ` : ''}
        ${patient.occupation ? `
          <div class="info-item">
            <div class="info-label">Ocupação</div>
            <div class="info-value">${patient.occupation}</div>
          </div>
        ` : ''}
      </div>
    </div>
    
    ${patient.healthInsurance ? `
      <div class="doc-section">
        <div class="doc-section-title">Convênio / Plano de Saúde</div>
        <div class="info-grid">
          <div class="info-item">
            <div class="info-label">Plano</div>
            <div class="info-value">${patient.healthInsurance}</div>
          </div>
          ${patient.insuranceNumber ? `
            <div class="info-item">
              <div class="info-label">Número</div>
              <div class="info-value">${patient.insuranceNumber}</div>
            </div>
          ` : ''}
        </div>
      </div>
    ` : ''}
    
    ${patient.emergencyContactName ? `
      <div class="doc-section">
        <div class="doc-section-title">Contato de Emergência</div>
        <div class="info-grid">
          <div class="info-item">
            <div class="info-label">Nome</div>
            <div class="info-value">${patient.emergencyContactName}</div>
          </div>
          <div class="info-item">
            <div class="info-label">Telefone</div>
            <div class="info-value">${patient.emergencyContactPhone || ''}</div>
          </div>
        </div>
      </div>
    ` : ''}
    
    ${clinicalHistory && (clinicalHistory.allergies?.length || clinicalHistory.chronicConditions?.length || clinicalHistory.currentMedications?.length) ? `
      <div class="doc-section">
        <div class="doc-section-title">Histórico Clínico</div>
        ${clinicalHistory.allergies?.length ? `
          <div style="margin-bottom: 10px;">
            <strong>Alergias:</strong>
            <ul class="doc-list">
              ${clinicalHistory.allergies.map((a: string) => `<li>${a}</li>`).join('')}
            </ul>
          </div>
        ` : ''}
        ${clinicalHistory.chronicConditions?.length ? `
          <div style="margin-bottom: 10px;">
            <strong>Condições Crônicas:</strong>
            <ul class="doc-list">
              ${clinicalHistory.chronicConditions.map((c: string) => `<li>${c}</li>`).join('')}
            </ul>
          </div>
        ` : ''}
        ${clinicalHistory.currentMedications?.length ? `
          <div style="margin-bottom: 10px;">
            <strong>Medicações em Uso:</strong>
            <ul class="doc-list">
              ${clinicalHistory.currentMedications.map((m: string) => `<li>${m}</li>`).join('')}
            </ul>
          </div>
        ` : ''}
      </div>
    ` : ''}
    
    ${recentEncounters?.length ? `
      <div class="doc-section">
        <div class="doc-section-title">Últimos Atendimentos</div>
        <table class="doc-table">
          <thead>
            <tr>
              <th>Data</th>
              <th>Profissional</th>
              <th>Queixa</th>
            </tr>
          </thead>
          <tbody>
            ${recentEncounters.map((e: any) => `
              <tr>
                <td>${formatDate(e.date)}</td>
                <td>${e.professional}<br><small style="color:#666;">${e.specialty}</small></td>
                <td>${e.chiefComplaint || '-'}</td>
              </tr>
            `).join('')}
          </tbody>
        </table>
      </div>
    ` : ''}
    
    ${recentMeasurements?.length ? `
      <div class="doc-section">
        <div class="doc-section-title">Últimas Medidas</div>
        <table class="doc-table">
          <thead>
            <tr>
              <th>Data</th>
              <th>Tipo</th>
              <th>Valor</th>
            </tr>
          </thead>
          <tbody>
            ${recentMeasurements.map((m: any) => `
              <tr>
                <td>${formatDate(m.date)}</td>
                <td>${m.type}</td>
                <td>${m.value} ${m.unit}</td>
              </tr>
            `).join('')}
          </tbody>
        </table>
      </div>
    ` : ''}
    
    <div class="doc-footer">
      <p>Este documento contém informações confidenciais do paciente.</p>
      <p>Uso exclusivo para fins clínicos e administrativos.</p>
    </div>
  `;
}

export function generateCertificateHTML(data: any): string {
  const { header, certificate, signature } = data;
  
  let certificateText = '';
  
  if (certificate.type === 'COMPARECIMENTO') {
    certificateText = `
      Atesto que o(a) Sr(a). <strong>${certificate.patientName.toUpperCase()}</strong>,
      ${certificate.patientCpf ? `portador(a) do CPF nº ${certificate.patientCpf},` : ''}
      esteve sob meus cuidados médicos em <strong>${formatDate(certificate.appointmentDate)}</strong>
      ${certificate.appointmentTime ? `às <strong>${certificate.appointmentTime}</strong>` : ''},
      neste consultório.
    `;
  } else if (certificate.type === 'LICENCA_MEDICA') {
    certificateText = `
      Atesto que o(a) Sr(a). <strong>${certificate.patientName.toUpperCase()}</strong>,
      ${certificate.patientCpf ? `portador(a) do CPF nº ${certificate.patientCpf},` : ''}
      necessita de afastamento de suas atividades por <strong>${certificate.daysOff} dia(s)</strong>,
      ${certificate.startDate ? `no período de <strong>${formatDate(certificate.startDate)}</strong>` : ''}
      ${certificate.endDate ? `a <strong>${formatDate(certificate.endDate)}</strong>` : ''},
      ${certificate.diagnosis ? `por motivo de saúde.` : `por motivos de saúde.`}
    `;
  } else {
    certificateText = `
      Atesto para os devidos fins que o(a) Sr(a). <strong>${certificate.patientName.toUpperCase()}</strong>,
      ${certificate.patientCpf ? `portador(a) do CPF nº ${certificate.patientCpf},` : ''}
      encontra-se em condições de saúde compatíveis com suas atividades habituais.
    `;
  }
  
  return `
    <div class="doc-header">
      <h1>${header.clinicName}</h1>
      <p class="clinic-info">${header.clinicAddress}</p>
      <p class="clinic-info">Telefone: ${header.clinicPhone}</p>
      <div class="professional-info">
        <p class="professional-name">${header.professionalName}</p>
        <p>${header.professionalCouncil}: ${header.councilNumber} — ${header.specialty}</p>
      </div>
    </div>
    
    <div style="text-align: center; margin: 30px 0;">
      <h2 style="font-size: 16pt; margin: 0;">ATESTADO MÉDICO</h2>
    </div>
    
    <div class="certificate-text">
      ${certificateText}
      
      ${certificate.purpose ? `<p style="margin-top: 20px;">${certificate.purpose}.</p>` : '<p style="margin-top: 20px;">Por ser verdade, firmo o presente atestado.</p>'}
    </div>
    
    <div class="signature-section">
      <p style="font-size: 10pt;">${signature.city}, ${formatDateLong(signature.date)}</p>
      <div class="signature-line"></div>
      <p class="signature-name">${signature.professionalName}</p>
      <p class="signature-council">${header.professionalCouncil}: ${signature.councilNumber}</p>
    </div>
    
    <div class="doc-footer">
      <p>${header.clinicName} — ${header.clinicAddress} — Tel: ${header.clinicPhone}</p>
    </div>
  `;
}

export function generateReferralHTML(data: any): string {
  const { requester, patient, referral, date } = data;
  
  const urgencyClass = referral.urgency === 'URGENTE' ? 'urgency-urgente' : 
                       referral.urgency === 'EMERGENCIA' ? 'urgency-emergencia' : 'urgency-normal';
  
  return `
    <div class="doc-header">
      <h1>${requester.clinicName}</h1>
      <div class="professional-info">
        <p class="professional-name">${requester.name}</p>
        <p>${requester.council}: ${requester.councilNumber} — ${requester.specialty}</p>
      </div>
    </div>
    
    <div style="text-align: center; margin: 20px 0;">
      <h2 style="font-size: 14pt; margin: 0;">ENCAMINHAMENTO MÉDICO</h2>
      <p style="font-size: 9pt; color: #666; margin: 5px 0;">Data: ${formatDate(date)}</p>
    </div>
    
    <div class="patient-box">
      <p class="patient-name">${patient.fullName}</p>
      <p class="patient-details">
        Idade: ${patient.age} anos | Tel: ${patient.phone}
        ${patient.healthInsurance ? `| Convênio: ${patient.healthInsurance}` : ''}
      </p>
    </div>
    
    <div class="doc-section">
      <div class="info-grid">
        <div class="info-item">
          <div class="info-label">Especialidade Solicitada</div>
          <div class="info-value"><strong>${referral.specialty}</strong></div>
        </div>
        <div class="info-item">
          <div class="info-label">Urgência</div>
          <div class="info-value"><span class="urgency-badge ${urgencyClass}">${referral.urgency}</span></div>
        </div>
      </div>
    </div>
    
    <div class="doc-section">
      <div class="doc-section-title">Motivo do Encaminhamento</div>
      <p style="font-size: 10pt;">${referral.reason}</p>
    </div>
    
    <div class="doc-section">
      <div class="doc-section-title">Resumo Clínico</div>
      <p style="font-size: 10pt;">${referral.clinicalSummary}</p>
    </div>
    
    ${referral.currentMedications?.length ? `
      <div class="doc-section">
        <div class="doc-section-title">Medicações em Uso</div>
        <ul class="doc-list">
          ${referral.currentMedications.map((m: string) => `<li>${m}</li>`).join('')}
        </ul>
      </div>
    ` : ''}
    
    ${referral.examsRequested?.length ? `
      <div class="doc-section">
        <div class="doc-section-title">Exames Já Realizados</div>
        <ul class="doc-list">
          ${referral.examsRequested.map((e: string) => `<li>${e}</li>`).join('')}
        </ul>
      </div>
    ` : ''}
    
    ${referral.specificQuestions?.length ? `
      <div class="doc-section">
        <div class="doc-section-title">Questões Específicas</div>
        <ul class="doc-list">
          ${referral.specificQuestions.map((q: string) => `<li>${q}</li>`).join('')}
        </ul>
      </div>
    ` : ''}
    
    <div class="signature-section">
      <div class="signature-line"></div>
      <p class="signature-name">${requester.name}</p>
      <p class="signature-council">${requester.council}: ${requester.councilNumber}</p>
    </div>
    
    <div class="doc-footer">
      <p>${requester.clinicName} — Tel: ${requester.phone}</p>
      ${requester.email ? `<p>Email: ${requester.email}</p>` : ''}
    </div>
  `;
}

export function generateExamRequestHTML(data: any): string {
  const { requester, patient, exams, generalInstructions, date, signature } = data;
  
  const examsHTML = exams.map((exam: any, idx: number) => `
    <tr>
      <td style="text-align: center;">${idx + 1}</td>
      <td><strong>${exam.examName}</strong><br><small style="color:#666;">${exam.category}</small></td>
      <td><span class="urgency-badge ${exam.priority === 'URGENTE' ? 'urgency-urgente' : 'urgency-normal'}">${exam.priority}</span></td>
      <td>${exam.instructions || '-'}</td>
      <td>${exam.clinicalQuestion || '-'}</td>
    </tr>
  `).join('');
  
  return `
    <div class="doc-header">
      <h1>${requester.clinicName}</h1>
      <div class="professional-info">
        <p class="professional-name">${requester.name}</p>
        <p>${requester.council}: ${requester.councilNumber} — ${requester.specialty}</p>
      </div>
    </div>
    
    <div style="text-align: center; margin: 20px 0;">
      <h2 style="font-size: 14pt; margin: 0;">SOLICITAÇÃO DE EXAMES</h2>
      <p style="font-size: 9pt; color: #666; margin: 5px 0;">Data: ${formatDate(date)}</p>
    </div>
    
    <div class="patient-box">
      <p class="patient-name">${patient.fullName}</p>
      <p class="patient-details">
        Idade: ${patient.age} anos | Sexo: ${patient.gender}
        ${patient.cpf ? `| CPF: ${patient.cpf}` : ''}
        ${patient.healthInsurance ? `| Convênio: ${patient.healthInsurance}` : ''}
      </p>
    </div>
    
    <div class="doc-section">
      <div class="doc-section-title">Exames Solicitados</div>
      <table class="doc-table">
        <thead>
          <tr>
            <th style="width: 30px;">#</th>
            <th>Exame</th>
            <th style="width: 80px;">Prioridade</th>
            <th>Instruções</th>
            <th>Questão Clínica</th>
          </tr>
        </thead>
        <tbody>
          ${examsHTML}
        </tbody>
      </table>
    </div>
    
    ${generalInstructions ? `
      <div class="doc-section">
        <div class="doc-section-title">Instruções Gerais</div>
        <p style="font-size: 10pt;">${generalInstructions}</p>
      </div>
    ` : ''}
    
    <div class="signature-section">
      <div class="signature-line"></div>
      <p class="signature-name">${signature.professionalName}</p>
      <p class="signature-council">${requester.council}: ${signature.councilNumber}</p>
    </div>
    
    <div class="doc-footer">
      <p>${requester.clinicName} — Tel: ${requester.phone}</p>
    </div>
  `;
}

// ============================================
// HELPER FUNCTIONS
// ============================================

function formatDate(isoString: string): string {
  if (!isoString) return '';
  const date = new Date(isoString);
  return date.toLocaleDateString('pt-BR');
}

function formatDateTime(isoString: string): string {
  if (!isoString) return '';
  const date = new Date(isoString);
  return date.toLocaleString('pt-BR');
}

function formatDateLong(isoString: string): string {
  if (!isoString) return '';
  const date = new Date(isoString);
  const months = ['janeiro', 'fevereiro', 'março', 'abril', 'maio', 'junho', 
                  'julho', 'agosto', 'setembro', 'outubro', 'novembro', 'dezembro'];
  return `${date.getDate()} de ${months[date.getMonth()]} de ${date.getFullYear()}`;
}

export function calculateAge(birthDate: string): number {
  const today = new Date();
  const birth = new Date(birthDate);
  let age = today.getFullYear() - birth.getFullYear();
  const monthDiff = today.getMonth() - birth.getMonth();
  if (monthDiff < 0 || (monthDiff === 0 && today.getDate() < birth.getDate())) {
    age--;
  }
  return age;
}

// ============================================
// MAIN PRINT FUNCTION
// ============================================

export function generatePrintHTML(documentType: string, data: any): string {
  let content = '';
  
  switch (documentType) {
    case 'PRESCRIPTION':
      content = generatePrescriptionHTML(data);
      break;
    case 'PATIENT_SUMMARY':
      content = generatePatientSummaryHTML(data);
      break;
    case 'CERTIFICATE':
      content = generateCertificateHTML(data);
      break;
    case 'REFERRAL':
      content = generateReferralHTML(data);
      break;
    case 'EXAM_REQUEST':
      content = generateExamRequestHTML(data);
      break;
    default:
      content = '<p>Documento não suportado</p>';
  }
  
  return `
    <!DOCTYPE html>
    <html lang="pt-BR">
      <head>
        <meta charset="UTF-8">
        <title>Documento - NEXCLÍNICA</title>
        <style>${printCSS}</style>
      </head>
      <body>
        ${content}
      </body>
    </html>
  `;
}

export function printDocument(documentType: string, data: any): void {
  const html = generatePrintHTML(documentType, data);
  const printWindow = window.open('', '_blank');
  
  if (!printWindow) {
    alert('Por favor, permita pop-ups para imprimir este documento.');
    return;
  }
  
  printWindow.document.write(html);
  printWindow.document.close();
  
  printWindow.onload = () => {
    printWindow.focus();
    setTimeout(() => {
      printWindow.print();
    }, 250);
  };
}
