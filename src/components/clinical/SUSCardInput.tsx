// NEXCLÍNICA — SUS Card Input Component
import React, { useState } from 'react';
import { Input } from '../ui';
import { CreditCard, CheckCircle, XCircle, AlertCircle } from 'lucide-react';
import type { SUSCard } from '../../domain/models';

interface SUSCardInputProps {
  value?: SUSCard;
  onChange: (susCard: SUSCard | undefined) => void;
}

export function SUSCardInput({ value, onChange }: SUSCardInputProps) {
  const [isValidating, setIsValidating] = useState(false);
  const [validationResult, setValidationResult] = useState<'valid' | 'invalid' | null>(null);

  const formatSUSNumber = (num: string): string => {
    const digits = num.replace(/\D/g, '');
    if (digits.length <= 3) return digits;
    if (digits.length <= 7) return `${digits.slice(0, 3)} ${digits.slice(3)}`;
    if (digits.length <= 11) return `${digits.slice(0, 3)} ${digits.slice(3, 7)} ${digits.slice(7)}`;
    return `${digits.slice(0, 3)} ${digits.slice(3, 7)} ${digits.slice(7, 11)} ${digits.slice(11, 15)}`;
  };

  const validateSUSNumber = (number: string): boolean => {
    // Simplified validation - in production, use official algorithm
    const digits = number.replace(/\D/g, '');
    return digits.length === 15;
  };

  const handleValidate = () => {
    if (!value?.number) return;
    
    setIsValidating(true);
    setTimeout(() => {
      const isValid = validateSUSNumber(value.number);
      setValidationResult(isValid ? 'valid' : 'invalid');
      onChange({
        ...value,
        isValid,
        validatedAt: new Date().toISOString(),
      });
      setIsValidating(false);
    }, 500);
  };

  const handleChange = (field: keyof SUSCard, val: string | boolean) => {
    const newValue = { ...value, [field]: val } as SUSCard;
    onChange(newValue);
    setValidationResult(null);
  };

  return (
    <div className="space-y-3">
      <div className="flex items-center gap-2 mb-2">
        <CreditCard size={18} className="text-[#17AEB5]" />
        <h4 className="text-sm font-semibold text-[#18383C]">Cartão SUS</h4>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
        <div className="sm:col-span-2">
          <Input
            label="Número do Cartão SUS"
            value={value?.number ? formatSUSNumber(value.number) : ''}
            onChange={(e) => handleChange('number', e.target.value.replace(/\D/g, ''))}
            placeholder="000 0000 0000 0000"
            maxLength={19}
          />
        </div>

        <Input
          label="Nome da Mãe"
          value={value?.motherName || ''}
          onChange={(e) => handleChange('motherName', e.target.value)}
          placeholder="Nome completo da mãe"
        />

        <div className="grid grid-cols-2 gap-2">
          <Input
            label="Cidade"
            value={value?.originCity || ''}
            onChange={(e) => handleChange('originCity', e.target.value)}
            placeholder="Cidade"
          />
          <Input
            label="UF"
            value={value?.originState || ''}
            onChange={(e) => handleChange('originState', e.target.value)}
            placeholder="UF"
            maxLength={2}
          />
        </div>
      </div>

      <div className="flex items-center gap-2">
        <button
          type="button"
          onClick={handleValidate}
          disabled={!value?.number || isValidating}
          className="px-3 py-1.5 text-xs font-medium rounded-lg bg-[#17AEB5] text-white hover:bg-[#087F86] disabled:opacity-50 disabled:cursor-not-allowed"
        >
          {isValidating ? 'Validando...' : 'Validar Cartão'}
        </button>

        {validationResult === 'valid' && (
          <span className="flex items-center gap-1 text-xs text-[#52B788]">
            <CheckCircle size={14} /> Cartão válido
          </span>
        )}
        {validationResult === 'invalid' && (
          <span className="flex items-center gap-1 text-xs text-[#E97878]">
            <XCircle size={14} /> Número inválido
          </span>
        )}
      </div>

      {value?.isValid && (
        <div className="p-3 rounded-lg bg-green-50 border border-green-100">
          <p className="text-xs text-[#52B788] font-medium mb-1">✓ Cartão SUS Validado</p>
          <p className="text-xs text-[#6F8C90]">
            Validado em: {value.validatedAt ? new Date(value.validatedAt).toLocaleString('pt-BR') : '-'}
          </p>
        </div>
      )}
    </div>
  );
}
