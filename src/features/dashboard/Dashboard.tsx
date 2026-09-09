// NEXCLÍNICA — Dashboard Page
import React from 'react';
import { useApp } from '../../services/AppContext';
import { MetricCard, Card, Avatar, StatusBadge, SectionHeader } from '../../components/ui';
import { Calendar, Users, Clock, TrendingUp, Activity, CheckCircle, FileText, ClipboardList } from 'lucide-react';
import { APPOINTMENT_STATUS_LABELS, APPOINTMENT_TYPE_LABELS } from '../../domain/models';
import { LineChart, Line, XAxis, YAxis, Tooltip, ResponsiveContainer, Area, AreaChart } from 'recharts';

export default function Dashboard() {
  const { repos, currentUser } = useApp();

  const appointments = repos.appointments.findAll();
  const patients = repos.patients.findAll();
  const encounters = repos.encounters.findAll();

  const today = new Date().toISOString().split('T')[0];
  const todayAppts = appointments.filter(a => a.startDateTime.startsWith(today));
  const activePatients = patients.filter(p => p.active);
  const completedThisMonth = encounters.filter(e => {
    const d = new Date(e.encounterDate);
    const now = new Date();
    return d.getMonth() === now.getMonth() && d.getFullYear() === now.getFullYear();
  });

  // Chart data — monthly attendance
  const chartData = [
    { name: 'Jan', atendimentos: 24 },
    { name: 'Fev', atendimentos: 31 },
    { name: 'Mar', atendimentos: 28 },
    { name: 'Abr', atendimentos: 35 },
    { name: 'Mai', atendimentos: 42 },
    { name: 'Jun', atendimentos: 38 },
    { name: 'Jul', atendimentos: 45 },
    { name: 'Ago', atendimentos: 41 },
    { name: 'Set', atendimentos: 48 },
    { name: 'Out', atendimentos: 52 },
    { name: 'Nov', atendimentos: 47 },
    { name: 'Dez', atendimentos: 50 },
  ];

  const getAppointmentStatusVariant = (status: string) => {
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

  const formatTime = (iso: string) => {
    const d = new Date(iso);
    return d.toLocaleTimeString('pt-BR', { hour: '2-digit', minute: '2-digit' });
  };

  return (
    <div className="space-y-6">
      {/* Welcome Header */}
      <div>
        <h1 className="text-2xl font-bold text-[#18383C]">
          Olá, {currentUser?.name?.split(' ')[0] || 'Profissional'} 👋
        </h1>
        <p className="text-[#6F8C90] mt-1">Aqui está o panorama da sua clínica hoje.</p>
      </div>

      {/* Metric Cards */}
      <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-3">
        <MetricCard
          title="Consultas hoje"
          value={todayAppts.length}
          subtitle={`${todayAppts.filter(a => a.status === 'CONFIRMADA').length} confirmadas`}
          icon={<Calendar size={18} />}
          color="primary"
        />
        <MetricCard
          title="Pacientes ativos"
          value={activePatients.length}
          subtitle={`${patients.length} cadastrados`}
          icon={<Users size={18} />}
          color="success"
        />
        <MetricCard
          title="Na fila"
          value={repos.queue.findActive().length}
          subtitle="Aguardando atendimento"
          icon={<Clock size={18} />}
          color="warning"
        />
        <MetricCard
          title="Atendimentos mês"
          value={completedThisMonth.length}
          subtitle="Período atual"
          icon={<Activity size={18} />}
          color="primary"
        />
        <MetricCard
          title="Receitas emitidas"
          value={repos.prescriptions.findAll().length}
          subtitle="Total"
          icon={<FileText size={18} />}
          color="neutral"
        />
        <MetricCard
          title="Exames pendentes"
          value={repos.examRequests.findAll().filter(e => e.status === 'REQUESTED').length}
          subtitle="Aguardando"
          icon={<ClipboardList size={18} />}
          color="neutral"
        />
      </div>

      {/* Today's Agenda */}
      <div>
        <SectionHeader title="Agenda de hoje" subtitle={`${todayAppts.length} compromissos`} />
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-3">
          {todayAppts.length === 0 && (
            <Card className="p-6 col-span-full">
              <p className="text-center text-[#6F8C90] text-sm">Nenhum compromisso para hoje.</p>
            </Card>
          )}
          {todayAppts.map(appt => {
            const patient = repos.patients.findById(appt.patientId);
            const professional = repos.professionals.findById(appt.professionalId);
            const specialty = repos.specialties.findById(appt.specialtyId);
            return (
              <Card key={appt.id} className="p-4 hover:shadow-md cursor-pointer">
                <div className="flex items-start gap-3">
                  <div className="text-center min-w-[48px]">
                    <p className="text-lg font-bold text-[#17AEB5]">{formatTime(appt.startDateTime)}</p>
                    <p className="text-xs text-[#6F8C90]">{formatTime(appt.endDateTime)}</p>
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="font-medium text-[#18383C] truncate">{patient?.fullName || 'Paciente'}</p>
                    <p className="text-sm text-[#6F8C90]">{specialty?.name}</p>
                    <div className="flex items-center gap-2 mt-2">
                      <StatusBadge
                        label={APPOINTMENT_TYPE_LABELS[appt.appointmentType]}
                        variant="neutral"
                      />
                      <StatusBadge
                        label={APPOINTMENT_STATUS_LABELS[appt.status]}
                        variant={getAppointmentStatusVariant(appt.status)}
                      />
                    </div>
                  </div>
                </div>
              </Card>
            );
          })}
        </div>
      </div>

      {/* Recent Patients & Indicators */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Recent Patients */}
        <div>
          <SectionHeader title="Pacientes recentes" />
          <Card className="divide-y divide-[#EDF9FA]">
            {patients.slice(0, 5).map(patient => {
              const lastAppt = appointments
                .filter(a => a.patientId === patient.id)
                .sort((a, b) => new Date(b.startDateTime).getTime() - new Date(a.startDateTime).getTime())[0];
              return (
                <div key={patient.id} className="flex items-center gap-3 p-4 hover:bg-[#F5FCFC]">
                  <Avatar name={patient.fullName} color={patient.avatarColor} size="sm" />
                  <div className="flex-1 min-w-0">
                    <p className="text-sm font-medium text-[#18383C] truncate">{patient.fullName}</p>
                    <p className="text-xs text-[#6F8C90]">{patient.phone}</p>
                  </div>
                  {lastAppt && (
                    <span className="text-xs text-[#6F8C90]">
                      {new Date(lastAppt.startDateTime).toLocaleDateString('pt-BR')}
                    </span>
                  )}
                </div>
              );
            })}
          </Card>
        </div>

        {/* Indicators Chart */}
        <div>
          <SectionHeader title="Indicadores" subtitle="Atendimentos por mês" />
          <Card className="p-5">
            <div className="h-48">
              <ResponsiveContainer width="100%" height="100%">
                <AreaChart data={chartData}>
                  <defs>
                    <linearGradient id="colorAtend" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="5%" stopColor="#17AEB5" stopOpacity={0.3} />
                      <stop offset="95%" stopColor="#17AEB5" stopOpacity={0} />
                    </linearGradient>
                  </defs>
                  <XAxis dataKey="name" axisLine={false} tickLine={false} tick={{ fontSize: 12, fill: '#6F8C90' }} />
                  <YAxis axisLine={false} tickLine={false} tick={{ fontSize: 12, fill: '#6F8C90' }} />
                  <Tooltip
                    contentStyle={{
                      backgroundColor: 'white',
                      border: '1px solid #EDF9FA',
                      borderRadius: '12px',
                      boxShadow: '0 4px 12px rgba(0,0,0,0.05)',
                    }}
                  />
                  <Area
                    type="monotone"
                    dataKey="atendimentos"
                    stroke="#17AEB5"
                    strokeWidth={2}
                    fill="url(#colorAtend)"
                  />
                </AreaChart>
              </ResponsiveContainer>
            </div>
            <div className="grid grid-cols-3 gap-3 mt-4 pt-4 border-t border-[#EDF9FA]">
              <div className="text-center">
                <p className="text-lg font-bold text-[#18383C]">89%</p>
                <p className="text-xs text-[#6F8C90]">Taxa de retorno</p>
              </div>
              <div className="text-center">
                <p className="text-lg font-bold text-[#18383C]">4%</p>
                <p className="text-xs text-[#6F8C90]">Faltas</p>
              </div>
              <div className="text-center">
                <p className="text-lg font-bold text-[#18383C]">12</p>
                <p className="text-xs text-[#6F8C90]">Novos pacientes</p>
              </div>
            </div>
          </Card>
        </div>
      </div>
    </div>
  );
}
