// NEXCLÍNICA — Clinical Encounter Workspace
import React, { useState, useEffect } from 'react';
import { useNavigate, useSearchParams } from 'react-router-dom';
import { useApp, getDemoProfessionalId, getDemoTenantId } from '../../services/AppContext';
import { Card, Button, Input, Textarea, Avatar, StatusBadge } from '../../components/ui';
import { ArrowLeft, Check, Save, Plus, Ruler } from 'lucide-react';
import { MEASUREMENT_TYPES } from '../../domain/models';

export default function EncounterForm() {
  const { repos } = useApp();
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const appointmentId = searchParams.get('appointmentId');
  const patientId = searchParams.get('patientId');

  const [form, setForm] = useState({
    chiefComplaint: '',
    history: '',
    assessment: '',
    conduct: '',
    notes: '',
    recommendedReturn: '',
  });
  const [encounterId, setEncounterId] = useState<string | null>(null);
  const [showMeasureForm, setShowMeasureForm] = useState(false);
  const [newMeasure, setNewMeasure] = useState({ type: 'peso', value: '', unit: 'kg' });

  const patient = patientId ? repos.patients.findById(patientId) : null;
  const professionalId = getDemoProfessionalId();
  const professional = repos.professionals.findById(professionalId);

  useEffect(() => {
    if (patientId && professionalId) {
      const enc = repos.encounters.create({
        tenantId: getDemoTenantId(),
        patientId,
        professionalId,
        appointmentId: appointmentId || undefined,
        specialtyId: professional?.specialtyId || '',
        encounterDate: new Date().toISOString(),
        status: 'IN_PROGRESS',
      });
      setEncounterId(enc.id);
    }
  }, [patientId, professionalId]);

  const update = (field: string, value: string) => {
    setForm(prev => ({ ...prev, [field]: value }));
  };

  const handleSave = () => {
    if (!encounterId) return;
    repos.encounters.update(encounterId, {
      ...form,
      status: 'DRAFT',
    });
  };

  const handleComplete = () => {
    if (!encounterId || !patientId) return;

    // Update encounter
    repos.encounters.update(encounterId, {
      ...form,
      status: 'COMPLETED',
      completedAt: new Date().toISOString(),
    });

    // Update appointment
    if (appointmentId) {
      repos.appointments.update(appointmentId, { status: 'CONCLUÍDA' });
    }

    // Create evolution
    if (form.assessment || form.conduct) {
      repos.evolutions.create({
        patientId,
        professionalId,
        encounterId,
        date: new Date().toISOString(),
        description: [form.chiefComplaint, form.assessment, form.conduct].filter(Boolean).join(' | '),
      });
    }

    navigate(`/pacientes/${patientId}`);
  };

  const handleAddMeasurement = () => {
    if (!patientId || !newMeasure.value) return;
    const typeInfo = MEASUREMENT_TYPES.find(t => t.code === newMeasure.type);
    repos.measurements.create({
      patientId,
      type: newMeasure.type,
      value: parseFloat(newMeasure.value),
      unit: typeInfo?.unit || '',
      measuredAt: new Date().toISOString(),
      professionalId,
      encounterId: encounterId || undefined,
    });
    setNewMeasure({ type: 'peso', value: '', unit: 'kg' });
    setShowMeasureForm(false);
  };

  if (!patient) {
    return <div className="text-center py-12 text-[#6F8C90]">Paciente não encontrado.</div>;
  }

  return (
    <div className="max-w-4xl mx-auto space-y-5">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-3">
          <button onClick={() => navigate(-1)} className="p-2 rounded-lg hover:bg-[#EDF9FA] text-[#6F8C90]">
            <ArrowLeft size={20} />
          </button>
          <div>
            <h1 className="text-xl font-bold text-[#18383C]">Atendimento Clínico</h1>
            <p className="text-sm text-[#6F8C90]">Registro de encontro clínico</p>
          </div>
        </div>
        <div className="flex gap-2">
          <Button variant="secondary" onClick={handleSave}>
            <Save size={16} /> Salvar rascunho
          </Button>
          <Button onClick={handleComplete}>
            <Check size={16} /> Concluir atendimento
          </Button>
        </div>
      </div>

      {/* Patient Summary */}
      <Card className="p-4">
        <div className="flex items-center gap-4">
          <Avatar name={patient.fullName} color={patient.avatarColor} size="md" />
          <div>
            <p className="font-medium text-[#18383C]">{patient.fullName}</p>
            <p className="text-sm text-[#6F8C90]">{patient.phone} • {professional?.personName}</p>
          </div>
          <div className="ml-auto">
            <StatusBadge label="Em Atendimento" variant="primary" />
          </div>
        </div>
      </Card>

      {/* Clinical Form */}
      <div className="space-y-4">
        <Card className="p-5">
          <h3 className="font-semibold text-[#18383C] mb-3">Queixa Principal</h3>
          <Textarea
            value={form.chiefComplaint}
            onChange={e => update('chiefComplaint', e.target.value)}
            placeholder="Descreva a queixa principal do paciente..."
          />
        </Card>

        <Card className="p-5">
          <h3 className="font-semibold text-[#18383C] mb-3">Histórico</h3>
          <Textarea
            value={form.history}
            onChange={e => update('history', e.target.value)}
            placeholder="Histórico relevante, antecedentes, medicamentos em uso..."
            className="min-h-[100px]"
          />
        </Card>

        <Card className="p-5">
          <h3 className="font-semibold text-[#18383C] mb-3">Avaliação</h3>
          <Textarea
            value={form.assessment}
            onChange={e => update('assessment', e.target.value)}
            placeholder="Avaliação clínica, achados do exame físico, raciocínio clínico..."
            className="min-h-[100px]"
          />
        </Card>

        <Card className="p-5">
          <h3 className="font-semibold text-[#18383C] mb-3">Conduta</h3>
          <Textarea
            value={form.conduct}
            onChange={e => update('conduct', e.target.value)}
            placeholder="Plano terapêutico, orientações, prescrições, encaminhamentos..."
            className="min-h-[100px]"
          />
        </Card>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <Card className="p-5">
            <h3 className="font-semibold text-[#18383C] mb-3">Observações</h3>
            <Textarea
              value={form.notes}
              onChange={e => update('notes', e.target.value)}
              placeholder="Observações adicionais..."
            />
          </Card>
          <Card className="p-5">
            <h3 className="font-semibold text-[#18383C] mb-3">Retorno Recomendado</h3>
            <Textarea
              value={form.recommendedReturn}
              onChange={e => update('recommendedReturn', e.target.value)}
              placeholder="Ex: Retorno em 30 dias..."
            />
          </Card>
        </div>

        {/* Measurements */}
        <Card className="p-5">
          <div className="flex items-center justify-between mb-3">
            <h3 className="font-semibold text-[#18383C]">Medidas</h3>
            <Button size="sm" variant="secondary" onClick={() => setShowMeasureForm(!showMeasureForm)}>
              <Plus size={14} /> Registrar medida
            </Button>
          </div>

          {showMeasureForm && (
            <div className="flex flex-wrap gap-2 mb-4 p-3 rounded-xl bg-[#F5FCFC]">
              <select
                value={newMeasure.type}
                onChange={e => {
                  const typeInfo = MEASUREMENT_TYPES.find(t => t.code === e.target.value);
                  setNewMeasure({ ...newMeasure, type: e.target.value, unit: typeInfo?.unit || '' });
                }}
                className="px-3 py-2 rounded-lg border border-[#EDF9FA] text-sm"
              >
                {MEASUREMENT_TYPES.map(m => (
                  <option key={m.code} value={m.code}>{m.label} ({m.unit})</option>
                ))}
              </select>
              <input
                type="number"
                step="0.1"
                value={newMeasure.value}
                onChange={e => setNewMeasure({ ...newMeasure, value: e.target.value })}
                placeholder="Valor"
                className="px-3 py-2 rounded-lg border border-[#EDF9FA] text-sm w-24"
              />
              <span className="flex items-center text-sm text-[#6F8C90]">{newMeasure.unit}</span>
              <Button size="sm" onClick={handleAddMeasurement} disabled={!newMeasure.value}>Adicionar</Button>
            </div>
          )}

          {/* Show recent measurements */}
          {patientId && (
            <div className="space-y-2">
              {repos.measurements.findByPatient(patientId)
                .sort((a, b) => new Date(b.measuredAt).getTime() - new Date(a.measuredAt).getTime())
                .slice(0, 5)
                .map(m => {
                  const typeInfo = MEASUREMENT_TYPES.find(t => t.code === m.type);
                  return (
                    <div key={m.id} className="flex items-center justify-between p-2 rounded-lg bg-[#F5FCFC]">
                      <span className="text-sm text-[#18383C]">{typeInfo?.label || m.type}</span>
                      <span className="text-sm font-medium text-[#17AEB5]">{m.value} {m.unit}</span>
                    </div>
                  );
                })}
            </div>
          )}
        </Card>
      </div>

      {/* Bottom actions */}
      <div className="flex justify-end gap-2 pb-4">
        <Button variant="secondary" onClick={() => navigate(-1)}>Cancelar</Button>
        <Button variant="secondary" onClick={handleSave}>
          <Save size={16} /> Salvar rascunho
        </Button>
        <Button onClick={handleComplete}>
          <Check size={16} /> Concluir atendimento
        </Button>
      </div>
    </div>
  );
}
