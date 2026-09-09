// NEXCLÍNICA — Print Components
// Botões e modais para impressão de documentos

import React, { useState } from 'react';
import { Button, Modal } from '../ui';
import { Printer, Eye, X } from 'lucide-react';
import { printDocument, generatePrintHTML } from '../../utils/printUtils';

// ============================================
// PRINT BUTTON
// ============================================

interface PrintButtonProps {
  documentType: 'PRESCRIPTION' | 'PATIENT_SUMMARY' | 'CERTIFICATE' | 'REFERRAL' | 'EXAM_REQUEST';
  data: any;
  title?: string;
  variant?: 'primary' | 'secondary' | 'ghost';
  size?: 'sm' | 'md' | 'lg';
  showPreview?: boolean;
  className?: string;
  children?: React.ReactNode;
}

export function PrintButton({
  documentType,
  data,
  title = 'Imprimir Documento',
  variant = 'primary',
  size = 'md',
  showPreview = true,
  className = '',
  children,
}: PrintButtonProps) {
  const [previewOpen, setPreviewOpen] = useState(false);

  const handlePrint = () => {
    if (showPreview) {
      setPreviewOpen(true);
    } else {
      printDocument(documentType, data);
    }
  };

  const handleDirectPrint = () => {
    printDocument(documentType, data);
    setPreviewOpen(false);
  };

  return (
    <>
      <Button
        variant={variant}
        size={size}
        onClick={handlePrint}
        className={className}
      >
        {children || <><Printer size={size === 'sm' ? 14 : 16} /> Imprimir</>}
      </Button>

      {showPreview && (
        <PrintPreviewModal
          isOpen={previewOpen}
          onClose={() => setPreviewOpen(false)}
          documentType={documentType}
          data={data}
          title={title}
          onPrint={handleDirectPrint}
        />
      )}
    </>
  );
}

// ============================================
// PRINT PREVIEW MODAL
// ============================================

interface PrintPreviewModalProps {
  isOpen: boolean;
  onClose: () => void;
  documentType: string;
  data: any;
  title: string;
  onPrint: () => void;
}

export function PrintPreviewModal({
  isOpen,
  onClose,
  documentType,
  data,
  title,
  onPrint,
}: PrintPreviewModalProps) {
  if (!isOpen) return null;

  const htmlContent = generatePrintHTML(documentType, data);

  return (
    <Modal
      open={isOpen}
      onClose={onClose}
      title={title}
      size="xl"
    >
      <div className="space-y-4">
        {/* Preview Container */}
        <div className="border border-gray-200 rounded-lg overflow-hidden bg-white">
          <div className="bg-gray-100 px-4 py-2 border-b border-gray-200 flex items-center justify-between">
            <span className="text-sm font-medium text-gray-700">Pré-visualização</span>
            <div className="flex items-center gap-2">
              <span className="text-xs text-gray-500">A4</span>
            </div>
          </div>
          <div className="p-4 bg-gray-50 overflow-auto max-h-[60vh]">
            <div className="bg-white shadow-lg mx-auto" style={{ maxWidth: '210mm', minHeight: '297mm' }}>
              <iframe
                srcDoc={htmlContent}
                className="w-full border-0"
                style={{ height: '70vh' }}
                title="Preview do documento"
              />
            </div>
          </div>
        </div>

        {/* Actions */}
        <div className="flex justify-end gap-2 pt-4 border-t border-gray-200">
          <Button variant="secondary" onClick={onClose}>
            <X size={16} />
            Fechar
          </Button>
          <Button variant="primary" onClick={onPrint}>
            <Printer size={16} />
            Imprimir
          </Button>
        </div>
      </div>
    </Modal>
  );
}

// ============================================
// PRINT ACTION GROUP
// ============================================

interface PrintActionGroupProps {
  actions: {
    label: string;
    documentType: 'PRESCRIPTION' | 'PATIENT_SUMMARY' | 'CERTIFICATE' | 'REFERRAL' | 'EXAM_REQUEST';
    data: any;
    icon?: React.ReactNode;
  }[];
  variant?: 'primary' | 'secondary' | 'ghost';
  size?: 'sm' | 'md' | 'lg';
}

export function PrintActionGroup({ actions, variant = 'secondary', size = 'md' }: PrintActionGroupProps) {
  return (
    <div className="flex flex-wrap gap-2">
      {actions.map((action, idx) => (
        <PrintButton
          key={idx}
          documentType={action.documentType}
          data={action.data}
          title={action.label}
          variant={variant}
          size={size}
        >
          {action.icon}
          {action.label}
        </PrintButton>
      ))}
    </div>
  );
}
