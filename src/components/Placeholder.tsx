// NEXCLÍNICA — Placeholder page for routes not yet fully implemented
import React from 'react';
import { Card, EmptyState } from './ui';
import { Settings } from 'lucide-react';

interface PlaceholderProps {
  title: string;
  description: string;
}

export default function Placeholder({ title, description }: PlaceholderProps) {
  return (
    <div className="flex items-center justify-center min-h-[60vh]">
      <Card className="p-8 text-center max-w-md">
        <div className="w-16 h-16 rounded-2xl bg-[#EDF9FA] flex items-center justify-center mx-auto mb-4">
          <Settings size={28} className="text-[#17AEB5]" />
        </div>
        <h2 className="text-lg font-semibold text-[#18383C] mb-2">{title}</h2>
        <p className="text-sm text-[#6F8C90] mb-4">{description}</p>
        <p className="text-xs text-[#6F8C90] bg-[#EDF9FA] rounded-lg p-3">
          Esta seção será expandida nas próximas versões do NEXCLÍNICA.
        </p>
      </Card>
    </div>
  );
}
