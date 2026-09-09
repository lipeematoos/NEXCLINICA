// NEXCLÍNICA — Professionals Page
import React from 'react';
import { useApp } from '../../services/AppContext';
import { Card, Avatar, StatusBadge, Button, EmptyState, SectionHeader } from '../../components/ui';
import { UserCog, Mail, Phone, Award } from 'lucide-react';

export default function Professionals() {
  const { repos } = useApp();
  const professionals = repos.professionals.findAll();
  const specialties = repos.specialties.findAll();

  return (
    <div className="space-y-5">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-[#18383C]">Profissionais</h1>
          <p className="text-sm text-[#6F8C90]">{professionals.length} profissionais cadastrados</p>
        </div>
        <Button>
          <UserCog size={18} /> Novo Profissional
        </Button>
      </div>

      {professionals.length === 0 ? (
        <EmptyState icon={<UserCog size={28} />} title="Nenhum profissional" description="Cadastre profissionais para começar." />
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {professionals.map(prof => {
            const specialty = specialties.find(s => s.id === prof.specialtyId);
            return (
              <Card key={prof.id} className="p-5 hover:shadow-md">
                <div className="flex items-start gap-3">
                  <Avatar name={prof.personName} color={prof.color} size="md" />
                  <div className="flex-1 min-w-0">
                    <p className="font-medium text-[#18383C] truncate">{prof.personName}</p>
                    <p className="text-sm text-[#6F8C90]">{specialty?.name}</p>
                    <div className="flex items-center gap-1 mt-1">
                      <Award size={12} className="text-[#17AEB5]" />
                      <span className="text-xs text-[#6F8C90]">{prof.professionalCouncil} {prof.councilNumber}</span>
                    </div>
                  </div>
                  <StatusBadge label={prof.active ? 'Ativo' : 'Inativo'} variant={prof.active ? 'success' : 'neutral'} />
                </div>
                <div className="mt-3 pt-3 border-t border-[#EDF9FA] space-y-1">
                  <p className="text-xs text-[#6F8C90] flex items-center gap-1"><Mail size={12} /> {prof.email}</p>
                  <p className="text-xs text-[#6F8C90] flex items-center gap-1"><Phone size={12} /> {prof.phone}</p>
                  <p className="text-xs text-[#6F8C90]">Duração: {prof.appointmentDuration} min</p>
                </div>
              </Card>
            );
          })}
        </div>
      )}
    </div>
  );
}
