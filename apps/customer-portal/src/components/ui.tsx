import { type ReactNode, type ButtonHTMLAttributes, type InputHTMLAttributes, forwardRef } from 'react';

/* ─── Card ─── */
export function Card({ children, className = '' }: { children: ReactNode; className?: string }) {
  return (
    <div className={`bg-card border border-line rounded-xl p-6 ${className}`}>
      {children}
    </div>
  );
}

/* ─── KPI Card ─── */
export function KpiCard({
  label,
  value,
  unit,
  trend,
}: {
  label: string;
  value: string | number;
  unit?: string;
  trend?: { value: number; label: string };
}) {
  return (
    <Card>
      <p className="text-muted text-sm mb-1">{label}</p>
      <p className="text-3xl font-semibold text-txt">
        {value}
        {unit && <span className="text-lg text-muted ml-1">{unit}</span>}
      </p>
      {trend && (
        <p className={`text-sm mt-2 ${trend.value >= 0 ? 'text-success' : 'text-danger'}`}>
          {trend.value >= 0 ? '+' : ''}{trend.value}% {trend.label}
        </p>
      )}
    </Card>
  );
}

/* ─── Button ─── */
type ButtonVariant = 'primary' | 'secondary' | 'danger' | 'ghost';

const btnStyles: Record<ButtonVariant, string> = {
  primary: 'bg-accent hover:bg-accent/90 text-white',
  secondary: 'bg-bg-2 border border-line hover:bg-card text-txt',
  danger: 'bg-danger/10 border border-danger/30 hover:bg-danger/20 text-danger',
  ghost: 'hover:bg-card text-muted hover:text-txt',
};

interface ButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: ButtonVariant;
  loading?: boolean;
}

export function Button({
  variant = 'primary',
  loading,
  children,
  className = '',
  disabled,
  ...props
}: ButtonProps) {
  return (
    <button
      className={`px-4 py-2 rounded-lg font-medium transition-colors disabled:opacity-50 disabled:cursor-not-allowed ${btnStyles[variant]} ${className}`}
      disabled={disabled || loading}
      {...props}
    >
      {loading ? (
        <span className="flex items-center gap-2">
          <Spinner size="sm" />
          {children}
        </span>
      ) : (
        children
      )}
    </button>
  );
}

/* ─── Input ─── */
export const Input = forwardRef<HTMLInputElement, InputHTMLAttributes<HTMLInputElement>>(
  (props, ref) => <input ref={ref} {...props} />,
);
Input.displayName = 'Input';

/* ─── Spinner ─── */
export function Spinner({ size = 'md' }: { size?: 'sm' | 'md' | 'lg' }) {
  const dim = size === 'sm' ? 'w-4 h-4' : size === 'lg' ? 'w-8 h-8' : 'w-6 h-6';
  return (
    <svg className={`animate-spin ${dim} text-accent`} viewBox="0 0 24 24" fill="none">
      <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
      <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z" />
    </svg>
  );
}

/* ─── Badge ─── */
type BadgeColor = 'green' | 'yellow' | 'red' | 'blue' | 'gray';

const badgeColors: Record<BadgeColor, string> = {
  green: 'bg-success/10 text-success border-success/30',
  yellow: 'bg-warning/10 text-warning border-warning/30',
  red: 'bg-danger/10 text-danger border-danger/30',
  blue: 'bg-accent/10 text-accent-2 border-accent/30',
  gray: 'bg-muted/10 text-muted border-muted/30',
};

export function Badge({ children, color = 'gray' }: { children: ReactNode; color?: BadgeColor }) {
  return (
    <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium border ${badgeColors[color]}`}>
      {children}
    </span>
  );
}

/* ─── Empty state ─── */
export function EmptyState({ title, description }: { title: string; description?: string }) {
  return (
    <div className="text-center py-12">
      <p className="text-muted text-lg">{title}</p>
      {description && <p className="text-muted/60 text-sm mt-1">{description}</p>}
    </div>
  );
}

/* ─── Page header ─── */
export function PageHeader({
  title,
  description,
  action,
}: {
  title: string;
  description?: string;
  action?: ReactNode;
}) {
  return (
    <div className="flex items-start justify-between mb-8">
      <div>
        <h1 className="text-2xl font-semibold text-txt">{title}</h1>
        {description && <p className="text-muted mt-1">{description}</p>}
      </div>
      {action}
    </div>
  );
}

/* ─── Status badge for subscriptions/contracts ─── */
const statusColors: Record<string, BadgeColor> = {
  active: 'green',
  trialing: 'blue',
  past_due: 'yellow',
  canceled: 'red',
  incomplete: 'gray',
  draft: 'gray',
  pending: 'yellow',
  expired: 'red',
  terminated: 'red',
  current: 'green',
  none: 'gray',
};

export function StatusBadge({ status }: { status: string }) {
  const color = statusColors[status] ?? 'gray';
  return <Badge color={color}>{status.replace('_', ' ')}</Badge>;
}
