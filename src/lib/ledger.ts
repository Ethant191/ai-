import type { LedgerRecord, LedgerTotals, LedgerType, TrendPoint } from '../types';

export const LEDGER_STORAGE_KEY = 'ai-xiao-zhangfang-records';

export const typeLabels: Record<LedgerType, string> = {
  expense: '支出',
  income: '收入'
};

export const typeColors: Record<LedgerType, string> = {
  expense: '#ef6550',
  income: '#35b779'
};

export function createRecord(type: LedgerType, amount: number, note: string): LedgerRecord {
  return {
    id: globalThis.crypto?.randomUUID?.() ?? `${Date.now()}-${Math.random().toString(16).slice(2)}`,
    type,
    amount,
    note: note.trim(),
    createdAt: new Date().toISOString()
  };
}

export function getLedgerTotals(records: LedgerRecord[]): LedgerTotals {
  const totals = records.reduce(
    (result, record) => {
      result[record.type] += record.amount;
      return result;
    },
    { expense: 0, income: 0 }
  );

  return {
    ...totals,
    profit: totals.income - totals.expense
  };
}

export function getSignedAmount(record: LedgerRecord): number {
  if (record.type === 'income') {
    return record.amount;
  }

  return -record.amount;
}

export function getTrendPoints(records: LedgerRecord[], days: number): TrendPoint[] {
  const today = startOfDay(new Date());
  const firstDate = addDays(today, -(days - 1));
  const sortedRecords = [...records].sort(
    (a, b) => new Date(a.createdAt).getTime() - new Date(b.createdAt).getTime()
  );
  let runningProfit = sortedRecords
    .filter((record) => startOfDay(new Date(record.createdAt)).getTime() < firstDate.getTime())
    .reduce((sum, record) => sum + getSignedAmount(record), 0);

  return Array.from({ length: days }, (_, index) => {
    const day = addDays(firstDate, index);
    const dayKey = formatDateKey(day);

    runningProfit += sortedRecords
      .filter((record) => formatDateKey(new Date(record.createdAt)) === dayKey)
      .reduce((sum, record) => sum + getSignedAmount(record), 0);

    return {
      date: dayKey,
      label: formatShortDate(day),
      profit: Number(runningProfit.toFixed(2))
    };
  });
}

export function readRecordsFromStorage(): LedgerRecord[] {
  try {
    const rawRecords = localStorage.getItem(LEDGER_STORAGE_KEY);
    if (!rawRecords) {
      return [];
    }

    const parsed = JSON.parse(rawRecords);
    if (!Array.isArray(parsed)) {
      return [];
    }

    return parsed.filter(isLedgerRecord);
  } catch {
    return [];
  }
}

export function writeRecordsToStorage(records: LedgerRecord[]) {
  localStorage.setItem(LEDGER_STORAGE_KEY, JSON.stringify(records));
}

function isLedgerRecord(value: unknown): value is LedgerRecord {
  if (!value || typeof value !== 'object') {
    return false;
  }

  const candidate = value as LedgerRecord;

  return (
    typeof candidate.id === 'string' &&
    candidate.type in typeLabels &&
    Number.isFinite(candidate.amount) &&
    candidate.amount > 0 &&
    typeof candidate.note === 'string' &&
    typeof candidate.createdAt === 'string'
  );
}

function startOfDay(date: Date): Date {
  return new Date(date.getFullYear(), date.getMonth(), date.getDate());
}

function addDays(date: Date, days: number): Date {
  const nextDate = new Date(date);
  nextDate.setDate(nextDate.getDate() + days);
  return nextDate;
}

function formatDateKey(date: Date): string {
  const year = date.getFullYear();
  const month = String(date.getMonth() + 1).padStart(2, '0');
  const day = String(date.getDate()).padStart(2, '0');

  return `${year}-${month}-${day}`;
}

function formatShortDate(date: Date): string {
  const month = String(date.getMonth() + 1).padStart(2, '0');
  const day = String(date.getDate()).padStart(2, '0');

  return `${month}-${day}`;
}
