// NEXCLÍNICA — New Patient Page
import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useApp, getDemoTenantId } from '../../services/AppContext';
import { Input, Select, Button, Textarea, Card } from '../../components/ui';
import { SUSCardInput } from '../../components/clinical/SUSCardInput';
import { HealthInsuranceInput } from '../../components/clinical/HealthInsuranceInput';
import { ArrowLeft, ArrowRight, Check } from 'lucide-react';
import type { SUSCard, HealthInsurance } from '../../domain/models';

const STEPS = [
  { id: 'basic', label: 'Dados básicos' },
  { id: 'contact', label: 'Contato' },
  { id: 'emergency', label: 'Emergência' },
  { id: 'coverage', label: 'SUS/Convênio' },
  { id: 'admin', label: 'Administrativo' },
  { id: 'consent', label: 'Consentimentos' },
];

export default function NewPatient() {
  const { repos } = useApp();
  const navigate = useNavigate();
  const [step, setStep] = useState(0);
  const [form, setForm] = useState({
    fullName: '',
    socialName: '',
    birthDate: '',
    cpf: '',
    rg: '',
    gender: '' as '' | 'M' | 'F' | 'O' | 'N',
    phone: '',
    email: '',
    emergencyContactName: '',
    emergencyContactPhone: '',
    address: '',
    occupation: '',
    healthInsurance: '',
    insuranceNumber: '',
    notes: '',
    consentLgpd: false,
    consentTreatment: false,
    susCard: undefined as SUSCard | undefined,
    healthInsuranceData: undefined as HealthInsurance | undefined,
  });

  const update = (field: string, value: string | boolean) => {
    setForm(prev => ({ ...prev, [field]: value }));
  };

  const canNext = () => {
    if (step === 0) return form.fullName && form.birthDate && form.phone;
    if (step === 5) return form.consentLgpd;
    return true;
  };

  const handleSave = () => {
    const patient = repos.patients.create({
      tenantId: getDemoTenantId(),
      fullName: form.fullName,
      socialName: form.socialName || undefined,
      birthDate: form.birthDate,
      cpf: form.cpf || undefined,
      rg: form.rg || undefined,
      gender: form.gender || undefined,
      phone: form.phone,
      email: form.email || undefined,
      emergencyContactName: form.emergencyContactName || undefined,
      emergencyContactPhone: form.emergencyContactPhone || undefined,
      address: form.address || undefined,
      occupation: form.occupation || undefined,
      healthInsurance: form.healthInsurance || undefined,
      insuranceNumber: form.insuranceNumber || undefined,
      notes: form.notes || undefined,
      active: true,
      avatarColor: ['#17AEB5', '#22BFC5', '#52B788', '#F6B85A', '#E97878'][Math.floor(Math.random() * 5)],
      susCard: form.susCard,
      healthInsuranceData: form.healthInsuranceData,
    });
    navigate(`/pacientes/${patient.id}`);
  };

  return (
    <div className="max-w-2xl mx-auto space-y-5">
      {/* Header */}
      <div className="flex items-center gap-3">
        <button onClick={() => navigate('/pacientes')} className="p-2 rounded-lg hover:bg-[#EDF9FA] text-[#6F8C90]">
          <ArrowLeft size={20} />
        </button>
        <div>
          <h1 className="text-2xl font-bold text-[#18383C]">Novo Paciente</h1>
          <p className="text-sm text-[#6F8C90]">Cadastre um novo paciente no sistema</p>
        </div>
      </div>

      {/* Steps indicator */}
      <div className="flex items-center gap-2 overflow-x-auto pb-2">
        {STEPS.map((s, i) => (
          <div key={s.id} className="flex items-center gap-2">
            <div className={`flex items-center gap-2 px-3 py-1.5 rounded-lg text-sm font-medium whitespace-nowrap
              ${i === step ? 'bg-[#17AEB5] text-white' : i < step ? 'bg-[#EDF9FA] text-[#087F86]' : 'text-[#6F8C90]'}`}>
              <span className="w-5 h-5 rounded-full flex items-center justify-center text-xs border border-current">
                {i < step ? <Check size={12} /> : i + 1}
              </span>
              <span className="hidden sm:inline">{s.label}</span>
            </div>
            {i < STEPS.length - 1 && <div className="w-4 h-px bg-[#EDF9FA]" />}
          </div>
        ))}
      </div>

      {/* Form Card */}
      <Card className="p-6">
        <div className="space-y-4">
          {/* Step 0: Basic */}
          {step === 0 && (
            <>
              <Input label="Nome completo *" value={form.fullName} onChange={e => update('fullName', e.target.value)} placeholder="Nome completo do paciente" />
              <Input label="Nome social" value={form.socialName} onChange={e => update('socialName', e.target.value)} placeholder="Se diferente do nome civil" />
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <Input label="Data de nascimento *" type="date" value={form.birthDate} onChange={e => update('birthDate', e.target.value)} />
                <Select
                  label="Gênero"
                  value={form.gender}
                  onChange={e => update('gender', e.target.value)}
                  options={[
                    { value: '', label: 'Selecionar...' },
                    { value: 'M', label: 'Masculino' },
                    { value: 'F', label: 'Feminino' },
                    { value: 'O', label: 'Outro' },
                    { value: 'N', label: 'Prefiro não informar' },
                  ]}
                />
              </div>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <Input label="CPF" value={form.cpf} onChange={e => update('cpf', e.target.value)} placeholder="000.000.000-00" />
                <Input label="RG" value={form.rg} onChange={e => update('rg', e.target.value)} />
              </div>
            </>
          )}

          {/* Step 1: Contact */}
          {step === 1 && (
            <>
              <Input label="Telefone *" value={form.phone} onChange={e => update('phone', e.target.value)} placeholder="(00) 00000-0000" />
              <Input label="E-mail" type="email" value={form.email} onChange={e => update('email', e.target.value)} placeholder="email@exemplo.com" />
              <Input label="Endereço" value={form.address} onChange={e => update('address', e.target.value)} placeholder="Rua, número, bairro, cidade/UF" />
              <Input label="Profissão" value={form.occupation} onChange={e => update('occupation', e.target.value)} />
            </>
          )}

          {/* Step 2: Emergency */}
          {step === 2 && (
            <>
              <Input label="Nome do contato de emergência" value={form.emergencyContactName} onChange={e => update('emergencyContactName', e.target.value)} />
              <Input label="Telefone do contato de emergência" value={form.emergencyContactPhone} onChange={e => update('emergencyContactPhone', e.target.value)} placeholder="(00) 00000-0000" />
            </>
          )}

          {/* Step 3: SUS/Insurance Coverage */}
          {step === 3 && (
            <>
              <SUSCardInput
                value={form.susCard}
                onChange={(susCard) => setForm(prev => ({ ...prev, susCard }))}
              />
              <div className="border-t border-[#EDF9FA] pt-4 mt-4">
                <HealthInsuranceInput
                  value={form.healthInsuranceData}
                  onChange={(insurance) => setForm(prev => ({ ...prev, healthInsuranceData: insurance }))}
                />
              </div>
            </>
          )}

          {/* Step 4: Admin */}
          {step === 4 && (
            <>
              <Input label="Convênio / Plano de saúde" value={form.healthInsurance} onChange={e => update('healthInsurance', e.target.value)} />
              <Input label="Número da carteirinha" value={form.insuranceNumber} onChange={e => update('insuranceNumber', e.target.value)} />
              <Textarea label="Observações" value={form.notes} onChange={e => update('notes', e.target.value)} placeholder="Informações adicionais sobre o paciente..." />
            </>
          )}

          {/* Step 5: Consent */}
          {step === 5 && (
            <div className="space-y-4">
              <div className="p-4 rounded-xl bg-[#EDF9FA] border border-[#17AEB5]/20">
                <h3 className="font-medium text-[#18383C] mb-2">Termos e Consentimentos</h3>
                <p className="text-sm text-[#6F8C90] mb-4">
                  De acordo com a LGPD (Lei Geral de Proteção de Dados), é necessário o consentimento do paciente para o tratamento de seus dados pessoais e de saúde.
                </p>
                <label className="flex items-start gap-3 cursor-pointer">
                  <input
                    type="checkbox"
                    checked={form.consentLgpd}
                    onChange={e => update('consentLgpd', e.target.checked)}
                    className="mt-1 w-4 h-4 rounded border-[#17AEB5] text-[#17AEB5] focus:ring-[#17AEB5]"
                  />
                  <span className="text-sm text-[#18383C]">
                    Autorizo o tratamento dos meus dados pessoais conforme a LGPD para fins de atendimento clínico. *
                  </span>
                </label>
                <label className="flex items-start gap-3 cursor-pointer mt-3">
                  <input
                    type="checkbox"
                    checked={form.consentTreatment}
                    onChange={e => update('consentTreatment', e.target.checked)}
                    className="mt-1 w-4 h-4 rounded border-[#17AEB5] text-[#17AEB5] focus:ring-[#17AEB5]"
                  />
                  <span className="text-sm text-[#18383C]">
                    Estou ciente e de acordo com o termo de consentimento para tratamento de dados de saúde.
                  </span>
                </label>
              </div>
            </div>
          )}
        </div>

        {/* Navigation buttons */}
        <div className="flex items-center justify-between mt-6 pt-4 border-t border-[#EDF9FA]">
          <Button
            variant="ghost"
            onClick={() => step === 0 ? navigate('/pacientes') : setStep(step - 1)}
          >
            <ArrowLeft size={16} />
            {step === 0 ? 'Cancelar' : 'Voltar'}
          </Button>
          {step < STEPS.length - 1 ? (
            <Button onClick={() => setStep(step + 1)} disabled={!canNext()}>
              Próximo
              <ArrowRight size={16} />
            </Button>
          ) : (
            <Button onClick={handleSave} disabled={!canNext()}>
              <Check size={16} />
              Cadastrar Paciente
            </Button>
          )}
        </div>
      </Card>
    </div>
  );
}
