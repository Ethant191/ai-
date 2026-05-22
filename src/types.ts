export type LedgerType = 'expense' | 'income';

export type TabKey = 'home' | 'charts';

export interface LedgerRecord {
  id: string;
  type: LedgerType;
  amount: number;
  note: string;
  createdAt: string;
}

export interface LedgerTotals {
  expense: number;
  income: number;
  profit: number;
}

export interface TrendPoint {
  date: string;
  label: string;
  profit: number;
}
