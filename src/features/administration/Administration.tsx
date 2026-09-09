// NEXCLÍNICA — Administration Page
import React from 'react';
import { useApp } from '../../services/AppContext';
import { Card, Avatar, StatusBadge, SectionHeader } from '../../components/ui';
import { Settings, Users, Shield, Building2, UserCog } from 'lucide-react';
import { USER_ROLE_LABELS } from '../../domain/models';

export default function Administration() {
  const { repos } = useApp();
  const users = repos.users.findAll();
  const units = repos.units.findAll();

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-[#18383C]">Administração</h1>
        <p className="text-sm text-[#6F8C90]">Gerencie usuários, unidades e configurações do sistema</p>
      </div>

      {/* Quick Stats */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        <Card className="p-4">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-[#EDF9FA] flex items-center justify-center">
              <Users size={20} className="text-[#17AEB5]" />
            </div>
            <div>
              <p className="text-xl font-bold text-[#18383C]">{users.length}</p>
              <p className="text-xs text-[#6F8C90]">Usuários</p>
            </div>
          </div>
        </Card>
        <Card className="p-4">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-[#EDF9FA] flex items-center justify-center">
              <Building2 size={20} className="text-[#17AEB5]" />
            </div>
            <div>
              <p className="text-xl font-bold text-[#18383C]">{units.length}</p>
              <p className="text-xs text-[#6F8C90]">Unidades</p>
            </div>
          </div>
        </Card>
        <Card className="p-4">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-[#EDF9FA] flex items-center justify-center">
              <Shield size={20} className="text-[#17AEB5]" />
            </div>
            <div>
              <p className="text-xl font-bold text-[#18383C]">Demo</p>
              <p className="text-xs text-[#6F8C90]">Modo atual</p>
            </div>
          </div>
        </Card>
      </div>

      {/* Users */}
      <div>
        <SectionHeader title="Usuários do sistema" />
        <Card className="divide-y divide-[#EDF9FA]">
          {users.map(user => (
            <div key={user.id} className="flex items-center gap-3 p-4">
              <Avatar name={user.name} size="sm" />
              <div className="flex-1 min-w-0">
                <p className="text-sm font-medium text-[#18383C] truncate">{user.name}</p>
                <p className="text-xs text-[#6F8C90]">{user.email}</p>
              </div>
              <StatusBadge label={USER_ROLE_LABELS[user.role]} variant="primary" />
              <StatusBadge label={user.active ? 'Ativo' : 'Inativo'} variant={user.active ? 'success' : 'neutral'} />
            </div>
          ))}
        </Card>
      </div>

      {/* Units */}
      <div>
        <SectionHeader title="Unidades" />
        <Card className="divide-y divide-[#EDF9FA]">
          {units.map(unit => (
            <div key={unit.id} className="flex items-center gap-3 p-4">
              <div className="w-10 h-10 rounded-xl bg-[#EDF9FA] flex items-center justify-center">
                <Building2 size={20} className="text-[#17AEB5]" />
              </div>
              <div className="flex-1 min-w-0">
                <p className="text-sm font-medium text-[#18383C] truncate">{unit.name}</p>
                <p className="text-xs text-[#6F8C90]">{unit.address}</p>
              </div>
              <StatusBadge label={unit.active ? 'Ativa' : 'Inativa'} variant={unit.active ? 'success' : 'neutral'} />
            </div>
          ))}
        </Card>
      </div>

      {/* RBAC Info */}
      <Card className="p-5">
        <div className="flex items-center gap-3 mb-3">
          <Shield size={20} className="text-[#17AEB5]" />
          <h3 className="font-semibold text-[#18383C]">Controle de Acesso (RBAC)</h3>
        </div>
        <p className="text-sm text-[#6F8C90] mb-3">
          Perfis de acesso disponíveis no sistema. As permissões serão implementadas no backend em produção.
        </p>
        <div className="flex flex-wrap gap-2">
          {Object.entries(USER_ROLE_LABELS).map(([key, label]) => (
            <span key={key} className="px-3 py-1.5 rounded-lg bg-[#EDF9FA] text-sm text-[#087F86] font-medium">
              {label}
            </span>
          ))}
        </div>
      </Card>

      {/* Settings notice */}
      <Card className="p-5 bg-[#EDF9FA] border-[#17AEB5]/20">
        <div className="flex items-start gap-3">
          <Settings size={20} className="text-[#17AEB5] mt-0.5" />
          <div>
            <p className="text-sm font-medium text-[#18383C]">Configurações do sistema</p>
            <p className="text-xs text-[#6F8C90] mt-1">
              Configurações avançadas como integração com backend, autenticação, criptografia e auditoria
              serão implementadas na Fase 2 (Modo Produção).
            </p>
          </div>
        </div>
      </Card>
    </div>
  );
}
