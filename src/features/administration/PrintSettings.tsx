// NEXCLÍNICA — Print Settings Page
import React, { useState } from 'react';
import { Card, Button, Input, Select } from '../../components/ui';
import { Settings, Printer, Save, RotateCcw } from 'lucide-react';

export default function PrintSettings() {
  const [settings, setSettings] = useState({
    clinicName: 'NEXCLÍNICA — Consultório',
    clinicAddress: 'Av. Paulista, 1000 — Sala 501, São Paulo/SP',
    clinicPhone: '(11) 3000-0000',
    clinicEmail: 'contato@nexclinica.demo',
    paperSize: 'A4',
    includeQRCode: true,
    includeDisclaimer: true,
    footerWarning: 'Este documento foi emitido eletronicamente pelo sistema NEXCLÍNICA.',
  });

  const [saved, setSaved] = useState(false);

  const handleSave = () => {
    // In production, this would save to backend
    setSaved(true);
    setTimeout(() => setSaved(false), 3000);
  };

  const handleReset = () => {
    setSettings({
      clinicName: 'NEXCLÍNICA — Consultório',
      clinicAddress: 'Av. Paulista, 1000 — Sala 501, São Paulo/SP',
      clinicPhone: '(11) 3000-0000',
      clinicEmail: 'contato@nexclinica.demo',
      paperSize: 'A4',
      includeQRCode: true,
      includeDisclaimer: true,
      footerWarning: 'Este documento foi emitido eletronicamente pelo sistema NEXCLÍNICA.',
    });
  };

  return (
    <div className="max-w-3xl mx-auto space-y-5">
      <div>
        <h1 className="text-2xl font-bold text-[#18383C]">Configurações de Impressão</h1>
        <p className="text-sm text-[#6F8C90]">Personalize o cabeçalho e rodapé dos documentos impressos</p>
      </div>

      {/* Clinic Header */}
      <Card className="p-5">
        <h3 className="font-semibold text-[#18383C] mb-4 flex items-center gap-2">
          <Settings size={18} className="text-[#17AEB5]" />
          Cabeçalho do Consultório
        </h3>
        <div className="space-y-4">
          <Input
            label="Nome do Consultório/Clínica"
            value={settings.clinicName}
            onChange={e => setSettings({ ...settings, clinicName: e.target.value })}
          />
          <Input
            label="Endereço Completo"
            value={settings.clinicAddress}
            onChange={e => setSettings({ ...settings, clinicAddress: e.target.value })}
          />
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <Input
              label="Telefone"
              value={settings.clinicPhone}
              onChange={e => setSettings({ ...settings, clinicPhone: e.target.value })}
            />
            <Input
              label="E-mail"
              type="email"
              value={settings.clinicEmail}
              onChange={e => setSettings({ ...settings, clinicEmail: e.target.value })}
            />
          </div>
        </div>
      </Card>

      {/* Paper Settings */}
      <Card className="p-5">
        <h3 className="font-semibold text-[#18383C] mb-4 flex items-center gap-2">
          <Printer size={18} className="text-[#17AEB5]" />
          Configurações de Papel
        </h3>
        <div className="space-y-4">
          <Select
            label="Tamanho do Papel"
            value={settings.paperSize}
            onChange={e => setSettings({ ...settings, paperSize: e.target.value })}
            options={[
              { value: 'A4', label: 'A4 (210 x 297 mm)' },
              { value: 'A5', label: 'A5 (148 x 210 mm)' },
              { value: 'LETTER', label: 'Letter (216 x 279 mm)' },
            ]}
          />
          
          <div className="space-y-3">
            <label className="flex items-center gap-3 cursor-pointer">
              <input
                type="checkbox"
                checked={settings.includeQRCode}
                onChange={e => setSettings({ ...settings, includeQRCode: e.target.checked })}
                className="w-4 h-4 rounded border-[#17AEB5] text-[#17AEB5] focus:ring-[#17AEB5]"
              />
              <div>
                <span className="text-sm font-medium text-[#18383C]">Incluir QR Code nas receitas</span>
                <p className="text-xs text-[#6F8C90]">Permite validação da receita por farmácias</p>
              </div>
            </label>

            <label className="flex items-center gap-3 cursor-pointer">
              <input
                type="checkbox"
                checked={settings.includeDisclaimer}
                onChange={e => setSettings({ ...settings, includeDisclaimer: e.target.checked })}
                className="w-4 h-4 rounded border-[#17AEB5] text-[#17AEB5] focus:ring-[#17AEB5]"
              />
              <div>
                <span className="text-sm font-medium text-[#18383C]">Incluir aviso no rodapé</span>
                <p className="text-xs text-[#6F8C90]">Mensagem informando que o documento foi emitido eletronicamente</p>
              </div>
            </label>
          </div>
        </div>
      </Card>

      {/* Footer */}
      <Card className="p-5">
        <h3 className="font-semibold text-[#18383C] mb-4">Rodapé Padrão</h3>
        <div>
          <label className="text-sm font-medium text-[#18383C]">Mensagem do Rodapé</label>
          <textarea
            value={settings.footerWarning}
            onChange={e => setSettings({ ...settings, footerWarning: e.target.value })}
            className="w-full mt-1 px-3 py-2.5 bg-white border border-[#EDF9FA] rounded-xl text-sm text-[#18383C] focus:outline-none focus:ring-2 focus:ring-[#17AEB5]/30 resize-none"
            rows={2}
          />
          <p className="text-xs text-[#6F8C90] mt-1">Esta mensagem aparecerá no rodapé de todos os documentos impressos</p>
        </div>
      </Card>

      {/* Preview Example */}
      <Card className="p-5">
        <h3 className="font-semibold text-[#18383C] mb-4">Pré-visualização do Cabeçalho</h3>
        <div className="border border-[#EDF9FA] rounded-xl p-6 bg-[#F5FCFC]">
          <div className="text-center border-b-2 border-[#17AEB5] pb-4 mb-4">
            <h2 className="text-lg font-bold text-[#17AEB5]">{settings.clinicName}</h2>
            <p className="text-xs text-[#6F8C90]">{settings.clinicAddress}</p>
            <p className="text-xs text-[#6F8C90]">Telefone: {settings.clinicPhone}</p>
            {settings.clinicEmail && <p className="text-xs text-[#6F8C90]">Email: {settings.clinicEmail}</p>}
          </div>
          <div className="text-center text-sm text-[#6F8C90]">
            <p>... conteúdo do documento ...</p>
          </div>
          {settings.includeDisclaimer && (
            <div className="text-center text-xs text-[#6F8C90] mt-4 pt-4 border-t border-[#EDF9FA]">
              <p>{settings.footerWarning}</p>
            </div>
          )}
        </div>
      </Card>

      {/* Actions */}
      <div className="flex justify-end gap-2">
        <Button variant="secondary" onClick={handleReset}>
          <RotateCcw size={16} /> Restaurar Padrão
        </Button>
        <Button onClick={handleSave}>
          <Save size={16} /> {saved ? 'Salvo!' : 'Salvar Configurações'}
        </Button>
      </div>

      {/* Info */}
      <Card className="p-4 bg-[#EDF9FA] border-[#17AEB5]/20">
        <p className="text-xs text-[#087F86]">
          <strong>Nota:</strong> As configurações de impressão são aplicadas a todos os documentos gerados pelo sistema,
          incluindo receituários, fichas de paciente, atestados, encaminhamentos e solicitações de exames.
          Em modo demo, as configurações são salvas apenas na sessão atual.
        </p>
      </Card>
    </div>
  );
}
