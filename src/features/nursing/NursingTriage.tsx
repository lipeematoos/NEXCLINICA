// NEXCLÍNICA — Nursing Triage (Layer 2)
import React, { useState } from 'react';
import { useApp, getDemoProfessionalId } from '../../services/AppContext';
import { Card, Button, Input, Select, StatusBadge, EmptyState, Avatar } from '../../components/ui';
import { Heart, Thermometer, Wind, Droplet, Activity, Save, CheckCircle } from 'lucide-react';
import { RISK_CLASSIFICATION_LABELS } from '../../domain/models';

export default function NursingTriage() {
  const { repos } = useApp();
  const [selectedQueueId, setSelectedQueueId] = useState('');
  const [form, setForm] = useState({
    bloodPressureSystolic: '',
    bloodPressureDiastolic: '',
    heartRate: '',
    temperature: '',
    respiratoryRate: '',
    oxygenSaturation: '',
    weight: '',
    height: '',
    chiefComplaint: '',
    painLevel: '0',
    riskClassification: '' as '' | 'VERDE' | 'AZUL' | 'AMARELO' | 'LARANJA' | 'VERMELHO',
    notes: '',
  });

  const activeQueue = repos.queue.findActive();
  const professionalId = getDemoProfessionalId();

  const selectedQueueItem = selectedQueueId ? repos.queue.findById(selectedQueueId) : null;
  const patient = selectedQueueItem ? repos.patients.findById(selectedQueueItem.patientId) : null;

  const update = (field: string, value: string) => {
    setForm(prev => ({ ...prev, [field]: value }));
  };

  const bmi = form.weight && form.height
    ? (parseFloat(form.weight) / Math.pow(parseFloat(form.height) / 100, 2)).toFixed(1)
    : null;

  const handleSave = () => {
    if (!patient || !selectedQueueItem) return;

    repos.nursing.create({
      patientId: patient.id,
      professionalId,
      queueId: selectedQueueId,
      recordedAt: new Date().toISOString(),
      bloodPressureSystolic: form.bloodPressureSystolic ? parseFloat(form.bloodPressureSystolic) : undefined,
      bloodPressureDiastolic: form.bloodPressureDiastolic ? parseFloat(form.bloodPressureDiastolic) : undefined,
      heartRate: form.heartRate ? parseFloat(form.heartRate) : undefined,
      temperature: form.temperature ? parseFloat(form.temperature) : undefined,
      respiratoryRate: form.respiratoryRate ? parseFloat(form.respiratoryRate) : undefined,
      oxygenSaturation: form.oxygenSaturation ? parseFloat(form.oxygenSaturation) : undefined,
      weight: form.weight ? parseFloat(form.weight) : undefined,
      height: form.height ? parseFloat(form.height) : undefined,
      bmi: bmi ? parseFloat(bmi) : undefined,
      chiefComplaint: form.chiefComplaint || undefined,
      painLevel: parseInt(form.painLevel),
      riskClassification: form.riskClassification || undefined,
      notes: form.notes || undefined,
    });

    // Also save measurements
    if (form.weight) {
      repos.measurements.create({
        patientId: patient.id,
        type: 'peso',
        value: parseFloat(form.weight),
        unit: 'kg',
        measuredAt: new Date().toISOString(),
        professionalId,
      });
    }
    if (form.bloodPressureSystolic) {
      repos.measurements.create({
        patientId: patient.id,
        type: 'pressao_sistolica',
        value: parseFloat(form.bloodPressureSystolic),
        unit: 'mmHg',
        measuredAt: new Date().toISOString(),
        professionalId,
      });
    }
    if (form.bloodPressureDiastolic) {
      repos.measurements.create({
        patientId: patient.id,
        type: 'pressao_diastolica',
        value: parseFloat(form.bloodPressureDiastolic),
        unit: 'mmHg',
        measuredAt: new Date().toISOString(),
        professionalId,
      });
    }
    if (form.heartRate) {
      repos.measurements.create({
        patientId: patient.id,
        type: 'frequencia_cardiaca',
        value: parseFloat(form.heartRate),
        unit: 'bpm',
        measuredAt: new Date().toISOString(),
        professionalId,
      });
    }
    if (form.temperature) {
      repos.measurements.create({
        patientId: patient.id,
        type: 'temperatura',
        value: parseFloat(form.temperature),
        unit: '°C',
        measuredAt: new Date().toISOString(),
        professionalId,
      });
    }

    // Reset
    setSelectedQueueId('');
    setForm({
      bloodPressureSystolic: '', bloodPressureDiastolic: '', heartRate: '',
      temperature: '', respiratoryRate: '', oxygenSaturation: '',
      weight: '', height: '', chiefComplaint: '', painLevel: '0',
      riskClassification: '', notes: '',
    });
  };

  return (
    <div className="space-y-5">
      <div>
        <h1 className="text-2xl font-bold text-[#18383C]">Triagem / Enfermagem</h1>
        <p className="text-sm text-[#6F8C90]">Registro de sinais vitais e classificação de risco</p>
      </div>

      {/* Select patient from queue */}
      <Card className="p-5">
        <h3 className="font-semibold text-[#18383C] mb-3">Paciente na Fila</h3>
        {activeQueue.length === 0 ? (
          <EmptyState title="Fila vazia" description="Nenhum paciente aguardando triagem no momento." />
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3">
            {activeQueue.filter(q => q.status === 'WAITING' || q.status === 'CALLED').map(item => {
              const p = repos.patients.findById(item.patientId);
              return (
                <button
                  key={item.id}
                  onClick={() => setSelectedQueueId(item.id)}
                  className={`p-3 rounded-xl border text-left transition-all ${
                    selectedQueueId === item.id
                      ? 'border-[#17AEB5] bg-[#EDF9FA] ring-2 ring-[#17AEB5]/20'
                      : 'border-[#EDF9FA] hover:border-[#17AEB5]/30'
                  }`}
                >
                  <div className="flex items-center gap-2">
                    <span className={`text-lg font-bold ${
                      item.queueType === 'PRIORIDADE' ? 'text-[#F6B85A]' :
                      item.queueType === 'URGÊNCIA' ? 'text-[#E97878]' :
                      'text-[#17AEB5]'
                    }`}>{item.queueNumber}</span>
                    <Avatar name={p?.fullName || '?'} color={p?.avatarColor} size="sm" />
                  </div>
                  <p className="text-sm font-medium text-[#18383C] mt-1">{p?.fullName}</p>
                  <p className="text-xs text-[#6F8C90]">{item.notes || 'Sem observações'}</p>
                </button>
              );
            })}
          </div>
        )}
      </Card>

      {/* Triage Form */}
      {patient && (
        <div className="space-y-4">
          {/* Patient Header */}
          <Card className="p-4">
            <div className="flex items-center gap-3">
              <Avatar name={patient.fullName} color={patient.avatarColor} />
              <div>
                <p className="font-medium text-[#18383C]">{patient.fullName}</p>
                <p className="text-sm text-[#6F8C90]">Senha: {selectedQueueItem?.queueNumber}</p>
              </div>
            </div>
          </Card>

          {/* Vital Signs */}
          <Card className="p-5">
            <h3 className="font-semibold text-[#18383C] mb-4 flex items-center gap-2">
              <Activity size={18} className="text-[#17AEB5]" /> Sinais Vitais
            </h3>
            <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-4">
              <div>
                <label className="text-xs font-medium text-[#6F8C90] flex items-center gap-1">
                  <Heart size={12} /> PA Sistólica (mmHg)
                </label>
                <input
                  type="number"
                  value={form.bloodPressureSystolic}
                  onChange={e => update('bloodPressureSystolic', e.target.value)}
                  placeholder="120"
                  className="w-full mt-1 px-3 py-2.5 bg-white border border-[#EDF9FA] rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-[#17AEB5]/30"
                />
              </div>
              <div>
                <label className="text-xs font-medium text-[#6F8C90]">PA Diastólica (mmHg)</label>
                <input
                  type="number"
                  value={form.bloodPressureDiastolic}
                  onChange={e => update('bloodPressureDiastolic', e.target.value)}
                  placeholder="80"
                  className="w-full mt-1 px-3 py-2.5 bg-white border border-[#EDF9FA] rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-[#17AEB5]/30"
                />
              </div>
              <div>
                <label className="text-xs font-medium text-[#6F8C90] flex items-center gap-1">
                  <Heart size={12} /> FC (bpm)
                </label>
                <input
                  type="number"
                  value={form.heartRate}
                  onChange={e => update('heartRate', e.target.value)}
                  placeholder="72"
                  className="w-full mt-1 px-3 py-2.5 bg-white border border-[#EDF9FA] rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-[#17AEB5]/30"
                />
              </div>
              <div>
                <label className="text-xs font-medium text-[#6F8C90] flex items-center gap-1">
                  <Thermometer size={12} /> Temperatura (°C)
                </label>
                <input
                  type="number"
                  step="0.1"
                  value={form.temperature}
                  onChange={e => update('temperature', e.target.value)}
                  placeholder="36.5"
                  className="w-full mt-1 px-3 py-2.5 bg-white border border-[#EDF9FA] rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-[#17AEB5]/30"
                />
              </div>
              <div>
                <label className="text-xs font-medium text-[#6F8C90] flex items-center gap-1">
                  <Wind size={12} /> FR (irpm)
                </label>
                <input
                  type="number"
                  value={form.respiratoryRate}
                  onChange={e => update('respiratoryRate', e.target.value)}
                  placeholder="16"
                  className="w-full mt-1 px-3 py-2.5 bg-white border border-[#EDF9FA] rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-[#17AEB5]/30"
                />
              </div>
              <div>
                <label className="text-xs font-medium text-[#6F8C90] flex items-center gap-1">
                  <Droplet size={12} /> SpO₂ (%)
                </label>
                <input
                  type="number"
                  value={form.oxygenSaturation}
                  onChange={e => update('oxygenSaturation', e.target.value)}
                  placeholder="98"
                  className="w-full mt-1 px-3 py-2.5 bg-white border border-[#EDF9FA] rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-[#17AEB5]/30"
                />
              </div>
              <div>
                <label className="text-xs font-medium text-[#6F8C90]">Peso (kg)</label>
                <input
                  type="number"
                  step="0.1"
                  value={form.weight}
                  onChange={e => update('weight', e.target.value)}
                  placeholder="70"
                  className="w-full mt-1 px-3 py-2.5 bg-white border border-[#EDF9FA] rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-[#17AEB5]/30"
                />
              </div>
              <div>
                <label className="text-xs font-medium text-[#6F8C90]">Altura (cm)</label>
                <input
                  type="number"
                  value={form.height}
                  onChange={e => update('height', e.target.value)}
                  placeholder="170"
                  className="w-full mt-1 px-3 py-2.5 bg-white border border-[#EDF9FA] rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-[#17AEB5]/30"
                />
              </div>
            </div>
            {bmi && (
              <div className="mt-4 p-3 rounded-xl bg-[#EDF9FA] text-center">
                <p className="text-sm text-[#6F8C90]">IMC calculado</p>
                <p className="text-2xl font-bold text-[#17AEB5]">{bmi}</p>
              </div>
            )}
          </Card>

          {/* Assessment */}
          <Card className="p-5">
            <h3 className="font-semibold text-[#18383C] mb-4">Avaliação</h3>
            <div className="space-y-4">
              <div>
                <label className="text-sm font-medium text-[#18383C]">Queixa Principal</label>
                <textarea
                  value={form.chiefComplaint}
                  onChange={e => update('chiefComplaint', e.target.value)}
                  placeholder="Descreva a queixa principal..."
                  className="w-full mt-1 px-3 py-2.5 bg-white border border-[#EDF9FA] rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-[#17AEB5]/30 resize-none"
                  rows={2}
                />
              </div>
              <div>
                <label className="text-sm font-medium text-[#18383C]">Nível de Dor (0-10)</label>
                <input
                  type="range"
                  min="0"
                  max="10"
                  value={form.painLevel}
                  onChange={e => update('painLevel', e.target.value)}
                  className="w-full mt-1 accent-[#17AEB5]"
                />
                <div className="flex justify-between text-xs text-[#6F8C90]">
                  <span>Sem dor (0)</span>
                  <span className="font-bold text-[#17AEB5]">{form.painLevel}</span>
                  <span>Dor máxima (10)</span>
                </div>
              </div>
            </div>
          </Card>

          {/* Risk Classification */}
          <Card className="p-5">
            <h3 className="font-semibold text-[#18383C] mb-4">Classificação de Risco</h3>
            <div className="grid grid-cols-2 sm:grid-cols-5 gap-2">
              {Object.entries(RISK_CLASSIFICATION_LABELS).map(([key, { label, color }]) => (
                <button
                  key={key}
                  onClick={() => update('riskClassification', key)}
                  className={`p-3 rounded-xl border-2 text-center transition-all ${
                    form.riskClassification === key
                      ? 'border-current shadow-md scale-105'
                      : 'border-transparent hover:border-current opacity-70 hover:opacity-100'
                  }`}
                  style={{ color }}
                >
                  <div className="w-8 h-8 rounded-full mx-auto mb-1" style={{ backgroundColor: color }} />
                  <p className="text-xs font-medium">{label.split(' — ')[0]}</p>
                </button>
              ))}
            </div>
          </Card>

          {/* Notes */}
          <Card className="p-5">
            <h3 className="font-semibold text-[#18383C] mb-3">Observações</h3>
            <textarea
              value={form.notes}
              onChange={e => update('notes', e.target.value)}
              placeholder="Observações adicionais da triagem..."
              className="w-full px-3 py-2.5 bg-white border border-[#EDF9FA] rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-[#17AEB5]/30 resize-none"
              rows={3}
            />
          </Card>

          {/* Actions */}
          <div className="flex justify-end gap-2">
            <Button onClick={handleSave}>
              <CheckCircle size={16} /> Salvar Triagem
            </Button>
          </div>
        </div>
      )}
    </div>
  );
}
