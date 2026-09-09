// NEXCLÍNICA — Health Insurance Input Component
import React from 'react';
import { Input, Select } from '../ui';
import { Shield } from 'lucide-react';
import type { HealthInsurance } from '../../domain/models';

interface HealthInsuranceInputProps {
  value?: HealthInsurance;
  onChange: (insurance: HealthInsurance | undefined) => void;
}

export function HealthInsuranceInput({ value, onChange }: HealthInsuranceInputProps) {
  const handleChange = (field: keyof HealthInsurance, val: string | boolean) => {
    const newValue = { ...value, [field]: val } as HealthInsurance;
    onChange(newValue);
  };

  return (
    <div className="space-y-3">
      <div className="flex items-center gap-2 mb-2">
        <Shield size={18} className="text-[#17AEB5]" />
        <h4 className="text-sm font-semibold text-[#18383C]">Convênio / Plano de Saúde</h4>
      </div>

      <label className="flex items-center gap-2 cursor-pointer">
        <input
          type="checkbox"
          checked={value?.hasInsurance || false}
          onChange={(e) => handleChange('hasInsurance', e.target.checked)}
          className="w-4 h-4 rounded border-[#17AEB5] text-[#17AEB5] focus:ring-[#17AEB5]"
        />
        <span className="text-sm text-[#18383C]">Possui convênio/plano de saúde</span>
      </label>

      {value?.hasInsurance && (
        <div className="space-y-3 pl-6 border-l-2 border-[#EDF9FA]">
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            <Input
              label="Operadora"
              value={value.insuranceCompany || ''}
              onChange={(e) => handleChange('insuranceCompany', e.target.value)}
              placeholder="Ex: Unimed, Bradesco Saúde"
            />
            <Input
              label="Número da Carteirinha"
              value={value.insuranceNumber || ''}
              onChange={(e) => handleChange('insuranceNumber', e.target.value)}
              placeholder="Número do beneficiário"
            />
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            <Input
              label="Plano"
              value={value.insurancePlan || ''}
              onChange={(e) => handleChange('insurancePlan', e.target.value)}
              placeholder="Ex: Nacional, Executivo"
            />
            <Select
              label="Categoria"
              value={value.insuranceCategory || ''}
              onChange={(e) => handleChange('insuranceCategory', e.target.value)}
              options={[
                { value: '', label: 'Selecionar...' },
                { value: 'INDIVIDUAL', label: 'Individual' },
                { value: 'FAMILIAR', label: 'Familiar' },
                { value: 'EMPRESARIAL', label: 'Empresarial' },
              ]}
            />
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            <Select
              label="Segmento"
              value={value.segmentType || ''}
              onChange={(e) => handleChange('segmentType', e.target.value)}
              options={[
                { value: '', label: 'Selecionar...' },
                { value: 'AMBULATORIAL', label: 'Ambulatorial' },
                { value: 'HOSPITALAR', label: 'Hospitalar' },
                { value: 'ODONTOLOGICO', label: 'Odontológico' },
                { value: 'COMPLETO', label: 'Completo' },
              ]}
            />
            <Select
              label="Tipo de Acomodação"
              value={value.accommodationType || ''}
              onChange={(e) => handleChange('accommodationType', e.target.value)}
              options={[
                { value: '', label: 'Selecionar...' },
                { value: 'INDIVIDUAL', label: 'Individual' },
                { value: 'FAMILIAR', label: 'Familiar' },
                { value: 'COLETIVO', label: 'Coletivo' },
              ]}
            />
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            <Input
              label="Vigência Início"
              type="date"
              value={value.validFrom || ''}
              onChange={(e) => handleChange('validFrom', e.target.value)}
            />
            <Input
              label="Vigência Fim"
              type="date"
              value={value.validUntil || ''}
              onChange={(e) => handleChange('validUntil', e.target.value)}
            />
          </div>

          <label className="flex items-center gap-2 cursor-pointer">
            <input
              type="checkbox"
              checked={value.hasCopayment || false}
              onChange={(e) => handleChange('hasCopayment', e.target.checked)}
              className="w-4 h-4 rounded border-[#17AEB5] text-[#17AEB5] focus:ring-[#17AEB5]"
            />
            <span className="text-sm text-[#18383C]">Possui coparticipação</span>
          </label>

          <div>
            <label className="text-sm font-medium text-[#18383C]">Observações</label>
            <textarea
              value={value.notes || ''}
              onChange={(e) => handleChange('notes', e.target.value)}
              placeholder="Informações adicionais sobre o convênio..."
              className="w-full mt-1 px-3 py-2 bg-white border border-[#EDF9FA] rounded-lg text-sm text-[#18383C] placeholder:text-[#6F8C90] focus:outline-none focus:ring-2 focus:ring-[#17AEB5]/30 resize-none"
              rows={2}
            />
          </div>
        </div>
      )}
    </div>
  );
}
