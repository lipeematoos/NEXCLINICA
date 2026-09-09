// NEXCLÍNICA — Encounters List Page
import React from 'react';
import { useNavigate } from 'react-router-dom';
import { useApp } from '../../services/AppContext';
import { Card, Avatar, StatusBadge, EmptyState } from '../../components/ui';
import { Stethoscope, Calendar } from 'lucide-react';
import { ENCOUNTER_STATUS_LABELS } from '../../domain/models';

export default function EncounterList() {
  const { repos } = useApp();
  const navigate = useNavigate();
  const encounters = repos.encounters.findAll()
    .sort((a, b) => new Date(b.encounterDate).getTime() - new Date(a.encounterDate).getTime());

  const formatDateTime = (iso: string) => new Date(iso).toLocaleString('pt-BR', {
    day: '2-digit', month: '2-digit', year: 'numeric', hour: '2-digit', minute: '2-digit'
  });

  return (
    <div className="space-y-5">
      <div>
        <h1 className="text-2xl font-bold text-[#18383C]">Atendimentos</h1>
        <p className="text-sm text-[#6F8C90]">{encounters.length} atendimentos registrados</p>
      </div>

      {encounters.length === 0 ? (
        <EmptyState
          icon={<Stethoscope size={28} />}
          title="Nenhum atendimento"
          description="Os atendimentos realizados aparecerão aqui."
        />
      ) : (
        <div className="space-y-3">
          {encounters.map(enc => {
            const patient = repos.patients.findById(enc.patientId);
            const professional = repos.professionals.findById(enc.professionalId);
            const specialty = repos.specialties.findById(enc.specialtyId);
            return (
              <Card
                key={enc.id}
                className="p-4 hover:shadow-md cursor-pointer"
                onClick={() => patient && navigate(`/pacientes/${patient.id}`)}
              >
                <div className="flex items-start gap-3">
                  <Avatar name={patient?.fullName || '?'} color={patient?.avatarColor} size="sm" />
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-2 flex-wrap">
                      <p className="font-medium text-[#18383C]">{patient?.fullName}</p>
                      <StatusBadge
                        label={ENCOUNTER_STATUS_LABELS[enc.status]}
                        variant={enc.status === 'COMPLETED' ? 'success' : enc.status === 'IN_PROGRESS' ? 'primary' : 'warning'}
                      />
                    </div>
                    <p className="text-sm text-[#6F8C90] mt-0.5">{specialty?.name} — {professional?.personName}</p>
                    {enc.chiefComplaint && (
                      <p className="text-sm text-[#6F8C90] mt-1 truncate">{enc.chiefComplaint}</p>
                    )}
                    <p className="text-xs text-[#6F8C90] mt-2 flex items-center gap-1">
                      <Calendar size={12} /> {formatDateTime(enc.encounterDate)}
                    </p>
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
