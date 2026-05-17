// ===== STATUS COLORS (Enterprise Color System) =====
export const STATUS_COLORS = {
  'Draft':                { bg: 'bg-gray-50',    text: 'text-gray-600',    border: 'border-gray-200',   dot: 'bg-gray-400' },
  'Pending Approval':     { bg: 'bg-amber-50',   text: 'text-amber-700',   border: 'border-amber-200',  dot: 'bg-amber-400' },
  'Approved':             { bg: 'bg-emerald-50', text: 'text-emerald-700', border: 'border-emerald-200',dot: 'bg-emerald-400' },
  'Rejected':             { bg: 'bg-red-50',     text: 'text-red-700',     border: 'border-red-200',    dot: 'bg-red-400' },
  'Returned For Rework':  { bg: 'bg-orange-50',  text: 'text-orange-700',  border: 'border-orange-200', dot: 'bg-orange-400' },
  'Locked':               { bg: 'bg-slate-100',  text: 'text-slate-600',   border: 'border-slate-200',  dot: 'bg-slate-400' },
  'Completed':            { bg: 'bg-emerald-50', text: 'text-emerald-700', border: 'border-emerald-200',dot: 'bg-emerald-400' },
  'On Track':             { bg: 'bg-blue-50',    text: 'text-blue-700',    border: 'border-blue-200',   dot: 'bg-blue-400' },
  'Not Started':          { bg: 'bg-gray-100',   text: 'text-gray-500',    border: 'border-gray-200',   dot: 'bg-gray-300' },
}

// ===== THRUST AREAS =====
export const THRUST_AREAS = [
  'Revenue Growth',
  'Operational Excellence',
  'Customer Satisfaction',
  'Innovation',
  'People Development',
]

// ===== UNIT OF MEASUREMENT =====
export const UOM_OPTIONS = [
  { value: 'Percentage', label: 'Percentage (%)' },
  { value: 'Count', label: 'Count (#)' },
  { value: 'Currency', label: 'Currency (₹)' },
  { value: 'Days', label: 'Days' },
  { value: 'Score', label: 'Score' },
]

// ===== QUARTERS =====
export const QUARTERS = ['Q1', 'Q2', 'Q3', 'Q4']

// ===== GOAL STATUSES =====
export const GOAL_STATUSES = [
  'Draft',
  'Pending Approval',
  'Approved',
  'Rejected',
  'Returned For Rework',
  'Locked',
]

// ===== CHECK-IN STATUSES =====
export const CHECKIN_STATUSES = ['Not Started', 'On Track', 'Completed']

// ===== EDITABLE STATUSES (employee can edit) =====
export const EDITABLE_STATUSES = ['Draft', 'Rejected', 'Returned For Rework']

// ===== DEPARTMENTS =====
export const DEPARTMENTS = ['Engineering', 'Sales', 'Operations', 'HR', 'Finance', 'Marketing']

// ===== CHART COLORS =====
export const CHART_COLORS = {
  primary: '#2563eb',
  secondary: '#3b82f6',
  success: '#059669',
  warning: '#d97706',
  danger: '#dc2626',
  info: '#0284c7',
  slate: '#64748b',
  purple: '#7c3aed',
}

export const PIE_COLORS = ['#2563eb', '#059669', '#d97706', '#dc2626', '#7c3aed', '#64748b']
