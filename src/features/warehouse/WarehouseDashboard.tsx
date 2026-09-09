// NEXCLÍNICA — Warehouse Dashboard
import React, { useState } from 'react';
import { Card, Button, StatusBadge, EmptyState } from '../../components/ui';
import { Package, AlertTriangle, TrendingDown, TrendingUp, ArrowRightLeft } from 'lucide-react';
import { WAREHOUSE_TYPE_LABELS } from '../../domain/models';
import type { Warehouse, WarehouseStock } from '../../domain/models';

// Demo data
const DEMO_WAREHOUSE: Warehouse = {
  id: 'wh-001',
  tenantId: 'demo-tenant',
  name: 'Almoxarifado Central de Medicamentos',
  code: 'ALM-001',
  type: 'CENTRAL',
  address: 'Rua da Saúde, 500 - Centro',
  phone: '(11) 3000-5000',
  email: 'almoxarifado@nexclinica.demo',
  managerName: 'Carlos Silva',
  minStockDays: 30,
  maxStockDays: 90,
  active: true,
  createdAt: new Date().toISOString(),
  updatedAt: new Date().toISOString(),
};

const DEMO_STOCK: WarehouseStock[] = [
  {
    id: 'stock-001',
    warehouseId: 'wh-001',
    medicationId: 'med-dipirona',
    medicationName: 'Dipirona Sódica 500mg',
    quantity: 5000,
    quantityUnit: 'comprimidos',
    batchNumber: 'LOT2026A001',
    expiryDate: '2027-06-30',
    inStock: true,
    minStock: 2000,
    maxStock: 10000,
    currentDays: 45,
    unitCost: 0.15,
    totalValue: 750,
    lastMovementDate: new Date().toISOString(),
    lastMovementType: 'PURCHASE',
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
  },
  {
    id: 'stock-002',
    warehouseId: 'wh-001',
    medicationId: 'med-paracetamol',
    medicationName: 'Paracetamol 750mg',
    quantity: 3500,
    quantityUnit: 'comprimidos',
    batchNumber: 'LOT2026A002',
    expiryDate: '2027-03-15',
    inStock: true,
    minStock: 1500,
    maxStock: 8000,
    currentDays: 38,
    unitCost: 0.18,
    totalValue: 630,
    lastMovementDate: new Date().toISOString(),
    lastMovementType: 'PURCHASE',
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
  },
  {
    id: 'stock-003',
    warehouseId: 'wh-001',
    medicationId: 'med-losartana',
    medicationName: 'Losartana Potássica 50mg',
    quantity: 800,
    quantityUnit: 'comprimidos',
    batchNumber: 'LOT2026A003',
    expiryDate: '2026-12-31',
    inStock: true,
    minStock: 1000,
    maxStock: 5000,
    currentDays: 15,
    unitCost: 0.25,
    totalValue: 200,
    lastMovementDate: new Date().toISOString(),
    lastMovementType: 'DISPENSATION',
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
  },
  {
    id: 'stock-004',
    warehouseId: 'wh-001',
    medicationId: 'med-metformina',
    medicationName: 'Metformina 850mg',
    quantity: 150,
    quantityUnit: 'comprimidos',
    batchNumber: 'LOT2026A004',
    expiryDate: '2026-09-30',
    inStock: true,
    minStock: 1000,
    maxStock: 5000,
    currentDays: 3,
    unitCost: 0.30,
    totalValue: 45,
    lastMovementDate: new Date().toISOString(),
    lastMovementType: 'DISPENSATION',
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
  },
];

export default function WarehouseDashboard() {
  const [stock] = useState(DEMO_STOCK);
  const warehouse = DEMO_WAREHOUSE;

  const totalItems = stock.length;
  const totalValue = stock.reduce((sum, item) => sum + item.totalValue, 0);
  const lowStockItems = stock.filter(item => item.currentDays < warehouse.minStockDays);
  const outOfStockItems = stock.filter(item => item.quantity === 0);
  const expiringSoon = stock.filter(item => {
    const daysUntilExpiry = Math.ceil((new Date(item.expiryDate).getTime() - Date.now()) / (1000 * 60 * 60 * 24));
    return daysUntilExpiry < 90;
  });

  return (
    <div className="space-y-5">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-[#18383C]">Almoxarifado Central</h1>
          <p className="text-sm text-[#6F8C90]">{warehouse.name}</p>
        </div>
        <div className="flex gap-2">
          <Button variant="secondary">
            <ArrowRightLeft size={16} /> Nova Transferência
          </Button>
          <Button>
            <Package size={16} /> Entrada de Estoque
          </Button>
        </div>
      </div>

      {/* Metrics */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <Card className="p-4">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-[#EDF9FA] flex items-center justify-center">
              <Package size={20} className="text-[#17AEB5]" />
            </div>
            <div>
              <p className="text-2xl font-bold text-[#18383C]">{totalItems}</p>
              <p className="text-xs text-[#6F8C90]">Itens Estocados</p>
            </div>
          </div>
        </Card>

        <Card className="p-4">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-green-50 flex items-center justify-center">
              <TrendingUp size={20} className="text-[#52B788]" />
            </div>
            <div>
              <p className="text-2xl font-bold text-[#18383C]">
                R$ {totalValue.toLocaleString('pt-BR', { minimumFractionDigits: 2 })}
              </p>
              <p className="text-xs text-[#6F8C90]">Valor Total Estocado</p>
            </div>
          </div>
        </Card>

        <Card className="p-4">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-amber-50 flex items-center justify-center">
              <TrendingDown size={20} className="text-[#F6B85A]" />
            </div>
            <div>
              <p className="text-2xl font-bold text-[#18383C]">{lowStockItems.length}</p>
              <p className="text-xs text-[#6F8C90]">Estoque Baixo</p>
            </div>
          </div>
        </Card>

        <Card className="p-4">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-red-50 flex items-center justify-center">
              <AlertTriangle size={20} className="text-[#E97878]" />
            </div>
            <div>
              <p className="text-2xl font-bold text-[#18383C]">{expiringSoon.length}</p>
              <p className="text-xs text-[#6F8C90]">Vencendo em 90 dias</p>
            </div>
          </div>
        </Card>
      </div>

      {/* Alerts */}
      {(lowStockItems.length > 0 || outOfStockItems.length > 0) && (
        <Card className="p-4 bg-amber-50 border border-amber-200">
          <div className="flex items-start gap-3">
            <AlertTriangle size={20} className="text-[#F6B85A] mt-0.5" />
            <div className="flex-1">
              <h3 className="font-semibold text-[#18383C] mb-2">Alertas de Estoque</h3>
              {lowStockItems.length > 0 && (
                <div className="mb-2">
                  <p className="text-sm font-medium text-[#18383C]">Estoque Baixo ({lowStockItems.length} itens):</p>
                  <ul className="list-disc list-inside text-sm text-[#6F8C90] mt-1">
                    {lowStockItems.slice(0, 3).map(item => (
                      <li key={item.id}>
                        {item.medicationName} - {item.currentDays} dias de estoque
                      </li>
                    ))}
                    {lowStockItems.length > 3 && (
                      <li className="text-xs">... e mais {lowStockItems.length - 3} itens</li>
                    )}
                  </ul>
                </div>
              )}
              {outOfStockItems.length > 0 && (
                <div>
                  <p className="text-sm font-medium text-[#E97878]">Sem Estoque ({outOfStockItems.length} itens)</p>
                </div>
              )}
            </div>
          </div>
        </Card>
      )}

      {/* Stock Table */}
      <Card className="p-5">
        <h3 className="font-semibold text-[#18383C] mb-4">Estoque Atual</h3>
        {stock.length === 0 ? (
          <EmptyState 
            icon={<Package size={28} />}
            title="Sem itens em estoque"
            description="Nenhum medicamento cadastrado no almoxarifado."
          />
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead>
                <tr className="border-b border-[#EDF9FA]">
                  <th className="text-left py-2 px-3 font-medium text-[#6F8C90]">Medicamento</th>
                  <th className="text-center py-2 px-3 font-medium text-[#6F8C90]">Quantidade</th>
                  <th className="text-center py-2 px-3 font-medium text-[#6F8C90]">Lote</th>
                  <th className="text-center py-2 px-3 font-medium text-[#6F8C90]">Validade</th>
                  <th className="text-center py-2 px-3 font-medium text-[#6F8C90]">Dias</th>
                  <th className="text-right py-2 px-3 font-medium text-[#6F8C90]">Valor</th>
                  <th className="text-center py-2 px-3 font-medium text-[#6F8C90]">Status</th>
                </tr>
              </thead>
              <tbody>
                {stock.map(item => {
                  const daysUntilExpiry = Math.ceil((new Date(item.expiryDate).getTime() - Date.now()) / (1000 * 60 * 60 * 24));
                  const isLowStock = item.currentDays < warehouse.minStockDays;
                  const isExpiringSoon = daysUntilExpiry < 90;

                  return (
                    <tr key={item.id} className="border-b border-[#EDF9FA] hover:bg-[#F5FCFC]">
                      <td className="py-3 px-3">
                        <p className="font-medium text-[#18383C]">{item.medicationName}</p>
                      </td>
                      <td className="text-center py-3 px-3">
                        <span className="font-medium">{item.quantity.toLocaleString('pt-BR')}</span>
                        <span className="text-xs text-[#6F8C90] ml-1">{item.quantityUnit}</span>
                      </td>
                      <td className="text-center py-3 px-3 text-[#6F8C90]">{item.batchNumber}</td>
                      <td className="text-center py-3 px-3 text-[#6F8C90]">
                        {new Date(item.expiryDate).toLocaleDateString('pt-BR')}
                      </td>
                      <td className="text-center py-3 px-3">
                        <span className={isLowStock ? 'text-[#E97878] font-medium' : 'text-[#6F8C90]'}>
                          {item.currentDays}
                        </span>
                      </td>
                      <td className="text-right py-3 px-3">
                        R$ {item.totalValue.toLocaleString('pt-BR', { minimumFractionDigits: 2 })}
                      </td>
                      <td className="text-center py-3 px-3">
                        {isLowStock && (
                          <StatusBadge label="Baixo" variant="warning" />
                        )}
                        {isExpiringSoon && !isLowStock && (
                          <StatusBadge label="Vencendo" variant="danger" />
                        )}
                        {!isLowStock && !isExpiringSoon && (
                          <StatusBadge label="Normal" variant="success" />
                        )}
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        )}
      </Card>
    </div>
  );
}
