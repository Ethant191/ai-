import { X } from 'lucide-react';
import { typeColors, typeLabels } from '../lib/ledger';
import type { LedgerRecord, LedgerType } from '../types';
import { formatCurrency, formatRecordDate } from '../utils/format';

interface LedgerRecordsSheetProps {
  type: LedgerType;
  records: LedgerRecord[];
  onClose: () => void;
}

export default function LedgerRecordsSheet({ type, records, onClose }: LedgerRecordsSheetProps) {
  const total = records.reduce((sum, record) => sum + record.amount, 0);

  return (
    <div className="sheet-backdrop" role="presentation" onClick={onClose}>
      <section
        className="records-sheet"
        role="dialog"
        aria-modal="true"
        aria-labelledby="records-sheet-title"
        onClick={(event) => event.stopPropagation()}
      >
        <header className="records-sheet__header">
          <div>
            <h2 id="records-sheet-title">{typeLabels[type]}账单</h2>
            <p>
              {records.length}笔 · 合计 {formatCurrency(total)}
            </p>
          </div>
          <button className="records-sheet__close" type="button" onClick={onClose} aria-label="关闭">
            <X size={22} strokeWidth={2.4} />
          </button>
        </header>

        {records.length > 0 ? (
          <div className="records-list">
            {records.map((record) => (
              <article className="records-list__item" key={record.id}>
                <div className="records-list__meta">
                  <strong>{record.note || '未填写备注'}</strong>
                  <span>{formatRecordDate(record.createdAt)}</span>
                </div>
                <span className="records-list__amount" style={{ color: typeColors[type] }}>
                  {formatCurrency(record.amount)}
                </span>
              </article>
            ))}
          </div>
        ) : (
          <div className="records-empty">暂无{typeLabels[type]}账单</div>
        )}
      </section>
    </div>
  );
}
