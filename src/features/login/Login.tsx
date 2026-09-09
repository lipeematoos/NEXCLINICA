// NEXCLÍNICA — Login Demo Screen
import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useApp } from '../../services/AppContext';
import { Activity, ArrowRight } from 'lucide-react';

export default function Login() {
  const { login, repos } = useApp();
  const navigate = useNavigate();
  const [selectedEmail, setSelectedEmail] = useState('');
  const [error, setError] = useState('');

  const users = repos.users.findAll();

  const handleLogin = () => {
    if (!selectedEmail) {
      setError('Selecione um perfil para acessar.');
      return;
    }
    const success = login(selectedEmail);
    if (success) {
      navigate('/');
    } else {
      setError('Não foi possível acessar com este perfil.');
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-[#F5FCFC] via-[#EDF9FA] to-[#F5FCFC] flex items-center justify-center p-4">
      <div className="w-full max-w-md">
        {/* Logo */}
        <div className="text-center mb-8">
          <div className="inline-flex items-center justify-center w-16 h-16 rounded-2xl bg-gradient-to-br from-[#17AEB5] to-[#087F86] shadow-lg mb-4">
            <Activity size={32} className="text-white" />
          </div>
          <h1 className="text-2xl font-bold text-[#18383C]">NEXCLÍNICA</h1>
          <p className="text-sm text-[#6F8C90] mt-1">Gestão clínica, prontuário e relacionamento com pacientes</p>
        </div>

        {/* Login Card */}
        <div className="bg-white rounded-2xl shadow-sm border border-[#EDF9FA] p-6">
          <h2 className="text-lg font-semibold text-[#18383C] mb-1">Acessar sistema</h2>
          <p className="text-sm text-[#6F8C90] mb-5">Selecione um perfil de demonstração para entrar.</p>

          <div className="space-y-2 mb-5">
            {users.map(user => (
              <button
                key={user.id}
                onClick={() => { setSelectedEmail(user.email); setError(''); }}
                className={`w-full flex items-center gap-3 p-3 rounded-xl border text-left transition-all
                  ${selectedEmail === user.email
                    ? 'border-[#17AEB5] bg-[#EDF9FA] ring-2 ring-[#17AEB5]/20'
                    : 'border-[#EDF9FA] hover:border-[#17AEB5]/30 hover:bg-[#F5FCFC]'
                  }`}
              >
                <div className="w-10 h-10 rounded-full bg-[#17AEB5] flex items-center justify-center text-white font-medium text-sm">
                  {user.name.charAt(0)}
                </div>
                <div className="flex-1 min-w-0">
                  <p className="text-sm font-medium text-[#18383C] truncate">{user.name}</p>
                  <p className="text-xs text-[#6F8C90] truncate">{user.email}</p>
                </div>
                <span className="text-xs px-2 py-1 rounded-lg bg-[#EDF9FA] text-[#087F86] font-medium">
                  {user.role.replace('_', ' ')}
                </span>
              </button>
            ))}
          </div>

          {error && (
            <p className="text-sm text-[#E97878] mb-3">{error}</p>
          )}

          <button
            onClick={handleLogin}
            className="w-full flex items-center justify-center gap-2 bg-[#17AEB5] hover:bg-[#087F86] text-white py-3 rounded-xl font-medium transition-all shadow-sm"
          >
            Entrar
            <ArrowRight size={18} />
          </button>

          <p className="text-xs text-[#6F8C90] text-center mt-4">
            Modo demonstração — dados fictícios para validação de UX.
          </p>
        </div>

        <p className="text-center text-xs text-[#6F8C90] mt-6">
          NEXCLÍNICA © 2026 — Ecossistema NEX
        </p>
      </div>
    </div>
  );
}
