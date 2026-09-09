// NEXCLÍNICA — Reusable UI Components
import React from 'react';
import { Search, X } from 'lucide-react';

// ============================================
// METRIC CARD
// ============================================

interface MetricCardProps {
  title: string;
  value: string | number;
  subtitle?: string;
  icon?: React.ReactNode;
  color?: 'primary' | 'success' | 'warning' | 'danger' | 'neutral';
}

export function MetricCard({ title, value, subtitle, icon, color = 'primary' }: MetricCardProps) {
  const colors = {
    primary: 'bg-[#EDF9FA] text-[#17AEB5]',
    success: 'bg-green-50 text-[#52B788]',
    warning: 'bg-amber-50 text-[#F6B85A]',
    danger: 'bg-red-50 text-[#E97878]',
    neutral: 'bg-gray-50 text-[#6F8C90]',
  };

  return (
    <div className="bg-white rounded-2xl p-5 shadow-sm border border-[#EDF9FA] hover:shadow-md transition-shadow">
      <div className="flex items-start justify-between">
        <div>
          <p className="text-sm text-[#6F8C90] font-medium">{title}</p>
          <p className="text-2xl font-bold text-[#18383C] mt-1">{value}</p>
          {subtitle && <p className="text-xs text-[#6F8C90] mt-1">{subtitle}</p>}
        </div>
        {icon && (
          <div className={`w-10 h-10 rounded-xl ${colors[color]} flex items-center justify-center`}>
            {icon}
          </div>
        )}
      </div>
    </div>
  );
}

// ============================================
// STATUS BADGE
// ============================================

interface StatusBadgeProps {
  label: string;
  variant?: 'success' | 'warning' | 'danger' | 'info' | 'neutral' | 'primary';
}

export function StatusBadge({ label, variant = 'neutral' }: StatusBadgeProps) {
  const styles = {
    success: 'bg-green-50 text-[#52B788] border-green-100',
    warning: 'bg-amber-50 text-[#D4940A] border-amber-100',
    danger: 'bg-red-50 text-[#E97878] border-red-100',
    info: 'bg-blue-50 text-blue-600 border-blue-100',
    neutral: 'bg-gray-50 text-[#6F8C90] border-gray-100',
    primary: 'bg-[#EDF9FA] text-[#17AEB5] border-[#17AEB5]/20',
  };

  return (
    <span className={`inline-flex items-center px-2.5 py-1 rounded-lg text-xs font-medium border ${styles[variant]}`}>
      {label}
    </span>
  );
}

// ============================================
// SECTION HEADER
// ============================================

interface SectionHeaderProps {
  title: string;
  subtitle?: string;
  action?: React.ReactNode;
}

export function SectionHeader({ title, subtitle, action }: SectionHeaderProps) {
  return (
    <div className="flex items-center justify-between mb-4">
      <div>
        <h2 className="text-lg font-semibold text-[#18383C]">{title}</h2>
        {subtitle && <p className="text-sm text-[#6F8C90] mt-0.5">{subtitle}</p>}
      </div>
      {action && <div>{action}</div>}
    </div>
  );
}

// ============================================
// SEARCH FIELD
// ============================================

interface SearchFieldProps {
  value: string;
  onChange: (value: string) => void;
  placeholder?: string;
}

export function SearchField({ value, onChange, placeholder = 'Buscar...' }: SearchFieldProps) {
  return (
    <div className="relative">
      <Search size={18} className="absolute left-3 top-1/2 -translate-y-1/2 text-[#6F8C90]" />
      <input
        type="text"
        value={value}
        onChange={(e) => onChange(e.target.value)}
        placeholder={placeholder}
        className="w-full pl-10 pr-10 py-2.5 bg-white border border-[#EDF9FA] rounded-xl text-sm text-[#18383C] placeholder:text-[#6F8C90] focus:outline-none focus:ring-2 focus:ring-[#17AEB5]/30 focus:border-[#17AEB5]"
      />
      {value && (
        <button
          onClick={() => onChange('')}
          className="absolute right-3 top-1/2 -translate-y-1/2 text-[#6F8C90] hover:text-[#18383C]"
        >
          <X size={16} />
        </button>
      )}
    </div>
  );
}

// ============================================
// EMPTY STATE
// ============================================

interface EmptyStateProps {
  icon?: React.ReactNode;
  title: string;
  description?: string;
  action?: React.ReactNode;
}

export function EmptyState({ icon, title, description, action }: EmptyStateProps) {
  return (
    <div className="flex flex-col items-center justify-center py-12 text-center">
      {icon && <div className="w-16 h-16 rounded-2xl bg-[#EDF9FA] flex items-center justify-center mb-4 text-[#17AEB5]">{icon}</div>}
      <h3 className="text-base font-semibold text-[#18383C]">{title}</h3>
      {description && <p className="text-sm text-[#6F8C90] mt-1 max-w-sm">{description}</p>}
      {action && <div className="mt-4">{action}</div>}
    </div>
  );
}

// ============================================
// BUTTON
// ============================================

interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: 'primary' | 'secondary' | 'ghost' | 'danger';
  size?: 'sm' | 'md' | 'lg';
}

export function Button({ variant = 'primary', size = 'md', className = '', children, ...props }: ButtonProps) {
  const variants = {
    primary: 'bg-[#17AEB5] text-white hover:bg-[#087F86] shadow-sm',
    secondary: 'bg-white text-[#18383C] border border-[#EDF9FA] hover:bg-[#F5FCFC]',
    ghost: 'text-[#6F8C90] hover:bg-[#EDF9FA] hover:text-[#087F86]',
    danger: 'bg-[#E97878] text-white hover:bg-red-500',
  };
  const sizes = {
    sm: 'px-3 py-1.5 text-xs',
    md: 'px-4 py-2.5 text-sm',
    lg: 'px-6 py-3 text-base',
  };

  return (
    <button
      className={`inline-flex items-center justify-center gap-2 rounded-xl font-medium transition-all ${variants[variant]} ${sizes[size]} ${className}`}
      {...props}
    >
      {children}
    </button>
  );
}

// ============================================
// AVATAR
// ============================================

interface AvatarProps {
  name: string;
  color?: string;
  size?: 'sm' | 'md' | 'lg';
}

export function Avatar({ name, color = '#17AEB5', size = 'md' }: AvatarProps) {
  const sizes = { sm: 'w-8 h-8 text-xs', md: 'w-10 h-10 text-sm', lg: 'w-14 h-14 text-lg' };
  const initial = name.charAt(0).toUpperCase();

  return (
    <div
      className={`${sizes[size]} rounded-full flex items-center justify-center text-white font-semibold`}
      style={{ backgroundColor: color }}
    >
      {initial}
    </div>
  );
}

// ============================================
// CARD
// ============================================

interface CardProps {
  children: React.ReactNode;
  className?: string;
  onClick?: () => void;
}

export function Card({ children, className = '', onClick }: CardProps) {
  return (
    <div
      className={`bg-white rounded-2xl border border-[#EDF9FA] shadow-sm ${onClick ? 'cursor-pointer hover:shadow-md' : ''} ${className}`}
      onClick={onClick}
    >
      {children}
    </div>
  );
}

// ============================================
// TABS
// ============================================

interface TabsProps {
  tabs: { id: string; label: string }[];
  activeTab: string;
  onChange: (id: string) => void;
}

export function Tabs({ tabs, activeTab, onChange }: TabsProps) {
  return (
    <div className="flex gap-1 border-b border-[#EDF9FA] pb-0 mb-4 overflow-x-auto">
      {tabs.map(tab => (
        <button
          key={tab.id}
          onClick={() => onChange(tab.id)}
          className={`px-4 py-2.5 text-sm font-medium rounded-t-lg transition-all whitespace-nowrap
            ${activeTab === tab.id
              ? 'text-[#17AEB5] border-b-2 border-[#17AEB5] bg-[#EDF9FA]/50'
              : 'text-[#6F8C90] hover:text-[#087F86] hover:bg-[#F5FCFC]'
            }`}
        >
          {tab.label}
        </button>
      ))}
    </div>
  );
}

// ============================================
// INPUT
// ============================================

interface InputProps extends React.InputHTMLAttributes<HTMLInputElement> {
  label?: string;
  error?: string;
}

export function Input({ label, error, className = '', ...props }: InputProps) {
  return (
    <div className="space-y-1">
      {label && <label className="text-sm font-medium text-[#18383C]">{label}</label>}
      <input
        className={`w-full px-3 py-2.5 bg-white border rounded-xl text-sm text-[#18383C] placeholder:text-[#6F8C90] focus:outline-none focus:ring-2 focus:ring-[#17AEB5]/30 focus:border-[#17AEB5] ${error ? 'border-red-300' : 'border-[#EDF9FA]'} ${className}`}
        {...props}
      />
      {error && <p className="text-xs text-[#E97878]">{error}</p>}
    </div>
  );
}

// ============================================
// SELECT
// ============================================

interface SelectProps extends React.SelectHTMLAttributes<HTMLSelectElement> {
  label?: string;
  options: { value: string; label: string }[];
}

export function Select({ label, options, className = '', ...props }: SelectProps) {
  return (
    <div className="space-y-1">
      {label && <label className="text-sm font-medium text-[#18383C]">{label}</label>}
      <select
        className={`w-full px-3 py-2.5 bg-white border border-[#EDF9FA] rounded-xl text-sm text-[#18383C] focus:outline-none focus:ring-2 focus:ring-[#17AEB5]/30 focus:border-[#17AEB5] ${className}`}
        {...props}
      >
        {options.map(opt => (
          <option key={opt.value} value={opt.value}>{opt.label}</option>
        ))}
      </select>
    </div>
  );
}

// ============================================
// TEXTAREA
// ============================================

interface TextareaProps extends React.TextareaHTMLAttributes<HTMLTextAreaElement> {
  label?: string;
}

export function Textarea({ label, className = '', ...props }: TextareaProps) {
  return (
    <div className="space-y-1">
      {label && <label className="text-sm font-medium text-[#18383C]">{label}</label>}
      <textarea
        className={`w-full px-3 py-2.5 bg-white border border-[#EDF9FA] rounded-xl text-sm text-[#18383C] placeholder:text-[#6F8C90] focus:outline-none focus:ring-2 focus:ring-[#17AEB5]/30 focus:border-[#17AEB5] resize-none ${className}`}
        rows={3}
        {...props}
      />
    </div>
  );
}

// ============================================
// MODAL
// ============================================

interface ModalProps {
  open: boolean;
  onClose: () => void;
  title: string;
  children: React.ReactNode;
  size?: 'sm' | 'md' | 'lg' | 'xl';
}

export function Modal({ open, onClose, title, children, size = 'md' }: ModalProps) {
  if (!open) return null;

  const sizes = {
    sm: 'max-w-md',
    md: 'max-w-lg',
    lg: 'max-w-2xl',
    xl: 'max-w-4xl',
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
      <div className="absolute inset-0 bg-black/30 backdrop-blur-sm" onClick={onClose} />
      <div className={`relative bg-white rounded-2xl shadow-xl w-full ${sizes[size]} max-h-[90vh] overflow-y-auto`}>
        <div className="flex items-center justify-between p-5 border-b border-[#EDF9FA]">
          <h3 className="text-lg font-semibold text-[#18383C]">{title}</h3>
          <button onClick={onClose} className="p-1 rounded-lg hover:bg-gray-100 text-[#6F8C90]">
            <X size={20} />
          </button>
        </div>
        <div className="p-5">{children}</div>
      </div>
    </div>
  );
}
