// NEXCLÍNICA — Main Application Router
import React from 'react';
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { AppProvider, useApp } from './services/AppContext';
import MainLayout from './layouts/MainLayout';
import Login from './features/login/Login';
import Dashboard from './features/dashboard/Dashboard';
import PatientList from './features/patients/PatientList';
import NewPatient from './features/patients/NewPatient';
import Patient360 from './features/patients/Patient360';
import Agenda from './features/appointments/Agenda';
import EncounterForm from './features/encounters/EncounterForm';
import Professionals from './features/professionals/Professionals';
import Specialties from './features/specialties/Specialties';
import Administration from './features/administration/Administration';
import EncounterList from './features/encounters/EncounterList';
import Measurements from './features/measurements/Measurements';
import Placeholder from './components/Placeholder';

function ProtectedRoute({ children }: { children: React.ReactNode }) {
  const { isLoggedIn } = useApp();
  if (!isLoggedIn) return <Navigate to="/login" replace />;
  return <>{children}</>;
}

function AppRoutes() {
  const { isLoggedIn } = useApp();

  return (
    <Routes>
      <Route path="/login" element={isLoggedIn ? <Navigate to="/" replace /> : <Login />} />
      <Route element={<ProtectedRoute><MainLayout /></ProtectedRoute>}>
        <Route path="/" element={<Dashboard />} />
        <Route path="/pacientes" element={<PatientList />} />
        <Route path="/pacientes/novo" element={<NewPatient />} />
        <Route path="/pacientes/:id" element={<Patient360 />} />
        <Route path="/agenda" element={<Agenda />} />
        <Route path="/agenda/consultas" element={<Agenda />} />
        <Route path="/atendimentos" element={<EncounterList />} />
        <Route path="/atendimentos/novo" element={<EncounterForm />} />
        <Route path="/atendimentos/prontuarios" element={<EncounterList />} />
        <Route path="/clinico/evolucoes" element={<Placeholder title="Evoluções" description="Registro de evoluções clínicas." />} />
        <Route path="/clinico/medidas" element={<Measurements />} />
        <Route path="/clinico/documentos" element={<Placeholder title="Documentos" description="Gestão de documentos dos pacientes." />} />
        <Route path="/clinico/exames" element={<Placeholder title="Exames" description="Registro de exames solicitados e resultados." />} />
        <Route path="/gestao/indicadores" element={<Placeholder title="Indicadores" description="Painel de indicadores de gestão." />} />
        <Route path="/gestao/relatorios" element={<Placeholder title="Relatórios" description="Relatórios operacionais e clínicos." />} />
        <Route path="/admin/profissionais" element={<Professionals />} />
        <Route path="/admin/especialidades" element={<Specialties />} />
        <Route path="/admin/usuarios" element={<Administration />} />
        <Route path="/admin/unidades" element={<Administration />} />
        <Route path="/admin/configuracoes" element={<Administration />} />
      </Route>
      <Route path="*" element={<Navigate to="/" replace />} />
    </Routes>
  );
}

export default function App() {
  return (
    <BrowserRouter>
      <AppProvider>
        <AppRoutes />
      </AppProvider>
    </BrowserRouter>
  );
}
