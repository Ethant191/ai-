import type { LucideIcon } from 'lucide-react';
import { formatCompactCurrency } from '../utils/format';

interface StatCardProps {
  label: string;
  value: number;
  tone: 'orange' | 'red' | 'green';
  icon: LucideIcon;
  onClick?: () => void;
}

function CardContent({ label, value, icon: Icon }: Pick<StatCardProps, 'label' | 'value' | 'icon'>) {
  return (
    <>
      <div className="stat-card__label">
        <span className="stat-card__icon">
          <Icon size={21} strokeWidth={2.4} />
        </span>
        <span>{label}</span>
      </div>
      <strong className="stat-card__value">{formatCompactCurrency(value)}</strong>
    </>
  );
}

export default function StatCard({ label, value, tone, icon, onClick }: StatCardProps) {
  const className = `stat-card stat-card--${tone}${onClick ? ' stat-card--button' : ''}`;

  if (onClick) {
    return (
      <button className={className} type="button" onClick={onClick} aria-label={`查看${label}账单`}>
        <CardContent label={label} value={value} icon={icon} />
      </button>
    );
  }

  return (
    <section className={className} aria-label={label}>
      <CardContent label={label} value={value} icon={icon} />
    </section>
  );
}
