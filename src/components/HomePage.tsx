import { FormEvent, useMemo, useState } from 'react';
import { ArrowDown, ArrowUp, WalletCards } from 'lucide-react';
import { typeLabels } from '../lib/ledger';
import type { LedgerRecord, LedgerTotals, LedgerType } from '../types';
import LedgerRecordsSheet from './LedgerRecordsSheet';
import StatCard from './StatCard';

interface HomePageProps {
  records: LedgerRecord[];
  totals: LedgerTotals;
  onAddRecord: (type: LedgerType, amount: number, note: string) => void;
  onUpdateRecord: (id: string, updates: Pick<LedgerRecord, 'amount' | 'note'>) => void;
  onDeleteRecord: (id: string) => void;
}

const ledgerTypes: LedgerType[] = ['expense', 'income'];

export default function HomePage({
  records,
  totals,
  onAddRecord,
  onUpdateRecord,
  onDeleteRecord
}: HomePageProps) {
  const [type, setType] = useState<LedgerType>('expense');
  const [amount, setAmount] = useState('');
  const [note, setNote] = useState('');
  const [message, setMessage] = useState<{ text: string; tone: 'success' | 'error' } | null>(null);
  const [selectedType, setSelectedType] = useState<LedgerType | null>(null);
  const selectedRecords = useMemo(() => {
    if (!selectedType) {
      return [];
    }

    return records
      .filter((record) => record.type === selectedType)
      .sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime());
  }, [records, selectedType]);

  function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    const normalizedAmount = Number(amount);

    if (!Number.isFinite(normalizedAmount) || normalizedAmount <= 0) {
      setMessage({ text: '金额必须大于 0', tone: 'error' });
      return;
    }

    onAddRecord(type, Number(normalizedAmount.toFixed(2)), note);
    setAmount('');
    setNote('');
    setMessage({ text: '已保存', tone: 'success' });

    window.setTimeout(() => setMessage(null), 1600);
  }

  return (
    <main className="page page--home">
      <div className="stats-grid stats-grid--three">
        <StatCard
          label="支出"
          value={totals.expense}
          tone="red"
          icon={ArrowDown}
          onClick={() => setSelectedType('expense')}
        />
        <StatCard
          label="收入"
          value={totals.income}
          tone="green"
          icon={ArrowUp}
          onClick={() => setSelectedType('income')}
        />
        <StatCard label="利润" value={totals.profit} tone="green" icon={WalletCards} />
      </div>

      <section className="entry-section" aria-labelledby="entry-title">
        <h1 id="entry-title" className="section-title">
          记一笔
        </h1>

        <form className="entry-card" onSubmit={handleSubmit}>
          <div className="form-row form-row--segmented">
            <span className="form-label">类型</span>
            <div className="segmented-control" role="radiogroup" aria-label="类型">
              {ledgerTypes.map((item) => (
                <button
                  key={item}
                  className={item === type ? 'segmented-control__button is-active' : 'segmented-control__button'}
                  type="button"
                  role="radio"
                  aria-checked={item === type}
                  onClick={() => setType(item)}
                >
                  {typeLabels[item]}
                </button>
              ))}
            </div>
          </div>

          <label className="field">
            <span className="form-label">金额</span>
            <span className="money-input">
              <span className="money-input__prefix">¥</span>
              <input
                inputMode="decimal"
                min="0"
                step="0.01"
                type="number"
                placeholder="0.00"
                value={amount}
                onChange={(event) => setAmount(event.target.value)}
              />
            </span>
          </label>

          <label className="field">
            <span className="form-label">备注</span>
            <textarea
              rows={3}
              placeholder="请输入备注（可选）"
              value={note}
              onChange={(event) => setNote(event.target.value)}
            />
          </label>

          {message ? (
            <p className={`form-message form-message--${message.tone}`} role="status">
              {message.text}
            </p>
          ) : null}

          <button className="save-button" type="submit">
            保存
          </button>
        </form>
      </section>

      {selectedType ? (
        <LedgerRecordsSheet
          type={selectedType}
          records={selectedRecords}
          onClose={() => setSelectedType(null)}
          onUpdateRecord={onUpdateRecord}
          onDeleteRecord={onDeleteRecord}
        />
      ) : null}
    </main>
  );
}
