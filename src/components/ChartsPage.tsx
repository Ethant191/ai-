import { useMemo, useState } from 'react';
import {
  Area,
  AreaChart,
  Bar,
  BarChart,
  CartesianGrid,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis
} from 'recharts';
import { getTrendPoints } from '../lib/ledger';
import type { LedgerRecord } from '../types';
import { formatCurrency } from '../utils/format';

interface ChartsPageProps {
  records: LedgerRecord[];
}

const rangeOptions = [7, 30, 90] as const;

export default function ChartsPage({ records }: ChartsPageProps) {
  const [range, setRange] = useState<(typeof rangeOptions)[number]>(30);
  const trendPoints = useMemo(() => getTrendPoints(records, range), [records, range]);
  const comparisonPoints = useMemo(() => getIncomeExpensePoints(records, range), [records, range]);
  const hasComparisonData = comparisonPoints.some((point) => point.income > 0 || point.expense > 0);

  return (
    <main className="page page--charts">
      <header className="charts-header">
        <h1>图表</h1>
      </header>

      <section className="chart-section" aria-labelledby="trend-title">
        <div className="chart-section__top">
          <h2 id="trend-title">利润趋势</h2>
          <div className="range-switch" aria-label="图表范围">
            {rangeOptions.map((days) => (
              <button
                key={days}
                className={days === range ? 'range-switch__button is-active' : 'range-switch__button'}
                type="button"
                onClick={() => setRange(days)}
              >
                {days}天
              </button>
            ))}
          </div>
        </div>

        <div className="line-chart-frame">
          <ResponsiveContainer width="100%" height="100%">
            <AreaChart data={trendPoints} margin={{ top: 14, right: 14, bottom: 0, left: -18 }}>
              <defs>
                <linearGradient id="profitGradient" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="0%" stopColor="#2d86ee" stopOpacity={0.22} />
                  <stop offset="100%" stopColor="#2d86ee" stopOpacity={0.02} />
                </linearGradient>
              </defs>
              <CartesianGrid stroke="#e8e8e8" strokeDasharray="4 4" vertical={false} />
              <XAxis
                dataKey="label"
                axisLine={false}
                tickLine={false}
                interval={Math.max(0, Math.floor(range / 6) - 1)}
                minTickGap={10}
                tick={{ fill: '#4d4d4d', fontSize: 11 }}
              />
              <YAxis axisLine={false} tickLine={false} tick={{ fill: '#4d4d4d', fontSize: 11 }} width={52} />
              <Tooltip
                formatter={(value) => [formatCurrency(Number(value)), '累计利润']}
                labelFormatter={(label) => `${label}`}
                contentStyle={{
                  border: '1px solid #e9e9e9',
                  borderRadius: 12,
                  boxShadow: '0 10px 24px rgba(0, 0, 0, 0.08)'
                }}
              />
              <Area
                type="monotone"
                dataKey="profit"
                stroke="#2d86ee"
                strokeWidth={3}
                fill="url(#profitGradient)"
                dot={{ r: 3.2, strokeWidth: 2, fill: '#ffffff' }}
                activeDot={{ r: 5 }}
              />
            </AreaChart>
          </ResponsiveContainer>
        </div>
      </section>

      <section className="chart-section chart-section--compare" aria-labelledby="compare-title">
        <div className="chart-section__top chart-section__top--simple">
          <h2 id="compare-title">收支对比</h2>
        </div>

        {hasComparisonData ? (
          <>
            <div className="compare-legend" aria-label="收支图例">
              <span>
                <i className="compare-legend__dot compare-legend__dot--income" />
                收入
              </span>
              <span>
                <i className="compare-legend__dot compare-legend__dot--expense" />
                支出
              </span>
            </div>

            <div className="bar-chart-frame">
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={comparisonPoints} margin={{ top: 16, right: 12, bottom: 0, left: -18 }} barGap={4}>
                  <CartesianGrid stroke="#ececec" strokeDasharray="4 4" vertical={false} />
                  <XAxis
                    dataKey="label"
                    axisLine={false}
                    tickLine={false}
                    interval={Math.max(0, Math.floor(range / 6) - 1)}
                    minTickGap={10}
                    tick={{ fill: '#4d4d4d', fontSize: 11 }}
                  />
                  <YAxis axisLine={false} tickLine={false} tick={{ fill: '#4d4d4d', fontSize: 11 }} width={52} />
                  <Tooltip
                    formatter={(value, name) => [
                      formatCurrency(Number(value)),
                      name === 'income' ? '收入' : '支出'
                    ]}
                    labelFormatter={(label) => `${label}`}
                    contentStyle={{
                      border: '1px solid #e9e9e9',
                      borderRadius: 12,
                      boxShadow: '0 10px 24px rgba(0, 0, 0, 0.08)'
                    }}
                  />
                  <Bar dataKey="income" fill="#35b779" radius={[5, 5, 0, 0]} maxBarSize={18} />
                  <Bar dataKey="expense" fill="#ef6550" radius={[5, 5, 0, 0]} maxBarSize={18} />
                </BarChart>
              </ResponsiveContainer>
            </div>
          </>
        ) : (
          <div className="empty-chart">暂无收支数据</div>
        )}
      </section>
    </main>
  );
}

interface ComparisonPoint {
  date: string;
  label: string;
  income: number;
  expense: number;
}

function getIncomeExpensePoints(records: LedgerRecord[], days: number): ComparisonPoint[] {
  const today = startOfDay(new Date());
  const firstDate = addDays(today, -(days - 1));

  return Array.from({ length: days }, (_, index) => {
    const day = addDays(firstDate, index);
    const date = formatDateKey(day);
    const dayRecords = records.filter((record) => formatDateKey(new Date(record.createdAt)) === date);

    return {
      date,
      label: formatShortDate(day),
      income: getTypeTotal(dayRecords, 'income'),
      expense: getTypeTotal(dayRecords, 'expense')
    };
  });
}

function getTypeTotal(records: LedgerRecord[], type: 'income' | 'expense'): number {
  return Number(
    records
      .filter((record) => record.type === type)
      .reduce((sum, record) => sum + record.amount, 0)
      .toFixed(2)
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
