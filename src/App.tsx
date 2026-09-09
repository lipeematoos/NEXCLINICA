// NEXCLÍNICA — Main Application Router (6 Layers)
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
import EncounterList from './features/encounters/EncounterList';
import Professionals from './features/professionals/Professionals';
import Specialties from './features/specialties/Specialties';
import Administration from './features/administration/Administration';
import Measurements from './features/measurements/Measurements';
import ReceptionQueue from './features/queue/ReceptionQueue';
import CallScreen from './features/queue/CallScreen';
import NursingTriage from './features/nursing/NursingTriage';
import PrescriptionForm from './features/prescriptions/PrescriptionForm';
import QRValidation from './features/prescriptions/QRValidation';
import PharmacyDispensing from './features/prescriptions/PharmacyDispensing';
import PrintSettings from './features/administration/PrintSettings';
import WarehouseDashboard from './features/warehouse/WarehouseDashboard';
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
      {/* Public QR validation */}
      <Route path="/validar" element={<QRValidation />} />
      {/* Call screen (fullscreen, no layout) */}
      <Route path="/chamada" element={<ProtectedRoute><CallScreen /></ProtectedRoute>} />

      <Route element={<ProtectedRoute><MainLayout /></ProtectedRoute>}>
        <Route path="/" element={<Dashboard />} />

        {/* Patients */}
        <Route path="/pacientes" element={<PatientList />} />
        <Route path="/pacientes/novo" element={<NewPatient />} />
        <Route path="/pacientes/:id" element={<Patient360 />} />

        {/* Appointments */}
        <Route path="/agenda" element={<Agenda />} />
        <Route path="/agenda/consultas" element={<Agenda />} />

        {/* Layer 1: Reception / Queue */}
        <Route path="/recepcao/fila" element={<ReceptionQueue />} />

        {/* Layer 2: Nursing / Triage */}
        <Route path="/enfermagem/triagem" element={<NursingTriage />} />

        {/* Layer 3: Clinical */}
        <Route path="/atendimentos" element={<EncounterList />} />
        <Route path="/atendimentos/novo" element={<EncounterForm />} />
        <Route path="/atendimentos/prontuarios" element={<EncounterList />} />
        <Route path="/clinico/evolucoes" element={<Placeholder title="Evoluções" description="Registro de evoluções clínicas." />} />
        <Route path="/clinico/medidas" element={<Measurements />} />
        <Route path="/clinico/documentos" element={<Placeholder title="Documentos" description="Gestão de documentos dos pacientes." />} />
        <Route path="/clinico/exames" element={<Placeholder title="Exames" description="Registro de exames solicitados e resultados." />} />

        {/* Layer 4: Exams */}
        <Route path="/exames/solicitacoes" element={<Placeholder title="Solicitações de Exames" description="Solicite e acompanhe exames dos pacientes." />} />
        <Route path="/exames/resultados" element={<Placeholder title="Resultados de Exames" description="Visualize resultados e laudos de exames." />} />

        {/* Layer 5: Pharmacy / Prescriptions */}
        <Route path="/prescricoes/nova" element={<PrescriptionForm />} />
        <Route path="/prescricoes/:id" element={<PrescriptionForm />} />
        <Route path="/farmacia/dispensacao" element={<PharmacyDispensing />} />

        {/* Layer 3C: Warehouse / Stock Management */}
        <Route path="/almoxarifado" element={<WarehouseDashboard />} />
        <Route path="/almoxarifado/transferencias" element={<Placeholder title="Transferências" description="Gestão de transferências entre almoxarifado e unidades." />} />

        {/* Management */}
        <Route path="/gestao/indicadores" element={<Placeholder title="Indicadores" description="Painel de indicadores de gestão." />} />
        <Route path="/gestao/relatorios" element={<Placeholder title="Relatórios" description="Relatórios operacionais e clínicos." />} />

        {/* Administration */}
        <Route path="/admin/profissionais" element={<Professionals />} />
        <Route path="/admin/especialidades" element={<Specialties />} />
        <Route path="/admin/usuarios" element={<Administration />} />
        <Route path="/admin/unidades" element={<Administration />} />
        <Route path="/admin/farmacias" element={<Administration />} />
        <Route path="/admin/impressao" element={<PrintSettings />} />
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
