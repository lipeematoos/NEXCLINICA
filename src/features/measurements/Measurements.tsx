// NEXCLÍNICA — Measurements Page
import React, { useState } from 'react';
import { useApp } from '../../services/AppContext';
import { Card, Avatar, Select, EmptyState } from '../../components/ui';
import { Ruler, TrendingUp } from 'lucide-react';
import { MEASUREMENT_TYPES } from '../../domain/models';
import { LineChart, Line, XAxis, YAxis, Tooltip, ResponsiveContainer } from 'recharts';

export default function Measurements() {
  const { repos } = useApp();
  const [selectedPatient, setSelectedPatient] = useState('');
  const [selectedMetric, setSelectedMetric] = useState('peso');

  const patients = repos.patients.findAll().filter(p => p.active);
  const formatDate = (iso: string) => new Date(iso).toLocaleDateString('pt-BR');

  const allMeasurements = selectedPatient
    ? repos.measurements.findByPatientAndType(selectedPatient, selectedMetric)
        .sort((a, b) => new Date(a.measuredAt).getTime() - new Date(b.measuredAt).getTime())
    : [];

  const chartData = allMeasurements.map(m => ({
    date: formatDate(m.measuredAt),
    value: m.value,
  }));

  const metricInfo = MEASUREMENT_TYPES.find(m => m.code === selectedMetric);

  return (
    <div className="space-y-5">
      <div>
        <h1 className="text-2xl font-bold text-[#18383C]">Medidas e Evolução</h1>
        <p className="text-sm text-[#6F8C90]">Acompanhe a evolução das medidas dos pacientes</p>
      </div>

      {/* Filters */}
      <div className="flex flex-col sm:flex-row gap-3">
        <div className="flex-1">
          <Select
            label="Paciente"
            value={selectedPatient}
            onChange={e => setSelectedPatient(e.target.value)}
            options={[
              { value: '', label: 'Selecionar paciente...' },
              ...patients.map(p => ({ value: p.id, label: p.fullName })),
            ]}
          />
        </div>
        <div className="flex-1">
          <Select
            label="Métrica"
            value={selectedMetric}
            onChange={e => setSelectedMetric(e.target.value)}
            options={MEASUREMENT_TYPES.map(m => ({ value: m.code, label: `${m.label} (${m.unit})` }))}
          />
        </div>
      </div>

      {!selectedPatient ? (
        <EmptyState
          icon={<Ruler size={28} />}
          title="Selecione um paciente"
          description="Escolha um paciente para visualizar a evolução das medidas."
        />
      ) : (
        <>
          {/* Chart */}
          <Card className="p-5">
            <div className="flex items-center gap-2 mb-4">
              <TrendingUp size={20} className="text-[#17AEB5]" />
              <h3 className="font-semibold text-[#18383C]">
                Evolução — {metricInfo?.label}
              </h3>
            </div>
            {chartData.length > 0 ? (
              <div className="h-56">
                <ResponsiveContainer width="100%" height="100%">
                  <LineChart data={chartData}>
                    <XAxis dataKey="date" axisLine={false} tickLine={false} tick={{ fontSize: 11, fill: '#6F8C90' }} />
                    <YAxis axisLine={false} tickLine={false} tick={{ fontSize: 11, fill: '#6F8C90' }} />
                    <Tooltip contentStyle={{ backgroundColor: 'white', border: '1px solid #EDF9FA', borderRadius: '12px' }} />
                    <Line type="monotone" dataKey="value" stroke="#17AEB5" strokeWidth={2} dot={{ fill: '#17AEB5', r: 5 }} />
                  </LineChart>
                </ResponsiveContainer>
              </div>
            ) : (
              <p className="text-sm text-[#6F8C90] text-center py-12">
                Nenhum registro de {metricInfo?.label} para este paciente.
              </p>
            )}
          </Card>

          {/* Measurements table */}
          <Card className="p-5">
            <h3 className="font-semibold text-[#18383C] mb-3">Registros</h3>
            {allMeasurements.length === 0 ? (
              <p className="text-sm text-[#6F8C90]">Nenhum registro encontrado.</p>
            ) : (
              <div className="space-y-2">
                {allMeasurements.map(m => (
                  <div key={m.id} className="flex items-center justify-between p-3 rounded-xl bg-[#F5FCFC]">
                    <div>
                      <p className="text-sm font-medium text-[#18383C]">{metricInfo?.label}</p>
                      <p className="text-xs text-[#6F8C90]">{formatDate(m.measuredAt)}</p>
                    </div>
                    <p className="text-lg font-bold text-[#17AEB5]">
                      {m.value} <span className="text-xs font-normal text-[#6F8C90]">{m.unit}</span>
                    </p>
                  </div>
                ))}
              </div>
            )}
          </Card>
        </>
      )}
    </div>
  );
}
