export function formatCurrency(value: number): string {
  return new Intl.NumberFormat('zh-CN', {
    style: 'currency',
    currency: 'CNY',
    maximumFractionDigits: value % 1 === 0 ? 0 : 2
  }).format(value);
}

export function formatCompactCurrency(value: number): string {
  const absValue = Math.abs(value);

  if (absValue >= 100000) {
    return `${value < 0 ? '-' : ''}¥${(absValue / 10000).toFixed(1)}万`;
  }

  return formatCurrency(value);
}

export function formatRecordDate(value: string): string {
  const date = new Date(value);

  if (Number.isNaN(date.getTime())) {
    return '';
  }

  return new Intl.DateTimeFormat('zh-CN', {
    month: '2-digit',
    day: '2-digit',
    hour: '2-digit',
    minute: '2-digit',
    hour12: false
  }).format(date);
}

export function formatRecordDay(value: string): string {
  const date = new Date(value);

  if (Number.isNaN(date.getTime())) {
    return '未知日期';
  }

  return new Intl.DateTimeFormat('zh-CN', {
    year: 'numeric',
    month: '2-digit',
    day: '2-digit',
    weekday: 'short'
  }).format(date);
}

export function formatRecordTime(value: string): string {
  const date = new Date(value);

  if (Number.isNaN(date.getTime())) {
    return '';
  }

  return new Intl.DateTimeFormat('zh-CN', {
    hour: '2-digit',
    minute: '2-digit',
    hour12: false
  }).format(date);
}
