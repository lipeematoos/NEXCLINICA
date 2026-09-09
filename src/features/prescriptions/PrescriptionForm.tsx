// NEXCLÍNICA — Prescription with QR Code (Layer 5)
import React, { useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { useApp, getDemoProfessionalId, getDemoTenantId } from '../../services/AppContext';
import { Card, Button, Input, Select, Avatar, StatusBadge, Modal, EmptyState } from '../../components/ui';
import { QRCodeSVG } from 'qrcode.react';
import { FileText, Plus, Trash2, Send, Copy, Check, ArrowLeft, Pill, Shield } from 'lucide-react';
import { PRESCRIPTION_TYPE_LABELS, PRESCRIPTION_STATUS_LABELS } from '../../domain/models';
import type { PrescriptionType, PrescriptionMedication } from '../../domain/models';

export default function PrescriptionForm() {
  const { encounterId, patientId } = useParams<{ encounterId?: string; patientId?: string }>();
  const navigate = useNavigate();
  const { repos } = useApp();
  const professionalId = getDemoProfessionalId();

  const patient = patientId ? repos.patients.findById(patientId) : null;
  const professional = repos.professionals.findById(professionalId);
  const pharmacies = repos.pharmacies.findAll();
  const medications = repos.medications.findAll();

  const [form, setForm] = useState({
    prescriptionType: 'SIMPLES' as PrescriptionType,
    instructions: '',
    validDays: '30',
    pharmacyId: '',
  });
  const [meds, setMeds] = useState<PrescriptionMedication[]>([]);
  const [showAddMed, setShowAddMed] = useState(false);
  const [medSearch, setMedSearch] = useState('');
  const [newMed, setNewMed] = useState({
    name: '',
    genericName: '',
    dosage: '',
    pharmaceuticalForm: 'Comprimido',
    dosageInstruction: '',
    frequency: '',
    duration: '',
    route: 'Oral',
    timing: '',
    quantity: '30',
    quantityUnit: 'comprimidos',
    allowGeneric: true,
  });
  const [createdPrescription, setCreatedPrescription] = useState<string | null>(null);

  const filteredMeds = medSearch
    ? medications.filter(m => m.name.toLowerCase().includes(medSearch.toLowerCase()) || m.genericName.toLowerCase().includes(medSearch.toLowerCase()))
    : [];

  const addMed = () => {
    if (!newMed.name || !newMed.dosage) return;
    const med: PrescriptionMedication = {
      id: `med-${Date.now()}`,
      name: newMed.name,
      genericName: newMed.genericName || undefined,
      dosage: newMed.dosage,
      pharmaceuticalForm: newMed.pharmaceuticalForm,
      dosageInstruction: newMed.dosageInstruction,
      frequency: newMed.frequency || undefined,
      duration: newMed.duration || undefined,
      route: newMed.route,
      timing: newMed.timing || undefined,
      quantity: parseInt(newMed.quantity),
      quantityUnit: newMed.quantityUnit,
      allowGeneric: newMed.allowGeneric,
    };
    setMeds([...meds, med]);
    setNewMed({ name: '', genericName: '', dosage: '', pharmaceuticalForm: 'Comprimido', dosageInstruction: '', frequency: '', duration: '', route: 'Oral', timing: '', quantity: '30', quantityUnit: 'comprimidos', allowGeneric: true });
    setShowAddMed(false);
    setMedSearch('');
  };

  const removeMed = (id: string) => {
    setMeds(meds.filter(m => m.id !== id));
  };

  const selectMedFromCatalog = (medId: string) => {
    const med = medications.find(m => m.id === medId);
    if (med) {
      const pres = med.presentations[0];
      setNewMed({
        ...newMed,
        name: med.name,
        genericName: med.genericName,
        dosage: pres?.dosage || '',
        pharmaceuticalForm: pres?.pharmaceuticalForm || 'Comprimido',
      });
    }
  };

  const handleIssue = () => {
    if (!patient || meds.length === 0) return;

    const prescriptionNumber = `RX-${new Date().getFullYear()}-${String(Math.floor(Math.random() * 999999)).padStart(6, '0')}`;
    const accessCode = String(Math.floor(100000 + Math.random() * 900000));

    const validUntil = new Date();
    validUntil.setDate(validUntil.getDate() + parseInt(form.validDays));

    const prescription = repos.prescriptions.create({
      tenantId: getDemoTenantId(),
      patientId: patient.id,
      encounterId: encounterId || '',
      professionalId,
      specialtyId: professional?.specialtyId || '',
      prescriptionNumber,
      accessCode,
      prescriptionType: form.prescriptionType,
      medications: meds,
      instructions: form.instructions || undefined,
      validUntil: validUntil.toISOString(),
      status: 'ISSUED',
      issuedAt: new Date().toISOString(),
      issuedBy: professionalId,
      dispensingPharmacyId: form.pharmacyId || undefined,
      dispensingPharmacyName: form.pharmacyId ? pharmacies.find(p => p.id === form.pharmacyId)?.name : undefined,
    });

    setCreatedPrescription(prescription.id);
  };

  // If prescription was just created, show it
  if (createdPrescription) {
    const rx = repos.prescriptions.findById(createdPrescription);
    if (rx) {
      return <PrescriptionView prescriptionId={rx.id} onBack={() => navigate(-1)} />;
    }
  }

  if (!patient) {
    return <div className="text-center py-12 text-[#6F8C90]">Paciente não encontrado.</div>;
  }

  return (
    <div className="max-w-3xl mx-auto space-y-5">
      <div className="flex items-center gap-3">
        <button onClick={() => navigate(-1)} className="p-2 rounded-lg hover:bg-[#EDF9FA] text-[#6F8C90]">
          <ArrowLeft size={20} />
        </button>
        <div>
          <h1 className="text-xl font-bold text-[#18383C]">Prescrição Médica</h1>
          <p className="text-sm text-[#6F8C90]">Emitir receita para {patient.fullName}</p>
        </div>
      </div>

      {/* Patient summary */}
      <Card className="p-4">
        <div className="flex items-center gap-3">
          <Avatar name={patient.fullName} color={patient.avatarColor} />
          <div>
            <p className="font-medium text-[#18383C]">{patient.fullName}</p>
            <p className="text-sm text-[#6F8C90]">{professional?.personName} — {professional?.professionalCouncil} {professional?.councilNumber}</p>
          </div>
        </div>
      </Card>

      {/* Prescription type */}
      <Card className="p-5">
        <h3 className="font-semibold text-[#18383C] mb-3">Tipo de Receituário</h3>
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-2">
          {Object.entries(PRESCRIPTION_TYPE_LABELS).map(([key, label]) => (
            <button
              key={key}
              onClick={() => setForm({ ...form, prescriptionType: key as PrescriptionType })}
              className={`p-3 rounded-xl border text-sm font-medium transition-all ${
                form.prescriptionType === key
                  ? 'border-[#17AEB5] bg-[#EDF9FA] text-[#087F86]'
                  : 'border-[#EDF9FA] text-[#6F8C90] hover:border-[#17AEB5]/30'
              }`}
            >
              {label}
            </button>
          ))}
        </div>
      </Card>

      {/* Medications */}
      <Card className="p-5">
        <div className="flex items-center justify-between mb-3">
          <h3 className="font-semibold text-[#18383C]">Medicamentos</h3>
          <Button size="sm" variant="secondary" onClick={() => setShowAddMed(true)}>
            <Plus size={14} /> Adicionar
          </Button>
        </div>

        {meds.length === 0 ? (
          <p className="text-sm text-[#6F8C90] text-center py-4">Nenhum medicamento adicionado.</p>
        ) : (
          <div className="space-y-3">
            {meds.map(med => (
              <div key={med.id} className="p-3 rounded-xl bg-[#F5FCFC] border border-[#EDF9FA]">
                <div className="flex items-start justify-between">
                  <div>
                    <p className="font-medium text-[#18383C]">{med.name} {med.dosage}</p>
                    <p className="text-sm text-[#6F8C90]">{med.dosageInstruction}</p>
                    {med.frequency && <p className="text-xs text-[#6F8C90]">{med.frequency} — {med.duration}</p>}
                    <p className="text-xs text-[#6F8C90]">Via: {med.route} • Qtd: {med.quantity} {med.quantityUnit}</p>
                  </div>
                  <button onClick={() => removeMed(med.id)} className="text-[#E97878] hover:text-red-600 p-1">
                    <Trash2 size={16} />
                  </button>
                </div>
              </div>
            ))}
          </div>
        )}
      </Card>

      {/* Instructions & Validity */}
      <Card className="p-5">
        <h3 className="font-semibold text-[#18383C] mb-3">Instruções e Validade</h3>
        <div className="space-y-3">
          <div>
            <label className="text-sm font-medium text-[#18383C]">Instruções gerais</label>
            <textarea
              value={form.instructions}
              onChange={e => setForm({ ...form, instructions: e.target.value })}
              placeholder="Orientações gerais ao paciente..."
              className="w-full mt-1 px-3 py-2.5 bg-white border border-[#EDF9FA] rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-[#17AEB5]/30 resize-none"
              rows={2}
            />
          </div>
          <div className="grid grid-cols-2 gap-3">
            <Input label="Validade (dias)" type="number" value={form.validDays} onChange={e => setForm({ ...form, validDays: e.target.value })} />
            <Select
              label="Farmácia de dispensação"
              value={form.pharmacyId}
              onChange={e => setForm({ ...form, pharmacyId: e.target.value })}
              options={[
                { value: '', label: 'Selecionar...' },
                ...pharmacies.map(p => ({ value: p.id, label: p.name })),
              ]}
            />
          </div>
        </div>
      </Card>

      {/* Issue button */}
      <div className="flex justify-end gap-2">
        <Button variant="ghost" onClick={() => navigate(-1)}>Cancelar</Button>
        <Button onClick={handleIssue} disabled={meds.length === 0}>
          <FileText size={16} /> Emitir Prescrição
        </Button>
      </div>

      {/* Add Medication Modal */}
      <Modal open={showAddMed} onClose={() => setShowAddMed(false)} title="Adicionar Medicamento" size="lg">
        <div className="space-y-4">
          <div>
            <label className="text-sm font-medium text-[#18383C]">Buscar no catálogo</label>
            <input
              type="text"
              value={medSearch}
              onChange={e => setMedSearch(e.target.value)}
              placeholder="Digite o nome do medicamento..."
              className="w-full mt-1 px-3 py-2.5 bg-white border border-[#EDF9FA] rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-[#17AEB5]/30"
            />
            {filteredMeds.length > 0 && (
              <div className="mt-2 max-h-32 overflow-y-auto rounded-xl border border-[#EDF9FA]">
                {filteredMeds.map(m => (
                  <button
                    key={m.id}
                    onClick={() => selectMedFromCatalog(m.id)}
                    className="w-full text-left px-3 py-2 text-sm hover:bg-[#EDF9FA] border-b border-[#EDF9FA] last:border-0"
                  >
                    <p className="font-medium text-[#18383C]">{m.name}</p>
                    <p className="text-xs text-[#6F8C90]">{m.genericName}</p>
                  </button>
                ))}
              </div>
            )}
          </div>
          <div className="grid grid-cols-2 gap-3">
            <Input label="Nome *" value={newMed.name} onChange={e => setNewMed({ ...newMed, name: e.target.value })} />
            <Input label="Nome genérico" value={newMed.genericName} onChange={e => setNewMed({ ...newMed, genericName: e.target.value })} />
            <Input label="Dosagem *" value={newMed.dosage} onChange={e => setNewMed({ ...newMed, dosage: e.target.value })} placeholder="Ex: 500mg" />
            <Select
              label="Forma farmacêutica"
              value={newMed.pharmaceuticalForm}
              onChange={e => setNewMed({ ...newMed, pharmaceuticalForm: e.target.value })}
              options={['Comprimido', 'Cápsula', 'Xarope', 'Solução', 'Pomada', 'Injetável', 'Outro'].map(f => ({ value: f, label: f }))}
            />
          </div>
          <Input label="Posologia" value={newMed.dosageInstruction} onChange={e => setNewMed({ ...newMed, dosageInstruction: e.target.value })} placeholder="Ex: 1 comprimido de 8 em 8 horas" />
          <div className="grid grid-cols-3 gap-3">
            <Input label="Frequência" value={newMed.frequency} onChange={e => setNewMed({ ...newMed, frequency: e.target.value })} placeholder="3x ao dia" />
            <Input label="Duração" value={newMed.duration} onChange={e => setNewMed({ ...newMed, duration: e.target.value })} placeholder="7 dias" />
            <Select
              label="Via"
              value={newMed.route}
              onChange={e => setNewMed({ ...newMed, route: e.target.value })}
              options={['Oral', 'Tópica', 'Sublingual', 'Retal', 'Inalatória', 'Intravenosa', 'Intramuscular', 'Outra'].map(r => ({ value: r, label: r }))}
            />
          </div>
          <div className="grid grid-cols-2 gap-3">
            <Input label="Quantidade" type="number" value={newMed.quantity} onChange={e => setNewMed({ ...newMed, quantity: e.target.value })} />
            <Input label="Unidade" value={newMed.quantityUnit} onChange={e => setNewMed({ ...newMed, quantityUnit: e.target.value })} placeholder="comprimidos" />
          </div>
          <div className="flex justify-end gap-2 pt-2">
            <Button variant="ghost" onClick={() => setShowAddMed(false)}>Cancelar</Button>
            <Button onClick={addMed} disabled={!newMed.name || !newMed.dosage}>Adicionar</Button>
          </div>
        </div>
      </Modal>
    </div>
  );
}

// ============================================
// PRESCRIPTION VIEW (with QR Code)
// ============================================

function PrescriptionView({ prescriptionId, onBack }: { prescriptionId: string; onBack: () => void }) {
  const { repos } = useApp();
  const rx = repos.prescriptions.findById(prescriptionId);
  const [copied, setCopied] = useState(false);

  if (!rx) return <div>Receita não encontrada.</div>;

  const patient = repos.patients.findById(rx.patientId);
  const professional = repos.professionals.findById(rx.professionalId);
  const specialty = repos.specialties.findById(rx.specialtyId);

  const qrData = JSON.stringify({
    v: '1.0',
    r: rx.prescriptionNumber,
    c: rx.accessCode,
    p: rx.patientId.substring(0, 8),
    d: new Date(rx.issuedAt).toLocaleDateString('pt-BR'),
    e: new Date(rx.validUntil).toLocaleDateString('pt-BR'),
  });

  const handleCopyCode = () => {
    navigator.clipboard.writeText(rx.accessCode);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div className="max-w-3xl mx-auto space-y-5">
      <div className="flex items-center justify-between">
        <button onClick={onBack} className="flex items-center gap-2 text-sm text-[#6F8C90] hover:text-[#087F86]">
          <ArrowLeft size={16} /> Voltar
        </button>
        <StatusBadge label={PRESCRIPTION_STATUS_LABELS[rx.status]} variant={rx.status === 'ISSUED' ? 'success' : 'neutral'} />
      </div>

      {/* Prescription Card */}
      <Card className="p-6">
        {/* Header */}
        <div className="flex items-center justify-between mb-6 pb-4 border-b border-[#EDF9FA]">
          <div>
            <h2 className="text-xl font-bold text-[#18383C]">RECEITUÁRIO MÉDICO</h2>
            <p className="text-sm text-[#6F8C90]">{PRESCRIPTION_TYPE_LABELS[rx.prescriptionType]}</p>
          </div>
          <div className="text-right">
            <p className="text-sm font-medium text-[#18383C]">{rx.prescriptionNumber}</p>
            <p className="text-xs text-[#6F8C90]">Emitida em {new Date(rx.issuedAt).toLocaleDateString('pt-BR')}</p>
          </div>
        </div>

        {/* Patient & Professional */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mb-6">
          <div>
            <p className="text-xs text-[#6F8C90]">Paciente</p>
            <p className="font-medium text-[#18383C]">{patient?.fullName}</p>
          </div>
          <div>
            <p className="text-xs text-[#6F8C90]">Profissional</p>
            <p className="font-medium text-[#18383C]">{professional?.personName}</p>
            <p className="text-xs text-[#6F8C90]">{professional?.professionalCouncil} {professional?.councilNumber} — {specialty?.name}</p>
          </div>
        </div>

        {/* Medications */}
        <div className="mb-6">
          <h3 className="font-semibold text-[#18383C] mb-3 flex items-center gap-2">
            <Pill size={16} className="text-[#17AEB5]" /> Medicamentos Prescritos
          </h3>
          <div className="space-y-3">
            {rx.medications.map((med, idx) => (
              <div key={med.id} className="p-4 rounded-xl bg-[#F5FCFC] border border-[#EDF9FA]">
                <div className="flex items-start gap-3">
                  <span className="w-6 h-6 rounded-full bg-[#17AEB5] text-white text-xs flex items-center justify-center font-bold">{idx + 1}</span>
                  <div>
                    <p className="font-medium text-[#18383C]">{med.name} {med.dosage} — {med.pharmaceuticalForm}</p>
                    {med.genericName && <p className="text-xs text-[#6F8C90]">({med.genericName})</p>}
                    <p className="text-sm text-[#18383C] mt-1">{med.dosageInstruction}</p>
                    <div className="flex flex-wrap gap-3 mt-1 text-xs text-[#6F8C90]">
                      {med.frequency && <span>Via: {med.route}</span>}
                      {med.frequency && <span>{med.frequency}</span>}
                      {med.duration && <span>Duração: {med.duration}</span>}
                      <span>Qtd: {med.quantity} {med.quantityUnit}</span>
                      {med.allowGeneric && <span className="text-[#52B788]">✓ Permite genérico</span>}
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Instructions */}
        {rx.instructions && (
          <div className="mb-6 p-3 rounded-xl bg-[#EDF9FA]">
            <p className="text-sm text-[#087F86]"><span className="font-medium">Instruções:</span> {rx.instructions}</p>
          </div>
        )}

        {/* Validity */}
        <div className="flex items-center gap-2 text-sm text-[#6F8C90] mb-6">
          <Shield size={14} />
          <span>Válida até: {new Date(rx.validUntil).toLocaleDateString('pt-BR')}</span>
        </div>

        {/* QR Code & Access Code */}
        <div className="flex flex-col sm:flex-row items-center gap-6 p-5 rounded-2xl bg-[#F5FCFC] border border-[#EDF9FA]">
          <div className="text-center">
            <QRCodeSVG value={qrData} size={140} level="M" />
            <p className="text-xs text-[#6F8C90] mt-2">Escaneie para validar</p>
          </div>
          <div className="flex-1 text-center sm:text-left">
            <p className="text-sm text-[#6F8C90]">Código de acesso</p>
            <div className="flex items-center gap-2 mt-1">
              <p className="text-3xl font-mono font-bold text-[#17AEB5] tracking-wider">{rx.accessCode}</p>
              <button onClick={handleCopyCode} className="p-2 rounded-lg hover:bg-white text-[#6F8C90]">
                {copied ? <Check size={16} className="text-[#52B788]" /> : <Copy size={16} />}
              </button>
            </div>
            <p className="text-xs text-[#6F8C90] mt-2">
              Apresente este código ou QR Code na farmácia para retirar seus medicamentos.
            </p>
            {rx.dispensingPharmacyName && (
              <p className="text-xs text-[#087F86] mt-2 font-medium">
                Farmácia indicada: {rx.dispensingPharmacyName}
              </p>
            )}
          </div>
        </div>
      </Card>

      {/* Actions */}
      <div className="flex justify-end gap-2">
        <Button variant="secondary">
          <Send size={16} /> Enviar por E-mail
        </Button>
        <Button onClick={onBack}>Concluir</Button>
      </div>
    </div>
  );
}
