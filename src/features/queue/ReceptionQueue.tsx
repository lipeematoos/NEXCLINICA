// NEXCLÍNICA — Reception Queue Panel (Layer 1)
import React, { useState } from 'react';
import { useApp, getDemoTenantId, getDemoUnitId } from '../../services/AppContext';
import { Card, Button, Avatar, StatusBadge, Modal, Select, EmptyState } from '../../components/ui';
import { Users, Plus, Phone, ArrowRight, Check, X, Clock, AlertTriangle } from 'lucide-react';
import { QUEUE_STATUS_LABELS, QUEUE_TYPE_LABELS } from '../../domain/models';
import type { QueueStatus, QueueType } from '../../domain/models';

export default function ReceptionQueue() {
  const { repos } = useApp();
  const [showCheckIn, setShowCheckIn] = useState(false);
  const [selectedPatient, setSelectedPatient] = useState('');
  const [selectedType, setSelectedType] = useState<QueueType>('NORMAL');
  const [notes, setNotes] = useState('');

  const queue = repos.queue.findAll().sort((a, b) => {
    // Sort: IN_ATTENDANCE first, then CALLED, then WAITING
    const statusOrder = { IN_ATTENDANCE: 0, CALLED: 1, WAITING: 2, COMPLETED: 3, NO_SHOW: 4 };
    return statusOrder[a.status] - statusOrder[b.status];
  });

  const activeQueue = queue.filter(q => ['WAITING', 'CALLED', 'IN_ATTENDANCE'].includes(q.status));
  const waitingCount = queue.filter(q => q.status === 'WAITING').length;

  const patients = repos.patients.findAll().filter(p => p.active);
  const professionals = repos.professionals.findAll().filter(p => p.active);

  const generateQueueNumber = (type: QueueType): string => {
    const prefix = type === 'PRIORIDADE' ? 'P' : type === 'URGÊNCIA' ? 'U' : 'A';
    const count = queue.filter(q => q.queueType === type).length + 1;
    return `${prefix}${String(count).padStart(3, '0')}`;
  };

  const handleCheckIn = () => {
    if (!selectedPatient) return;
    const queueNumber = generateQueueNumber(selectedType);
    repos.queue.create({
      tenantId: getDemoTenantId(),
      unitId: getDemoUnitId(),
      patientId: selectedPatient,
      queueNumber,
      queueType: selectedType,
      status: 'WAITING',
      checkInTime: new Date().toISOString(),
      notes: notes || undefined,
    });
    setShowCheckIn(false);
    setSelectedPatient('');
    setNotes('');
    setSelectedType('NORMAL');
  };

  const handleCall = (queueId: string) => {
    repos.queue.update(queueId, {
      status: 'CALLED',
      calledTime: new Date().toISOString(),
      destinationRoom: 'Sala 3',
    });
  };

  const handleStartAttendance = (queueId: string) => {
    repos.queue.update(queueId, {
      status: 'IN_ATTENDANCE',
      attendanceStartTime: new Date().toISOString(),
    });
  };

  const handleComplete = (queueId: string) => {
    repos.queue.update(queueId, {
      status: 'COMPLETED',
      attendanceEndTime: new Date().toISOString(),
    });
  };

  const handleNoShow = (queueId: string) => {
    repos.queue.update(queueId, { status: 'NO_SHOW' });
  };

  const getStatusVariant = (status: QueueStatus) => {
    switch (status) {
      case 'WAITING': return 'warning';
      case 'CALLED': return 'info';
      case 'IN_ATTENDANCE': return 'primary';
      case 'COMPLETED': return 'success';
      case 'NO_SHOW': return 'neutral';
      default: return 'neutral';
    }
  };

  const getTypeVariant = (type: QueueType) => {
    switch (type) {
      case 'PRIORIDADE': return 'warning';
      case 'URGÊNCIA': return 'danger';
      default: return 'neutral';
    }
  };

  const formatTime = (iso: string) => new Date(iso).toLocaleTimeString('pt-BR', { hour: '2-digit', minute: '2-digit' });

  const getWaitTime = (checkIn: string) => {
    const diff = Date.now() - new Date(checkIn).getTime();
    const minutes = Math.floor(diff / 60000);
    if (minutes < 60) return `${minutes} min`;
    return `${Math.floor(minutes / 60)}h ${minutes % 60}min`;
  };

  return (
    <div className="space-y-5">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3">
        <div>
          <h1 className="text-2xl font-bold text-[#18383C]">Fila de Espera</h1>
          <p className="text-sm text-[#6F8C90]">
            {activeQueue.length} pacientes na fila • {waitingCount} aguardando
          </p>
        </div>
        <Button onClick={() => setShowCheckIn(true)}>
          <Plus size={18} /> Check-in Paciente
        </Button>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
        <Card className="p-4 text-center">
          <p className="text-2xl font-bold text-[#F6B85A]">{queue.filter(q => q.status === 'WAITING').length}</p>
          <p className="text-xs text-[#6F8C90]">Aguardando</p>
        </Card>
        <Card className="p-4 text-center">
          <p className="text-2xl font-bold text-[#17AEB5]">{queue.filter(q => q.status === 'CALLED').length}</p>
          <p className="text-xs text-[#6F8C90]">Chamados</p>
        </Card>
        <Card className="p-4 text-center">
          <p className="text-2xl font-bold text-[#22BFC5]">{queue.filter(q => q.status === 'IN_ATTENDANCE').length}</p>
          <p className="text-xs text-[#6F8C90]">Em Atendimento</p>
        </Card>
        <Card className="p-4 text-center">
          <p className="text-2xl font-bold text-[#52B788]">{queue.filter(q => q.status === 'COMPLETED').length}</p>
          <p className="text-xs text-[#6F8C90]">Concluídos</p>
        </Card>
      </div>

      {/* Queue List */}
      {activeQueue.length === 0 ? (
        <EmptyState
          icon={<Users size={28} />}
          title="Fila vazia"
          description="Nenhum paciente na fila de espera no momento."
        />
      ) : (
        <div className="space-y-3">
          {activeQueue.map(item => {
            const patient = repos.patients.findById(item.patientId);
            return (
              <Card key={item.id} className="p-4 hover:shadow-md">
                <div className="flex items-center gap-4">
                  {/* Queue Number */}
                  <div className={`w-16 h-16 rounded-2xl flex flex-col items-center justify-center font-bold text-white ${
                    item.queueType === 'URGÊNCIA' ? 'bg-[#E97878]' :
                    item.queueType === 'PRIORIDADE' ? 'bg-[#F6B85A]' :
                    'bg-[#17AEB5]'
                  }`}>
                    <span className="text-lg">{item.queueNumber}</span>
                    <span className="text-[10px] opacity-80">{QUEUE_TYPE_LABELS[item.queueType]}</span>
                  </div>

                  {/* Patient Info */}
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-2 flex-wrap">
                      <p className="font-medium text-[#18383C]">{patient?.fullName}</p>
                      <StatusBadge label={QUEUE_STATUS_LABELS[item.status]} variant={getStatusVariant(item.status)} />
                      {item.queueType !== 'NORMAL' && (
                        <StatusBadge label={QUEUE_TYPE_LABELS[item.queueType]} variant={getTypeVariant(item.queueType)} />
                      )}
                    </div>
                    <div className="flex items-center gap-3 mt-1 text-sm text-[#6F8C90]">
                      <span className="flex items-center gap-1"><Clock size={12} /> Check-in: {formatTime(item.checkInTime)}</span>
                      <span className="flex items-center gap-1">
                        {item.status === 'WAITING' ? '⏳' : item.status === 'CALLED' ? '📢' : '🩺'}
                        Espera: {getWaitTime(item.checkInTime)}
                      </span>
                      {item.destinationRoom && <span>Sala: {item.destinationRoom}</span>}
                    </div>
                    {item.notes && <p className="text-xs text-[#6F8C90] mt-1">{item.notes}</p>}
                  </div>

                  {/* Actions */}
                  <div className="flex gap-1.5">
                    {item.status === 'WAITING' && (
                      <Button size="sm" variant="primary" onClick={() => handleCall(item.id)}>
                        <Phone size={14} /> Chamar
                      </Button>
                    )}
                    {item.status === 'CALLED' && (
                      <Button size="sm" variant="primary" onClick={() => handleStartAttendance(item.id)}>
                        <ArrowRight size={14} /> Iniciar
                      </Button>
                    )}
                    {item.status === 'IN_ATTENDANCE' && (
                      <Button size="sm" variant="secondary" onClick={() => handleComplete(item.id)}>
                        <Check size={14} /> Concluir
                      </Button>
                    )}
                    {(item.status === 'WAITING' || item.status === 'CALLED') && (
                      <Button size="sm" variant="ghost" onClick={() => handleNoShow(item.id)}>
                        <X size={14} />
                      </Button>
                    )}
                  </div>
                </div>
              </Card>
            );
          })}
        </div>
      )}

      {/* Check-in Modal */}
      <Modal open={showCheckIn} onClose={() => setShowCheckIn(false)} title="Check-in de Paciente">
        <div className="space-y-4">
          <Select
            label="Paciente"
            value={selectedPatient}
            onChange={e => setSelectedPatient(e.target.value)}
            options={[
              { value: '', label: 'Selecionar paciente...' },
              ...patients.map(p => ({ value: p.id, label: `${p.fullName} — ${p.phone}` })),
            ]}
          />
          <Select
            label="Tipo de Atendimento"
            value={selectedType}
            onChange={e => setSelectedType(e.target.value as QueueType)}
            options={[
              { value: 'NORMAL', label: 'Normal' },
              { value: 'PRIORIDADE', label: 'Prioridade (idosos, gestantes, PcD)' },
              { value: 'URGÊNCIA', label: 'Urgência' },
            ]}
          />
          <div>
            <label className="text-sm font-medium text-[#18383C]">Observações</label>
            <textarea
              value={notes}
              onChange={e => setNotes(e.target.value)}
              placeholder="Motivo da visita, informações relevantes..."
              className="w-full mt-1 px-3 py-2.5 bg-white border border-[#EDF9FA] rounded-xl text-sm text-[#18383C] placeholder:text-[#6F8C90] focus:outline-none focus:ring-2 focus:ring-[#17AEB5]/30 resize-none"
              rows={2}
            />
          </div>
          <div className="flex justify-end gap-2 pt-2">
            <Button variant="ghost" onClick={() => setShowCheckIn(false)}>Cancelar</Button>
            <Button onClick={handleCheckIn} disabled={!selectedPatient}>Registrar Check-in</Button>
          </div>
        </div>
      </Modal>
    </div>
  );
}
