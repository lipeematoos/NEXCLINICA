// NEXCLÍNICA — Call Screen (TV Display for waiting room)
import React, { useState, useEffect } from 'react';
import { useApp } from '../../services/AppContext';
import { Activity, Volume2, Clock } from 'lucide-react';

export default function CallScreen() {
  const { repos } = useApp();
  const [currentTime, setCurrentTime] = useState(new Date());

  useEffect(() => {
    const timer = setInterval(() => setCurrentTime(new Date()), 1000);
    return () => clearInterval(timer);
  }, []);

  const queue = repos.queue.findAll();
  const recentlyCalled = queue
    .filter(q => q.status === 'CALLED' || q.status === 'IN_ATTENDANCE')
    .sort((a, b) => new Date(b.calledTime || b.checkInTime).getTime() - new Date(a.calledTime || a.checkInTime).getTime())
    .slice(0, 4);

  const waiting = queue
    .filter(q => q.status === 'WAITING')
    .sort((a, b) => new Date(a.checkInTime).getTime() - new Date(b.checkInTime).getTime());

  const nextInLine = waiting.slice(0, 5);

  return (
    <div className="min-h-screen bg-gradient-to-br from-[#087F86] to-[#17AEB5] text-white p-6 md:p-10">
      {/* Header */}
      <div className="flex items-center justify-between mb-8">
        <div className="flex items-center gap-3">
          <div className="w-12 h-12 rounded-xl bg-white/20 flex items-center justify-center">
            <Activity size={28} className="text-white" />
          </div>
          <div>
            <h1 className="text-2xl font-bold">NEXCLÍNICA</h1>
            <p className="text-sm text-white/70">Painel de Chamada</p>
          </div>
        </div>
        <div className="text-right">
          <p className="text-3xl font-bold">
            {currentTime.toLocaleTimeString('pt-BR', { hour: '2-digit', minute: '2-digit', second: '2-digit' })}
          </p>
          <p className="text-sm text-white/70">
            {currentTime.toLocaleDateString('pt-BR', { weekday: 'long', day: 'numeric', month: 'long' })}
          </p>
        </div>
      </div>

      {/* Main called section */}
      <div className="mb-8">
        <h2 className="text-lg font-medium text-white/80 mb-4 flex items-center gap-2">
          <Volume2 size={20} /> Senhas Chamadas
        </h2>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          {recentlyCalled.length === 0 ? (
            <div className="col-span-full text-center py-12 text-white/60">
              <p className="text-lg">Aguardando chamadas...</p>
            </div>
          ) : (
            recentlyCalled.map(item => {
              const patient = repos.patients.findById(item.patientId);
              return (
                <div
                  key={item.id}
                  className={`rounded-2xl p-6 text-center ${
                    item.status === 'IN_ATTENDANCE'
                      ? 'bg-white/20 ring-2 ring-white/40'
                      : 'bg-white/10 animate-pulse'
                  }`}
                >
                  <p className="text-5xl font-bold mb-2">{item.queueNumber}</p>
                  <p className="text-lg font-medium">{patient?.fullName?.split(' ').slice(0, 2).join(' ')}</p>
                  {item.destinationRoom && (
                    <p className="text-sm text-white/70 mt-2">Dirija-se à {item.destinationRoom}</p>
                  )}
                  <p className={`text-xs mt-2 px-2 py-1 rounded-full inline-block ${
                    item.status === 'IN_ATTENDANCE' ? 'bg-green-400/30' : 'bg-yellow-400/30'
                  }`}>
                    {item.status === 'IN_ATTENDANCE' ? 'Em Atendimento' : 'Chamado'}
                  </p>
                </div>
              );
            })
          )}
        </div>
      </div>

      {/* Next in line */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <div>
          <h2 className="text-lg font-medium text-white/80 mb-4 flex items-center gap-2">
            <Clock size={20} /> Próximos da Fila
          </h2>
          <div className="bg-white/10 rounded-2xl overflow-hidden">
            {nextInLine.length === 0 ? (
              <p className="text-center py-8 text-white/60">Fila vazia</p>
            ) : (
              nextInLine.map((item, idx) => {
                const patient = repos.patients.findById(item.patientId);
                return (
                  <div key={item.id} className={`flex items-center gap-4 p-4 ${idx < nextInLine.length - 1 ? 'border-b border-white/10' : ''}`}>
                    <span className={`text-2xl font-bold w-16 text-center ${
                      item.queueType === 'PRIORIDADE' ? 'text-yellow-300' :
                      item.queueType === 'URGÊNCIA' ? 'text-red-300' :
                      'text-white'
                    }`}>{item.queueNumber}</span>
                    <div className="flex-1">
                      <p className="font-medium">{patient?.fullName?.split(' ').slice(0, 2).join(' ')}</p>
                      <p className="text-xs text-white/60">
                        {item.queueType !== 'NORMAL' ? `⚡ ${item.queueType}` : 'Normal'}
                      </p>
                    </div>
                  </div>
                );
              })
            )}
          </div>
        </div>

        {/* Info panel */}
        <div>
          <h2 className="text-lg font-medium text-white/80 mb-4">Informações</h2>
          <div className="bg-white/10 rounded-2xl p-6 space-y-4">
            <div className="flex items-center justify-between">
              <span className="text-white/70">Total na fila</span>
              <span className="text-2xl font-bold">{waiting.length}</span>
            </div>
            <div className="flex items-center justify-between">
              <span className="text-white/70">Em atendimento</span>
              <span className="text-2xl font-bold">{queue.filter(q => q.status === 'IN_ATTENDANCE').length}</span>
            </div>
            <div className="flex items-center justify-between">
              <span className="text-white/70">Atendidos hoje</span>
              <span className="text-2xl font-bold">{queue.filter(q => q.status === 'COMPLETED').length}</span>
            </div>
            <div className="pt-4 border-t border-white/10">
              <p className="text-xs text-white/60 text-center">
                Ao ouvir sua senha, dirija-se à recepção para ser encaminhado.
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
