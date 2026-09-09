// NEXCLÍNICA — AI Suggestion Card Component
import React, { useState } from 'react';
import { Card, Button, StatusBadge } from '../ui';
import { Sparkles, AlertTriangle, CheckCircle, XCircle, Edit, Info } from 'lucide-react';
import type { AISuggestion, AISuggestionAlert } from '../../domain/models';
import { EVIDENCE_LEVEL_LABELS, ALERT_SEVERITY_LABELS } from '../../domain/models';

interface AISuggestionCardProps {
  suggestion: AISuggestion;
  onAccept?: (suggestionId: string) => void;
  onReject?: (suggestionId: string, reason: string) => void;
  onModify?: (suggestionId: string) => void;
}

export function AISuggestionCard({ suggestion, onAccept, onReject, onModify }: AISuggestionCardProps) {
  const [showRejectReason, setShowRejectReason] = useState(false);
  const [rejectReason, setRejectReason] = useState('');

  const getSeverityColor = (severity: string) => {
    switch (severity) {
      case 'CRITICAL': return 'bg-red-100 text-red-800 border-red-200';
      case 'HIGH': return 'bg-orange-100 text-orange-800 border-orange-200';
      case 'MEDIUM': return 'bg-yellow-100 text-yellow-800 border-yellow-200';
      case 'LOW': return 'bg-blue-100 text-blue-800 border-blue-200';
      default: return 'bg-gray-100 text-gray-800 border-gray-200';
    }
  };

  const getTypeIcon = (type: string) => {
    switch (type) {
      case 'DRUG_INTERACTION': return '⚠️';
      case 'ALLERGY': return '🚫';
      case 'CONTRAINDICATION': return '⛔';
      case 'SIDE_EFFECT': return '💊';
      case 'DUPLICATE_THERAPY': return '🔄';
      default: return 'ℹ️';
    }
  };

  return (
    <Card className="p-4 border-l-4 border-l-[#17AEB5] bg-gradient-to-r from-[#F5FCFC] to-white">
      {/* Header */}
      <div className="flex items-start justify-between mb-3">
        <div className="flex items-start gap-2 flex-1">
          <Sparkles size={20} className="text-[#17AEB5] mt-0.5" />
          <div className="flex-1">
            <div className="flex items-center gap-2 mb-1">
              <h4 className="text-sm font-semibold text-[#18383C]">{suggestion.title}</h4>
              <StatusBadge 
                label={suggestion.status === 'SUGGESTED' ? 'Sugestão' : suggestion.status === 'ACCEPTED' ? 'Aceita' : suggestion.status === 'REJECTED' ? 'Rejeitada' : 'Modificada'}
                variant={suggestion.status === 'ACCEPTED' ? 'success' : suggestion.status === 'REJECTED' ? 'danger' : 'primary'}
              />
            </div>
            <p className="text-xs text-[#6F8C90]">{suggestion.category}</p>
          </div>
        </div>
        <div className="flex items-center gap-1">
          {suggestion.evidenceLevel && (
            <span className="text-xs px-2 py-1 rounded bg-[#EDF9FA] text-[#087F86] font-medium">
              Evidência: {EVIDENCE_LEVEL_LABELS[suggestion.evidenceLevel]}
            </span>
          )}
          <span className="text-xs px-2 py-1 rounded bg-gray-100 text-gray-700">
            Confiança: {Math.round(suggestion.confidenceScore * 100)}%
          </span>
        </div>
      </div>

      {/* Description */}
      <p className="text-sm text-[#18383C] mb-3">{suggestion.description}</p>

      {/* Rationale */}
      <div className="p-3 rounded-lg bg-[#EDF9FA] mb-3">
        <p className="text-xs font-medium text-[#087F86] mb-1">Justificativa:</p>
        <p className="text-xs text-[#18383C]">{suggestion.rationale}</p>
      </div>

      {/* Alerts */}
      {suggestion.alerts && suggestion.alerts.length > 0 && (
        <div className="space-y-2 mb-3">
          <p className="text-xs font-semibold text-[#E97878] flex items-center gap-1">
            <AlertTriangle size={14} /> Alertas de Segurança
          </p>
          {suggestion.alerts.map((alert, idx) => (
            <div key={idx} className={`p-2 rounded-lg border ${getSeverityColor(alert.severity)}`}>
              <div className="flex items-start gap-2">
                <span className="text-lg">{getTypeIcon(alert.type)}</span>
                <div className="flex-1">
                  <p className="text-xs font-medium">{alert.message}</p>
                  {alert.details && <p className="text-xs mt-1 opacity-80">{alert.details}</p>}
                  {alert.recommendation && (
                    <p className="text-xs mt-1 font-medium">Recomendação: {alert.recommendation}</p>
                  )}
                </div>
                <span className="text-xs font-medium whitespace-nowrap">
                  {ALERT_SEVERITY_LABELS[alert.severity as keyof typeof ALERT_SEVERITY_LABELS]}
                </span>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Medications */}
      {suggestion.medications && suggestion.medications.length > 0 && (
        <div className="mb-3">
          <p className="text-xs font-semibold text-[#18383C] mb-2">Medicamentos Sugeridos:</p>
          <div className="space-y-1">
            {suggestion.medications.map((med, idx) => (
              <div key={idx} className="p-2 rounded bg-white border border-[#EDF9FA] text-xs">
                <p className="font-medium text-[#18383C]">{med.medicationName} {med.dosage}</p>
                <p className="text-[#6F8C90]">{med.dosageInstruction}</p>
                {med.duration && <p className="text-[#6F8C90]">Duração: {med.duration}</p>}
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Guidelines */}
      {suggestion.guidelines && suggestion.guidelines.length > 0 && (
        <div className="mb-3">
          <p className="text-xs font-semibold text-[#18383C] mb-1 flex items-center gap-1">
            <Info size={12} /> Diretrizes e Referências:
          </p>
          <ul className="list-disc list-inside text-xs text-[#6F8C90] space-y-0.5">
            {suggestion.guidelines.map((guideline, idx) => (
              <li key={idx}>{guideline}</li>
            ))}
          </ul>
        </div>
      )}

      {/* Disclaimer */}
      <div className="p-2 rounded bg-yellow-50 border border-yellow-200 mb-3">
        <p className="text-xs text-yellow-800">
          <strong>⚠️ IMPORTANTE:</strong> Esta é uma sugestão baseada em protocolos clínicos. 
          A decisão final é do profissional de saúde. Verifique alergias, interações e contraindicações antes de aceitar.
        </p>
      </div>

      {/* Actions */}
      {suggestion.status === 'SUGGESTED' && (
        <div className="flex items-center gap-2 pt-2 border-t border-[#EDF9FA]">
          <Button size="sm" variant="primary" onClick={() => onAccept?.(suggestion.id)}>
            <CheckCircle size={14} /> Aceitar
          </Button>
          <Button size="sm" variant="secondary" onClick={() => onModify?.(suggestion.id)}>
            <Edit size={14} /> Modificar
          </Button>
          {!showRejectReason ? (
            <Button size="sm" variant="ghost" onClick={() => setShowRejectReason(true)}>
              <XCircle size={14} /> Rejeitar
            </Button>
          ) : (
            <div className="flex-1 flex items-center gap-2">
              <input
                type="text"
                value={rejectReason}
                onChange={(e) => setRejectReason(e.target.value)}
                placeholder="Motivo da rejeição..."
                className="flex-1 px-2 py-1 text-xs border border-[#EDF9FA] rounded focus:outline-none focus:ring-1 focus:ring-[#17AEB5]"
              />
              <Button 
                size="sm" 
                variant="danger" 
                onClick={() => {
                  onReject?.(suggestion.id, rejectReason);
                  setShowRejectReason(false);
                  setRejectReason('');
                }}
                disabled={!rejectReason}
              >
                Confirmar
              </Button>
            </div>
          )}
        </div>
      )}

      {suggestion.status === 'ACCEPTED' && suggestion.acceptedAt && (
        <div className="pt-2 border-t border-[#EDF9FA]">
          <p className="text-xs text-[#52B788]">
            ✓ Aceita em {new Date(suggestion.acceptedAt).toLocaleString('pt-BR')}
          </p>
        </div>
      )}

      {suggestion.status === 'REJECTED' && suggestion.rejectedAt && (
        <div className="pt-2 border-t border-[#EDF9FA]">
          <p className="text-xs text-[#E97878]">
            ✗ Rejeitada em {new Date(suggestion.rejectedAt).toLocaleString('pt-BR')}
          </p>
          {suggestion.rejectionReason && (
            <p className="text-xs text-[#6F8C90] mt-1">Motivo: {suggestion.rejectionReason}</p>
          )}
        </div>
      )}
    </Card>
  );
}
