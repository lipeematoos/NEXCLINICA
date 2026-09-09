// NEXCLÍNICA — QR Code Validation (Public page)
import React, { useState } from 'react';
import { useApp } from '../../services/AppContext';
import { Card, Button, Input, StatusBadge } from '../../components/ui';
import { Shield, Check, X, AlertTriangle, QrCode, Activity } from 'lucide-react';

export default function QRValidation() {
  const { repos } = useApp();
  const [code, setCode] = useState('');
  const [result, setResult] = useState<'found' | 'not_found' | 'expired' | 'cancelled' | null>(null);
  const [prescription, setPrescription] = useState<any>(null);

  const handleValidate = () => {
    if (!code) return;

    // Try by access code
    const rx = repos.prescriptions.findByAccessCode(code);
    if (rx) {
      const isExpired = new Date(rx.validUntil) < new Date();
      if (rx.status === 'CANCELLED') {
        setResult('cancelled');
        setPrescription(rx);
      } else if (isExpired) {
        setResult('expired');
        setPrescription(rx);
      } else {
        setResult('found');
        setPrescription(rx);
      }
      return;
    }

    // Try by prescription number
    const rxByNumber = repos.prescriptions.findByPrescriptionNumber(code);
    if (rxByNumber) {
      const isExpired = new Date(rxByNumber.validUntil) < new Date();
      if (rxByNumber.status === 'CANCELLED') {
        setResult('cancelled');
        setPrescription(rxByNumber);
      } else if (isExpired) {
        setResult('expired');
        setPrescription(rxByNumber);
      } else {
        setResult('found');
        setPrescription(rxByNumber);
      }
      return;
    }

    setResult('not_found');
    setPrescription(null);
  };

  return (
    <div className="min-h-screen bg-[#F5FCFC] flex items-center justify-center p-4">
      <div className="w-full max-w-md">
        {/* Header */}
        <div className="text-center mb-6">
          <div className="inline-flex items-center justify-center w-14 h-14 rounded-2xl bg-gradient-to-br from-[#17AEB5] to-[#087F86] shadow-lg mb-3">
            <Activity size={28} className="text-white" />
          </div>
          <h1 className="text-xl font-bold text-[#18383C]">NEXCLÍNICA</h1>
          <p className="text-sm text-[#6F8C90]">Validação de Receita Médica</p>
        </div>

        {/* Validation Card */}
        <Card className="p-6">
          <div className="flex items-center gap-2 mb-4">
            <Shield size={20} className="text-[#17AEB5]" />
            <h2 className="text-lg font-semibold text-[#18383C]">Verificar autenticidade</h2>
          </div>

          <p className="text-sm text-[#6F8C90] mb-4">
            Digite o código de acesso ou número da receita para verificar sua validade.
          </p>

          <div className="space-y-3">
            <Input
              placeholder="Código de acesso ou nº da receita"
              value={code}
              onChange={e => { setCode(e.target.value); setResult(null); }}
            />
            <Button onClick={handleValidate} className="w-full" disabled={!code}>
              <QrCode size={16} /> Validar Receita
            </Button>
          </div>

          {/* Results */}
          {result === 'found' && prescription && (
            <div className="mt-4 p-4 rounded-xl bg-green-50 border border-green-100">
              <div className="flex items-center gap-2 mb-2">
                <Check size={20} className="text-[#52B788]" />
                <p className="font-medium text-[#52B788]">Receita válida</p>
              </div>
              <div className="text-sm text-[#18383C] space-y-1">
                <p><span className="text-[#6F8C90]">Nº:</span> {prescription.prescriptionNumber}</p>
                <p><span className="text-[#6F8C90]">Paciente:</span> {repos.patients.findById(prescription.patientId)?.fullName}</p>
                <p><span className="text-[#6F8C90]">Profissional:</span> {repos.professionals.findById(prescription.professionalId)?.personName}</p>
                <p><span className="text-[#6F8C90]">Emitida em:</span> {new Date(prescription.issuedAt).toLocaleDateString('pt-BR')}</p>
                <p><span className="text-[#6F8C90]">Válida até:</span> {new Date(prescription.validUntil).toLocaleDateString('pt-BR')}</p>
                <p><span className="text-[#6F8C90]">Medicamentos:</span> {prescription.medications.length} item(ns)</p>
              </div>
              <StatusBadge label="VÁLIDA" variant="success" />
            </div>
          )}

          {result === 'expired' && prescription && (
            <div className="mt-4 p-4 rounded-xl bg-amber-50 border border-amber-100">
              <div className="flex items-center gap-2 mb-2">
                <AlertTriangle size={20} className="text-[#F6B85A]" />
                <p className="font-medium text-[#D4940A]">Receita vencida</p>
              </div>
              <p className="text-sm text-[#6F8C90]">
                Esta receita foi emitida em {new Date(prescription.issuedAt).toLocaleDateString('pt-BR')} e venceu em {new Date(prescription.validUntil).toLocaleDateString('pt-BR')}.
              </p>
              <StatusBadge label="VENCIDA" variant="warning" />
            </div>
          )}

          {result === 'cancelled' && (
            <div className="mt-4 p-4 rounded-xl bg-red-50 border border-red-100">
              <div className="flex items-center gap-2 mb-2">
                <X size={20} className="text-[#E97878]" />
                <p className="font-medium text-[#E97878]">Receita cancelada</p>
              </div>
              <p className="text-sm text-[#6F8C90]">Esta receita foi cancelada pelo profissional emissor.</p>
              <StatusBadge label="CANCELADA" variant="danger" />
            </div>
          )}

          {result === 'not_found' && (
            <div className="mt-4 p-4 rounded-xl bg-red-50 border border-red-100">
              <div className="flex items-center gap-2 mb-2">
                <X size={20} className="text-[#E97878]" />
                <p className="font-medium text-[#E97878]">Receita não encontrada</p>
              </div>
              <p className="text-sm text-[#6F8C90]">Nenhuma receita encontrada com este código. Verifique os dados informados.</p>
            </div>
          )}
        </Card>

        <p className="text-center text-xs text-[#6F8C90] mt-4">
          NEXCLÍNICA © 2026 — Sistema de validação de receitas médicas
        </p>
      </div>
    </div>
  );
}
