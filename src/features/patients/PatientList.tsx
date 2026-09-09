// NEXCLÍNICA — Patient List Page
import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useApp } from '../../services/AppContext';
import { SearchField, Card, Avatar, StatusBadge, Button, EmptyState } from '../../components/ui';
import { Users, Plus, Phone, Calendar } from 'lucide-react';

export default function PatientList() {
  const { repos } = useApp();
  const navigate = useNavigate();
  const [search, setSearch] = useState('');
  const [filterActive, setFilterActive] = useState<'all' | 'active' | 'inactive'>('active');

  const allPatients = repos.patients.findAll();
  const filtered = allPatients.filter(p => {
    if (filterActive === 'active' && !p.active) return false;
    if (filterActive === 'inactive' && p.active) return false;
    if (search) {
      const s = search.toLowerCase();
      return p.fullName.toLowerCase().includes(s) || p.phone.includes(s) || (p.cpf && p.cpf.includes(s));
    }
    return true;
  });

  const calculateAge = (birthDate: string) => {
    const today = new Date();
    const birth = new Date(birthDate);
    let age = today.getFullYear() - birth.getFullYear();
    const m = today.getMonth() - birth.getMonth();
    if (m < 0 || (m === 0 && today.getDate() < birth.getDate())) age--;
    return age;
  };

  const getLastAppointment = (patientId: string) => {
    return repos.appointments.findByPatient(patientId)
      .filter(a => a.status === 'CONCLUÍDA')
      .sort((a, b) => new Date(b.startDateTime).getTime() - new Date(a.startDateTime).getTime())[0];
  };

  const getNextAppointment = (patientId: string) => {
    return repos.appointments.findByPatient(patientId)
      .filter(a => ['AGENDADA', 'CONFIRMADA'].includes(a.status))
      .sort((a, b) => new Date(a.startDateTime).getTime() - new Date(b.startDateTime).getTime())[0];
  };

  return (
    <div className="space-y-5">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3">
        <div>
          <h1 className="text-2xl font-bold text-[#18383C]">Pacientes</h1>
          <p className="text-sm text-[#6F8C90]">{allPatients.length} pacientes cadastrados</p>
        </div>
        <Button onClick={() => navigate('/pacientes/novo')}>
          <Plus size={18} />
          Novo Paciente
        </Button>
      </div>

      {/* Filters */}
      <div className="flex flex-col sm:flex-row gap-3">
        <div className="flex-1">
          <SearchField
            value={search}
            onChange={setSearch}
            placeholder="Buscar por nome, telefone ou CPF..."
          />
        </div>
        <div className="flex gap-1 bg-white rounded-xl border border-[#EDF9FA] p-1">
          {[
            { key: 'active' as const, label: 'Ativos' },
            { key: 'inactive' as const, label: 'Inativos' },
            { key: 'all' as const, label: 'Todos' },
          ].map(f => (
            <button
              key={f.key}
              onClick={() => setFilterActive(f.key)}
              className={`px-3 py-1.5 rounded-lg text-sm font-medium transition-all
                ${filterActive === f.key
                  ? 'bg-[#17AEB5] text-white'
                  : 'text-[#6F8C90] hover:text-[#087F86]'
                }`}
            >
              {f.label}
            </button>
          ))}
        </div>
      </div>

      {/* Patient List */}
      {filtered.length === 0 ? (
        <EmptyState
          icon={<Users size={28} />}
          title="Nenhum paciente encontrado"
          description="Tente ajustar os filtros ou cadastre um novo paciente."
          action={<Button onClick={() => navigate('/pacientes/novo')}>Novo Paciente</Button>}
        />
      ) : (
        <div className="space-y-2">
          {filtered.map(patient => {
            const lastAppt = getLastAppointment(patient.id);
            const nextAppt = getNextAppointment(patient.id);
            return (
              <Card
                key={patient.id}
                className="p-4 hover:shadow-md cursor-pointer"
                onClick={() => navigate(`/pacientes/${patient.id}`)}
              >
                <div className="flex items-center gap-4">
                  <Avatar name={patient.fullName} color={patient.avatarColor} />
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-2">
                      <p className="font-medium text-[#18383C] truncate">{patient.fullName}</p>
                      {!patient.active && <StatusBadge label="Inativo" variant="neutral" />}
                    </div>
                    <div className="flex flex-wrap items-center gap-3 mt-1">
                      <span className="text-sm text-[#6F8C90]">
                        {calculateAge(patient.birthDate)} anos
                      </span>
                      <span className="text-sm text-[#6F8C90] flex items-center gap-1">
                        <Phone size={12} /> {patient.phone}
                      </span>
                      {lastAppt && (
                        <span className="text-xs text-[#6F8C90] flex items-center gap-1">
                          <Calendar size={12} /> Último: {new Date(lastAppt.startDateTime).toLocaleDateString('pt-BR')}
                        </span>
                      )}
                      {nextAppt && (
                        <span className="text-xs text-[#17AEB5] flex items-center gap-1 font-medium">
                          <Calendar size={12} /> Próximo: {new Date(nextAppt.startDateTime).toLocaleDateString('pt-BR')}
                        </span>
                      )}
                    </div>
                  </div>
                </div>
              </Card>
            );
          })}
        </div>
      )}
    </div>
  );
}
