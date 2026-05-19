import { useMemo, useState } from 'react';
import {
  Area,
  AreaChart,
  CartesianGrid,
  Cell,
  Pie,
  PieChart,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis
} from 'recharts';
import { getTrendPoints, typeColors, typeLabels } from '../lib/ledger';
import type { LedgerRecord, LedgerTotals } from '../types';
import { formatCurrency } from '../utils/format';

interface ChartsPageProps {
  records: LedgerRecord[];
  totals: LedgerTotals;
}

const rangeOptions = [7, 30, 90] as const;

export default function ChartsPage({ records, totals }: ChartsPageProps) {
  const [range, setRange] = useState<(typeof rangeOptions)[number]>(30);
  const trendPoints = useMemo(() => getTrendPoints(records, range), [records, range]);
  const costTotal = totals.investment + totals.expense;
  const costData = [
    { name: typeLabels.investment, value: totals.investment, color: typeColors.investment },
    { name: typeLabels.expense, value: totals.expense, color: typeColors.expense }
  ].filter((item) => item.value > 0);

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

      <section className="chart-section chart-section--cost" aria-labelledby="cost-title">
        <h2 id="cost-title">成本结构</h2>

        {costTotal > 0 ? (
          <div className="cost-layout">
            <div className="donut-frame">
              <ResponsiveContainer width="100%" height="100%">
                <PieChart>
                  <Pie data={costData} dataKey="value" innerRadius="58%" outerRadius="82%" paddingAngle={1}>
                    {costData.map((entry) => (
                      <Cell key={entry.name} fill={entry.color} />
                    ))}
                  </Pie>
                  <Tooltip
                    formatter={(value) => [formatCurrency(Number(value)), '金额']}
                    contentStyle={{
                      border: '1px solid #e9e9e9',
                      borderRadius: 12,
                      boxShadow: '0 10px 24px rgba(0, 0, 0, 0.08)'
                    }}
                  />
                </PieChart>
              </ResponsiveContainer>
            </div>

            <div className="cost-legend">
              {costData.map((item) => (
                <div className="cost-legend__row" key={item.name}>
                  <span className="cost-legend__dot" style={{ backgroundColor: item.color }} />
                  <span className="cost-legend__name">{item.name}</span>
                  <strong>{Math.round((item.value / costTotal) * 100)}%</strong>
                </div>
              ))}
            </div>
          </div>
        ) : (
          <div className="empty-chart">暂无成本数据</div>
        )}
      </section>
    </main>
  );
}
