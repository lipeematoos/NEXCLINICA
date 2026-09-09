// NEXCLÍNICA — Specialties Page
import React from 'react';
import { useApp } from '../../services/AppContext';
import { Card, StatusBadge, Button, EmptyState } from '../../components/ui';
import { Layers, Clock, Plus } from 'lucide-react';

export default function Specialties() {
  const { repos } = useApp();
  const specialties = repos.specialties.findAll();

  return (
    <div className="space-y-5">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-[#18383C]">Especialidades</h1>
          <p className="text-sm text-[#6F8C90]">{specialties.length} especialidades configuradas</p>
        </div>
        <Button>
          <Plus size={18} /> Nova Especialidade
        </Button>
      </div>

      {specialties.length === 0 ? (
        <EmptyState icon={<Layers size={28} />} title="Nenhuma especialidade" description="Configure as especialidades atendidas pela clínica." />
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {specialties.map(spec => (
            <Card key={spec.id} className="p-5 hover:shadow-md">
              <div className="flex items-start justify-between">
                <div>
                  <div className="flex items-center gap-2">
                    <div className="w-10 h-10 rounded-xl bg-[#EDF9FA] flex items-center justify-center">
                      <Layers size={20} className="text-[#17AEB5]" />
                    </div>
                    <div>
                      <p className="font-medium text-[#18383C]">{spec.name}</p>
                      <p className="text-xs text-[#6F8C90]">Código: {spec.code}</p>
                    </div>
                  </div>
                </div>
                <StatusBadge label={spec.active ? 'Ativa' : 'Inativa'} variant={spec.active ? 'success' : 'neutral'} />
              </div>
              {spec.description && <p className="text-sm text-[#6F8C90] mt-3">{spec.description}</p>}
              <div className="flex items-center gap-1 mt-3 text-xs text-[#6F8C90]">
                <Clock size={12} /> Duração padrão: {spec.appointmentDuration} minutos
              </div>
            </Card>
          ))}
        </div>
      )}
    </div>
  );
}
