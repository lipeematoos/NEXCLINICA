// NEXCLÍNICA — Pharmacy Dispensing (Layer 5)
import React, { useState } from 'react';
import { useApp } from '../../services/AppContext';
import { Card, Button, Input, StatusBadge, Avatar, EmptyState } from '../../components/ui';
import { Pill, Search, Check, X, Package, AlertTriangle } from 'lucide-react';
import { PRESCRIPTION_STATUS_LABELS, PRESCRIPTION_TYPE_LABELS } from '../../domain/models';

export default function PharmacyDispensing() {
  const { repos } = useApp();
  const [searchCode, setSearchCode] = useState('');
  const [foundRx, setFoundRx] = useState<import('../../domain/models').Prescription | null>(null);
  const [dispensed, setDispensed] = useState(false);

  const handleSearch = () => {
    if (!searchCode) return;
    const rx = repos.prescriptions.findByAccessCode(searchCode) || repos.prescriptions.findByPrescriptionNumber(searchCode);
    setFoundRx(rx || null);
    setDispensed(false);
  };

  const handleDispense = () => {
    if (!foundRx) return;
    repos.prescriptions.update(foundRx.id, { status: 'DISPENSED' });
    setDispensed(true);
  };

  const prescriptions = repos.prescriptions.findAll();

  return (
    <div className="space-y-5">
      <div>
        <h1 className="text-2xl font-bold text-[#18383C]">Dispensação de Medicamentos</h1>
        <p className="text-sm text-[#6F8C90]">Farmácia — Busque e valide receitas para dispensação</p>
      </div>

      {/* Search */}
      <Card className="p-5">
        <h3 className="font-semibold text-[#18383C] mb-3">Buscar Receita</h3>
        <div className="flex gap-2">
          <div className="flex-1">
            <Input
              placeholder="Código de acesso ou nº da receita (ex: 847291 ou RX-2026-000142)"
              value={searchCode}
              onChange={e => setSearchCode(e.target.value)}
            />
          </div>
          <Button onClick={handleSearch}>
            <Search size={16} /> Buscar
          </Button>
        </div>
      </Card>

      {/* Found prescription */}
      {foundRx && !dispensed && (
        <Card className="p-5">
          <div className="flex items-center justify-between mb-4">
            <div>
              <h3 className="font-semibold text-[#18383C]">{foundRx.prescriptionNumber}</h3>
              <p className="text-sm text-[#6F8C90]">{PRESCRIPTION_TYPE_LABELS[foundRx.prescriptionType]}</p>
            </div>
            <StatusBadge
              label={PRESCRIPTION_STATUS_LABELS[foundRx.status]}
              variant={foundRx.status === 'ISSUED' ? 'success' : foundRx.status === 'DISPENSED' ? 'primary' : 'neutral'}
            />
          </div>

          {/* Patient */}
          <div className="p-3 rounded-xl bg-[#F5FCFC] mb-4">
            <div className="flex items-center gap-3">
              <Avatar name={repos.patients.findById(foundRx.patientId)?.fullName || '?'} size="sm" />
              <div>
                <p className="font-medium text-[#18383C]">{repos.patients.findById(foundRx.patientId)?.fullName}</p>
                <p className="text-xs text-[#6F8C90]">
                  Prescrito por: {repos.professionals.findById(foundRx.professionalId)?.personName}
                </p>
              </div>
            </div>
          </div>

          {/* Medications */}
          <h4 className="text-sm font-medium text-[#18383C] mb-2 flex items-center gap-2">
            <Pill size={14} className="text-[#17AEB5]" /> Medicamentos
          </h4>
          <div className="space-y-2 mb-4">
            {foundRx.medications.map((med: any) => (
              <div key={med.id} className="flex items-center justify-between p-3 rounded-xl bg-[#F5FCFC]">
                <div>
                  <p className="text-sm font-medium text-[#18383C]">{med.name} {med.dosage}</p>
                  <p className="text-xs text-[#6F8C90]">{med.dosageInstruction} — {med.quantity} {med.quantityUnit}</p>
                </div>
                <div className="text-right">
                  <span className="text-xs px-2 py-1 rounded-lg bg-[#EDF9FA] text-[#087F86]">A dispensar</span>
                </div>
              </div>
            ))}
          </div>

          {/* Validity */}
          <div className="flex items-center justify-between p-3 rounded-xl border border-[#EDF9FA] mb-4">
            <span className="text-sm text-[#6F8C90]">Validade da receita</span>
            <span className={`text-sm font-medium ${new Date(foundRx.validUntil) < new Date() ? 'text-[#E97878]' : 'text-[#52B788]'}`}>
              {new Date(foundRx.validUntil).toLocaleDateString('pt-BR')}
              {new Date(foundRx.validUntil) < new Date() && ' (VENCIDA)'}
            </span>
          </div>

          {/* Actions */}
          <div className="flex justify-end gap-2">
            {new Date(foundRx.validUntil) >= new Date() && foundRx.status === 'ISSUED' && (
              <Button onClick={handleDispense}>
                <Package size={16} /> Confirmar Dispensação
              </Button>
            )}
            {foundRx.status === 'DISPENSED' && (
              <span className="text-sm text-[#52B788] flex items-center gap-1"><Check size={16} /> Já dispensada</span>
            )}
            {new Date(foundRx.validUntil) < new Date() && (
              <span className="text-sm text-[#E97878] flex items-center gap-1"><AlertTriangle size={16} /> Receita vencida — não é possível dispensar</span>
            )}
          </div>
        </Card>
      )}

      {dispensed && (
        <Card className="p-6 text-center">
          <div className="w-16 h-16 rounded-full bg-green-50 flex items-center justify-center mx-auto mb-3">
            <Check size={32} className="text-[#52B788]" />
          </div>
          <h3 className="text-lg font-semibold text-[#18383C]">Dispensação realizada!</h3>
          <p className="text-sm text-[#6F8C90] mt-1">Medicamentos dispensados com sucesso.</p>
          <Button className="mt-4" onClick={() => { setFoundRx(null); setSearchCode(''); setDispensed(false); }}>
            Nova Dispensação
          </Button>
        </Card>
      )}

      {/* Recent prescriptions */}
      <Card className="p-5">
        <h3 className="font-semibold text-[#18383C] mb-3">Receitas Recentes</h3>
        {prescriptions.length === 0 ? (
          <EmptyState title="Nenhuma receita" description="As receitas emitidas aparecerão aqui." />
        ) : (
          <div className="space-y-2">
            {prescriptions.slice(-5).reverse().map(rx => {
              const patient = repos.patients.findById(rx.patientId);
              return (
                <div key={rx.id} className="flex items-center justify-between p-3 rounded-xl bg-[#F5FCFC]">
                  <div>
                    <p className="text-sm font-medium text-[#18383C]">{rx.prescriptionNumber}</p>
                    <p className="text-xs text-[#6F8C90]">{patient?.fullName} — {new Date(rx.issuedAt).toLocaleDateString('pt-BR')}</p>
                  </div>
                  <StatusBadge
                    label={PRESCRIPTION_STATUS_LABELS[rx.status]}
                    variant={rx.status === 'ISSUED' ? 'success' : rx.status === 'DISPENSED' ? 'primary' : 'neutral'}
                  />
                </div>
              );
            })}
          </div>
        )}
      </Card>
    </div>
  );
}
