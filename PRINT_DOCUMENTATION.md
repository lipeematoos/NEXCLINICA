# 🖨️ Impressão de Documentos - NEXCLÍNICA

## Visão Geral

O NEXCLÍNICA agora inclui funcionalidade completa de impressão de documentos para consultórios particulares que não possuem farmácia integrada. O sistema gera documentos profissionais em formato A4 prontos para impressão.

## 📄 Documentos Disponíveis

### 1. Receituário Médico
- Cabeçalho completo do consultório/profissional
- Dados do paciente (nome, idade, CPF)
- Lista de medicamentos com posologia detalhada
- Instruções gerais
- Assinatura do profissional
- QR Code para validação (opcional)
- Rodapé com informações de verificação

**Acesso:** Após emitir uma prescrição, clique em "Imprimir"

### 2. Ficha do Paciente
- Dados pessoais completos
- Informações de contato e emergência
- Convênio/plano de saúde
- Histórico clínico (alergias, condições crônicas, medicações)
- Últimos atendimentos
- Últimas medidas (peso, PA, etc.)
- Últimas prescrições
- Data de impressão

**Acesso:** Na tela do Paciente 360°, clique em "Imprimir Ficha"

### 3. Atestado Médico
- Dados do profissional e paciente
- Tipo de atestado (comparecimento, saúde, licença)
- Data e horário (para comparecimento)
- Período de afastamento (para licença)
- Finalidade do atestado
- Assinatura do profissional

**Acesso:** Em desenvolvimento

### 4. Encaminhamento para Especialista
- Dados do médico solicitante
- Dados do paciente
- Especialidade de destino
- Motivo do encaminhamento
- Resumo clínico
- Medicamentos em uso
- Exames já realizados
- Urgência (Normal, Urgente, Emergência)

**Acesso:** Em desenvolvimento

### 5. Solicitação de Exames
- Dados do médico solicitante
- Dados do paciente
- Lista de exames solicitados
- Instruções de preparo
- Prioridade (Rotina, Urgente)
- Questão clínica

**Acesso:** Em desenvolvimento

## 🎨 Personalização

### Configurações de Impressão

Acesse **Administração → Impressão** para personalizar:

#### Cabeçalho do Consultório
- Nome do consultório/clínica
- Endereço completo
- Telefone
- E-mail

#### Configurações de Papel
- Tamanho do papel (A4, A5, Letter)
- Incluir QR Code nas receitas
- Incluir aviso no rodapé

#### Rodapé Padrão
- Mensagem personalizada no rodapé de todos os documentos

### Pré-visualização
A tela de configurações mostra uma pré-visualização em tempo real de como o cabeçalho aparecerá nos documentos.

## 🔧 Como Usar

### Imprimir Receituário

1. Acesse **Farmácia → Nova Prescrição**
2. Preencha os dados da prescrição
3. Clique em **Emitir Prescrição**
4. Na tela de visualização, clique em **Imprimir**
5. Revise o documento na pré-visualização
6. Clique em **Imprimir** novamente para imprimir

### Imprimir Ficha do Paciente

1. Acesse **Pacientes** e selecione um paciente
2. Na tela do Paciente 360°, clique em **Imprimir Ficha**
3. Revise o documento na pré-visualização
4. Clique em **Imprimir** para imprimir

### Configurar Impressão

1. Acesse **Administração → Impressão**
2. Preencha os dados do cabeçalho
3. Configure as opções de papel
4. Personalize o rodapé
5. Clique em **Salvar Configurações**

## 📋 Estrutura Técnica

### Modelos de Dados

```typescript
// src/domain/printModels.ts
- PrintablePrescription
- PrintablePatientSummary
- PrintableMedicalCertificate
- PrintableReferral
- PrintableExamRequest
- PrintSettings
- PrintMetrics
```

### Utilitários

```typescript
// src/utils/printUtils.ts
- printCSS: CSS completo para impressão
- generatePrescriptionHTML(): Gera HTML do receituário
- generatePatientSummaryHTML(): Gera HTML da ficha
- generateCertificateHTML(): Gera HTML do atestado
- generateReferralHTML(): Gera HTML do encaminhamento
- generateExamRequestHTML(): Gera HTML da solicitação
- generatePrintHTML(): Função principal
- printDocument(): Abre janela de impressão
- calculateAge(): Calcula idade a partir da data de nascimento
```

### Componentes

```typescript
// src/components/print/PrintComponents.tsx
- PrintButton: Botão com preview opcional
- PrintPreviewModal: Modal de pré-visualização
- PrintActionGroup: Grupo de botões de impressão
```

## 🎯 Características

### Design Profissional
- Layout limpo e profissional
- Tipografia adequada para impressão
- Espaçamento correto para leitura
- Cores sutis (turquesa #17AEB5)

### Formatação A4
- Margens padrão (2cm)
- Tamanho A4 (210 x 297 mm)
- Quebras de página inteligentes
- Evita corte de conteúdo

### Responsividade
- Preview em tela adaptável
- Impressão otimizada para A4
- Funciona em todos os navegadores modernos

### Validação
- Campos obrigatórios verificados
- Dados completos do profissional
- Informações do paciente validadas
- Medicamentos com posologia completa

## 🔒 Segurança e Conformidade

### Dados do Profissional
- Nome completo
- Conselho profissional (CRM, CRN, etc.)
- Número do conselho
- Especialidade

### Dados do Paciente
- Nome completo
- Idade calculada automaticamente
- CPF (opcional, mascarado em listas)
- Informações de contato

### Informações Clínicas
- Apenas dados necessários
- Histórico resumido
- Medidas recentes
- Prescrições atuais

### Conformidade LGPD
- Dados sensíveis protegidos
- Acesso restrito por perfil
- Audit trail preparado
- Consentimento do paciente

## 📊 Métricas de Uso (Futuro)

O sistema está preparado para registrar:
- Total de impressões por tipo de documento
- Impressões por profissional
- Impressões por período
- Economia de papel (se usando digital)

## 🚀 Próximas Funcionalidades

### Em Desenvolvimento
- [ ] Atestado médico completo
- [ ] Encaminhamento para especialista
- [ ] Solicitação de exames
- [ ] Upload de logo do consultório
- [ ] Assinatura digital
- [ ] Exportação para PDF
- [ ] Envio por e-mail

### Planejadas
- [ ] Integração com impressoras térmicas
- [ ] Templates personalizáveis
- [ ] Impressão em lote
- [ ] Histórico de impressões
- [ ] Relatórios de uso

## 💡 Dicas de Uso

### Para Consultórios
1. Configure o cabeçalho com seus dados completos
2. Use papel timbrado se disponível
3. Mantenha o QR Code ativado para validação
4. Personalize o rodapé com suas informações

### Para Clínicas
1. Configure dados da clínica principal
2. Cada profissional pode ter seu cabeçalho
3. Use tamanhos de papel diferentes conforme necessidade
4. Mantenha padrões de formatação

### Para Impressão
1. Use papel A4 de boa qualidade (75g/m² ou superior)
2. Configure a impressora para "Qualidade Normal"
3. Verifique se as margens estão corretas
4. Faça um teste antes de imprimir em grande quantidade

## 🐛 Solução de Problemas

### Pop-up bloqueado
- Permita pop-ups no navegador para imprimir
- Configure o navegador para permitir impressão

### Formatação incorreta
- Verifique se o navegador está atualizado
- Use Chrome, Firefox ou Edge
- Configure a impressora para papel A4

### Dados faltando
- Verifique se o perfil do profissional está completo
- Confirme os dados do consultório nas configurações
- Atualize as informações do paciente

## 📞 Suporte

Para dúvidas sobre impressão de documentos:
- Acesse **Administração → Configurações**
- Verifique se os dados do consultório estão completos
- Teste a impressão com um documento de exemplo

---

**NEXCLÍNICA** — Gestão clínica, prontuário e relacionamento com pacientes.  
*Funcionalidade de impressão disponível para consultórios particulares.*
