// NEXCLÍNICA — Main Layout with Sidebar
import React, { useState } from 'react';
import { NavLink, Outlet, useLocation } from 'react-router-dom';
import { useApp } from '../services/AppContext';
import {
  Home, Users, Calendar, Stethoscope, ClipboardList,
  BarChart3, Settings, LogOut, Menu, X, ChevronDown,
  ChevronRight, Activity, UserPlus, FileText, Ruler,
  Building2, UserCog, Shield, MapPin, Layers
} from 'lucide-react';

interface NavItem {
  label: string;
  path?: string;
  icon: React.ReactNode;
  children?: { label: string; path: string }[];
}

const NAV_ITEMS: NavItem[] = [
  { label: 'Início', path: '/', icon: <Home size={20} /> },
  {
    label: 'Pacientes',
    icon: <Users size={20} />,
    children: [
      { label: 'Pacientes', path: '/pacientes' },
      { label: 'Novo Paciente', path: '/pacientes/novo' },
    ],
  },
  {
    label: 'Agenda',
    icon: <Calendar size={20} />,
    children: [
      { label: 'Agenda', path: '/agenda' },
      { label: 'Consultas', path: '/agenda/consultas' },
    ],
  },
  {
    label: 'Recepção',
    icon: <Users size={20} />,
    children: [
      { label: 'Fila de Espera', path: '/recepcao/fila' },
      { label: 'Tela de Chamada', path: '/chamada' },
    ],
  },
  {
    label: 'Enfermagem',
    icon: <ClipboardList size={20} />,
    children: [
      { label: 'Triagem', path: '/enfermagem/triagem' },
    ],
  },
  {
    label: 'Atendimentos',
    icon: <Stethoscope size={20} />,
    children: [
      { label: 'Atendimentos', path: '/atendimentos' },
      { label: 'Prontuários', path: '/atendimentos/prontuarios' },
    ],
  },
  {
    label: 'Clínico',
    icon: <Activity size={20} />,
    children: [
      { label: 'Evoluções', path: '/clinico/evolucoes' },
      { label: 'Medidas', path: '/clinico/medidas' },
      { label: 'Documentos', path: '/clinico/documentos' },
      { label: 'Exames', path: '/clinico/exames' },
    ],
  },
  {
    label: 'Exames',
    icon: <FileText size={20} />,
    children: [
      { label: 'Solicitações', path: '/exames/solicitacoes' },
      { label: 'Resultados', path: '/exames/resultados' },
    ],
  },
  {
    label: 'Farmácia',
    icon: <Layers size={20} />,
    children: [
      { label: 'Nova Prescrição', path: '/prescricoes/nova' },
      { label: 'Dispensação', path: '/farmacia/dispensacao' },
    ],
  },
  {
    label: 'Gestão',
    icon: <BarChart3 size={20} />,
    children: [
      { label: 'Indicadores', path: '/gestao/indicadores' },
      { label: 'Relatórios', path: '/gestao/relatorios' },
    ],
  },
  {
    label: 'Administração',
    icon: <Settings size={20} />,
    children: [
      { label: 'Profissionais', path: '/admin/profissionais' },
      { label: 'Especialidades', path: '/admin/especialidades' },
      { label: 'Usuários', path: '/admin/usuarios' },
      { label: 'Unidades', path: '/admin/unidades' },
      { label: 'Farmácias', path: '/admin/farmacias' },
      { label: 'Impressão', path: '/admin/impressao' },
      { label: 'Configurações', path: '/admin/configuracoes' },
    ],
  },
];

function NavGroup({ item, collapsed }: { item: NavItem; collapsed: boolean }) {
  const location = useLocation();
  const [open, setOpen] = useState(false);

  const isActive = item.children?.some(c => location.pathname.startsWith(c.path)) ||
    (item.path && location.pathname === item.path);

  if (item.path) {
    return (
      <NavLink
        to={item.path}
        className={({ isActive }) =>
          `flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm font-medium transition-all
          ${isActive
            ? 'bg-[#17AEB5] text-white shadow-sm'
            : 'text-[#6F8C90] hover:bg-[#EDF9FA] hover:text-[#087F86]'
          }`
        }
      >
        {item.icon}
        {!collapsed && <span>{item.label}</span>}
      </NavLink>
    );
  }

  return (
    <div>
      <button
        onClick={() => setOpen(!open)}
        className={`flex items-center justify-between w-full px-3 py-2.5 rounded-xl text-sm font-medium transition-all
          ${isActive
            ? 'text-[#087F86] bg-[#EDF9FA]'
            : 'text-[#6F8C90] hover:bg-[#EDF9FA] hover:text-[#087F86]'
          }`}
      >
        <div className="flex items-center gap-3">
          {item.icon}
          {!collapsed && <span>{item.label}</span>}
        </div>
        {!collapsed && (
          open ? <ChevronDown size={16} /> : <ChevronRight size={16} />
        )}
      </button>
      {open && !collapsed && item.children && (
        <div className="ml-4 mt-1 space-y-0.5 border-l-2 border-[#EDF9FA] pl-3">
          {item.children.map(child => (
            <NavLink
              key={child.path}
              to={child.path}
              className={({ isActive }) =>
                `block px-3 py-2 rounded-lg text-sm transition-all
                ${isActive
                  ? 'text-[#17AEB5] font-medium bg-[#EDF9FA]'
                  : 'text-[#6F8C90] hover:text-[#087F86] hover:bg-[#F5FCFC]'
                }`
              }
            >
              {child.label}
            </NavLink>
          ))}
        </div>
      )}
    </div>
  );
}

export default function MainLayout() {
  const { currentUser, logout, sidebarOpen, toggleSidebar } = useApp();
  const [mobileOpen, setMobileOpen] = useState(false);

  const sidebarContent = (
    <div className="flex flex-col h-full">
      {/* Logo */}
      <div className="px-5 py-5 flex items-center gap-3">
        <div className="w-9 h-9 rounded-xl bg-gradient-to-br from-[#17AEB5] to-[#087F86] flex items-center justify-center">
          <Activity size={20} className="text-white" />
        </div>
        {sidebarOpen && (
          <div>
            <h1 className="text-base font-bold text-[#18383C] tracking-tight">NEXCLÍNICA</h1>
            <p className="text-[10px] text-[#6F8C90] -mt-0.5">Gestão Clínica</p>
          </div>
        )}
      </div>

      {/* Navigation */}
      <nav className="flex-1 px-3 space-y-1 overflow-y-auto">
        {NAV_ITEMS.map(item => (
          <NavGroup key={item.label} item={item} collapsed={!sidebarOpen} />
        ))}
      </nav>

      {/* User section */}
      <div className="p-3 border-t border-[#EDF9FA]">
        {sidebarOpen && currentUser && (
          <div className="px-3 py-2 mb-2">
            <p className="text-sm font-medium text-[#18383C] truncate">{currentUser.name}</p>
            <p className="text-xs text-[#6F8C90] truncate">{currentUser.email}</p>
          </div>
        )}
        <button
          onClick={logout}
          className="flex items-center gap-3 w-full px-3 py-2.5 rounded-xl text-sm text-[#6F8C90] hover:bg-red-50 hover:text-[#E97878] transition-all"
        >
          <LogOut size={20} />
          {sidebarOpen && <span>Sair</span>}
        </button>
      </div>
    </div>
  );

  return (
    <div className="flex h-screen bg-[#F5FCFC] overflow-hidden">
      {/* Desktop Sidebar */}
      <aside
        className={`hidden md:flex flex-col bg-white border-r border-[#EDF9FA] transition-all duration-300 ${
          sidebarOpen ? 'w-64' : 'w-20'
        }`}
      >
        {sidebarContent}
      </aside>

      {/* Mobile Sidebar Overlay */}
      {mobileOpen && (
        <div className="md:hidden fixed inset-0 z-50 flex">
          <div className="absolute inset-0 bg-black/20" onClick={() => setMobileOpen(false)} />
          <aside className="relative w-72 bg-white shadow-xl">
            <button
              onClick={() => setMobileOpen(false)}
              className="absolute top-4 right-4 p-1 rounded-lg hover:bg-gray-100"
            >
              <X size={20} />
            </button>
            {sidebarContent}
          </aside>
        </div>
      )}

      {/* Main Content */}
      <div className="flex-1 flex flex-col overflow-hidden">
        {/* Top Header */}
        <header className="bg-white border-b border-[#EDF9FA] px-4 md:px-6 py-3 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <button
              onClick={() => {
                if (window.innerWidth < 768) setMobileOpen(true);
                else toggleSidebar();
              }}
              className="p-2 rounded-lg hover:bg-[#EDF9FA] text-[#6F8C90]"
            >
              <Menu size={20} />
            </button>
            <div className="hidden sm:block">
              <p className="text-xs text-[#6F8C90]">NEXCLÍNICA — Modo Demo</p>
            </div>
          </div>
          <div className="flex items-center gap-3">
            <div className="w-8 h-8 rounded-full bg-[#17AEB5] flex items-center justify-center text-white text-sm font-medium">
              {currentUser?.name?.charAt(0) || 'U'}
            </div>
          </div>
        </header>

        {/* Page Content */}
        <main className="flex-1 overflow-y-auto p-4 md:p-6">
          <Outlet />
        </main>
      </div>
    </div>
  );
}
