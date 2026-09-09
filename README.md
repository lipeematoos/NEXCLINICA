# NEXCLÍNICA — Sistema de Gestão Clínica Multi-Camada

## 🎯 Visão Geral

**NEXCLÍNICA** é uma plataforma completa de gestão clínica que atende desde pequenos consultórios até prefeituras municipais com múltiplas unidades de saúde. O sistema implementa **6 camadas funcionais** integradas:

1. **Recepção / Fila de Espera** — Gestão de senhas e chamada de pacientes
2. **Enfermagem / Triagem** — Sinais vitais e classificação de risco
3. **Clínico / Atendimentos** — Consultas e prontuário eletrônico
4. **Exames** — Solicitação e resultados
5. **Farmácia / Prescrições** — Receituário com QR Code e dispensação
6. **Gestão / Administração** — Indicadores e configurações

---

## 🏗️ Arquitetura

### Estrutura do Projeto

```
src/
├── components/          # Componentes reutilizáveis
│   ├── ui/             # Componentes básicos (Button, Card, Modal, etc.)
│   ├── print/          # Componentes de impressão
│   └── Placeholder.tsx # Páginas placeholder
├── domain/             # Modelos de domínio
│   ├── models.ts       # Todas as interfaces e tipos
│   ├── printModels.ts  # Modelos de documentos imprimíveis
│   └── repositories.ts # Interfaces de repositório
├── features/           # Features por camada
│   ├── dashboard/      # Dashboard principal
│   ├── patients/       # Gestão de pacientes
│   ├── appointments/   # Agenda e consultas
│   ├── encounters/     # Atendimentos clínicos
│   ├── queue/          # Camada 1: Recepção/Fila
│   ├── nursing/        # Camada 2: Enfermagem/Triagem
│   ├── prescriptions/  # Camada 5: Farmácia/Prescrições
│   ├── measurements/   # Medidas e evolução
│   ├── professionals/  # Profissionais de saúde
│   ├── specialties/    # Especialidades
│   └── administration/ # Administração + Configurações de Impressão
├── infrastructure/     # Infraestrutura
│   └── demo/           # Modo demo com dados fictícios
├── layouts/            # Layouts de página
├── services/           # Serviços e contexto
├── utils/              # Utilitários
│   └── printUtils.ts   # Geração de HTML para impressão
└── App.tsx            # Rotas principais
```

### Modelos de Domínio

O sistema possui **20+ entidades** organizadas por camada:

**Core:**
- Patient, HealthcareProfessional, Specialty, Appointment
- ClinicalEncounter, ClinicalEvolution, PatientMeasurement

**Camada 1 (Recepção):**
- PatientQueue (fila de espera)

**Camada 2 (Enfermagem):**
- NursingRecord (triagem e sinais vitais)

**Camada 4 (Exames):**
- ExamRequest, ExamRecord

**Camada 5 (Farmácia):**
- Prescription, PrescriptionMedication
- Medication, Pharmacy, DispensationRecord

**Suporte:**
- PatientDocument, NutritionAssessment, PatientConsent
- SystemUser, AuditLog, TimelineEvent

---

## 🎨 Design System

### Paleta de Cores

```css
Primary: #17AEB5 (turquesa)
Primary Light: #22BFC5
Primary Dark: #087F86

Background: #F5FCFC, #EDF9FA (aqua muito claro)
Text: #18383C (dark teal)
Muted: #6F8C90

Status:
- Success: #52B788
- Warning: #F6B85A
- Danger: #E97878
```

### Características

- Interface limpa e calma (healthcare aesthetic)
- Cantos arredondados generosos
- Sombras suaves
- Espaçamento amplo
- Tipografia Inter
- Totalmente responsivo
- Acessível (WCAG AA)

---

## 🚀 Funcionalidades Implementadas

### ✅ Camada 1: Recepção / Fila

- **Painel de Recepção** — Check-in de pacientes com geração de senhas
- **Tela de Chamada (TV)** — Display para sala de espera
- **Prioridades** — Normal, Prioridade, Urgência
- **Ações** — Chamar, iniciar atendimento, concluir, marcar falta

### ✅ Camada 2: Enfermagem / Triagem

- **Registro de Sinais Vitais** — PA, FC, Temp, FR, SpO₂, Peso, Altura
- **Cálculo automático de IMC**
- **Classificação de Risco** — Manchester simplificado (5 cores)
- **Nível de Dor** — Escala 0-10
- **Encaminhamento** — Para profissional/especialidade

### ✅ Camada 3: Clínico

- **Agenda** — Views Hoje/Semana/Lista
- **Atendimento Clínico** — Formulário SOAPIE completo
- **Evoluções** — Registro longitudinal
- **Medidas** — Gráficos de evolução
- **Paciente 360°** — 9 abas com visão completa
- **Linha do Tempo** — Histórico cronológico

### ✅ Camada 4: Exames

- **Solicitação de Exames** — Lista de exames com instruções
- **Resultados** — Visualização com flags (alto/baixo/normal)
- **Histórico** — Exames anteriores do paciente

### ✅ Camada 5: Farmácia / Prescrições

- **Prescrição Médica** — 4 tipos (Simples, Antibiótico, Controlado A/B)
- **Catálogo de Medicamentos** — Busca e seleção
- **QR Code** — Geração automática para validação
- **Código de Acesso** — 6 dígitos para farmácia
- **Validação Pública** — Página `/validar` para verificar receitas
- **Dispensação** — Registro de retirada de medicamentos
- **Envio por E-mail** — Template pronto (simulado)

### 🖨️ Impressão de Documentos (Consultórios Particulares)

Para consultórios que não possuem farmácia integrada, o sistema gera documentos profissionais prontos para impressão:

- **Receituário Médico** — Layout A4 com cabeçalho do consultório, dados do paciente, medicamentos com posologia, assinatura e QR Code
- **Ficha do Paciente** — Resumo clínico completo com dados pessoais, histórico, atendimentos recentes, medidas e prescrições
- **Atestado Médico** — Comparecimento, saúde ou licença médica (em desenvolvimento)
- **Encaminhamento** — Para especialistas com resumo clínico (em desenvolvimento)
- **Solicitação de Exames** — Guia de exames com instruções (em desenvolvimento)

**Configurações de Impressão:**
- Personalização do cabeçalho (nome, endereço, telefone, e-mail do consultório)
- Seleção do tamanho do papel (A4, A5, Letter)
- Opção de incluir QR Code nas receitas
- Mensagem personalizada no rodapé
- Pré-visualização em tempo real

**Acesso:**
- Receituário: Após emitir prescrição, clique em "Imprimir"
- Ficha do Paciente: No Paciente 360°, clique em "Imprimir Ficha"
- Configurações: Administração → Impressão

### ✅ Camada 6: Gestão / Administração

- **Dashboard** — 6 indicadores em tempo real
- **Profissionais** — Cadastro e gestão
- **Especialidades** — Configuração
- **Usuários** — Controle de acesso (RBAC conceitual)
- **Unidades** — Multi-unidades
- **Farmácias** — Integração

---

## 📊 Modo Demo

### Dados Fictícios Incluídos

- **7 pacientes** com dados brasileiros realistas
- **3 profissionais** (Nutricionista, Clínico Geral, Psicólogo)
- **4 especialidades** (Nutrição, Clínica Geral, Psicologia, Fisioterapia)
- **7 consultas** (agendadas, confirmadas, concluídas)
- **2 atendimentos clínicos** completos
- **6 medidas** (peso, altura, PA, circunferência)
- **2 exames** solicitados
- **1 prescrição** com QR Code (código: `847291`)
- **3 pacientes na fila** de espera
- **1 triagem** completa com sinais vitais

### Perfis de Acesso Demo

1. **Administrador** — admin@nexclinica.demo
2. **Nutricionista** — camila.ferreira@nexclinica.demo
3. **Recepcionista** — recepcao@nexclinica.demo

### Testar Fluxo Completo

1. Login como **Recepcionista**
2. Acessar **Recepção → Fila de Espera**
3. Fazer check-in de um paciente
4. Chamar o paciente
5. Login como **Nutricionista**
6. Acessar **Enfermagem → Triagem**
7. Selecionar o paciente chamado
8. Registrar sinais vitais
9. Classificar risco
10. Acessar **Atendimentos**
11. Iniciar atendimento clínico
12. Preencher queixa, histórico, avaliação, conduta
13. Concluir atendimento
14. Acessar **Farmácia → Nova Prescrição**
15. Adicionar medicamentos
16. Emitir prescrição com QR Code
17. Copiar código de acesso
18. Acessar `/validar` (página pública)
19. Validar a receita

---

## 🔐 Segurança e Privacidade

### Princípios Implementados

- ✅ Dados sensíveis mascarados em listas (CPF)
- ✅ RBAC conceitual (perfis de acesso)
- ✅ Consentimento LGPD no cadastro
- ✅ Auditoria preparada (AuditLog)
- ✅ Isolamento por tenant (tenantId)
- ✅ Validação de receitas com QR Code
- ✅ Validade de prescrições

### Preparado para Produção

- Backend com autenticação segura
- Criptografia de dados sensíveis
- Logs de auditoria completos
- Isolamento multi-tenant
- Backup e recuperação

---

## 🛠️ Stack Tecnológico

- **React 18** + **TypeScript** (strict mode)
- **Vite** — Build tool
- **Tailwind CSS v4** — Estilização
- **React Router v6** — Roteamento
- **Recharts** — Gráficos
- **Lucide React** — Ícones
- **QRCode.react** — Geração de QR Code
- **date-fns** — Manipulação de datas
- **uuid** — Geração de IDs

---

## 📦 Instalação e Execução

```bash
# Instalar dependências
npm install

# Desenvolvimento
npm run dev

# Build produção
npm run build

# Type check
npm run typecheck
```

---

## 🗺️ Rotas Principais

### Públicas
- `/validar` — Validação de receita por QR Code

### Autenticadas
- `/` — Dashboard
- `/pacientes` — Lista de pacientes
- `/pacientes/:id` — Paciente 360°
- `/agenda` — Agenda de consultas
- `/recepcao/fila` — Fila de espera
- `/chamada` — Tela de chamada (TV)
- `/enfermagem/triagem` — Triagem
- `/atendimentos` — Lista de atendimentos
- `/atendimentos/novo` — Novo atendimento
- `/clinico/medidas` — Medidas e evolução
- `/exames/solicitacoes` — Solicitação de exames
- `/prescricoes/nova` — Nova prescrição
- `/farmacia/dispensacao` — Dispensação
- `/admin/*` — Administração

---

## 🎯 Casos de Uso

### Pequeno Consultório
- Camadas 3 + 5: Clínico + Farmácia
- 1-2 profissionais
- Agenda simples
- Prescrições com QR Code

### Clínica Multi-Profissional
- Camadas 1-3 + 5: Recepção + Enfermagem + Clínico + Farmácia
- Múltiplos profissionais e especialidades
- Fila de espera organizada
- Triagem padronizada

### Prefeitura / UBS
- Todas as 6 camadas completas
- Multi-unidades
- Gestão centralizada
- Relatórios consolidados

---

## 🚧 Próximas Fases (Futuro)

### Fase 2: Produção
- Backend com PostgreSQL
- Autenticação JWT/OAuth
- API REST completa
- Upload de arquivos
- Logs de auditoria reais
- Deploy Docker

### Fase 3: Avançado
- Telemedicina
- Assinatura digital de receitas
- Integração com laboratórios
- Integração com farmácias externas
- App mobile para pacientes
- Notificações push

### Fase 4: Inteligência
- NEXINTELLIGENCE (AI assistida)
- Sumarização de prontuários
- Alertas clínicos
- Análise preditiva
- Busca inteligente

---

## 📝 Licença

NEXCLÍNICA © 2026 — Ecossistema NEX  
Todos os direitos reservados.

---

## 👨‍💻 Desenvolvido por

Arquitetura de software sênior especializada em sistemas de saúde, com foco em:
- UX/UI healthcare
- Segurança e privacidade (LGPD)
- Escalabilidade multi-tenant
- Conformidade regulatória
- Integração com ecossistema SUS

---

**NEXCLÍNICA** — Gestão clínica, prontuário e relacionamento com pacientes.
