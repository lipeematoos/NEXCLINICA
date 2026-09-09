// NEXCLÍNICA — Patient 360° Page
import React, { useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useApp, getDemoProfessionalId } from '../../services/AppContext';
import { Card, Avatar, Tabs, StatusBadge, Button, EmptyState } from '../../components/ui';
import {
  ArrowLeft, Phone, Mail, Calendar, MapPin, Briefcase,
  Clock, Activity, FileText, Ruler, ClipboardList, Heart
} from 'lucide-react';
import { APPOINTMENT_STATUS_LABELS, APPOINTMENT_TYPE_LABELS, MEASUREMENT_TYPES } from '../../domain/models';
import { LineChart, Line, XAxis, YAxis, Tooltip, ResponsiveContainer } from 'recharts';

export default function Patient360() {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const { repos } = useApp();
  const [activeTab, setActiveTab] = useState('overview');
  const [selectedMetric, setSelectedMetric] = useState('peso');

  if (!id) return null;
  const patient = repos.patients.findById(id);
  if (!patient) return <div className="text-center py-12 text-[#6F8C90]">Paciente não encontrado.</div>;

  const appointments = repos.appointments.findByPatient(id);
  const encounters = repos.encounters.findByPatient(id);
  const measurements = repos.measurements.findByPatient(id);
  const evolutions = repos.evolutions.findByPatient(id);
  const exams = repos.exams.findByPatient(id);
  const documents = repos.documents.findByPatient(id);
  const nutrition = repos.nutrition.findByPatient(id);
  const timeline = repos.timeline.findByPatient(id);

  const calculateAge = (birthDate: string) => {
    const today = new Date();
    const birth = new Date(birthDate);
    let age = today.getFullYear() - birth.getFullYear();
    const m = today.getMonth() - birth.getMonth();
    if (m < 0 || (m === 0 && today.getDate() < birth.getDate())) age--;
    return age;
  };

  const lastEncounter = encounters
    .filter(e => e.status === 'COMPLETED')
    .sort((a, b) => new Date(b.encounterDate).getTime() - new Date(a.encounterDate).getTime())[0];

  const nextAppt = appointments
    .filter(a => ['AGENDADA', 'CONFIRMADA'].includes(a.status))
    .sort((a, b) => new Date(a.startDateTime).getTime() - new Date(b.startDateTime).getTime())[0];

  const lastNutrition = nutrition.sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime())[0];

  const formatDateTime = (iso: string) => new Date(iso).toLocaleString('pt-BR', { day: '2-digit', month: '2-digit', year: 'numeric', hour: '2-digit', minute: '2-digit' });
  const formatDate = (iso: string) => new Date(iso).toLocaleDateString('pt-BR');

  // Measurement chart data
  const metricData = measurements
    .filter(m => m.type === selectedMetric)
    .sort((a, b) => new Date(a.measuredAt).getTime() - new Date(b.measuredAt).getTime())
    .map(m => ({
      date: formatDate(m.measuredAt),
      value: m.value,
    }));

  const metricInfo = MEASUREMENT_TYPES.find(m => m.code === selectedMetric);

  const tabs = [
    { id: 'overview', label: 'Visão Geral' },
    { id: 'history', label: 'Histórico' },
    { id: 'encounters', label: 'Atendimentos' },
    { id: 'evolutions', label: 'Evoluções' },
    { id: 'measurements', label: 'Medidas' },
    { id: 'exams', label: 'Exames' },
    { id: 'documents', label: 'Documentos' },
    { id: 'nutrition', label: 'Nutrição' },
    { id: 'timeline', label: 'Linha do Tempo' },
  ];

  const getTimelineIcon = (type: string) => {
    switch (type) {
      case 'ENCOUNTER': return <ClipboardList size={14} />;
      case 'MEASUREMENT': return <Ruler size={14} />;
      case 'EXAM': return <Activity size={14} />;
      case 'DOCUMENT': return <FileText size={14} />;
      default: return <Heart size={14} />;
    }
  };

  return (
    <div className="space-y-5">
      {/* Back */}
      <button onClick={() => navigate('/pacientes')} className="flex items-center gap-2 text-sm text-[#6F8C90] hover:text-[#087F86]">
        <ArrowLeft size={16} /> Voltar para pacientes
      </button>

      {/* Patient Header */}
      <Card className="p-5">
        <div className="flex flex-col sm:flex-row sm:items-center gap-4">
          <Avatar name={patient.fullName} color={patient.avatarColor} size="lg" />
          <div className="flex-1">
            <div className="flex items-center gap-2 flex-wrap">
              <h1 className="text-xl font-bold text-[#18383C]">{patient.fullName}</h1>
              {patient.socialName && <span className="text-sm text-[#6F8C90]">({patient.socialName})</span>}
              <StatusBadge label={patient.active ? 'Ativo' : 'Inativo'} variant={patient.active ? 'success' : 'neutral'} />
            </div>
            <div className="flex flex-wrap items-center gap-4 mt-2 text-sm text-[#6F8C90]">
              <span>{calculateAge(patient.birthDate)} anos</span>
              <span className="flex items-center gap-1"><Phone size={14} /> {patient.phone}</span>
              {patient.email && <span className="flex items-center gap-1"><Mail size={14} /> {patient.email}</span>}
              {patient.occupation && <span className="flex items-center gap-1"><Briefcase size={14} /> {patient.occupation}</span>}
            </div>
          </div>
          <div className="flex gap-2">
            {nextAppt && (
              <div className="text-right">
                <p className="text-xs text-[#6F8C90]">Próximo atendimento</p>
                <p className="text-sm font-medium text-[#17AEB5]">{formatDate(nextAppt.startDateTime)}</p>
              </div>
            )}
          </div>
        </div>
      </Card>

      {/* Tabs */}
      <Tabs tabs={tabs} activeTab={activeTab} onChange={setActiveTab} />

      {/* Tab Content */}
      {activeTab === 'overview' && (
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
          {/* Basic Info */}
          <Card className="p-5">
            <h3 className="font-semibold text-[#18383C] mb-3">Dados básicos</h3>
            <div className="space-y-2 text-sm">
              <div className="flex justify-between"><span className="text-[#6F8C90]">Nascimento</span><span>{formatDate(patient.birthDate)}</span></div>
              <div className="flex justify-between"><span className="text-[#6F8C90]">Telefone</span><span>{patient.phone}</span></div>
              {patient.email && <div className="flex justify-between"><span className="text-[#6F8C90]">E-mail</span><span>{patient.email}</span></div>}
              {patient.address && <div className="flex justify-between"><span className="text-[#6F8C90]">Endereço</span><span className="text-right max-w-[60%]">{patient.address}</span></div>}
              {patient.healthInsurance && <div className="flex justify-between"><span className="text-[#6F8C90]">Convênio</span><span>{patient.healthInsurance}</span></div>}
            </div>
          </Card>

          {/* Last Encounter */}
          <Card className="p-5">
            <h3 className="font-semibold text-[#18383C] mb-3">Último atendimento</h3>
            {lastEncounter ? (
              <div className="space-y-2 text-sm">
                <p className="text-[#6F8C90]">{formatDateTime(lastEncounter.encounterDate)}</p>
                {lastEncounter.chiefComplaint && <p><span className="text-[#6F8C90]">Queixa:</span> {lastEncounter.chiefComplaint}</p>}
                {lastEncounter.conduct && <p><span className="text-[#6F8C90]">Conduta:</span> {lastEncounter.conduct}</p>}
              </div>
            ) : (
              <p className="text-sm text-[#6F8C90]">Nenhum atendimento registrado.</p>
            )}
          </Card>

          {/* Next Appointment */}
          <Card className="p-5">
            <h3 className="font-semibold text-[#18383C] mb-3">Próximo atendimento</h3>
            {nextAppt ? (
              <div className="space-y-2 text-sm">
                <p className="font-medium text-[#17AEB5]">{formatDateTime(nextAppt.startDateTime)}</p>
                <p className="text-[#6F8C90]">{APPOINTMENT_TYPE_LABELS[nextAppt.appointmentType]}</p>
                {nextAppt.reason && <p className="text-[#6F8C90]">{nextAppt.reason}</p>}
              </div>
            ) : (
              <p className="text-sm text-[#6F8C90]">Nenhum agendamento futuro.</p>
            )}
          </Card>

          {/* Nutrition Summary */}
          {lastNutrition && (
            <Card className="p-5">
              <h3 className="font-semibold text-[#18383C] mb-3">Avaliação nutricional</h3>
              <div className="grid grid-cols-3 gap-3">
                {lastNutrition.weight && (
                  <div className="text-center p-3 rounded-xl bg-[#EDF9FA]">
                    <p className="text-lg font-bold text-[#17AEB5]">{lastNutrition.weight}</p>
                    <p className="text-xs text-[#6F8C90]">Peso (kg)</p>
                  </div>
                )}
                {lastNutrition.bmi && (
                  <div className="text-center p-3 rounded-xl bg-[#EDF9FA]">
                    <p className="text-lg font-bold text-[#17AEB5]">{lastNutrition.bmi}</p>
                    <p className="text-xs text-[#6F8C90]">IMC</p>
                  </div>
                )}
                {lastNutrition.waistCircumference && (
                  <div className="text-center p-3 rounded-xl bg-[#EDF9FA]">
                    <p className="text-lg font-bold text-[#17AEB5]">{lastNutrition.waistCircumference}</p>
                    <p className="text-xs text-[#6F8C90]">Circ. Abd. (cm)</p>
                  </div>
                )}
              </div>
              {lastNutrition.goal && <p className="text-sm text-[#6F8C90] mt-3"><span className="font-medium">Meta:</span> {lastNutrition.goal}</p>}
            </Card>
          )}
        </div>
      )}

      {activeTab === 'history' && (
        <Card className="p-5">
          <h3 className="font-semibold text-[#18383C] mb-4">Histórico de atendimentos</h3>
          {encounters.length === 0 ? (
            <p className="text-sm text-[#6F8C90]">Nenhum atendimento registrado.</p>
          ) : (
            <div className="space-y-3">
              {encounters.sort((a, b) => new Date(b.encounterDate).getTime() - new Date(a.encounterDate).getTime()).map(enc => {
                const prof = repos.professionals.findById(enc.professionalId);
                return (
                  <div key={enc.id} className="p-4 rounded-xl border border-[#EDF9FA] hover:bg-[#F5FCFC]">
                    <div className="flex items-center justify-between mb-2">
                      <p className="text-sm font-medium text-[#18383C]">{formatDateTime(enc.encounterDate)}</p>
                      <StatusBadge label={enc.status === 'COMPLETED' ? 'Concluído' : 'Em andamento'} variant={enc.status === 'COMPLETED' ? 'success' : 'info'} />
                    </div>
                    {enc.chiefComplaint && <p className="text-sm text-[#6F8C90]"><span className="font-medium">Queixa:</span> {enc.chiefComplaint}</p>}
                    {enc.assessment && <p className="text-sm text-[#6F8C90] mt-1"><span className="font-medium">Avaliação:</span> {enc.assessment}</p>}
                    {enc.conduct && <p className="text-sm text-[#6F8C90] mt-1"><span className="font-medium">Conduta:</span> {enc.conduct}</p>}
                    <p className="text-xs text-[#6F8C90] mt-2">Profissional: {prof?.personName}</p>
                  </div>
                );
              })}
            </div>
          )}
        </Card>
      )}

      {activeTab === 'encounters' && (
        <Card className="p-5">
          <h3 className="font-semibold text-[#18383C] mb-4">Atendimentos</h3>
          {encounters.length === 0 ? (
            <EmptyState title="Nenhum atendimento" description="Os atendimentos aparecerão aqui após serem realizados." />
          ) : (
            <div className="space-y-3">
              {encounters.map(enc => (
                <div key={enc.id} className="p-4 rounded-xl border border-[#EDF9FA]">
                  <div className="flex items-center justify-between">
                    <p className="text-sm font-medium">{formatDateTime(enc.encounterDate)}</p>
                    <StatusBadge label={enc.status === 'COMPLETED' ? 'Concluído' : 'Rascunho'} variant={enc.status === 'COMPLETED' ? 'success' : 'warning'} />
                  </div>
                  {enc.chiefComplaint && <p className="text-sm text-[#6F8C90] mt-2">{enc.chiefComplaint}</p>}
                </div>
              ))}
            </div>
          )}
        </Card>
      )}

      {activeTab === 'evolutions' && (
        <Card className="p-5">
          <h3 className="font-semibold text-[#18383C] mb-4">Evoluções clínicas</h3>
          {evolutions.length === 0 ? (
            <EmptyState title="Nenhuma evolução" description="Registros de evolução aparecerão aqui." />
          ) : (
            <div className="space-y-3">
              {evolutions.sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime()).map(evo => {
                const prof = repos.professionals.findById(evo.professionalId);
                return (
                  <div key={evo.id} className="p-4 rounded-xl border border-[#EDF9FA]">
                    <div className="flex items-center justify-between mb-2">
                      <p className="text-sm font-medium">{formatDateTime(evo.date)}</p>
                      <span className="text-xs text-[#6F8C90]">{prof?.personName}</span>
                    </div>
                    <p className="text-sm text-[#18383C]">{evo.description}</p>
                  </div>
                );
              })}
            </div>
          )}
        </Card>
      )}

      {activeTab === 'measurements' && (
        <div className="space-y-4">
          {/* Metric selector */}
          <Card className="p-5">
            <div className="flex items-center justify-between mb-4">
              <h3 className="font-semibold text-[#18383C]">Evolução de medidas</h3>
              <select
                value={selectedMetric}
                onChange={e => setSelectedMetric(e.target.value)}
                className="px-3 py-1.5 rounded-lg border border-[#EDF9FA] text-sm text-[#18383C] focus:outline-none focus:ring-2 focus:ring-[#17AEB5]/30"
              >
                {MEASUREMENT_TYPES.map(m => (
                  <option key={m.code} value={m.code}>{m.label} ({m.unit})</option>
                ))}
              </select>
            </div>
            {metricData.length > 0 ? (
              <div className="h-48">
                <ResponsiveContainer width="100%" height="100%">
                  <LineChart data={metricData}>
                    <XAxis dataKey="date" axisLine={false} tickLine={false} tick={{ fontSize: 11, fill: '#6F8C90' }} />
                    <YAxis axisLine={false} tickLine={false} tick={{ fontSize: 11, fill: '#6F8C90' }} />
                    <Tooltip contentStyle={{ backgroundColor: 'white', border: '1px solid #EDF9FA', borderRadius: '12px' }} />
                    <Line type="monotone" dataKey="value" stroke="#17AEB5" strokeWidth={2} dot={{ fill: '#17AEB5', r: 4 }} />
                  </LineChart>
                </ResponsiveContainer>
              </div>
            ) : (
              <p className="text-sm text-[#6F8C90] text-center py-8">Nenhum registro de {metricInfo?.label || selectedMetric}.</p>
            )}
          </Card>

          {/* All measurements list */}
          <Card className="p-5">
            <h3 className="font-semibold text-[#18383C] mb-3">Todas as medidas</h3>
            {measurements.length === 0 ? (
              <p className="text-sm text-[#6F8C90]">Nenhuma medida registrada.</p>
            ) : (
              <div className="space-y-2">
                {measurements.sort((a, b) => new Date(b.measuredAt).getTime() - new Date(a.measuredAt).getTime()).map(m => {
                  const typeInfo = MEASUREMENT_TYPES.find(t => t.code === m.type);
                  return (
                    <div key={m.id} className="flex items-center justify-between p-3 rounded-xl bg-[#F5FCFC]">
                      <div>
                        <p className="text-sm font-medium text-[#18383C]">{typeInfo?.label || m.type}</p>
                        <p className="text-xs text-[#6F8C90]">{formatDateTime(m.measuredAt)}</p>
                      </div>
                      <p className="text-lg font-bold text-[#17AEB5]">{m.value} <span className="text-xs font-normal text-[#6F8C90]">{m.unit}</span></p>
                    </div>
                  );
                })}
              </div>
            )}
          </Card>
        </div>
      )}

      {activeTab === 'exams' && (
        <Card className="p-5">
          <h3 className="font-semibold text-[#18383C] mb-4">Exames</h3>
          {exams.length === 0 ? (
            <EmptyState title="Nenhum exame" description="Exames registrados aparecerão aqui." />
          ) : (
            <div className="space-y-3">
              {exams.map(exam => (
                <div key={exam.id} className="p-4 rounded-xl border border-[#EDF9FA]">
                  <div className="flex items-center justify-between mb-2">
                    <p className="text-sm font-medium text-[#18383C]">{exam.examType}</p>
                    <span className="text-xs text-[#6F8C90]">{formatDate(exam.examDate)}</span>
                  </div>
                  {exam.resultSummary && <p className="text-sm text-[#6F8C90]">{exam.resultSummary}</p>}
                </div>
              ))}
            </div>
          )}
        </Card>
      )}

      {activeTab === 'documents' && (
        <Card className="p-5">
          <h3 className="font-semibold text-[#18383C] mb-4">Documentos</h3>
          {documents.length === 0 ? (
            <EmptyState title="Nenhum documento" description="Documentos anexados aparecerão aqui." />
          ) : (
            <div className="space-y-2">
              {documents.map(doc => (
                <div key={doc.id} className="flex items-center gap-3 p-3 rounded-xl bg-[#F5FCFC]">
                  <FileText size={18} className="text-[#17AEB5]" />
                  <div className="flex-1">
                    <p className="text-sm font-medium text-[#18383C]">{doc.title}</p>
                    <p className="text-xs text-[#6F8C90]">{doc.type} — {formatDate(doc.date)}</p>
                  </div>
                </div>
              ))}
            </div>
          )}
        </Card>
      )}

      {activeTab === 'nutrition' && (
        <div className="space-y-4">
          {nutrition.length === 0 ? (
            <Card className="p-5">
              <EmptyState title="Sem avaliação nutricional" description="Avaliações nutricionais aparecerão aqui." />
            </Card>
          ) : (
            nutrition.sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()).map(n => (
              <Card key={n.id} className="p-5">
                <div className="flex items-center justify-between mb-4">
                  <h3 className="font-semibold text-[#18383C]">Avaliação Nutricional</h3>
                  <span className="text-xs text-[#6F8C90]">{formatDate(n.createdAt)}</span>
                </div>
                <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 mb-4">
                  {n.weight && <div className="text-center p-3 rounded-xl bg-[#EDF9FA]"><p className="text-lg font-bold text-[#17AEB5]">{n.weight} kg</p><p className="text-xs text-[#6F8C90]">Peso</p></div>}
                  {n.height && <div className="text-center p-3 rounded-xl bg-[#EDF9FA]"><p className="text-lg font-bold text-[#17AEB5]">{n.height} cm</p><p className="text-xs text-[#6F8C90]">Altura</p></div>}
                  {n.bmi && <div className="text-center p-3 rounded-xl bg-[#EDF9FA]"><p className="text-lg font-bold text-[#17AEB5]">{n.bmi}</p><p className="text-xs text-[#6F8C90]">IMC</p></div>}
                  {n.waistCircumference && <div className="text-center p-3 rounded-xl bg-[#EDF9FA]"><p className="text-lg font-bold text-[#17AEB5]">{n.waistCircumference} cm</p><p className="text-xs text-[#6F8C90]">Circ. Abdominal</p></div>}
                </div>
                {n.goal && <p className="text-sm text-[#6F8C90] mb-2"><span className="font-medium text-[#18383C]">Meta:</span> {n.goal}</p>}
                {n.dietaryNotes && <p className="text-sm text-[#6F8C90] mb-2"><span className="font-medium text-[#18383C]">Alimentação:</span> {n.dietaryNotes}</p>}
                {n.hydrationNotes && <p className="text-sm text-[#6F8C90] mb-2"><span className="font-medium text-[#18383C]">Hidratação:</span> {n.hydrationNotes}</p>}
                {n.physicalActivityNotes && <p className="text-sm text-[#6F8C90]"><span className="font-medium text-[#18383C]">Atividade física:</span> {n.physicalActivityNotes}</p>}
              </Card>
            ))
          )}
        </div>
      )}

      {activeTab === 'timeline' && (
        <Card className="p-5">
          <h3 className="font-semibold text-[#18383C] mb-4">Linha do Tempo do Paciente</h3>
          {timeline.length === 0 ? (
            <EmptyState title="Sem eventos" description="A linha do tempo será preenchida conforme atividades são registradas." />
          ) : (
            <div className="relative pl-6 space-y-4">
              <div className="absolute left-2 top-2 bottom-2 w-0.5 bg-[#EDF9FA]" />
              {timeline.map(event => (
                <div key={event.id} className="relative flex items-start gap-3">
                  <div className="absolute -left-4 top-1 w-4 h-4 rounded-full bg-white border-2 border-[#17AEB5] flex items-center justify-center">
                    <div className="w-1.5 h-1.5 rounded-full bg-[#17AEB5]" />
                  </div>
                  <div className="flex-1 pb-4">
                    <div className="flex items-center gap-2">
                      <span className="text-[#17AEB5]">{getTimelineIcon(event.type)}</span>
                      <p className="text-sm font-medium text-[#18383C]">{event.title}</p>
                    </div>
                    {event.description && <p className="text-xs text-[#6F8C90] mt-0.5">{event.description}</p>}
                    <p className="text-xs text-[#6F8C90] mt-1">{formatDateTime(event.date)}</p>
                  </div>
                </div>
              ))}
            </div>
          )}
        </Card>
      )}
    </div>
  );
}
