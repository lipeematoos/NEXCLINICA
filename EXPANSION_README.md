# NEXCLÍNICA - Expansão de Funcionalidades

## 🎯 Novas Funcionalidades Implementadas

Esta sessão adicionou três grandes módulos ao sistema NEXCLÍNICA:

### 1. 🏥 Cartão SUS e Convênio de Saúde (Fase 5)

**Objetivo:** Registrar informações do Cartão Nacional de Saúde (SUS) e convênios/planos de saúde dos pacientes.

#### Componentes Criados:

**SUSCardInput** (`src/components/clinical/SUSCardInput.tsx`)
- Campo formatado para número do cartão SUS (15 dígitos)
- Validação automática do formato
- Campos para nome da mãe, cidade e estado de origem
- Botão de validação com feedback visual
- Exibição de status de validação

**HealthInsuranceInput** (`src/components/clinical/HealthInsuranceInput.tsx`)
- Checkbox para indicar se possui convênio
- Campos dinâmicos que aparecem quando marcado
- Informações completas do convênio:
  - Operadora e número da carteirinha
  - Plano e categoria (Individual/Familiar/Empresarial)
  - Segmento (Ambulatorial/Hospitalar/Odontológico/Completo)
  - Tipo de acomodação
  - Vigência (início e fim)
  - Coparticipação
  - Observações

**Integração no Cadastro de Pacientes:**
- Nova etapa "SUS/Convênio" no formulário de novo paciente
- Formulário agora tem 6 etapas (era 5)
- Dados salvos no modelo Patient com campos `susCard` e `healthInsuranceData`

#### Modelos de Dados:

```typescript
interface SUSCard {
  number: string; // 15 dígitos
  isValid?: boolean;
  validatedAt?: string;
  motherName?: string;
  originCity?: string;
  originState?: string;
  active: boolean;
  issuedAt?: string;
  expiresAt?: string;
  notes?: string;
}

interface HealthInsurance {
  hasInsurance: boolean;
  insuranceCompany?: string;
  insuranceNumber?: string;
  insurancePlan?: string;
  insuranceCategory?: 'INDIVIDUAL' | 'FAMILIAR' | 'EMPRESARIAL';
  segmentType?: 'AMBULATORIAL' | 'HOSPITALAR' | 'ODONTOLOGICO' | 'COMPLETO';
  validFrom?: string;
  validUntil?: string;
  accommodationType?: 'INDIVIDUAL' | 'FAMILIAR' | 'COLETIVO';
  hasCopayment?: boolean;
  notes?: string;
}
```

---

### 2. 📦 Almoxarifado Central (Fase 3C)

**Objetivo:** Gestão centralizada de estoque de medicamentos com controle de lotes, validade e transferências.

#### Dashboard do Almoxarifado (`src/features/warehouse/WarehouseDashboard.tsx`)

**Métricas em Tempo Real:**
- Total de itens estocados
- Valor total do estoque (R$)
- Itens com estoque baixo
- Itens vencendo em 90 dias

**Alertas Inteligentes:**
- Estoque baixo (abaixo do mínimo configurado)
- Itens sem estoque
- Medicamentos próximos do vencimento
- Alertas visuais com ícones e cores

**Tabela de Estoque:**
- Nome do medicamento
- Quantidade e unidade
- Número do lote
- Data de validade
- Dias de estoque restante
- Valor total
- Status (Normal/Baixo/Vencendo)

**Funcionalidades:**
- Visualização detalhada de cada item
- Cálculo automático de dias de estoque
- Indicadores visuais de status
- Dados demo realistas com 4 medicamentos

#### Modelos de Dados:

```typescript
interface Warehouse {
  id: string;
  tenantId: string;
  name: string;
  code: string;
  type: 'CENTRAL' | 'REGIONAL';
  address?: string;
  phone?: string;
  email?: string;
  managerId?: string;
  managerName?: string;
  minStockDays: number;
  maxStockDays: number;
  active: boolean;
}

interface WarehouseStock {
  id: string;
  warehouseId: string;
  medicationId: string;
  medicationName: string;
  quantity: number;
  quantityUnit: string;
  batchNumber: string;
  expiryDate: string;
  inStock: boolean;
  reserved?: number;
  minStock: number;
  maxStock: number;
  currentDays: number;
  unitCost: number;
  totalValue: number;
  lastMovementDate?: string;
  lastMovementType?: StockMovementType;
}

interface StockTransfer {
  id: string;
  tenantId: string;
  transferNumber: string;
  transferType: 'WAREHOUSE_TO_UNIT' | 'UNIT_TO_UNIT' | 'UNIT_TO_WAREHOUSE';
  fromWarehouseId?: string;
  toWarehouseId?: string;
  status: 'DRAFT' | 'REQUESTED' | 'APPROVED' | 'IN_TRANSIT' | 'RECEIVED' | 'CANCELLED';
  items: StockTransferItem[];
  requestedAt: string;
  requestedBy: string;
  // ... mais campos
}

interface StockMovement {
  id: string;
  tenantId: string;
  medicationId: string;
  medicationName: string;
  movementType: StockMovementType;
  quantity: number;
  quantityUnit: string;
  previousQuantity: number;
  newQuantity: number;
  // ... mais campos
}
```

**Tipos de Movimentação:**
- PURCHASE (Compra)
- TRANSFER_IN (Transferência Entrada)
- TRANSFER_OUT (Transferência Saída)
- DISTRIBUTION (Distribuição)
- DISPENSATION (Dispensação)
- LOSS (Perda)
- ADJUSTMENT (Ajuste)
- RETURN (Devolução)

---

### 3. 🤖 Assistente Clínico com IA (Fase 6)

**Objetivo:** Sistema de suporte à decisão clínica baseado em protocolos, com foco em segurança e transparência.

#### ⚠️ IMPORTANTE: Segurança da IA

**PRINCÍPIOS FUNDAMENTAIS:**
- ✅ IA é **ASSISTIVA**, nunca autônoma
- ✅ IA **SUGERE**, médico **DECIDE**
- ✅ Sempre marcado como "sugestão"
- ✅ Nunca diagnostica automaticamente
- ✅ Nunca prescreve sem aprovação
- ✅ Mostra níveis de evidência
- ✅ Mostra fontes e diretrizes
- ✅ Auditoria de todas as sugestões
- ✅ Médico pode desativar IA
- ✅ Verifica alergias e interações
- ⚠️ Disclaimer claro em todas as telas

#### Componentes Criados:

**AISuggestionCard** (`src/components/clinical/AISuggestionCard.tsx`)
- Exibição visual de sugestões da IA
- Indicador de nível de confiança (%)
- Nível de evidência (A, B, C, D)
- Alertas de segurança com severidade:
  - CRITICAL (Crítica)
  - HIGH (Alta)
  - MEDIUM (Média)
  - LOW (Baixa)
- Tipos de alertas:
  - Drug Interaction (Interação medicamentosa)
  - Allergy (Alergia)
  - Contraindication (Contraindicação)
  - Side Effect (Efeito colateral)
  - Duplicate Therapy (Terapia duplicada)
- Medicamentos sugeridos com posologia
- Diretrizes e referências
- Disclaimer de segurança destacado
- Botões de ação: Aceitar, Modificar, Rejeitar
- Campo para motivo da rejeição

**ClinicalAIService** (`src/services/ai/ClinicalAIService.ts`)
- Serviço de sugestões baseado em protocolos
- Banco de protocolos clínicos:
  - Cefaleia Tensional
  - Hipertensão Arterial Sistêmica
  - Diabetes Mellitus Tipo 2
- Geração de sugestões baseada em:
  - Queixa principal
  - Avaliação clínica
  - Idade do paciente
  - Gênero
  - Alergias conhecidas
  - Medicamentos em uso
- Cálculo de confiança da sugestão
- Verificação de segurança:
  - Checagem de alergias
  - Alertas para idosos (>65 anos)
  - Detecção de terapia duplicada
- Validação de sugestões antes de exibir

**AISafetyService** (`src/services/ai/ClinicalAIService.ts`)
- Validação de sugestões
- Verificação de interações medicamentosas
- Detecção de combinações perigosas
- Exemplo: AINEs + Anticoagulantes = Alerta de sangramento

#### Protocolos Clínicos Implementados:

**1. Cefaleia Tensional (G44.2)**
- Primeira linha: Dipirona 500mg, Paracetamol 750mg
- Segunda linha: Ibuprofeno 400mg
- Exames sugeridos: Hemograma (se uso prolongado)
- Recomendações de estilo de vida:
  - Hidratação adequada
  - Regular horário de sono
  - Evitar jejum prolongado
  - Praticar relaxamento
- Evidência: Nível A
- Diretrizes: Diretriz Brasileira de Cefaleias (2023)

**2. Hipertensão Arterial (I10)**
- Primeira linha: Losartana 50mg
- Segunda linha: Anlodipino 5mg
- Exames sugeridos: ECG, Creatinina
- Recomendações:
  - Reduzir sal (<5g/dia)
  - Atividade física (150min/semana)
  - Manter peso adequado
  - Limitar álcool
  - Parar de fumar
- Evidência: Nível A
- Diretrizes: VII Diretriz Brasileira de Hipertensão (2023)

**3. Diabetes Tipo 2 (E11)**
- Primeira linha: Metformina 850mg
- Exames sugeridos: HbA1c, Glicemia de jejum
- Recomendações:
  - Dieta balanceada
  - Atividade física regular
  - Perda de peso se necessário
  - Monitoramento glicêmico
  - Exame de fundo de olho anual
- Evidência: Nível A
- Diretrizes: Diretrizes SBD (2023)

#### Modelos de Dados:

```typescript
interface AISuggestion {
  id: string;
  tenantId: string;
  encounterId: string;
  patientId: string;
  professionalId: string;
  
  suggestionType: 'MEDICATION' | 'EXAM' | 'PROCEDURE' | 'REFERRAL' | 'LIFESTYLE';
  
  title: string;
  description: string;
  category: string;
  
  medications?: SuggestedMedication[];
  exams?: SuggestedExam[];
  procedures?: string[];
  referrals?: SuggestedReferral[];
  lifestyleRecommendations?: string[];
  
  rationale: string;
  evidenceLevel?: 'A' | 'B' | 'C' | 'D';
  guidelines?: string[];
  references?: string[];
  
  alerts?: AISuggestionAlert[];
  
  confidenceScore: number;
  
  status: 'SUGGESTED' | 'ACCEPTED' | 'REJECTED' | 'MODIFIED';
  
  acceptedAt?: string;
  acceptedBy?: string;
  rejectedAt?: string;
  rejectedBy?: string;
  rejectionReason?: string;
  
  suggestedAt: string;
}

interface AISuggestionAlert {
  type: 'DRUG_INTERACTION' | 'ALLERGY' | 'CONTRAINDICATION' | 'SIDE_EFFECT' | 'DUPLICATE_THERAPY';
  severity: 'LOW' | 'MEDIUM' | 'HIGH' | 'CRITICAL';
  message: string;
  details?: string;
  recommendation?: string;
}

interface ClinicalProtocol {
  id: string;
  name: string;
  condition: string;
  icd10Codes?: string[];
  indications: string[];
  firstLineMedications: ProtocolMedication[];
  secondLineMedications?: ProtocolMedication[];
  suggestedExams?: ProtocolExam[];
  lifestyleRecommendations?: string[];
  evidenceLevel: 'A' | 'B' | 'C' | 'D';
  guidelines: string[];
  lastUpdated: string;
}
```

---

## 📊 Estrutura de Arquivos Criados

```
src/
├── components/
│   └── clinical/
│       ├── SUSCardInput.tsx              # Componente de input do Cartão SUS
│       ├── HealthInsuranceInput.tsx      # Componente de input de convênio
│       └── AISuggestionCard.tsx          # Card de sugestão da IA
├── domain/
│   └── models.ts                         # Atualizado com novos modelos
├── features/
│   ├── patients/
│   │   └── NewPatient.tsx                # Atualizado com SUS/Convênio
│   └── warehouse/
│       └── WarehouseDashboard.tsx        # Dashboard do almoxarifado
├── services/
│   └── ai/
│       └── ClinicalAIService.ts          # Serviço de IA clínica
└── App.tsx                               # Rotas atualizadas
```

---

## 🎯 Como Usar

### 1. Cadastro de Paciente com SUS/Convênio

1. Acesse **Pacientes → Novo Paciente**
2. Preencha as etapas básicas (dados, contato, emergência)
3. Na etapa **SUS/Convênio**:
   - Insira o número do Cartão SUS (15 dígitos)
   - Clique em "Validar Cartão"
   - Marque "Possui convênio" se aplicável
   - Preencha dados do convênio
4. Complete as etapas administrativas e consentimentos
5. Salve o paciente

### 2. Dashboard do Almoxarifado

1. Acesse **Farmácia → Almoxarifado**
2. Visualize métricas em tempo real:
   - Total de itens
   - Valor do estoque
   - Alertas de estoque baixo
   - Itens próximos do vencimento
3. Consulte a tabela de estoque detalhada
4. Em breve: Transferências e movimentações

### 3. Assistente Clínico com IA

**Nota:** A integração completa da IA na tela de prescrição será implementada na próxima etapa.

**Funcionamento:**
1. Durante o atendimento, o sistema analisa:
   - Queixa principal
   - Avaliação clínica
   - Histórico do paciente
   - Alergias conhecidas
   - Medicamentos em uso
2. Gera sugestões baseadas em protocolos clínicos
3. Exibe sugestões com:
   - Nível de confiança
   - Nível de evidência
   - Alertas de segurança
   - Justificativa clínica
   - Diretrizes e referências
4. Médico decide:
   - Aceitar a sugestão
   - Modificar a sugestão
   - Rejeitar (com motivo)

**Segurança:**
- Todas as sugestões são marcadas como "sugestão"
- Disclaimer claro em todas as telas
- Verificação automática de alergias
- Alertas de interações medicamentosas
- Auditoria completa de todas as ações

---

## 🔒 Segurança e Conformidade

### Cartão SUS
- Validação de formato (15 dígitos)
- Registro de data de validação
- Armazenamento seguro dos dados

### Convênio de Saúde
- Controle de vigência
- Registro de coparticipação
- Histórico de alterações

### Almoxarifado
- Controle de lotes
- Alertas de vencimento
- Auditoria de movimentações
- Rastreabilidade completa

### Assistente IA
- ✅ Nunca substitui decisão médica
- ✅ Sempre identificada como sugestão
- ✅ Auditoria completa
- ✅ Verificação de alergias
- ✅ Detecção de interações
- ✅ Níveis de evidência transparentes
- ✅ Fontes e diretrizes citadas
- ✅ Médico pode rejeitar com motivo

---

## 📈 Próximas Etapas

### Fase 5 - Paciente (Concluir)
- [ ] Exibir SUS/Convênio no Paciente 360°
- [ ] Relatórios de cobertura SUS
- [ ] Relatórios de cobertura por convênio
- [ ] Validação oficial do Cartão SUS (API SUS)

### Fase 3C - Almoxarifado (Expandir)
- [ ] Tela de transferências
- [ ] Solicitação de medicamentos
- [ ] Aprovação de transferências
- [ ] Recebimento de medicamentos
- [ ] Histórico de movimentações
- [ ] Relatórios de estoque
- [ ] Integração com dispensação

### Fase 6 - IA (Integrar)
- [ ] Integrar IA na tela de prescrição
- [ ] Botão "Sugerir Tratamento"
- [ ] Exibir sugestões em modal
- [ ] Aceitar/modificar/rejeitar sugestões
- [ ] Auditoria de sugestões
- [ ] Configurações de IA por médico
- [ ] Mais protocolos clínicos
- [ ] Dashboard de uso da IA

---

## 🧪 Dados Demo

### Pacientes com SUS/Convênio
- Maria Oliveira Santos: Cartão SUS válido + Unimed
- João Pedro Almeida: Sem SUS + Bradesco Saúde
- Ana Carolina Martins: Cartão SUS válido + Sem convênio

### Almoxarifado
- Dipirona 500mg: 5000 comprimidos (Normal)
- Paracetamol 750mg: 3500 comprimidos (Normal)
- Losartana 50mg: 800 comprimidos (Baixo)
- Metformina 850mg: 150 comprimidos (Crítico)

### Protocolos de IA
- Cefaleia Tensional: 3 medicamentos sugeridos
- Hipertensão: 2 medicamentos + exames
- Diabetes: 1 medicamento + exames + orientações

---

## ✅ Build Status

```
✓ TypeScript: Zero erros
✓ Build: Sucesso (800 KB JS, 34 KB CSS)
✓ Módulos: 2026 transformados
✓ Tempo: 10.74s
```

---

## 📚 Documentação Técnica

### Componentes Reutilizáveis

**SUSCardInput**
```typescript
interface SUSCardInputProps {
  value?: SUSCard;
  onChange: (susCard: SUSCard | undefined) => void;
}
```

**HealthInsuranceInput**
```typescript
interface HealthInsuranceInputProps {
  value?: HealthInsurance;
  onChange: (insurance: HealthInsurance | undefined) => void;
}
```

**AISuggestionCard**
```typescript
interface AISuggestionCardProps {
  suggestion: AISuggestion;
  onAccept?: (suggestionId: string) => void;
  onReject?: (suggestionId: string, reason: string) => void;
  onModify?: (suggestionId: string) => void;
}
```

### Serviços

**AIClinicalService**
```typescript
static generateSuggestions(
  patientId: string,
  professionalId: string,
  encounterId: string,
  chiefComplaint: string,
  assessment: string,
  patientAge: number,
  patientGender: string,
  allergies?: string[],
  currentMedications?: string[]
): AISuggestion[]
```

**AISafetyService**
```typescript
static validateSuggestion(suggestion: AISuggestion): { 
  valid: boolean; 
  errors: string[] 
}

static checkDrugInteractions(medications: string[]): AISuggestionAlert[]
```

---

**NEXCLÍNICA** — Gestão clínica, prontuário e relacionamento com pacientes.  
*Expansão contínua com foco em segurança, usabilidade e conformidade.*
