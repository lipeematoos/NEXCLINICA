// NEXCLÍNICA — Agenda Page
import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useApp, getDemoProfessionalId, getDemoTenantId, getDemoUnitId } from '../../services/AppContext';
import { Card, Button, Avatar, StatusBadge, Modal, Input, Select, EmptyState } from '../../components/ui';
import { Calendar, Clock, Plus, Play, Check, X, AlertCircle } from 'lucide-react';
import { APPOINTMENT_STATUS_LABELS, APPOINTMENT_TYPE_LABELS } from '../../domain/models';
import type { AppointmentStatus, AppointmentType } from '../../domain/models';

export default function Agenda() {
  const { repos } = useApp();
  const navigate = useNavigate();
  const [view, setView] = useState<'today' | 'week' | 'list'>('today');
  const [showNewAppt, setShowNewAppt] = useState(false);
  const [newAppt, setNewAppt] = useState({
    patientId: '',
    professionalId: getDemoProfessionalId(),
    date: new Date().toISOString().split('T')[0],
    time: '09:00',
    type: 'PRIMEIRA_CONSULTA' as AppointmentType,
    reason: '',
  });

  const appointments = repos.appointments.findAll();
  const patients = repos.patients.findAll();
  const professionals = repos.professionals.findAll();
  const specialties = repos.specialties.findAll();

  const today = new Date().toISOString().split('T')[0];

  const todayAppts = appointments
    .filter(a => a.startDateTime.startsWith(today))
    .sort((a, b) => new Date(a.startDateTime).getTime() - new Date(b.startDateTime).getTime());

  const weekAppts = appointments
    .filter(a => {
      const d = new Date(a.startDateTime);
      const now = new Date();
      const weekStart = new Date(now);
      weekStart.setDate(now.getDate() - now.getDay());
      const weekEnd = new Date(weekStart);
      weekEnd.setDate(weekStart.getDate() + 7);
      return d >= weekStart && d < weekEnd;
    })
    .sort((a, b) => new Date(a.startDateTime).getTime() - new Date(b.startDateTime).getTime());

  const formatTime = (iso: string) => new Date(iso).toLocaleTimeString('pt-BR', { hour: '2-digit', minute: '2-digit' });
  const formatDate = (iso: string) => new Date(iso).toLocaleDateString('pt-BR', { weekday: 'short', day: '2-digit', month: '2-digit' });

  const getStatusVariant = (status: AppointmentStatus) => {
    switch (status) {
      case 'CONFIRMADA': return 'success';
      case 'AGENDADA': return 'info';
      case 'EM_ATENDIMENTO': return 'primary';
      case 'CONCLUÍDA': return 'neutral';
      case 'CANCELADA': return 'danger';
      case 'FALTOU': return 'warning';
      default: return 'neutral';
    }
  };

  const handleStatusChange = (apptId: string, newStatus: AppointmentStatus) => {
    repos.appointments.update(apptId, { status: newStatus });
  };

  const handleStartAppointment = (apptId: string) => {
    const appt = repos.appointments.findById(apptId);
    if (!appt) return;
    repos.appointments.update(apptId, { status: 'EM_ATENDIMENTO' });
    navigate(`/atendimentos/novo?appointmentId=${apptId}&patientId=${appt.patientId}`);
  };

  const handleCreateAppointment = () => {
    if (!newAppt.patientId) return;
    const patient = repos.patients.findById(newAppt.patientId);
    const professional = repos.professionals.findById(newAppt.professionalId);
    if (!patient || !professional) return;

    const specialty = repos.specialties.findById(professional.specialtyId);
    const duration = specialty?.appointmentDuration || 30;
    const start = new Date(`${newAppt.date}T${newAppt.time}:00`);
    const end = new Date(start.getTime() + duration * 60000);

    repos.appointments.create({
      tenantId: getDemoTenantId(),
      patientId: newAppt.patientId,
      professionalId: newAppt.professionalId,
      specialtyId: professional.specialtyId,
      unitId: getDemoUnitId(),
      startDateTime: start.toISOString(),
      endDateTime: end.toISOString(),
      appointmentType: newAppt.type,
      status: 'AGENDADA',
      reason: newAppt.reason || undefined,
      confirmationStatus: 'NAO_CONFIRMADA',
    });

    setShowNewAppt(false);
    setNewAppt({ patientId: '', professionalId: getDemoProfessionalId(), date: today, time: '09:00', type: 'PRIMEIRA_CONSULTA', reason: '' });
  };

  const renderAppointmentCard = (appt: typeof appointments[0]) => {
    const patient = repos.patients.findById(appt.patientId);
    const professional = repos.professionals.findById(appt.professionalId);
    const specialty = repos.specialties.findById(appt.specialtyId);

    return (
      <Card key={appt.id} className="p-4 hover:shadow-md">
        <div className="flex items-start gap-3">
          <div className="text-center min-w-[50px]">
            <p className="text-base font-bold text-[#17AEB5]">{formatTime(appt.startDateTime)}</p>
            <p className="text-xs text-[#6F8C90]">{formatTime(appt.endDateTime)}</p>
          </div>
          <div className="flex-1 min-w-0">
            <div className="flex items-center gap-2">
              <Avatar name={patient?.fullName || '?'} color={patient?.avatarColor} size="sm" />
              <div className="min-w-0">
                <p
                  className="font-medium text-[#18383C] truncate cursor-pointer hover:text-[#17AEB5]"
                  onClick={() => patient && navigate(`/pacientes/${patient.id}`)}
                >
                  {patient?.fullName || 'Paciente'}
                </p>
                <p className="text-xs text-[#6F8C90]">{specialty?.name} — {professional?.personName}</p>
              </div>
            </div>
            <div className="flex flex-wrap items-center gap-2 mt-2">
              <StatusBadge label={APPOINTMENT_TYPE_LABELS[appt.appointmentType]} variant="neutral" />
              <StatusBadge label={APPOINTMENT_STATUS_LABELS[appt.status]} variant={getStatusVariant(appt.status)} />
            </div>
            {appt.reason && <p className="text-xs text-[#6F8C90] mt-2">{appt.reason}</p>}

            {/* Actions */}
            <div className="flex flex-wrap gap-1.5 mt-3">
              {appt.status === 'AGENDADA' && (
                <>
                  <Button size="sm" variant="secondary" onClick={() => handleStatusChange(appt.id, 'CONFIRMADA')}>
                    <Check size={14} /> Confirmar
                  </Button>
                  <Button size="sm" variant="primary" onClick={() => handleStartAppointment(appt.id)}>
                    <Play size={14} /> Iniciar
                  </Button>
                  <Button size="sm" variant="ghost" onClick={() => handleStatusChange(appt.id, 'CANCELADA')}>
                    <X size={14} /> Cancelar
                  </Button>
                </>
              )}
              {appt.status === 'CONFIRMADA' && (
                <Button size="sm" variant="primary" onClick={() => handleStartAppointment(appt.id)}>
                  <Play size={14} /> Iniciar Atendimento
                </Button>
              )}
              {appt.status === 'AGENDADA' && (
                <Button size="sm" variant="ghost" onClick={() => handleStatusChange(appt.id, 'FALTOU')}>
                  <AlertCircle size={14} /> Faltou
                </Button>
              )}
            </div>
          </div>
        </div>
      </Card>
    );
  };

  return (
    <div className="space-y-5">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3">
        <div>
          <h1 className="text-2xl font-bold text-[#18383C]">Agenda</h1>
          <p className="text-sm text-[#6F8C90]">
            {new Date().toLocaleDateString('pt-BR', { weekday: 'long', day: 'numeric', month: 'long', year: 'numeric' })}
          </p>
        </div>
        <Button onClick={() => setShowNewAppt(true)}>
          <Plus size={18} /> Novo Agendamento
        </Button>
      </div>

      {/* View toggle */}
      <div className="flex gap-1 bg-white rounded-xl border border-[#EDF9FA] p-1 w-fit">
        {[
          { key: 'today' as const, label: 'Hoje' },
          { key: 'week' as const, label: 'Semana' },
          { key: 'list' as const, label: 'Lista' },
        ].map(v => (
          <button
            key={v.key}
            onClick={() => setView(v.key)}
            className={`px-4 py-2 rounded-lg text-sm font-medium transition-all
              ${view === v.key ? 'bg-[#17AEB5] text-white' : 'text-[#6F8C90] hover:text-[#087F86]'}`}
          >
            {v.label}
          </button>
        ))}
      </div>

      {/* Content */}
      {view === 'today' && (
        <div className="space-y-3">
          {todayAppts.length === 0 ? (
            <EmptyState icon={<Calendar size={28} />} title="Sem compromissos hoje" description="A agenda de hoje está livre." />
          ) : (
            todayAppts.map(renderAppointmentCard)
          )}
        </div>
      )}

      {view === 'week' && (
        <div className="space-y-4">
          {weekAppts.length === 0 ? (
            <EmptyState icon={<Calendar size={28} />} title="Sem compromissos esta semana" />
          ) : (
            <>
              {Array.from(new Set(weekAppts.map(a => a.startDateTime.split('T')[0]))).map(date => (
                <div key={date}>
                  <h3 className="text-sm font-semibold text-[#18383C] mb-2 flex items-center gap-2">
                    <Calendar size={16} className="text-[#17AEB5]" />
                    {formatDate(date + 'T12:00:00')}
                  </h3>
                  <div className="space-y-2">
                    {weekAppts.filter(a => a.startDateTime.startsWith(date)).map(renderAppointmentCard)}
                  </div>
                </div>
              ))}
            </>
          )}
        </div>
      )}

      {view === 'list' && (
        <div className="space-y-2">
          {appointments
            .sort((a, b) => new Date(b.startDateTime).getTime() - new Date(a.startDateTime).getTime())
            .slice(0, 20)
            .map(renderAppointmentCard)}
        </div>
      )}

      {/* New Appointment Modal */}
      <Modal open={showNewAppt} onClose={() => setShowNewAppt(false)} title="Novo Agendamento" size="md">
        <div className="space-y-4">
          <Select
            label="Paciente"
            value={newAppt.patientId}
            onChange={e => setNewAppt({ ...newAppt, patientId: e.target.value })}
            options={[
              { value: '', label: 'Selecionar paciente...' },
              ...patients.filter(p => p.active).map(p => ({ value: p.id, label: p.fullName })),
            ]}
          />
          <Select
            label="Profissional"
            value={newAppt.professionalId}
            onChange={e => setNewAppt({ ...newAppt, professionalId: e.target.value })}
            options={professionals.map(p => ({ value: p.id, label: p.personName }))}
          />
          <div className="grid grid-cols-2 gap-3">
            <Input label="Data" type="date" value={newAppt.date} onChange={e => setNewAppt({ ...newAppt, date: e.target.value })} />
            <Input label="Horário" type="time" value={newAppt.time} onChange={e => setNewAppt({ ...newAppt, time: e.target.value })} />
          </div>
          <Select
            label="Tipo"
            value={newAppt.type}
            onChange={e => setNewAppt({ ...newAppt, type: e.target.value as AppointmentType })}
            options={Object.entries(APPOINTMENT_TYPE_LABELS).map(([k, v]) => ({ value: k, label: v }))}
          />
          <Input label="Motivo" value={newAppt.reason} onChange={e => setNewAppt({ ...newAppt, reason: e.target.value })} placeholder="Motivo da consulta..." />
          <div className="flex justify-end gap-2 pt-3">
            <Button variant="ghost" onClick={() => setShowNewAppt(false)}>Cancelar</Button>
            <Button onClick={handleCreateAppointment} disabled={!newAppt.patientId}>Agendar</Button>
          </div>
        </div>
      </Modal>
    </div>
  );
}
